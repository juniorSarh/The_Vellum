// src/server/routes/booking.routes.ts
import { Router } from "express";
import {
  getAllBookingsController,
 getBookingByIdController,
 createBookingController,
 updateBookingController,
  deleteBookingController,
  getBookingsByCustomerIdController
} from "../controllers/booking.controller";

const bookingrouter = Router();

bookingrouter.get("/", getAllBookingsController);
bookingrouter.get("/customer/:customerId", getBookingsByCustomerIdController);
bookingrouter.get("/:id", getBookingByIdController);
bookingrouter.post("/", createBookingController);
bookingrouter.put("/:id", updateBookingController);
bookingrouter.delete("/:id", deleteBookingController);

export default bookingrouter;
