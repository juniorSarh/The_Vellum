// src/controllers/hotelController.ts
import { Request, Response, NextFunction } from "express";
import {
  createHotel,
  getHotels,
  getHotelById,
  getHotelsByAdmin,
  updateHotel,
  deleteHotel,
} from "../services/hotel.services";

// ============================
// GET ALL HOTELS (OPTIONAL adminId FILTER)
// ============================
export async function getHotelsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const adminId = req.query.adminId ? Number(req.query.adminId) : undefined;

    const hotels = adminId
      ? await getHotelsByAdmin(adminId)
      : await getHotels();

    res.json(hotels);
  } catch (err) {
    next(err);
  }
}

// ============================
// GET HOTEL BY ID
// ============================
export async function getHotelByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const hotel = await getHotelById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (err) {
    next(err);
  }
}

// ============================
// CREATE HOTEL
// ============================
export async function createHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { admin_id, name, location, star_rating, description, images } =
      req.body;

    // You can add simple validation here if you want
    if (!name || !location) {
      return res
        .status(400)
        .json({ error: "Hotel name and location are required" });
    }

    const newHotel = await createHotel({
      admin_id,
      name,
      location,
      star_rating,
      description,
      images,
    });

    res.status(201).json(newHotel);
  } catch (err: any) {
    next(err);
  }
}

// ============================
// UPDATE HOTEL
// ============================
export async function updateHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const { admin_id, name, location, star_rating, description, images } =
      req.body;

    const updated = await updateHotel(id, {
      admin_id,
      name,
      location,
      star_rating,
      description,
      images,
    });

    if (!updated) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// ============================
// DELETE HOTEL
// ============================
export async function deleteHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    // Optional: you can first check if it exists
    const existing = await getHotelById(id);
    if (!existing) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    await deleteHotel(id);

    // 204 = No Content
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
