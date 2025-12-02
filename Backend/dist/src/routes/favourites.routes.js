"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favourites_controller_1 = require("../controllers/favourites.controller");
const router = express_1.default.Router();
router.post("/", favourites_controller_1.addFavouriteController);
router.get("/customers/:customer_id", favourites_controller_1.getUserFavouritesController);
router.get("/", favourites_controller_1.getAllFavouritesController);
router.delete("/", favourites_controller_1.removeFavouriteController);
router.delete("/:favourite_id", favourites_controller_1.removeFavouriteByIdController);
exports.default = router;
