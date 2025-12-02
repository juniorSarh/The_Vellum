"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFavourite = exports.removeById = exports.removeByCustomerAndHotel = exports.getAllFavourites = exports.getFavouritesByCustomer = exports.addFavourite = exports.createFavouritesTable = void 0;
const db_1 = require("../config/db");
// CREATE TABLE
const createFavouritesTable = async () => {
    await (0, db_1.sql) `
    CREATE TABLE IF NOT EXISTS favourites (
      favourite_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE (customer_id, hotel_id)
    );
  `;
};
exports.createFavouritesTable = createFavouritesTable;
// ADD FAVOURITE
const addFavourite = async (customer_id, hotel_id) => {
    const result = await (0, db_1.sql) `
    INSERT INTO favourites (customer_id, hotel_id)
    VALUES (${customer_id}, ${hotel_id})
    ON CONFLICT (customer_id, hotel_id) DO NOTHING
    RETURNING *;
  `;
    return result[0];
};
exports.addFavourite = addFavourite;
// GET USER FAVOURITES
const getFavouritesByCustomer = async (customer_id) => {
    const result = await (0, db_1.sql) `
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
exports.getFavouritesByCustomer = getFavouritesByCustomer;
//gET ALL FAVOURITES
const getAllFavourites = async () => {
    const result = await (0, db_1.sql) `
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
exports.getAllFavourites = getAllFavourites;
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
const removeByCustomerAndHotel = async (customer_id, hotel_id) => {
    const result = await (0, db_1.sql) `
    DELETE FROM favourites
    WHERE customer_id = ${customer_id} AND hotel_id = ${hotel_id}
    RETURNING *;
  `;
    return result[0];
};
exports.removeByCustomerAndHotel = removeByCustomerAndHotel;
// REMOVE BY FAVOURITE ID
const removeById = async (favourite_id) => {
    const result = await (0, db_1.sql) `
    DELETE FROM favourites
    WHERE favourite_id = ${favourite_id}
    RETURNING *;
  `;
    return result[0];
};
exports.removeById = removeById;
// CHECK IF FAVOURITE EXISTS
const isFavourite = async (customer_id, hotel_id) => {
    const result = await (0, db_1.sql) `
    SELECT favourite_id FROM favourites
    WHERE customer_id = ${customer_id} AND hotel_id = ${hotel_id};
  `;
    return result.length > 0;
};
exports.isFavourite = isFavourite;
