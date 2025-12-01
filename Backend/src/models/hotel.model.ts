// src/models/hotel.model.ts
import { sql } from "../config/db";

export interface Hotel {
  hotel_id?: number;
  admin_id?: number | null;
  name: string;
  location: string;
  star_rating?: number | null;
  description?: string | null;

  // ✅ NEW: main cover image URL
  main_image?: string | null;

  // ✅ Gallery images
  images?: string[] | null;
}

// Get all hotels
export async function getAllHotels(): Promise<Hotel[]> {
  const rows = await sql`
    SELECT *
    FROM hotels
    ORDER BY hotel_id
  `;

  return rows as unknown as Hotel[];
}

// Get hotel by ID
export async function getHotelById(hotelId: number): Promise<Hotel | null> {
  const rows = await sql`
    SELECT *
    FROM hotels
    WHERE hotel_id = ${hotelId}
  `;

  const hotels = rows as unknown as Hotel[];
  return hotels[0] ?? null;
}

// Get hotels by admin
export async function getHotelsByAdmin(adminId: number): Promise<Hotel[]> {
  const rows = await sql`
    SELECT *
    FROM hotels
    WHERE admin_id = ${adminId}
    ORDER BY hotel_id
  `;

  return rows as unknown as Hotel[];
}

// Create hotel
export async function createHotel(hotel: Hotel): Promise<Hotel> {
  const {
    admin_id = null,
    name,
    location,
    star_rating = null,
    description = null,
    main_image = null,
    images = null,
  } = hotel;

  const rows = await sql`
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

  const hotels = rows as unknown as Hotel[];
  return hotels[0];
}

// Update hotel
export async function updateHotel(
  hotelId: number,
  hotel: Hotel
): Promise<Hotel | null> {
  const {
    admin_id = null,
    name,
    location,
    star_rating = null,
    description = null,
    main_image = null,
    images = null,
  } = hotel;

  const rows = await sql`
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

  const hotels = rows as unknown as Hotel[];
  return hotels[0] ?? null;
}

// Delete hotel
export async function deleteHotel(hotelId: number): Promise<boolean> {
  const rows = await sql`
    DELETE FROM hotels
    WHERE hotel_id = ${hotelId}
    RETURNING hotel_id
  `;

  const deletedRows = rows as unknown as { hotel_id: number }[];
  return deletedRows.length > 0;
}
