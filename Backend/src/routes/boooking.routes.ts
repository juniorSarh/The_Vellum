import { Router } from "express";
import {
  getAllBookingsController,
  getBookingByIdController,
  createBookingController,
  updateBookingController,
  deleteBookingController,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getAllBookingsController); // Get all bookings
router.get("/:id", getBookingByIdController); // Get booking by ID
router.post("/", createBookingController); // Create new booking
router.put("/:id", updateBookingController); // Update booking
router.delete("/:id", deleteBookingController); // Delete booking

export default router;
