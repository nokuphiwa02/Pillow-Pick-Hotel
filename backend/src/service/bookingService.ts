import { query } from '../config/database';
import {Bookings, NewBookings} from '../Types/bookings.types';

export const createBookingTables = async(): Promise<void> => {
    await query(`
          DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status')
          THEN CREATE TYPE booking_status AS ENUM ('Pending','Cancelled','Approve');
          END IF;
          END $$
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS bookings(
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
            try{
                console.log('bookings table created successfully');
            }catch(error){
                console.error('Error creating bookings table:',error);
            }
};

export const createBookings = async (appData: NewBookings): Promise<Bookings> => {
    const { user_id, room_id, check_in, check_out, guest_number } = appData;
    console.log("CRITICAL CHECK - appData content:", appData);

    const roomResult = await query(
        `SELECT price_per_night FROM rooms WHERE id = $1`,
        [room_id]
    );

    if (roomResult.rows.length === 0) {
        throw new Error(`Room with ID ${room_id} not found.`);
    }

    const price_per_night = roomResult.rows[0].price_per_night;

 
    const dateIn = new Date(check_in);
    const dateOut = new Date(check_out);
    const differenceInTime = dateOut.getTime() - dateIn.getTime();
    const total_days = Math.ceil(differenceInTime / (1000 * 3600 * 24)); 

    if (total_days <= 0) {
        throw new Error("Check-out date must be after check-in date.");
    }

   
    const calculated_total_price = total_days * price_per_night;
    console.log(`Calculated Price: ${calculated_total_price} (${total_days} nights @ R${price_per_night} per night)`);

    
    const { rows } = await query(
        `
        INSERT INTO bookings(user_id, room_id, check_in, check_out, guest_number, total_price)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [user_id, room_id, check_in, check_out, guest_number, calculated_total_price]
    );

    return rows[0];
};

export const findAllBookings = async(): Promise<Bookings[]> => {
    const { rows } = await query(
        `SELECT id,user_id, room_id, check_in, check_out, guest_number, total_price,created_at
        FROM bookings ORDER BY id ASC`
    );
    return rows;
};

export const findBookingsById = async(id: number): Promise<Bookings | null> => {
    const { rows } = await query(`SELECT * FROM bookings WHERE id= $1` ,[id]);
    return rows[0] || null;
};


export const updateBookingById = async(id: number, appData: Bookings ): Promise<Bookings | null> => {
    const {user_id, room_id, check_in, check_out, guest_number, total_price} = appData
    const { rows } = await query(`UPDATE bookings
        SET user_id = COALESCE($1,user_id),
        room_id = COALESCE($2,room_id),
        check_in= COALESCE($3,check_in),
        check_out = COALESCE($4,check_out),
        guest_number = COALESCE($5,guest_number),
        total_price = COALESCE($6,total_price)
        WHERE id = $7
        RETURNING * `,
        [user_id,room_id,check_in,check_out,guest_number,total_price,id]
    );
    return rows[0] || null;
};

export const deleteBookingById = async(id: number): Promise<Bookings | null> =>{
    const { rows } =await query(
        `DELETE FROM bookings WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};