import { Request, Response } from "express";
import {
  addFavourite,
  getFavouritesByCustomer,
  getAllFavourites,
  removeByCustomerAndHotel,
  removeById,
  isFavourite,
} from "../services/favourites.service";

export const addFavouriteController = async (req: Request, res: Response) => {
  try {
    const { customer_id, hotel_id } = req.body;
    if (!customer_id || !hotel_id)
      return res
        .status(400)
        .json({ error: "customer_id and hotel_id are required" });

    const exists = await isFavourite(customer_id, hotel_id);
    if (exists)
      return res.status(409).json({ message: "Already in favourites" });

    const fav = await addFavourite(customer_id, hotel_id);
    res.status(201).json(fav);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserFavouritesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { customer_id } = req.params;
    const list = await getFavouritesByCustomer(Number(customer_id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllFavouritesController = async (
  req: Request,
  res: Response
) => {
  try {
    const list = await getAllFavourites();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeFavouriteController = async (
  req: Request,
  res: Response
) => {
  try {
    const { customer_id, hotel_id } = req.body;
    if (!customer_id || !hotel_id)
      return res
        .status(400)
        .json({ error: "customer_id and hotel_id are required" });

    const removed = await removeByCustomerAndHotel(customer_id, hotel_id);
    res.json(removed || { message: "Nothing to remove" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeFavouriteByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { favourite_id } = req.params;
    const removed = await removeById(Number(favourite_id));
    res.json(removed || { message: "Not found" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
