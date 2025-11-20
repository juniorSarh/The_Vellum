// src/components/BookingCard.tsx
import React from "react";
import { FaShareAlt, FaHeart } from "react-icons/fa";
import Button from "./Button";
import "../../src/BookingCard.css";

interface BookingCardProps {
  title: string;
  onShare: () => void;
  onFavorite: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  title,
  onShare,
  onFavorite,
}) => {
  return (
    <div className="booking-card">
      <p className="booking-text">{title}</p>

      <div className="booking-actions">
        <Button
          icon={<FaShareAlt />}
          backgroundColor="#d9d9d9"
          color="#000"
          className="booking-btn"
          onClick={onShare}
        />

        <Button
          icon={<FaHeart />}
          backgroundColor="#d9d9d9"
          color="#000"
          className="booking-btn"
          onClick={onFavorite}
        />
      </div>
    </div>
  );
};

export default BookingCard;
