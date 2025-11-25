import { Router } from "express";
import {
  getAllBookingsController,
  getBookingByIdController,
  createBookingController,
  updateBookingController,
  deleteBookingController,
} from "../controllers/booking.controller";

const bookingrouter = Router();

bookingrouter.get("/", getAllBookingsController); // Get all bookings
bookingrouter.get("/:id", getBookingByIdController); // Get booking by ID
bookingrouter.post("/", createBookingController); // Create new booking
bookingrouter.put("/:id", updateBookingController); // Update booking
bookingrouter.delete("/:id", deleteBookingController); // Delete booking

export default bookingrouter;
