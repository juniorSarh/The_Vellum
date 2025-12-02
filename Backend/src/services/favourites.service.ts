import { sql } from "../config/db";
import { Favourite } from "../models/favourite.model";

// CREATE TABLE
export const createFavouritesTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS favourites (
      favourite_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE (customer_id, hotel_id)
    );
  `;
};

// ADD FAVOURITE
export const addFavourite = async (customer_id: number, hotel_id: number) => {
  const result = await sql`
    INSERT INTO favourites (customer_id, hotel_id)
    VALUES (${customer_id}, ${hotel_id})
    ON CONFLICT (customer_id, hotel_id) DO NOTHING
    RETURNING *;
  `;
  return result[0];
};


// GET USER FAVOURITES
export const getFavouritesByCustomer = async (customer_id: number) => {
  const result = await sql`
    SELECT 
      f.favourite_id, 
      f.customer_id, 
      f.hotel_id, 
      f.created_at,
      h.name AS hotel_name,
      h.location,
      h.star_rating,
      h.description,
      h.images
    FROM favourites f
    JOIN hotels h ON h.hotel_id = f.hotel_id
    WHERE f.customer_id = ${customer_id}
    ORDER BY f.created_at DESC;
  `;
  return result;
};



//gET ALL FAVOURITES
export const getAllFavourites = async () => {
  const result = await sql`
    SELECT f.favourite_id, f.customer_id, f.hotel_id, f.created_at,
           c.email AS customer_email,
           h.name AS hotel_name
    FROM favourites f
    JOIN customers c ON c.id = f.customer_id
    JOIN hotels h ON h.hotel_id = f.hotel_id
    ORDER BY f.created_at DESC;
  `;
  return result;
};

// export const getAllFavourites = async () => {
//   const result = await sql`
//     SELECT 
//       f.favourite_id,
//       f.customer_id,
//       f.hotel_id,
//       f.created_at,

     
//       c.email AS customer_email,
//       c.first_name AS customer_first_name,
//       c.last_name AS customer_last_name,

      
//       h.name AS hotel_name,
//       h.location AS hotel_location,
//       h.star_rating AS hotel_star_rating,
//       h.description AS hotel_description,
//       h.images AS hotel_images

//     FROM favourites f
//     JOIN customers c ON c.id = f.customer_id
//     JOIN hotels h ON h.hotel_id = f.hotel_id
//     ORDER BY f.created_at DESC;
//   `;
//   return result;
// };





// REMOVE BY CUSTOMER + HOTEL
export const removeByCustomerAndHotel = async (
  customer_id: number,
  hotel_id: number
) => {
  const result = await sql`
    DELETE FROM favourites
    WHERE customer_id = ${customer_id} AND hotel_id = ${hotel_id}
    RETURNING *;
  `;
  return result[0];
};

// REMOVE BY FAVOURITE ID
export const removeById = async (favourite_id: number) => {
  const result = await sql`
    DELETE FROM favourites
    WHERE favourite_id = ${favourite_id}
    RETURNING *;
  `;
  return result[0];
};

// CHECK IF FAVOURITE EXISTS
export const isFavourite = async (customer_id: number, hotel_id: number) => {
  const result = await sql`
    SELECT favourite_id FROM favourites
    WHERE customer_id = ${customer_id} AND hotel_id = ${hotel_id};
  `;
  return result.length > 0;
};
