"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotel = exports.getHotelsByAdmin = exports.getHotelById = exports.getHotels = exports.createHotel = exports.createHotelTable = void 0;
// src/services/hotel.service.ts  (adjust path as needed)
const db_1 = require("../../src/config/db");
// ============================
// CREATE HOTELS TABLE
// ============================
const createHotelTable = async () => {
    await (0, db_1.sql) `
    CREATE TABLE IF NOT EXISTS hotels (
      hotel_id    SERIAL PRIMARY KEY,
      admin_id    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      name        TEXT NOT NULL,
      location    TEXT NOT NULL,
      star_rating INTEGER,
      description TEXT,
      main_image  TEXT,
      images      TEXT[]
    );
  `;
};
exports.createHotelTable = createHotelTable;
// ============================
// CREATE HOTEL
// ============================
const createHotel = async (hotel) => {
    const { admin_id = null, name, location, star_rating = null, description = null, main_image = null, images = null, } = hotel;
    const result = await (0, db_1.sql) `
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
    RETURNING hotel_id, admin_id, name, location, star_rating, description, main_image, images;
  `;
    return result[0];
};
exports.createHotel = createHotel;
// ============================
// GET ALL HOTELS
// ============================
const getHotels = async () => {
    return (await (0, db_1.sql) `
    SELECT hotel_id, admin_id, name, location, star_rating, description, main_image, images
    FROM hotels
    ORDER BY hotel_id;
  `);
};
exports.getHotels = getHotels;
// ============================
// GET HOTEL BY ID
// ============================
const getHotelById = async (hotel_id) => {
    const result = await (0, db_1.sql) `
    SELECT hotel_id, admin_id, name, location, star_rating, description, main_image, images
    FROM hotels
    WHERE hotel_id = ${hotel_id};
  `;
    return result[0];
};
exports.getHotelById = getHotelById;
// ============================
// GET HOTELS BY ADMIN
// ============================
const getHotelsByAdmin = async (admin_id) => {
    return (await (0, db_1.sql) `
    SELECT hotel_id, admin_id, name, location, star_rating, description, main_image, images
    FROM hotels
    WHERE admin_id = ${admin_id}
    ORDER BY hotel_id;
  `);
};
exports.getHotelsByAdmin = getHotelsByAdmin;
// ============================
// UPDATE HOTEL (PARTIAL UPDATE)
// ============================
const updateHotel = async (hotel_id, hotelData) => {
    const { admin_id, name, location, star_rating, description, main_image, images, } = hotelData;
    const result = await (0, db_1.sql) `
    UPDATE hotels
    SET
      admin_id    = COALESCE(${admin_id},    admin_id),
      name        = COALESCE(${name},        name),
      location    = COALESCE(${location},    location),
      star_rating = COALESCE(${star_rating}, star_rating),
      description = COALESCE(${description}, description),
      main_image  = COALESCE(${main_image},  main_image),
      images      = COALESCE(${images},      images)
    WHERE hotel_id = ${hotel_id}
    RETURNING hotel_id, admin_id, name, location, star_rating, description, main_image, images;
  `;
    return result[0];
};
exports.updateHotel = updateHotel;
// ============================
// DELETE HOTEL
// ============================
const deleteHotel = async (hotel_id) => {
    await (0, db_1.sql) `
    DELETE FROM hotels
    WHERE hotel_id = ${hotel_id};
  `;
};
exports.deleteHotel = deleteHotel;
