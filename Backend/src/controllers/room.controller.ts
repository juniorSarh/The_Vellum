// src/controllers/room.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  getRoomsByHotel,
  updateRoom,
  deleteRoom,
} from "../services/room.service";

// ============================
// GET ALL ROOMS (optional ?hotelId)
// ============================
export const getRoomsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelIdParam = req.query.hotelId;
    const hotelId = hotelIdParam ? Number(hotelIdParam) : undefined;

    const rooms = hotelId ? await getRoomsByHotel(hotelId) : await getRooms();

    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

// ============================
// GET ROOM BY ID
// ============================
export const getRoomByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const room = await getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    next(err);
  }
};

// ============================
// CREATE ROOM
// ============================
export const createRoomHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hotel_id, room_type, price, status } = req.body;

    if (!hotel_id || !room_type || price == null || !status) {
      return res.status(400).json({
        error: "hotel_id, room_type, price, and status are required",
      });
    }

    const newRoom = await createRoom({
      hotel_id: Number(hotel_id),
      room_type,
      price: Number(price),
      status,
    });

    res.status(201).json(newRoom);
  } catch (err) {
    next(err);
  }
};

// ============================
// UPDATE ROOM
// ============================
export const updateRoomHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const { hotel_id, room_type, price, status } = req.body;

    const updated = await updateRoom(id, {
      hotel_id: hotel_id != null ? Number(hotel_id) : undefined,
      room_type,
      price: price != null ? Number(price) : undefined,
      status,
    });

    if (!updated) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ============================
// DELETE ROOM
// ============================
export const deleteRoomHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const existing = await getRoomById(id);
    if (!existing) {
      return res.status(404).json({ message: "Room not found" });
    }

    await deleteRoom(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
