// src/server/models/booking.model.ts

export interface Booking {
  booking_id?: number;
  customer_id: number;
  room_id: number;

  check_in_date: string; // TIMESTAMPTZ → ISO string
  check_out_date: string;

  status: string;
  additional_requests?: string | null;

  // PG NUMERIC => usually a string in JS; allow both
  total_cost: string | number;

  // Joined fields (optional)
  customer_first_name?: string;
  customer_last_name?: string;
  hotel_name?: string;
  room_type?: string;
}

export interface BookingCreate {
  customer_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
  additional_requests?: string;
  total_cost: number;
}

export interface BookingUpdate {
  check_in_date?: string;
  check_out_date?: string;
  status?: string;
  additional_requests?: string;
  total_cost?: number;
}
