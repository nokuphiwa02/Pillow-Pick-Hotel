
import { pool, query } from "../config/database";
import { Bookings, NewBookings } from "../Types/bookings.types";

// BOOKING ERROR
export class BookingError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "BookingError";
    this.statusCode = statusCode;
  }
}

// CREATE BOOKING TABLE
export const createBookingTables = async (): Promise<void> => {
  await query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'booking_status'
      )
      THEN
        CREATE TYPE booking_status AS ENUM (
          'Pending',
          'Cancelled',
          'Approve'
        );
      END IF;
    END $$
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES oauth_users(id) ON DELETE CASCADE,
      room_id INT NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guest_number INT NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      booking_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Bookings table created successfully");
};

// CREATE BOOKING WITH CAPACITY AND AVAILABILITY VALIDATION
export const createBookings = async (
  appData: NewBookings
): Promise<Bookings> => {
  const {
    user_id,
    room_id,
    check_in,
    check_out,
    guest_number,
  } = appData;

  const userId = Number(user_id);
  const roomId = Number(room_id);
  const guestCount = Number(guest_number);

  // Validate IDs
  if (
    !Number.isInteger(userId) ||
    userId <= 0 ||
    !Number.isInteger(roomId) ||
    roomId <= 0
  ) {
    throw new BookingError("Invalid user ID or room ID.", 400);
  }

  // Validate guest count
  if (!Number.isInteger(guestCount) || guestCount <= 0) {
    throw new BookingError(
      "Guest number must be a positive integer.",
      400
    );
  }

  // Validate dates
  const dateIn = new Date(`${check_in}T00:00:00Z`);
  const dateOut = new Date(`${check_out}T00:00:00Z`);

  if (
    !Number.isFinite(dateIn.getTime()) ||
    !Number.isFinite(dateOut.getTime()) ||
    dateIn.toISOString().slice(0, 10) !== String(check_in) ||
    dateOut.toISOString().slice(0, 10) !== String(check_out)
  ) {
    throw new BookingError(
      "Invalid check-in or check-out date.",
      400
    );
  }

  const totalNights =
    (dateOut.getTime() - dateIn.getTime()) /
    (1000 * 60 * 60 * 24);

  if (totalNights <= 0) {
    throw new BookingError(
      "Check-out date must be after check-in date.",
      400
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the room record to prevent simultaneous overbooking.
    const roomResult = await client.query(
      `SELECT id, capacity, quantity, price_per_night, is_available
       FROM rooms
       WHERE id = $1
       FOR UPDATE`,
      [roomId]
    );

    if (roomResult.rows.length === 0) {
      throw new BookingError("Room not found.", 404);
    }

    const room = roomResult.rows[0];

    if (
      room.is_available !== true ||
      Number(room.quantity) <= 0
    ) {
      throw new BookingError(
        "This room is unavailable or fully booked.",
        409
      );
    }

    // Capacity is the maximum number of guests in ONE room.
    if (guestCount > Number(room.capacity)) {
      throw new BookingError(
        `This room can accommodate a maximum of ${room.capacity} guests.`,
        400
      );
    }

    // Count bookings that overlap the requested stay.
    // Cancelled bookings do not occupy a room.
    const availabilityResult = await client.query(
      `SELECT COUNT(*)::int AS booked_count
       FROM bookings
       WHERE room_id = $1
         AND LOWER(booking_status) <> 'cancelled'
         AND check_in < $3::date
         AND check_out > $2::date`,
      [roomId, check_in, check_out]
    );

    const bookedCount = Number(
      availabilityResult.rows[0].booked_count
    );

    if (bookedCount >= Number(room.quantity)) {
      throw new BookingError(
        "Fully Booked: no rooms are available for the selected dates.",
        409
      );
    }

    // Validate room price
    const pricePerNight = Number(room.price_per_night);

    if (
      !Number.isFinite(pricePerNight) ||
      pricePerNight <= 0
    ) {
      throw new BookingError(
        "The room has an invalid price per night.",
        400
      );
    }

    // Calculate the total price on the server.
    const calculatedTotalPrice = totalNights * pricePerNight;

    // Insert the booking only after all validations pass.
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        user_id,
        room_id,
        check_in,
        check_out,
        guest_number,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        userId,
        roomId,
        check_in,
        check_out,
        guestCount,
        calculatedTotalPrice,
      ]
    );

    await client.query("COMMIT");

    return bookingResult.rows[0] as Bookings;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// GET ALL BOOKINGS — FOR ADMIN
export const findAllBookings = async (): Promise<Bookings[]> => {
  const { rows } = await query(
    `SELECT *
     FROM bookings
     ORDER BY created_at DESC`
  );

  return rows;
};

// GET BOOKINGS BELONGING TO ONE USER — FOR GUEST
export const findBookingsByUserId = async (
  userId: number
): Promise<Bookings[]> => {
  const { rows } = await query(
    `SELECT *
     FROM bookings
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

// GET BOOKING BY ID
export const findBookingsById = async (
  id: number
): Promise<Bookings | null> => {
  const { rows } = await query(
    `SELECT *
     FROM bookings
     WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
};

// UPDATE BOOKING
export const updateBookingById = async (
  id: number,
  appData: Bookings
): Promise<Bookings | null> => {
  const {
    user_id,
    room_id,
    check_in,
    check_out,
    guest_number,
    total_price,
  } = appData;

  const { rows } = await query(
    `UPDATE bookings
     SET user_id = COALESCE($1, user_id),
         room_id = COALESCE($2, room_id),
         check_in = COALESCE($3, check_in),
         check_out = COALESCE($4, check_out),
         guest_number = COALESCE($5, guest_number),
         total_price = COALESCE($6, total_price)
     WHERE id = $7
     RETURNING *`,
    [
      user_id,
      room_id,
      check_in,
      check_out,
      guest_number,
      total_price,
      id,
    ]
  );

  return rows[0] || null;
};

// DELETE BOOKING
export const deleteBookingById = async (
  id: number
): Promise<Bookings | null> => {
  const { rows } = await query(
    `DELETE FROM bookings
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return rows[0] || null;
};
