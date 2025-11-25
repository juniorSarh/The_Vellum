import { useState } from "react";
import PrivateNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import SearchBar from "../../src/components/searchBar";
import HotelCard from "../../src/components/hotelCard";
import heroImg from "../../src/assets/hero.jpg"; // hero image
import hotelImg from "../../src/assets/images.jpg"; // hotel image
import "../../src/home.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]); // track favorited hotels

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const hotels = [...Array(6)].map((_, i) => ({
    id: i,
    name: `Grand Hotel ${i + 1}`,
    location: "Cape Town",
    price: 1500 + i * 100,
    image: hotelImg,
  }));

  return (
    <div className="home-page">
      <PrivateNav />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <h1>Discover Your Dream Stay ✨</h1>
          <p>Book luxury hotels, cozy lodges, and unforgettable experiences.</p>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search hotels, cities, or prices..."
          />
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="featured-hotels">
        <h2>Top Picks for You ❤️</h2>
        <div className="hotel-grid">
          {hotels
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
                isLoggedIn={true} // favorite icon shows on Home
                isFavorite={favorites.includes(hotel.id)}
                onFavorite={() => toggleFavorite(hotel.id)}
              />
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
