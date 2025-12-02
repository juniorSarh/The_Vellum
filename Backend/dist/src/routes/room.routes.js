"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/room.routes.ts
const express_1 = require("express");
const room_controller_1 = require("../controllers/room.controller");
const router = (0, express_1.Router)();
// GET /api/rooms           -> all rooms or filter by ?hotelId=1
router.get("/", room_controller_1.getRoomsHandler);
// GET /api/rooms/:id       -> single room
router.get("/:id", room_controller_1.getRoomByIdHandler);
// POST /api/rooms          -> create room
router.post("/", room_controller_1.createRoomHandler);
// PUT /api/rooms/:id       -> update room
router.put("/:id", room_controller_1.updateRoomHandler);
// DELETE /api/rooms/:id    -> delete room
router.delete("/:id", room_controller_1.deleteRoomHandler);
exports.default = router;
