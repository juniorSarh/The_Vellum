"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server/routes/booking.routes.ts
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const bookingrouter = (0, express_1.Router)();
bookingrouter.get("/", booking_controller_1.getAllBookingsController);
bookingrouter.get("/customer/:customerId", booking_controller_1.getBookingsByCustomerIdController);
bookingrouter.get("/:id", booking_controller_1.getBookingByIdController);
bookingrouter.post("/", booking_controller_1.createBookingController);
bookingrouter.put("/:id", booking_controller_1.updateBookingController);
bookingrouter.delete("/:id", booking_controller_1.deleteBookingController);
exports.default = bookingrouter;
