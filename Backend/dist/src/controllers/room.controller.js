"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomHandler = exports.updateRoomHandler = exports.createRoomHandler = exports.getRoomByIdHandler = exports.getRoomsHandler = void 0;
const room_service_1 = require("../services/room.service");
// ============================
// GET ALL ROOMS (optional ?hotelId)
// ============================
const getRoomsHandler = async (req, res, next) => {
    try {
        const hotelIdParam = req.query.hotelId;
        const hotelId = hotelIdParam ? Number(hotelIdParam) : undefined;
        const rooms = hotelId ? await (0, room_service_1.getRoomsByHotel)(hotelId) : await (0, room_service_1.getRooms)();
        res.json(rooms);
    }
    catch (err) {
        next(err);
    }
};
exports.getRoomsHandler = getRoomsHandler;
// ============================
// GET ROOM BY ID
// ============================
const getRoomByIdHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const room = await (0, room_service_1.getRoomById)(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json(room);
    }
    catch (err) {
        next(err);
    }
};
exports.getRoomByIdHandler = getRoomByIdHandler;
// ============================
// CREATE ROOM
// ============================
const createRoomHandler = async (req, res, next) => {
    try {
        const { hotel_id, room_type, price, status } = req.body;
        if (!hotel_id || !room_type || price == null || !status) {
            return res.status(400).json({
                error: "hotel_id, room_type, price, and status are required",
            });
        }
        const newRoom = await (0, room_service_1.createRoom)({
            hotel_id: Number(hotel_id),
            room_type,
            price: Number(price),
            status,
        });
        res.status(201).json(newRoom);
    }
    catch (err) {
        next(err);
    }
};
exports.createRoomHandler = createRoomHandler;
// ============================
// UPDATE ROOM
// ============================
const updateRoomHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { hotel_id, room_type, price, status } = req.body;
        const updated = await (0, room_service_1.updateRoom)(id, {
            hotel_id: hotel_id != null ? Number(hotel_id) : undefined,
            room_type,
            price: price != null ? Number(price) : undefined,
            status,
        });
        if (!updated) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
};
exports.updateRoomHandler = updateRoomHandler;
// ============================
// DELETE ROOM
// ============================
const deleteRoomHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const existing = await (0, room_service_1.getRoomById)(id);
        if (!existing) {
            return res.status(404).json({ message: "Room not found" });
        }
        await (0, room_service_1.deleteRoom)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteRoomHandler = deleteRoomHandler;
