// src/services/review.service.ts
import { sql } from "../../src/config/db";
import { Review, ReviewCreate, ReviewUpdate } from "../models/review.model";

// ======================================
// CREATE REVIEWS TABLE
// ======================================
// NOTE: Uses customer_id to reference customers(id) and adds created_at
export const createReviewsTable = async () => {
  await sql`
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

// ======================================
// CREATE REVIEW
// ======================================
// expects ReviewCreate to have: customer_id, hotel_id, star_rating?, comment?
export const createReview = async (data: ReviewCreate) => {
  const { customer_id, hotel_id, star_rating = null, comment = null } = data;

  const result = await sql`
    INSERT INTO reviews (customer_id, hotel_id, star_rating, comment)
    VALUES (${customer_id}, ${hotel_id}, ${star_rating}, ${comment})
    RETURNING review_id, customer_id, hotel_id, star_rating, comment, created_at;
  `;
  return result[0] as Review;
};

// ======================================
// GET REVIEWS (optional filter by customer_id / hotel_id)
// ======================================
export const getReviews = async (filters?: {
  customer_id?: number;
  hotel_id?: number;
}) => {
  const { customer_id, hotel_id } = filters || {};

  if (customer_id && hotel_id) {
    return (await sql`
      SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
      FROM reviews
      WHERE customer_id = ${customer_id} AND hotel_id = ${hotel_id}
      ORDER BY created_at DESC;
    `) as Review[];
  }

  if (customer_id) {
    return (await sql`
      SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
      FROM reviews
      WHERE customer_id = ${customer_id}
      ORDER BY created_at DESC;
    `) as Review[];
  }

  if (hotel_id) {
    return (await sql`
      SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
      FROM reviews
      WHERE hotel_id = ${hotel_id}
      ORDER BY created_at DESC;
    `) as Review[];
  }

  return (await sql`
    SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
    FROM reviews
    ORDER BY created_at DESC;
  `) as Review[];
};

// ======================================
// SPECIAL: GET REVIEWS BY HOTEL WITH CUSTOMER NAMES
// (for /api/reviews/hotel/:hotelId)
// ======================================
export const getReviewsByHotelWithCustomer = async (hotelId: number) => {
  const rows = await sql`
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

// ======================================
// GET REVIEW BY ID
// ======================================
export const getReviewById = async (id: number) => {
  const result = await sql`
    SELECT review_id, customer_id, hotel_id, star_rating, comment, created_at
    FROM reviews
    WHERE review_id = ${id};
  `;
  return result[0] as Review | undefined;
};

// ======================================
// UPDATE REVIEW (partial)
// ======================================
export const updateReview = async (id: number, data: ReviewUpdate) => {
  const { star_rating = null, comment = null } = data;

  const result = await sql`
    UPDATE reviews
    SET
      star_rating = COALESCE(${star_rating}, star_rating),
      comment     = COALESCE(${comment}, comment)
    WHERE review_id = ${id}
    RETURNING review_id, customer_id, hotel_id, star_rating, comment, created_at;
  `;
  return result[0] as Review | undefined;
};

// ======================================
// DELETE REVIEW
// ======================================
export const deleteReview = async (id: number) => {
  await sql`
    DELETE FROM reviews WHERE review_id = ${id};
  `;
};
