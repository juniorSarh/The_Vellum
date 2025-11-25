// src/models/room.model.ts

export interface Room {
  room_id?: number;
  hotel_id: number;
  room_type: string;
  price: number; // numeric(10,2)
  status: string; // e.g. "available", "booked", "maintenance"
}
