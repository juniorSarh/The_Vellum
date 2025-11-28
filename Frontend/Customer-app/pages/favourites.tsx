import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  fetchUserFavourites,
  removeFavourite,
} from "../../src/storeSlices/favouritesSlice";
import HotelCard from "../../src/components/hotelCard";
import type { RootState } from "../../store";

const FavouritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.favourites);

  // Get logged-in customer_id from customer slice
  const customer_id = useAppSelector((state : RootState) => state.customer.customer?.id);

  console.log(customer_id)
  useEffect(() => {
    if (customer_id) dispatch(fetchUserFavourites(customer_id));
  }, [customer_id, dispatch]);

  const handleRemoveFavourite = (hotel_id: number) => {
    if (!customer_id) return;
    dispatch(removeFavourite({ customer_id, hotel_id }));
  };

  if (loading) return <p>Loading favourites...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!list.length) return <p>No favourites yet.</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {list.map((fav) => (
        <HotelCard
          key={fav.favourite_id}
          hotelId={fav.favourite_id}
          image={fav.images?.[0] || ""}
          name={fav.hotel_name || ""}
          isFavorite= {true}
          location={fav.location || ""}
          isLoggedIn={true}
          onClick={() => handleRemoveFavourite(fav.hotel_id)}
        />
      ))}
    </div>
  );
};

export default FavouritesPage;
