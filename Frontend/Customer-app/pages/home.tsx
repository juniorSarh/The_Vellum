import { useState } from "react";
import Footer from "../../src/components/Footer";
import HotelCard from "../../src/components/hotelCard";
import SearchBar from "../../src/components/searchBar";
import PrivateNavBar from "../../src/components/PrivateNaveBar";
import "../../src/Landing.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

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

        <div className="hotel-card-grid">
          {[...Array(12)].map((_, i) => (
            <HotelCard
              key={i}
              name="The Vellum"
              location="KwaZulu-Natal, South Africa"
              price={2000}
              isLoggedIn={true}
              image="../src/assets/images.jpg"
              />
          ))}

        </div>
      </section>

      <Footer />
    </div>
  );
     
}
