"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.getRoomsByHotel = exports.getRoomById = exports.getRooms = exports.createRoom = exports.createRoomTable = void 0;
// src/services/room.service.ts
const db_1 = require("../../src/config/db"); // keep same style as your other services
// ============================
// CREATE ROOMS TABLE
// ============================
const createRoomTable = async () => {
    await (0, db_1.sql) `
    CREATE TABLE IF NOT EXISTS rooms (
      room_id   SERIAL PRIMARY KEY,
      hotel_id  INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
      room_type TEXT    NOT NULL,
      price     NUMERIC(10,2) NOT NULL,
      status    TEXT    NOT NULL
    );
  `;
};
exports.createRoomTable = createRoomTable;
// ============================
// CREATE ROOM
// ============================
const createRoom = async (room) => {
    const { hotel_id, room_type, price, status } = room;
    const result = await (0, db_1.sql) `
    INSERT INTO rooms (hotel_id, room_type, price, status)
    VALUES (${hotel_id}, ${room_type}, ${price}, ${status})
    RETURNING room_id, hotel_id, room_type, price, status;
  `;
    return result[0];
};
exports.createRoom = createRoom;
// ============================
// GET ALL ROOMS
// ============================
const getRooms = async () => {
    const result = await (0, db_1.sql) `
    SELECT room_id, hotel_id, room_type, price, status
    FROM rooms
    ORDER BY room_id;
  `;
    return result;
};
exports.getRooms = getRooms;
// ============================
// GET ROOM BY ID
// ============================
const getRoomById = async (room_id) => {
    const result = await (0, db_1.sql) `
    SELECT room_id, hotel_id, room_type, price, status
    FROM rooms
    WHERE room_id = ${room_id};
  `;
    return result[0];
};
exports.getRoomById = getRoomById;
// ============================
// GET ROOMS BY HOTEL
// ============================
const getRoomsByHotel = async (hotel_id) => {
    const result = await (0, db_1.sql) `
    SELECT room_id, hotel_id, room_type, price, status
    FROM rooms
    WHERE hotel_id = ${hotel_id}
    ORDER BY room_id;
  `;
    return result;
};
exports.getRoomsByHotel = getRoomsByHotel;
// ============================
// UPDATE ROOM (PARTIAL)
// ============================
const updateRoom = async (room_id, updates) => {
    const { hotel_id, room_type, price, status } = updates;
    const result = await (0, db_1.sql) `
    UPDATE rooms
    SET
      hotel_id  = COALESCE(${hotel_id}, hotel_id),
      room_type = COALESCE(${room_type}, room_type),
      price     = COALESCE(${price}, price),
      status    = COALESCE(${status}, status)
    WHERE room_id = ${room_id}
    RETURNING room_id, hotel_id, room_type, price, status;
  `;
    return result[0];
};
exports.updateRoom = updateRoom;
// ============================
// DELETE ROOM
// ============================
const deleteRoom = async (room_id) => {
    await (0, db_1.sql) `
    DELETE FROM rooms
    WHERE room_id = ${room_id};
  `;
};
exports.deleteRoom = deleteRoom;
