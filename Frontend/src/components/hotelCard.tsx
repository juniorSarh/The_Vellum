import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./hotelCard.css";

interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  price: number;
  isLoggedIn?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onRemove?: () => void; // 👈 NEW
  onClick?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  image,
  name,
  location,
  price,
  isLoggedIn = false,
  isFavorite = false,
  onFavorite,
  onRemove, // 👈 NEW
  onClick,
}) => {
  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-image-container">
        <img src={image} alt={name} className="hotel-image" />

        {isLoggedIn && onFavorite && (
          <div
            className="favorite-icon"
            onClick={(e) => {
              e.stopPropagation();

              // 👇 If card is already favorite and we're on favorites page → remove it
              if (isFavorite && onRemove) {
                onRemove();
              } else {
                onFavorite();
              }
            }}
          >
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
        <p className="hotel-price">{price} / night</p>
      </div>
    </div>
  );
};

export default HotelCard;
