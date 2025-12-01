// src/routes/review.routes.ts
import { Router } from "express";
import {
  listReviewsHandler,
  getReviewByIdHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  getReviewsByHotelHandler, // ✅ NEW
} from "../controllers/review.controller";

const reviewsRouter = Router();

// GET /api/reviews?customer_id=&hotel_id=
reviewsRouter.get("/", listReviewsHandler);

// ✅ NEW: GET /api/reviews/hotel/:hotelId
reviewsRouter.get("/hotel/:hotelId", getReviewsByHotelHandler);

// GET /api/reviews/:id
reviewsRouter.get("/:id", getReviewByIdHandler);

// POST /api/reviews
reviewsRouter.post("/", createReviewHandler);

// PUT /api/reviews/:id
reviewsRouter.put("/:id", updateReviewHandler);

// DELETE /api/reviews/:id
reviewsRouter.delete("/:id", deleteReviewHandler);

export default reviewsRouter;
