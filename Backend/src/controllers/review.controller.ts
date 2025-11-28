import { Request, Response } from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/review.service";

export const listReviewsHandler = async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id ? Number(req.query.user_id) : undefined;
    const hotel_id = req.query.hotel_id
      ? Number(req.query.hotel_id)
      : undefined;

    const reviews = await getReviews({ user_id, hotel_id });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getReviewByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const review = await getReviewById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

export const createReviewHandler = async (req: Request, res: Response) => {
  try {
    const { user_id, hotel_id, star_rating, comment } = req.body;

    if (!user_id || !hotel_id) {
      return res
        .status(400)
        .json({ error: "user_id and hotel_id are required" });
    }

    if (
      star_rating !== undefined &&
      star_rating !== null &&
      (isNaN(Number(star_rating)) ||
        Number(star_rating) < 1 ||
        Number(star_rating) > 5)
    ) {
      return res
        .status(400)
        .json({ error: "star_rating must be a number between 1 and 5" });
    }

    const created = await createReview({
      user_id: Number(user_id),
      hotel_id: Number(hotel_id),
      star_rating: star_rating !== undefined ? Number(star_rating) : null,
      comment: comment ?? null,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

export const updateReviewHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { star_rating, comment } = req.body;

    if (
      star_rating !== undefined &&
      star_rating !== null &&
      (isNaN(Number(star_rating)) ||
        Number(star_rating) < 1 ||
        Number(star_rating) > 5)
    ) {
      return res
        .status(400)
        .json({ error: "star_rating must be a number between 1 and 5" });
    }

    const updated = await updateReview(id, {
      star_rating: star_rating !== undefined ? Number(star_rating) : undefined,
      comment,
    });

    if (!updated) return res.status(404).json({ message: "Review not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

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
