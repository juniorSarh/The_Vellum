export interface Favourite {
  favourite_id?: number; // primary key
  customer_id: number;
  hotel_id: number;
  created_at?: string; // DATE string
}
