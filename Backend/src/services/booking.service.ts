// src/server/services/booking.service.ts
import { sql } from "../../src/config/db";
import { Booking, BookingCreate, BookingUpdate } from "../models/booking.model";

// ======================================================
// CREATE BOOKINGS TABLE
// ======================================================
export const createBookingsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
      check_in_date TIMESTAMPTZ NOT NULL,
      check_out_date TIMESTAMPTZ NOT NULL,
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
    customer_id,
    room_id,
    check_in_date,
    check_out_date,
    status,
    additional_requests,
    total_cost,
  } = data;

  const result = await sql`
    WITH inserted AS (
      INSERT INTO bookings (
        customer_id,
        room_id,
        check_in_date,
        check_out_date,
        status,
        additional_requests,
        total_cost
      )
      VALUES (
        ${customer_id},
        ${room_id},
        ${check_in_date},
        ${check_out_date},
        ${status},
        ${additional_requests ?? ""},
        ${total_cost}
      )
      RETURNING
        booking_id,
        customer_id,
        room_id,
        check_in_date,
        check_out_date,
        status,
        additional_requests,
        total_cost
    )
    SELECT
      i.booking_id,
      i.customer_id,
      i.room_id,
      i.check_in_date,
      i.check_out_date,
      i.status,
      i.additional_requests,
      i.total_cost,

      c.first_name AS customer_first_name,
      c.last_name  AS customer_last_name,
      h.name       AS hotel_name,
      r.room_type  AS room_type
    FROM inserted i
    JOIN customers c ON c.id       = i.customer_id
    JOIN rooms     r ON r.room_id  = i.room_id
    JOIN hotels    h ON h.hotel_id = r.hotel_id;
  `;

  return result[0] as Booking;
};

// ======================================================
// GET ALL BOOKINGS
// ======================================================
export const getBookings = async () => {
  const result = await sql`
    SELECT
      b.booking_id,
      b.customer_id,
      b.room_id,
      b.check_in_date,
      b.check_out_date,
      b.status,
      b.additional_requests,
      b.total_cost,
      c.first_name AS customer_first_name,
      c.last_name  AS customer_last_name,
      h.name       AS hotel_name,
      r.room_type  AS room_type
      
    FROM bookings b
    JOIN customers c ON c.id       = b.customer_id
    JOIN rooms     r ON r.room_id  = b.room_id
    JOIN hotels    h ON h.hotel_id = r.hotel_id
    ORDER BY b.check_in_date DESC;
  `;

  // console.log(result)
  return result as Booking[];
};

// ======================================================
// GET BOOKING BY ID
// ======================================================
export const getBookingById = async (id: number) => {
  const result = await sql`
    SELECT
      b.booking_id,
      b.customer_id,
      b.room_id,
      b.check_in_date,
      b.check_out_date,
      b.status,
      b.additional_requests,
      b.total_cost,

      c.first_name AS customer_first_name,
      c.last_name  AS customer_last_name,
      h.name       AS hotel_name,
      r.room_type  AS room_type
    FROM bookings b
    JOIN customers c ON c.id       = b.customer_id
    JOIN rooms     r ON r.room_id  = b.room_id
    JOIN hotels    h ON h.hotel_id = r.hotel_id
    WHERE b.booking_id = ${id};
  `;

  return result[0] as Booking | undefined;
};

// ======================================================
// UPDATE BOOKING
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
    WITH updated AS (
      UPDATE bookings
      SET
        check_in_date       = COALESCE(${check_in_date},       check_in_date),
        check_out_date      = COALESCE(${check_out_date},      check_out_date),
        status              = COALESCE(${status},              status),
        additional_requests = COALESCE(${additional_requests}, additional_requests),
        total_cost          = COALESCE(${total_cost},          total_cost)
      WHERE booking_id = ${id}
      RETURNING
        booking_id,
        customer_id,
        room_id,
        check_in_date,
        check_out_date,
        status,
        additional_requests,
        total_cost
    )
    SELECT
      u.booking_id,
      u.customer_id,
      u.room_id,
      u.check_in_date,
      u.check_out_date,
      u.status,
      u.additional_requests,
      u.total_cost,

      c.first_name AS customer_first_name,
      c.last_name  AS customer_last_name,
      h.name       AS hotel_name,
      r.room_type  AS room_type
    FROM updated u
    JOIN customers c ON c.id       = u.customer_id
    JOIN rooms     r ON r.room_id  = u.room_id
    JOIN hotels    h ON h.hotel_id = r.hotel_id;
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
