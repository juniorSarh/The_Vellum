import { Router } from "express";
import {
  listReviewsHandler,
  getReviewByIdHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
} from "../controllers/review.controller";

const reviewsRouter = Router();

// GET /api/reviews?user_id=&hotel_id=
reviewsRouter.get("/", listReviewsHandler);

// GET /api/reviews/:id
reviewsRouter.get("/:id", getReviewByIdHandler);

// POST /api/reviews
reviewsRouter.post("/", createReviewHandler);

// PUT /api/reviews/:id
reviewsRouter.put("/:id", updateReviewHandler);

// DELETE /api/reviews/:id
reviewsRouter.delete("/:id", deleteReviewHandler);

export default reviewsRouter;
