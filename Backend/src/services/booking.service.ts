import { sql } from "../../src/config/db";
import { Booking, BookingCreate, BookingUpdate } from "../models/booking.model";

// ======================================================
// CREATE BOOKINGS TABLE
// ======================================================
export const createBookingsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      status TEXT NOT NULL,
      additional_requests TEXT,
      total_cost NUMERIC(10,2) NOT NULL
    );
  `;
};

// ======================================================
// CREATE BOOKING
// ======================================================
export const createBooking = async (data: BookingCreate) => {
  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    status,
    additional_requests,
    total_cost,
  } = data;

  const result = await sql`
    INSERT INTO bookings (
      user_id, room_id, check_in_date, check_out_date,
      status, additional_requests, total_cost
    )
    VALUES (
      ${user_id}, ${room_id}, ${check_in_date}, ${check_out_date},
      ${status}, ${additional_requests}, ${total_cost}
    )
    RETURNING *;
  `;

  return result[0] as Booking;
};

// ======================================================
// GET ALL BOOKINGS
// ======================================================
export const getBookings = async () => {
  return (await sql`
    SELECT *
    FROM bookings
    ORDER BY booking_id DESC;
  `) as Booking[];
};

// ======================================================
// GET BOOKING BY ID
// ======================================================
export const getBookingById = async (id: number) => {
  const result = await sql`
    SELECT *
    FROM bookings
    WHERE booking_id = ${id};
  `;

  return result[0] as Booking | undefined;
};

// ======================================================
// UPDATE BOOKING
// Only updates provided fields (COALESCE)
// ======================================================
export const updateBooking = async (id: number, data: BookingUpdate) => {
  const {
    check_in_date,
    check_out_date,
    status,
    additional_requests,
    total_cost,
  } = data;

  const result = await sql`
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

  return result[0] as Booking | undefined;
};

// ======================================================
// DELETE BOOKING
// ======================================================
export const deleteBooking = async (id: number) => {
  await sql`
    DELETE FROM bookings
    WHERE booking_id = ${id};
  `;
};
