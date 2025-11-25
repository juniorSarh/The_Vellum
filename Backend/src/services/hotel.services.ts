// src/services/hotel.service.ts  (adjust path as needed)
import { sql } from "../../src/config/db";
import { Hotel } from "../models/hotel.model"; // adjust the path if different

// ============================
// CREATE HOTELS TABLE
// ============================
export const createHotelTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS hotels (
      hotel_id   SERIAL PRIMARY KEY,
      admin_id   INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      name       TEXT NOT NULL,
      location   TEXT NOT NULL,
      star_rating INTEGER,
      description TEXT,
      images      TEXT[]
    );
  `;
};

// ============================
// CREATE HOTEL
// ============================
export const createHotel = async (hotel: Omit<Hotel, "hotel_id">) => {
  const {
    admin_id = null,
    name,
    location,
    star_rating = null,
    description = null,
    images = null,
  } = hotel;

  const result = await sql`
    INSERT INTO hotels (admin_id, name, location, star_rating, description, images)
    VALUES (${admin_id}, ${name}, ${location}, ${star_rating}, ${description}, ${images})
    RETURNING hotel_id, admin_id, name, location, star_rating, description, images;
  `;

  return result[0] as Hotel;
};

// ============================
// GET ALL HOTELS
// ============================
export const getHotels = async () => {
  return (await sql`
    SELECT hotel_id, admin_id, name, location, star_rating, description, images
    FROM hotels
    ORDER BY hotel_id;
  `) as Hotel[];
};

// ============================
// GET HOTEL BY ID
// ============================
export const getHotelById = async (hotel_id: number) => {
  const result = await sql`
    SELECT hotel_id, admin_id, name, location, star_rating, description, images
    FROM hotels
    WHERE hotel_id = ${hotel_id};
  `;

  return result[0] as Hotel | undefined;
};

// ============================
// GET HOTELS BY ADMIN
// ============================
export const getHotelsByAdmin = async (admin_id: number) => {
  return (await sql`
    SELECT hotel_id, admin_id, name, location, star_rating, description, images
    FROM hotels
    WHERE admin_id = ${admin_id}
    ORDER BY hotel_id;
  `) as Hotel[];
};

// ============================
// UPDATE HOTEL (PARTIAL UPDATE)
// ============================
export const updateHotel = async (
  hotel_id: number,
  hotelData: Partial<Hotel>
) => {
  const { admin_id, name, location, star_rating, description, images } =
    hotelData;

  const result = await sql`
    UPDATE hotels
    SET
      admin_id   = COALESCE(${admin_id}, admin_id),
      name       = COALESCE(${name}, name),
      location   = COALESCE(${location}, location),
      star_rating= COALESCE(${star_rating}, star_rating),
      description= COALESCE(${description}, description),
      images     = COALESCE(${images}, images)
    WHERE hotel_id = ${hotel_id}
    RETURNING hotel_id, admin_id, name, location, star_rating, description, images;
  `;

  return result[0] as Hotel | undefined;
};

// ============================
// DELETE HOTEL
// ============================
export const deleteHotel = async (hotel_id: number) => {
  await sql`
    DELETE FROM hotels
    WHERE hotel_id = ${hotel_id};
  `;
};
