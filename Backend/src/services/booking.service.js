"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.getBookingById = exports.getBookings = exports.createBooking = exports.createBookingsTable = void 0;
const db_1 = require("../../src/config/db");
// ======================================================
// CREATE BOOKINGS TABLE
// ======================================================
const createBookingsTable = async () => {
    await (0, db_1.sql) `
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      status TEXT NOT NULL,
      additional_requests TEXT,
      total_cost NUMERIC(10,2) NOT NULL
    );
  `;
};
exports.createBookingsTable = createBookingsTable;
// ======================================================
// CREATE BOOKING
// ======================================================
const createBooking = async (data) => {
    const { customer_id, room_id, check_in_date, check_out_date, status, additional_requests, total_cost, } = data;
    const result = await (0, db_1.sql) `
    INSERT INTO bookings (
      customer_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    )
    VALUES (
      ${customer_id}, ${room_id}, ${check_in_date}, ${check_out_date},
      ${status}, ${additional_requests}, ${total_cost}
    )
    RETURNING *;
  `;
    return result[0];
};
exports.createBooking = createBooking;
// ======================================================
// GET ALL BOOKINGS
// ======================================================
const getBookings = async () => {
    return (await (0, db_1.sql) `
    SELECT *
    FROM bookings
    ORDER BY booking_id DESC;
  `);
};
exports.getBookings = getBookings;
// ======================================================
// GET BOOKING BY ID
// ======================================================
const getBookingById = async (id) => {
    const result = await (0, db_1.sql) `
    SELECT *
    FROM bookings
    WHERE booking_id = ${id};
  `;
    return result[0];
};
exports.getBookingById = getBookingById;
// ======================================================
// UPDATE BOOKING
// Only updates provided fields (COALESCE)
// ======================================================
const updateBooking = async (id, data) => {
    const { check_in_date, check_out_date, status, additional_requests, total_cost, } = data;
    const result = await (0, db_1.sql) `
    UPDATE bookings
    SET
      check_in_date = COALESCE(${check_in_date}, check_in_date),
      check_out_date = COALESCE(${check_out_date}, check_out_date),
      status = COALESCE(${status}, status),
      additional_requests = COALESCE(${additional_requests}, additional_requests),
      total_cost = COALESCE(${total_cost}, total_cost)
    WHERE booking_id = ${id}
    RETURNING *;
  `;
    return result[0];
};
exports.updateBooking = updateBooking;
// ======================================================
// DELETE BOOKING
// ======================================================
const deleteBooking = async (id) => {
    await (0, db_1.sql) `
    DELETE FROM bookings
    WHERE booking_id = ${id};
  `;
};
exports.deleteBooking = deleteBooking;
