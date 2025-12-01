export interface Review {
  review_id: number;
  customer_id: number;
  hotel_id: number;
  star_rating: number | null;
  comment: string | null;
}

export interface ReviewCreate {
  customer_id: number;
  hotel_id: number;
  star_rating?: number | null;
  comment?: string | null;
}

export interface ReviewUpdate {
  star_rating?: number | null;
  comment?: string | null;
}
