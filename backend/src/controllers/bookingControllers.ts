import { Request, Response } from "express";
import * as bookingService from "../service/bookingService";
import { BookingError } from "../service/bookingService";


// CREATE BOOKING

export const addBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "You must be logged in to book a room",
      });
    }

    const bookingData = {
      ...req.body,
      user_id: user.id,
    };

    const newBooking = await bookingService.createBookings(bookingData);

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error instanceof BookingError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error in creating booking",
    });
  }
};

// GET BOOKINGS
// Admins can view all bookings.
// Guests can view only their own bookings.
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "You must be logged in to view bookings",
      });
    }

    if (user.role === "admin") {
      const bookings = await bookingService.findAllBookings();

      return res.status(200).json(bookings);
    }

    const bookings = await bookingService.findBookingsByUserId(user.id);

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);

    return res.status(500).json({
      message: "Error retrieving bookings",
    });
  }
};

// GET BOOKING BY ID
export const getBookingsById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "You must be logged in to view this booking",
      });
    }

    const booking = await bookingService.findBookingsById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Guests cannot view another user's booking.
    if (
      user.role !== "admin" &&
      Number(booking.user_id) !== Number(user.id)
    ) {
      return res.status(403).json({
        message: "You are not allowed to view this booking",
      });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error retrieving booking:", error);

    return res.status(500).json({
      message: "Error retrieving booking",
    });
  }
};

// DELETE BOOKING — ADMIN ONLY
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "You must be logged in",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete bookings",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await bookingService.deleteBookingById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);

    return res.status(500).json({
      message: "Error deleting booking",
    });
  }
};