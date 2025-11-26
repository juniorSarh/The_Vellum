import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // using react-icons
import "./hotelCard.css";

interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  isLoggedIn: boolean;
  onClick?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  image,
  name,
  location,
  isLoggedIn,
  onClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering card onClick
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-image-container">
        <img src={image} alt={name} className="hotel-image" />
         {isLoggedIn && (
          <div className="favorite-icon" onClick={toggleFavorite}>
            {isFavorite ? (
              <FaHeart color="#EAC248" />
            ) : (
              <FaRegHeart color="#fff" />
            )}
          </div>
        )}
      </div>

      <div className="hotel-content">
        <h3 className="hotel-name">{name}</h3>
        <p className="hotel-location">{location}</p>
      </div>
    </div>
  );
};

export default HotelCard;
