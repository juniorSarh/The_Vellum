import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // using react-icons
import "./hotelCard.css";
import { useAppDispatch, useAppSelector } from "../storeSlices/hooks";
import {
  addToFavourites,
  removeFavourite,
} from "../storeSlices/favouritesSlice";
import type { RootState } from "../../store";

interface HotelCardProps {
  image: string;
  name: string;
  hotelId: number;
  location: string;
  isFavorite?: boolean;
  isLoggedIn: boolean;
  onClick?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  image,
  name,
  hotelId,
  location,
  isFavorite,
  isLoggedIn,
  onClick,
}) => {
  const [isfavorite, setIsFavorite] = useState(isFavorite);
  const dispatch = useAppDispatch();

  const { hotels } = useAppSelector((state) => state.hotel);
  const customer_id = useAppSelector(
    (state: RootState) => state.customer.customer?.id!!
  );
  

  const favouritesList = useAppSelector((state : RootState) => state.favourites.list);
  const favourite_id = favouritesList.map((fav) => fav.hotel_id)[0];

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering card onClick
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      dispatch(addToFavourites({ customer_id, hotel_id:favourite_id }));
    } else {
      dispatch(removeFavourite({ customer_id, hotel_id:favourite_id}));
    }
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
