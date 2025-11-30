export interface Review {
  review_id: number;
  user_id: number;
  hotel_id: number;
  star_rating: number | null;
  comment: string | null;
}

export interface ReviewCreate {
  user_id: number;
  hotel_id: number;
  star_rating?: number | null;
  comment?: string | null;
}

export interface ReviewUpdate {
  star_rating?: number | null;
  comment?: string | null;
}
