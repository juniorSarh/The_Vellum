// src/services/booking.service.ts
import { sql } from "../../src/config/db";
import { Booking } from "../models/booking.model"; // adjust path if different

// ============================
// CREATE BOOKINGS TABLE
// ============================
export const createBookingTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id          SERIAL PRIMARY KEY,
      user_id             INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      room_id             INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
      check_in_date       DATE NOT NULL,
      check_out_date      DATE NOT NULL,
      status              TEXT NOT NULL,
      additional_requests TEXT,
      total_cost          NUMERIC(10,2) NOT NULL
    );
  `;
};

// ============================
// CREATE BOOKING
// ============================
export const createBooking = async (
  booking: Omit<Booking, "booking_id">
) => {
  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    status,
    additional_requests = null,
    total_cost,
  } = booking;

  const result = await sql`
    INSERT INTO bookings (
      user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    )
    VALUES (
      ${user_id}, ${room_id}, ${check_in_date}, ${check_out_date},
      ${status}, ${additional_requests}, ${total_cost}
    )
    RETURNING
      booking_id, user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost;
  `;

  return result[0] as Booking;
};

// ============================
// GET ALL BOOKINGS
// ============================
export const getBookings = async () => {
  return (await sql`
    SELECT
      booking_id, user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    FROM bookings
    ORDER BY booking_id;
  `) as Booking[];
};

// ============================
// GET BOOKING BY ID
// ============================
export const getBookingById = async (booking_id: number) => {
  const result = await sql`
    SELECT
      booking_id, user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    FROM bookings
    WHERE booking_id = ${booking_id};
  `;

  return result[0] as Booking | undefined;
};

// ============================
// GET BOOKINGS BY USER
// ============================
export const getBookingsByUser = async (user_id: number) => {
  return (await sql`
    SELECT
      booking_id, user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    FROM bookings
    WHERE user_id = ${user_id}
    ORDER BY booking_id;
  `) as Booking[];
};

// ============================
// GET BOOKINGS BY ROOM
// ============================
export const getBookingsByRoom = async (room_id: number) => {
  return (await sql`
    SELECT
      booking_id, user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    FROM bookings
    WHERE room_id = ${room_id}
    ORDER BY booking_id;
  `) as Booking[];
};

// ============================
// UPDATE BOOKING
// ============================
export const updateBooking = async (
  booking_id: number,
  bookingData: Partial<Booking>
) => {
  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    status,
    additional_requests,
    total_cost,
  } = bookingData;

  const result = await sql`
    UPDATE bookings
    SET
      user_id             = COALESCE(${user_id}, user_id),
      room_id             = COALESCE(${room_id}, room_id),
      check_in_date       = COALESCE(${check_in_date}, check_in_date),
      check_out_date      = COALESCE(${check_out_date}, check_out_date),
      status              = COALESCE(${status}, status),
      additional_requests = COALESCE(${additional_requests}, additional_requests),
      total_cost          = COALESCE(${total_cost}, total_cost)
    WHERE booking_id = ${booking_id}
    RETURNING
      booking_id, user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost;
  `;

  return result[0] as Booking | undefined;
};

// ============================
// DELETE BOOKING
// ============================
export const deleteBooking = async (booking_id: number) => {
  await sql`
    DELETE FROM bookings
    WHERE booking_id = ${booking_id};
  `;
};
