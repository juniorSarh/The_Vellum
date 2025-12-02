"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/review.routes.ts
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const reviewsRouter = (0, express_1.Router)();
// GET /api/reviews?customer_id=&hotel_id=
reviewsRouter.get("/", review_controller_1.listReviewsHandler);
// ✅ NEW: GET /api/reviews/hotel/:hotelId
reviewsRouter.get("/hotel/:hotelId", review_controller_1.getReviewsByHotelHandler);
// GET /api/reviews/:id
reviewsRouter.get("/:id", review_controller_1.getReviewByIdHandler);
// POST /api/reviews
reviewsRouter.post("/", review_controller_1.createReviewHandler);
// PUT /api/reviews/:id
reviewsRouter.put("/:id", review_controller_1.updateReviewHandler);
// DELETE /api/reviews/:id
reviewsRouter.delete("/:id", review_controller_1.deleteReviewHandler);
exports.default = reviewsRouter;
