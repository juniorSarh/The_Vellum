import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./hotelCard.css";
import { useAppDispatch, useAppSelector } from "../storeSlices/hooks";
import {
  addToFavourites,
  removeFavourite,
} from "../storeSlices/favouritesSlice";
import type { RootState } from "../../store";

interface HotelCardProps {
  image?: string; // <- now optional
  name: string;
  hotelId: number | undefined;
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
  const dispatch = useAppDispatch();

  const customer_id = useAppSelector(
    (state: RootState) => state.customer.customer?.id!!
  );
  

  const addHotel = (hotelId: number | undefined) => {
    if (hotelId === undefined && !isFavorite) {
      dispatch(addToFavourites({ customer_id, hotel_id: favourite_id}));
    } else if(hotelId === undefined && isFavorite){
      dispatch(removeFavourite({ customer_id, hotel_id: favourite_id }));
    }
    if (hotelId && !isFavorite) {
      dispatch(addToFavourites({ customer_id, hotel_id: hotelId}));
    } else if(hotelId && isFavorite){
      dispatch(removeFavourite({ customer_id, hotel_id: hotelId}));
    }
  }
  const favouritesList = useAppSelector((state : RootState) => state.favourites.list);
  const favourite_id = favouritesList.map((fav) => fav.hotel_id)[0];

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    addHotel(hotelId);
  };

  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-image-container">
        {image ? (
          <img src={image} alt={name} className="hotel-image" />
        ) : (
          <div className="hotel-image placeholder">
            <span>{name.charAt(0).toUpperCase()}</span>
          </div>
        )}

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
