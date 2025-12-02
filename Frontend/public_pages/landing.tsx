import { useState, useEffect } from "react";
import Footer from "../src/components/Footer";
import HotelCard from "../src/components/hotelCard";
import SearchBar from "../src/components/searchBar";
import "../src/Landing.css";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { setHotels, type Hotel } from "../src/storeSlices/hotelSlice";
import PrivatNav from "../src/components/PrivatNav";

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { hotels } = useAppSelector((state) => state.hotel);

  // Load hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("https://the-vellum.onrender.com/api/hotels");
        if (!res.ok) {
          throw new Error("Failed to fetch hotels");
        }
        const data: Hotel[] = await res.json();
        dispatch(setHotels(data));
      } catch (err) {
        console.error("Error loading hotels:", err);
      }
    };

    fetchHotels();
  }, [dispatch]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Filter hotels by search term (name or location)
  const filteredHotels = (hotels || []).filter((hotel) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      hotel.name.toLowerCase().includes(term) ||
      hotel.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="landing-wrapper">
     <PrivatNav />

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

        <div className="hotel-card-grid">
          {filteredHotels.length === 0 ? (
            <p>No hotels found. Try another search.</p>
          ) : (
            filteredHotels.map((hotel) => {
              const imageUrl =
                hotel.images && hotel.images.length > 0
                  ? hotel.images[0].startsWith("http")
                    ? hotel.images[0]
                    : `https://the-vellum.onrender.com/${hotel.images[0]}`
                  : undefined;

              return (
                <HotelCard
                  key={hotel.hotel_id}
                  name={hotel.name}
                  hotelId={hotel.hotel_id}
                  location={hotel.location}
                  isLoggedIn={false}
                  image={imageUrl}
                  onClick={() => navigate(`/hotel/${hotel.hotel_id}`)}
                />
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
