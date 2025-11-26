"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const bookingrouter = (0, express_1.Router)();
bookingrouter.get("/", booking_controller_1.getAllBookingsController); // Get all bookings
bookingrouter.get("/:id", booking_controller_1.getBookingByIdController); // Get booking by ID
bookingrouter.post("/", booking_controller_1.createBookingController); // Create new booking
bookingrouter.put("/:id", booking_controller_1.updateBookingController); // Update booking
bookingrouter.delete("/:id", booking_controller_1.deleteBookingController); // Delete booking
exports.default = bookingrouter;
