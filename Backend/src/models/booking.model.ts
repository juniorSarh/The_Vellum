export interface Booking {
  booking_id?: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
  additional_requests?: string | null;
  total_cost: number;
}

export interface BookingCreate {
  user_id: number;
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
