// src/routes/hotelRoutes.ts
import { Router } from "express";
import {
  getHotelsHandler,
  getHotelByIdHandler,
  createHotelHandler,
  updateHotelHandler,
  deleteHotelHandler,
} from "../controllers/hotel.controller";

const HotelRouter = Router();

// GET /api/hotels?adminId=1
HotelRouter.get("/", getHotelsHandler);

// GET /api/hotels/:id
HotelRouter.get("/:id", getHotelByIdHandler);

// POST /api/hotels
HotelRouter.post("/", createHotelHandler);

// PUT /api/hotels/:id
HotelRouter.put("/:id", updateHotelHandler);

// DELETE /api/hotels/:id
HotelRouter.delete("/:id", deleteHotelHandler);

export default HotelRouter;
