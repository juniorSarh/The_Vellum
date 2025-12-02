"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelsHandler = getHotelsHandler;
exports.getHotelByIdHandler = getHotelByIdHandler;
exports.createHotelHandler = createHotelHandler;
exports.updateHotelHandler = updateHotelHandler;
exports.deleteHotelHandler = deleteHotelHandler;
const hotel_services_1 = require("../services/hotel.services");
// ============================
// GET ALL HOTELS (OPTIONAL adminId FILTER)
// ============================
async function getHotelsHandler(req, res, next) {
    try {
        const adminId = req.query.adminId ? Number(req.query.adminId) : undefined;
        const hotels = adminId
            ? await (0, hotel_services_1.getHotelsByAdmin)(adminId)
            : await (0, hotel_services_1.getHotels)();
        res.json(hotels);
    }
    catch (err) {
        next(err);
    }
}
// ============================
// GET HOTEL BY ID
// ============================
async function getHotelByIdHandler(req, res, next) {
    try {
        const id = Number(req.params.id);
        const hotel = await (0, hotel_services_1.getHotelById)(id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json(hotel);
    }
    catch (err) {
        next(err);
    }
}
// ============================
// CREATE HOTEL
// ============================
async function createHotelHandler(req, res, next) {
    try {
        const { admin_id, name, location, star_rating, description, images } = req.body;
        // You can add simple validation here if you want
        if (!name || !location) {
            return res
                .status(400)
                .json({ error: "Hotel name and location are required" });
        }
        const newHotel = await (0, hotel_services_1.createHotel)({
            admin_id,
            name,
            location,
            star_rating,
            description,
            images,
        });
        res.status(201).json(newHotel);
    }
    catch (err) {
        next(err);
    }
}
// ============================
// UPDATE HOTEL
// ============================
async function updateHotelHandler(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { admin_id, name, location, star_rating, description, images } = req.body;
        const updated = await (0, hotel_services_1.updateHotel)(id, {
            admin_id,
            name,
            location,
            star_rating,
            description,
            images,
        });
        if (!updated) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
}
// ============================
// DELETE HOTEL
// ============================
async function deleteHotelHandler(req, res, next) {
    try {
        const id = Number(req.params.id);
        // Optional: you can first check if it exists
        const existing = await (0, hotel_services_1.getHotelById)(id);
        if (!existing) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        await (0, hotel_services_1.deleteHotel)(id);
        // 204 = No Content
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
