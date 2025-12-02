"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReviewById = exports.getReviewsByHotelWithCustomer = exports.getReviews = exports.createReview = exports.createReviewsTable = void 0;
// src/services/review.service.ts
const db_1 = require("../../src/config/db");
// ======================================
// CREATE REVIEWS TABLE
// ======================================
// NOTE: Uses customer_id to reference customers(id) and adds created_at
const createReviewsTable = async () => {
    await (0, db_1.sql) `
    CREATE TABLE IF NOT EXISTS reviews (
      review_id    SERIAL PRIMARY KEY,
      customer_id  INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      hotel_id     INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
      star_rating  INTEGER CHECK (star_rating BETWEEN 1 AND 5),
      comment      TEXT,
      created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
};
exports.createReviewsTable = createReviewsTable;
// ======================================
// CREATE REVIEW
// ======================================
// expects ReviewCreate to have: customer_id, hotel_id, star_rating?, comment?
const createReview = async (data) => {
    const { customer_id, hotel_id, star_rating = null, comment = null } = data;
    const result = await (0, db_1.sql) `
    INSERT INTO reviews (customer_id, hotel_id, star_rating, comment)
    VALUES (${customer_id}, ${hotel_id}, ${star_rating}, ${comment})
    RETURNING review_id, customer_id, hotel_id, star_rating, comment, created_at;
  `;
    return result[0];
};
exports.createReview = createReview;
// ======================================
// GET REVIEWS (optional filter by customer_id / hotel_id)
// ======================================
const getReviews = async (filters) => {
    const { customer_id, hotel_id } = filters || {};
    if (customer_id && hotel_id) {
        return (await (0, db_1.sql) `
      SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
      FROM reviews
      WHERE customer_id = ${customer_id} AND hotel_id = ${hotel_id}
      ORDER BY created_at DESC;
    `);
    }
    if (customer_id) {
        return (await (0, db_1.sql) `
      SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
      FROM reviews
      WHERE customer_id = ${customer_id}
      ORDER BY created_at DESC;
    `);
    }
    if (hotel_id) {
        return (await (0, db_1.sql) `
      SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
      FROM reviews
      WHERE hotel_id = ${hotel_id}
      ORDER BY created_at DESC;
    `);
    }
    return (await (0, db_1.sql) `
    SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
    FROM reviews
    ORDER BY created_at DESC;
  `);
};
exports.getReviews = getReviews;
// ======================================
// SPECIAL: GET REVIEWS BY HOTEL WITH CUSTOMER NAMES
// (for /api/reviews/hotel/:hotelId)
// ======================================
const getReviewsByHotelWithCustomer = async (hotelId) => {
    const rows = await (0, db_1.sql) `
    SELECT
      r.review_id,
      r.hotel_id,
      r.customer_id,
      r.star_rating AS rating,           -- alias for frontend
      r.comment,
      r.created_at,
      c.first_name AS customer_first_name,
      c.last_name  AS customer_last_name
    FROM reviews r
    JOIN customers c ON c.id = r.customer_id
    WHERE r.hotel_id = ${hotelId}
    ORDER BY r.created_at DESC;
  `;
    // returns objects like:
    // {
    //   review_id,
    //   hotel_id,
    //   customer_id,
    //   rating,
    //   comment,
    //   created_at,
    //   customer_first_name,
    //   customer_last_name
    // }
    return rows;
};
exports.getReviewsByHotelWithCustomer = getReviewsByHotelWithCustomer;
// ======================================
// GET REVIEW BY ID
// ======================================
const getReviewById = async (id) => {
    const result = await (0, db_1.sql) `
    SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
    FROM reviews
    WHERE review_id = ${id};
  `;
    return result[0];
};
exports.getReviewById = getReviewById;
// ======================================
// UPDATE REVIEW (partial)
// ======================================
const updateReview = async (id, data) => {
    const { star_rating = null, comment = null } = data;
    const result = await (0, db_1.sql) `
    UPDATE reviews
    SET
      star_rating = COALESCE(${star_rating}, star_rating),
      comment     = COALESCE(${comment}, comment)
    WHERE review_id = ${id}
    RETURNING review_id, customer_id, hotel_id, star_rating, comment, created_at;
  `;
    return result[0];
};
exports.updateReview = updateReview;
// ======================================
// DELETE REVIEW
// ======================================
const deleteReview = async (id) => {
    await (0, db_1.sql) `
    DELETE FROM reviews WHERE review_id = ${id};
  `;
};
exports.deleteReview = deleteReview;
