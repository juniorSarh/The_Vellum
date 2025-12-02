"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavouriteByIdController = exports.removeFavouriteController = exports.getAllFavouritesController = exports.getUserFavouritesController = exports.addFavouriteController = void 0;
const favourites_service_1 = require("../services/favourites.service");
const addFavouriteController = async (req, res) => {
    try {
        const { customer_id, hotel_id } = req.body;
        if (!customer_id || !hotel_id)
            return res
                .status(400)
                .json({ error: "customer_id and hotel_id are required" });
        const exists = await (0, favourites_service_1.isFavourite)(customer_id, hotel_id);
        if (exists)
            return res.status(409).json({ message: "Already in favourites" });
        const fav = await (0, favourites_service_1.addFavourite)(customer_id, hotel_id);
        res.status(201).json(fav);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addFavouriteController = addFavouriteController;
const getUserFavouritesController = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const list = await (0, favourites_service_1.getFavouritesByCustomer)(Number(customer_id));
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserFavouritesController = getUserFavouritesController;
const getAllFavouritesController = async (req, res) => {
    try {
        const list = await (0, favourites_service_1.getAllFavourites)();
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllFavouritesController = getAllFavouritesController;
const removeFavouriteController = async (req, res) => {
    try {
        const { customer_id, hotel_id } = req.body;
        if (!customer_id || !hotel_id)
            return res
                .status(400)
                .json({ error: "customer_id and hotel_id are required" });
        const removed = await (0, favourites_service_1.removeByCustomerAndHotel)(customer_id, hotel_id);
        res.json(removed || { message: "Nothing to remove" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFavouriteController = removeFavouriteController;
const removeFavouriteByIdController = async (req, res) => {
    try {
        const { favourite_id } = req.params;
        const removed = await (0, favourites_service_1.removeById)(Number(favourite_id));
        res.json(removed || { message: "Not found" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFavouriteByIdController = removeFavouriteByIdController;
