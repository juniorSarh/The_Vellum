import { useState, useEffect } from "react";
import NavBar from "../src/components/navBar";
import Footer from "../src/components/Footer";
import HotelCard from "../src/components/hotelCard";
import SearchBar from "../src/components/searchBar";
import "../src/Landing.css";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { setHotels, type Hotel } from "../src/storeSlices/hotelSlice";

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { hotels } = useAppSelector((state) => state.hotel);

  // Load hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:4040/api/hotels");
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
      <NavBar />

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
                    : `http://localhost:4040/${hotel.images[0]}`
                  : undefined;

              return (
                <HotelCard
                  key={hotel.hotel_id}
                  name={hotel.name}
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
