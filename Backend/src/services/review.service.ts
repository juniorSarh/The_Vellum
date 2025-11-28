import { sql } from "../../src/config/db";
import { Review, ReviewCreate, ReviewUpdate } from "../models/review.model";

// ======================================
// CREATE REVIEWS TABLE
// ======================================
export const createReviewsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      review_id   SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      hotel_id    INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
      star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
      comment     TEXT
    );
  `;
};

// ======================================
// CREATE REVIEW
// ======================================
export const createReview = async (data: ReviewCreate) => {
  const { user_id, hotel_id, star_rating = null, comment = null } = data;

  const result = await sql`
    INSERT INTO reviews (user_id, hotel_id, star_rating, comment)
    VALUES (${user_id}, ${hotel_id}, ${star_rating}, ${comment})
    RETURNING review_id, user_id, hotel_id, star_rating, comment;
  `;
  return result[0] as Review;
};

// ======================================
// GET REVIEWS (optional filter by user_id/hotel_id)
// ======================================
export const getReviews = async (filters?: {
  user_id?: number;
  hotel_id?: number;
}) => {
  const { user_id, hotel_id } = filters || {};

  if (user_id && hotel_id) {
    return (await sql`
      SELECT review_id, user_id, hotel_id, star_rating, comment
      FROM reviews
      WHERE user_id = ${user_id} AND hotel_id = ${hotel_id}
      ORDER BY review_id DESC;
    `) as Review[];
  }

  if (user_id) {
    return (await sql`
      SELECT review_id, user_id, hotel_id, star_rating, comment
      FROM reviews
      WHERE user_id = ${user_id}
      ORDER BY review_id DESC;
    `) as Review[];
  }

  if (hotel_id) {
    return (await sql`
      SELECT review_id, user_id, hotel_id, star_rating, comment
      FROM reviews
      WHERE hotel_id = ${hotel_id}
      ORDER BY review_id DESC;
    `) as Review[];
  }

  return (await sql`
    SELECT review_id, user_id, hotel_id, star_rating, comment
    FROM reviews
    ORDER BY review_id DESC;
  `) as Review[];
};

// ======================================
// GET REVIEW BY ID
// ======================================
export const getReviewById = async (id: number) => {
  const result = await sql`
    SELECT review_id, user_id, hotel_id, star_rating, comment
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
    RETURNING review_id, user_id, hotel_id, star_rating, comment;
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
