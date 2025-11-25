// src/services/room.service.ts
import { sql } from "../../src/config/db"; // keep same style as your other services
import { Room } from "../models/room.model";

// ============================
// CREATE ROOMS TABLE
// ============================
export const createRoomTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id   SERIAL PRIMARY KEY,
      hotel_id  INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
      room_type TEXT    NOT NULL,
      price     NUMERIC(10,2) NOT NULL,
      status    TEXT    NOT NULL
    );
  `;
};

// ============================
// CREATE ROOM
// ============================
export const createRoom = async (
  room: Omit<Room, "room_id">
): Promise<Room> => {
  const { hotel_id, room_type, price, status } = room;

  const result = await sql`
    INSERT INTO rooms (hotel_id, room_type, price, status)
    VALUES (${hotel_id}, ${room_type}, ${price}, ${status})
    RETURNING room_id, hotel_id, room_type, price, status;
  `;

  return result[0] as Room;
};

// ============================
// GET ALL ROOMS
// ============================
export const getRooms = async (): Promise<Room[]> => {
  const result = await sql`
    SELECT room_id, hotel_id, room_type, price, status
    FROM rooms
    ORDER BY room_id;
  `;

  return result as Room[];
};

// ============================
// GET ROOM BY ID
// ============================
export const getRoomById = async (
  room_id: number
): Promise<Room | undefined> => {
  const result = await sql`
    SELECT room_id, hotel_id, room_type, price, status
    FROM rooms
    WHERE room_id = ${room_id};
  `;

  return result[0] as Room | undefined;
};

// ============================
// GET ROOMS BY HOTEL
// ============================
export const getRoomsByHotel = async (
  hotel_id: number
): Promise<Room[]> => {
  const result = await sql`
    SELECT room_id, hotel_id, room_type, price, status
    FROM rooms
    WHERE hotel_id = ${hotel_id}
    ORDER BY room_id;
  `;

  return result as Room[];
};

// ============================
// UPDATE ROOM (PARTIAL)
// ============================
export const updateRoom = async (
  room_id: number,
  updates: Partial<Room>
): Promise<Room | undefined> => {
  const { hotel_id, room_type, price, status } = updates;

  const result = await sql`
    UPDATE rooms
    SET
      hotel_id  = COALESCE(${hotel_id}, hotel_id),
      room_type = COALESCE(${room_type}, room_type),
      price     = COALESCE(${price}, price),
      status    = COALESCE(${status}, status)
    WHERE room_id = ${room_id}
    RETURNING room_id, hotel_id, room_type, price, status;
  `;

  return result[0] as Room | undefined;
};

// ============================
// DELETE ROOM
// ============================
export const deleteRoom = async (room_id: number): Promise<void> => {
  await sql`
    DELETE FROM rooms
    WHERE room_id = ${room_id};
  `;
};
