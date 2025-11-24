import { useState, useEffect } from "react";
import PrivateNav from "../../src/components/PrivateNaveBar";
import Footer from "../../src/components/Footer";
import SearchBar from "../../src/components/searchBar";
import Button from "../../src/components/Button";
import HotelCard from "../../src/components/hotelCard";

import "../../src/assets/css/favourites.css";
import { FaArrowLeft } from "react-icons/fa";
import hotelImg from "../../src/assets/images.jpg"; // hotel card image

export default function Favourites() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Mock hotel data (should match Home.tsx hotels)
  const hotels = [...Array(6)].map((_, i) => ({
    id: i,
    name: `Grand Hotel ${i + 1}`,
    location: "Cape Town",
    price: 1500 + i * 100,
    image: hotelImg,
  }));

  // Filter only favorited hotels
  const favoriteHotels = hotels.filter((hotel) => favorites.includes(hotel.id));

  const handleRemoveFavorite = (id: number) => {
    const updated = favorites.filter((favId) => favId !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="landing">

      {/* Navbar */}
      <PrivateNav />

      <div className="nav">
        <Button icon={<FaArrowLeft />} />
      </div>

      {/* Search bar */}
      <div className="search-bar-container">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search favorites..."
        />
      </div>

      {/* Hotel cards */}
      <div className="cards">
        {favoriteHotels.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            You have no favorites yet ❤️
          </p>
        ) : (
          favoriteHotels
            .filter((hotel) =>
              hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((hotel) => (
              <HotelCard
                key={hotel.id}
                name={hotel.name}
                location={hotel.location}
                price={hotel.price}
                image={hotel.image}
                isLoggedIn={true}
                isFavorite={true} 
                onFavorite={() => handleRemoveFavorite(hotel.id)} // 🔥 Remove functionality
              />
            ))
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
