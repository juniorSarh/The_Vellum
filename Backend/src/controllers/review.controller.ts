// src/controllers/review.controller.ts
import { Request, Response } from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByHotelWithCustomer,
} from "../services/review.service";

// GET /api/reviews?customer_id=&hotel_id=
export const listReviewsHandler = async (req: Request, res: Response) => {
  try {
    const customer_id = req.query.customer_id
      ? Number(req.query.customer_id)
      : undefined;
    const hotel_id = req.query.hotel_id
      ? Number(req.query.hotel_id)
      : undefined;

    const reviews = await getReviews({ customer_id, hotel_id });
    res.json(reviews);
  } catch (error) {
    console.error("Error listing reviews:", error);
    res.status(500).json({ message: "Failed to list reviews" });
  }
};

// ✅ NEW: GET /api/reviews/hotel/:hotelId
// returns reviews with rating + customer names
export const getReviewsByHotelHandler = async (req: Request, res: Response) => {
  try {
    const hotelId = Number(req.params.hotelId);
    if (isNaN(hotelId)) {
      return res.status(400).json({ message: "Invalid hotel id" });
    }

    const reviews = await getReviewsByHotelWithCustomer(hotelId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching hotel reviews:", error);
    res.status(500).json({ message: "Failed to fetch hotel reviews" });
  }
};

// GET /api/reviews/:id
export const getReviewByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const review = await getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

// POST /api/reviews
export const createReviewHandler = async (req: Request, res: Response) => {
  try {
    const review = await createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

// PUT /api/reviews/:id
export const updateReviewHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateReview(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// DELETE /api/reviews/:id
export const deleteReviewHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteReview(id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
