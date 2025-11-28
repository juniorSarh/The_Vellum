// src/server/controllers/booking.controller.ts
import { Request, Response } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../services/booking.service";

export const getAllBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookings();
    alert(bookings)
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ... rest of controllers unchanged
