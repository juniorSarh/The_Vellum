// src/models/booking.model.ts

export interface Booking {
  booking_id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;  
  check_out_date: string; 
  status: string;
  additional_requests?: string | null;
  total_cost: number;
}
