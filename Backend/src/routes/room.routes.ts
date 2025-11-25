// src/routes/room.routes.ts
import { Router } from "express";
import {
  getRoomsHandler,
  getRoomByIdHandler,
  createRoomHandler,
  updateRoomHandler,
  deleteRoomHandler,
} from "../controllers/room.controller";

const router = Router();

// GET /api/rooms           -> all rooms or filter by ?hotelId=1
router.get("/", getRoomsHandler);

// GET /api/rooms/:id       -> single room
router.get("/:id", getRoomByIdHandler);

// POST /api/rooms          -> create room
router.post("/", createRoomHandler);

// PUT /api/rooms/:id       -> update room
router.put("/:id", updateRoomHandler);

// DELETE /api/rooms/:id    -> delete room
router.delete("/:id", deleteRoomHandler);

export default router;
