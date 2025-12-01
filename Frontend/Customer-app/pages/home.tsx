import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../src/components/Footer";
import HotelCard from "../../src/components/hotelCard";
import SearchBar from "../../src/components/searchBar";
import PrivateNavBar from "../../src/components/PrivateNaveBar";
import "../../src/Landing.css";

import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { setHotels, type Hotel } from "../../src/storeSlices/hotelSlice";
import { fetchUserFavourites } from "../../src/storeSlices/favouritesSlice";
import type { RootState } from "../../store";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { hotels, loading, error } = useAppSelector((state) => state.hotel);
  const customer_id = useAppSelector(
    (state: RootState) => state.customer.customer?.id!!
  );
  const favourites = useAppSelector((state) => state.favourites.list);

  const isFavorite = (hotelId: number) => {
    return favourites.some((fav) => {
      return fav.hotel_id === hotelId;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Fetch hotels on first load
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:4040/api/hotels");
        const data = await res.json();
        dispatch(setHotels(data));
        dispatch(fetchUserFavourites(customer_id));
      } catch (err) {
        console.error("Failed to load hotels on home page:", err);
      }
    };

    fetchHotels();
  }, [dispatch]);

  // Filter hotels by search term (name or location)
  const filteredHotels: Hotel[] = hotels.filter((hotel) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = hotel.name?.toLowerCase().includes(term);
    const locationMatch = hotel.location?.toLowerCase().includes(term);
    return nameMatch || locationMatch;
  });

  return (
    <div className="landing-wrapper">
      <PrivateNavBar />

      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-heading">Discover Places You’ll Love 💛</h1>
          <p className="hero-text">
            Stay in stunning destinations, curated for comfort and unforgettable
            memories.
          </p>

          <div className="hero-search">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Where would you like to stay?"
            />
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="recommend-section">
        <h2 className="section-heading">Recommended For You ✨</h2>

        {loading && <p className="status-text">Loading hotels...</p>}
        {error && <p className="status-text error-text">{error}</p>}

        <div className="hotel-card-grid">
          {filteredHotels.length === 0 && !loading ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              No hotels found. Try a different search.
            </p>
          ) : (
            filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.hotel_id}
                hotelId={hotel.hotel_id!!}
                name={hotel.name}
                location={hotel.location}
                isFavorite={isFavorite(hotel.hotel_id!!)}
                // Placeholder price (you can later compute from rooms, etc.)
                isLoggedIn={true}
                image={
                  hotel.images && hotel.images.length > 0
                    ? hotel.images[0]
                    : "../src/assets/images.jpg"
                }
                onClick={() => navigate(`/hotel/${hotel.hotel_id}`)}
              />
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
