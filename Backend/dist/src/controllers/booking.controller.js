"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookingController = exports.updateBookingController = exports.createBookingController = exports.getBookingByIdController = exports.getBookingsByCustomerIdController = exports.getAllBookingsController = void 0;
const booking_service_1 = require("../services/booking.service");
const getAllBookingsController = async (req, res) => {
    try {
        const bookings = await (0, booking_service_1.getBookings)();
        res.json(bookings);
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};
exports.getAllBookingsController = getAllBookingsController;
// GET BOOKINGS BY CUSTOMER ID
const getBookingsByCustomerIdController = async (req, res) => {
    try {
        const customerId = Number(req.params.customerId);
        const bookings = await (0, booking_service_1.getBookingsByCustomerId)(customerId);
        res.json(bookings);
    }
    catch (error) {
        console.error("Error fetching bookings by customer ID:", error);
        res.status(500).json({ message: "Failed to fetch bookings by customer ID" });
    }
};
exports.getBookingsByCustomerIdController = getBookingsByCustomerIdController;
const getBookingByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const booking = await (0, booking_service_1.getBookingById)(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    }
    catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Failed to fetch booking" });
    }
};
exports.getBookingByIdController = getBookingByIdController;
const createBookingController = async (req, res) => {
    try {
        const booking = await (0, booking_service_1.createBooking)(req.body);
        res.status(201).json(booking);
    }
    catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Failed to create booking" });
    }
};
exports.createBookingController = createBookingController;
const updateBookingController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await (0, booking_service_1.updateBooking)(id, req.body);
        if (!updated) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Failed to update booking" });
    }
};
exports.updateBookingController = updateBookingController;
const deleteBookingController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, booking_service_1.deleteBooking)(id);
        res.json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Failed to delete booking" });
    }
};
exports.deleteBookingController = deleteBookingController;
