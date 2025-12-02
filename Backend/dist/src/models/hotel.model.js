"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHotels = getAllHotels;
exports.getHotelById = getHotelById;
exports.getHotelsByAdmin = getHotelsByAdmin;
exports.createHotel = createHotel;
exports.updateHotel = updateHotel;
exports.deleteHotel = deleteHotel;
// src/models/hotel.model.ts
const db_1 = require("../config/db");
// Get all hotels
async function getAllHotels() {
    const rows = await (0, db_1.sql) `
    SELECT *
    FROM hotels
    ORDER BY hotel_id
  `;
    return rows;
}
// Get hotel by ID
async function getHotelById(hotelId) {
    const rows = await (0, db_1.sql) `
    SELECT *
    FROM hotels
    WHERE hotel_id = ${hotelId}
  `;
    const hotels = rows;
    return hotels[0] ?? null;
}
// Get hotels by admin
async function getHotelsByAdmin(adminId) {
    const rows = await (0, db_1.sql) `
    SELECT *
    FROM hotels
    WHERE admin_id = ${adminId}
    ORDER BY hotel_id
  `;
    return rows;
}
// Create hotel
async function createHotel(hotel) {
    const { admin_id = null, name, location, star_rating = null, description = null, main_image = null, images = null, } = hotel;
    const rows = await (0, db_1.sql) `
    INSERT INTO hotels (
      admin_id,
      name,
      location,
      star_rating,
      description,
      main_image,
      images
    )
    VALUES (
      ${admin_id},
      ${name},
      ${location},
      ${star_rating},
      ${description},
      ${main_image},
      ${images}
    )
    RETURNING *
  `;
    const hotels = rows;
    return hotels[0];
}
// Update hotel
async function updateHotel(hotelId, hotel) {
    const { admin_id = null, name, location, star_rating = null, description = null, main_image = null, images = null, } = hotel;
    const rows = await (0, db_1.sql) `
    UPDATE hotels
    SET
      admin_id   = ${admin_id},
      name       = ${name},
      location   = ${location},
      star_rating= ${star_rating},
      description= ${description},
      main_image = ${main_image},
      images     = ${images}
    WHERE hotel_id = ${hotelId}
    RETURNING *
  `;
    const hotels = rows;
    return hotels[0] ?? null;
}
// Delete hotel
async function deleteHotel(hotelId) {
    const rows = await (0, db_1.sql) `
    DELETE FROM hotels
    WHERE hotel_id = ${hotelId}
    RETURNING hotel_id
  `;
    const deletedRows = rows;
    return deletedRows.length > 0;
}
