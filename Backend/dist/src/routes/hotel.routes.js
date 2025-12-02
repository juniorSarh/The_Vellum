"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/hotelRoutes.ts
const express_1 = require("express");
const hotel_controller_1 = require("../controllers/hotel.controller");
const HotelRouter = (0, express_1.Router)();
// GET /api/hotels?adminId=1
HotelRouter.get("/", hotel_controller_1.getHotelsHandler);
// GET /api/hotels/:id
HotelRouter.get("/:id", hotel_controller_1.getHotelByIdHandler);
// POST /api/hotels
HotelRouter.post("/", hotel_controller_1.createHotelHandler);
// PUT /api/hotels/:id
HotelRouter.put("/:id", hotel_controller_1.updateHotelHandler);
// DELETE /api/hotels/:id
HotelRouter.delete("/:id", hotel_controller_1.deleteHotelHandler);
exports.default = HotelRouter;
