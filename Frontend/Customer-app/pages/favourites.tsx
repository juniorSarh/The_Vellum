import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  fetchUserFavourites,
  removeFavourite,
} from "../../src/storeSlices/favouritesSlice";
import HotelCard from "../../src/components/hotelCard";
import type { RootState } from "../../store";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import "../../src/assets/css/favourites.css";
import SearchBar from "../../src/components/searchBar";

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

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading favourites...</h2>;
  if (error) return <p>Error: {error}</p>;
  if (!list.length) return <h2 style={{ textAlign: "center" }}>No favourites yet.</h2>;

  return (
    <>
      <PrivatNav />

      <div className="contant">
        <div className="search">
          <SearchBar />
        </div>
        <div className="heading">
          <h2>Your Favourites</h2>
        </div>
        <div className="favourites-grid">
          {list.map((fav) => (
            <HotelCard
              key={fav.favourite_id}
              hotelId={undefined}
              image={fav.images?.[0] || ""}
              name={fav.hotel_name || ""}
              isFavorite={true}
              location={fav.location || ""}
              isLoggedIn={true}
              onClick={() => handleRemoveFavourite(fav.hotel_id)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavouritesPage;
