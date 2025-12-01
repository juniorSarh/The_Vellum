import express from "express";
import {
  addFavouriteController,
  getUserFavouritesController,
  getAllFavouritesController,
  removeFavouriteController,
  removeFavouriteByIdController,
} from "../controllers/favourites.controller";

const router = express.Router();

router.post("/", addFavouriteController);
router.get("/customers/:customer_id", getUserFavouritesController);
router.get("/", getAllFavouritesController);
router.delete("/", removeFavouriteController);
router.delete("/:favourite_id", removeFavouriteByIdController);

export default router;             
