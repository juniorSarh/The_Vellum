import { Request, Response } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByCustomerId
} from "../services/booking.service";
export const getAllBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// GET BOOKINGS BY CUSTOMER ID
export const getBookingsByCustomerIdController = async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.customerId);
    const bookings = await getBookingsByCustomerId(customerId);
    res.json(bookings);
  }
  catch (error) {
    console.error("Error fetching bookings by customer ID:", error);
    res.status(500).json({ message: "Failed to fetch bookings by customer ID" });
  }
};
export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};
export const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = await createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};
export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateBooking(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
};
export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteBooking(id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
