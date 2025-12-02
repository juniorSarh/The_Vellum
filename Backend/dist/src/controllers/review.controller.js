"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewHandler = exports.updateReviewHandler = exports.createReviewHandler = exports.getReviewByIdHandler = exports.getReviewsByHotelHandler = exports.listReviewsHandler = void 0;
const review_service_1 = require("../services/review.service");
// GET /api/reviews?customer_id=&hotel_id=
const listReviewsHandler = async (req, res) => {
    try {
        const customer_id = req.query.customer_id
            ? Number(req.query.customer_id)
            : undefined;
        const hotel_id = req.query.hotel_id
            ? Number(req.query.hotel_id)
            : undefined;
        const reviews = await (0, review_service_1.getReviews)({ customer_id, hotel_id });
        res.json(reviews);
    }
    catch (error) {
        console.error("Error listing reviews:", error);
        res.status(500).json({ message: "Failed to list reviews" });
    }
};
exports.listReviewsHandler = listReviewsHandler;
// ✅ NEW: GET /api/reviews/hotel/:hotelId
// returns reviews with rating + customer names
const getReviewsByHotelHandler = async (req, res) => {
    try {
        const hotelId = Number(req.params.hotelId);
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel id" });
        }
        const reviews = await (0, review_service_1.getReviewsByHotelWithCustomer)(hotelId);
        res.json(reviews);
    }
    catch (error) {
        console.error("Error fetching hotel reviews:", error);
        res.status(500).json({ message: "Failed to fetch hotel reviews" });
    }
};
exports.getReviewsByHotelHandler = getReviewsByHotelHandler;
// GET /api/reviews/:id
const getReviewByIdHandler = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const review = await (0, review_service_1.getReviewById)(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json(review);
    }
    catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ message: "Failed to fetch review" });
    }
};
exports.getReviewByIdHandler = getReviewByIdHandler;
// POST /api/reviews
const createReviewHandler = async (req, res) => {
    try {
        const review = await (0, review_service_1.createReview)(req.body);
        res.status(201).json(review);
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Failed to create review" });
    }
};
exports.createReviewHandler = createReviewHandler;
// PUT /api/reviews/:id
const updateReviewHandler = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await (0, review_service_1.updateReview)(id, req.body);
        if (!updated) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Failed to update review" });
    }
};
exports.updateReviewHandler = updateReviewHandler;
// DELETE /api/reviews/:id
const deleteReviewHandler = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, review_service_1.deleteReview)(id);
        res.json({ message: "Review deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Failed to delete review" });
    }
};
exports.deleteReviewHandler = deleteReviewHandler;
