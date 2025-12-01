import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { fetchUserFavourites } from "../../src/storeSlices/favouritesSlice";
import HotelCard from "../../src/components/hotelCard";
import type { RootState } from "../../store";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import "../../src/assets/css/favourites.css";
import SearchBar from "../../src/components/searchBar";
import { useNavigate } from "react-router-dom";

const FavouritesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useAppSelector((state) => state.favourites);

  const customer_id = useAppSelector(
    (state: RootState) => state.customer.customer?.id
  );

  useEffect(() => {
    if (customer_id) dispatch(fetchUserFavourites(customer_id));
  }, [customer_id, dispatch]);

  // search handler
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Filter favourites based on search term
  const filteredFavourites = list.filter((fav) =>
    fav.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PrivatNav />

      <div className="contant">
        <div className="search">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Find your favourite hotels..."
          />
        </div>

        {loading && (
          <h2 style={{ textAlign: "center" }}>Loading favourites...</h2>
        )}
        {error && <p style={{ textAlign: "center" }}>Error: {error}</p>}

        {/* No favourites yet */}
        {!loading && !error && list.length === 0 && !searchTerm && (
          <div className="no-favourites-box">
            <h2>No favourites yet.</h2>
          </div>
        )}

        {/* No results found while searching */}
        {searchTerm && filteredFavourites.length === 0 && (
          <h3 style={{ textAlign: "center", marginTop: "20px" }}>
            No matching hotels found.
          </h3>
        )}

        {/* Show favourites or search results */}
        {(searchTerm ? filteredFavourites : list).length > 0 && (
          <>
            <div className="heading">
              <h2>Your Favourites</h2>
            </div>

            <div className="favourites-grid">
              {(searchTerm ? filteredFavourites : list).map((fav) => (
                <HotelCard
                  key={fav.favourite_id}
                  hotelId={fav.hotel_id}
                  image={fav.images?.[0] || ""}
                  name={fav.hotel_name || ""}
                  isFavorite={true}
                  location={fav.location || ""}
                  isLoggedIn={true}
                  onClick={() => navigate(`/hotel/${fav.hotel_id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default FavouritesPage;
