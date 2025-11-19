import React, { useState } from "react";
import BookingCard from "../../src/components/bookingCard";
import SearchBar from "../../src/components/searchBar";
import Footer from "../../src/components/Footer";
import { useNavigate } from "react-router-dom";
import "../../src/BookingCard.css"

const BookingsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [bookings] = useState([
    "Booking Ref: 3920394434",
    "Booking Ref: 9495499494",
    "Booking Ref: 5848473853",
  ]);

  const filteredBookings = bookings.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  const handleFavorite = (item: string) => {
    const stored = JSON.parse(localStorage.getItem("favourites") || "[]");

    if (!stored.includes(item)) {
      stored.push(item);
      localStorage.setItem("favourites", JSON.stringify(stored));
    }

    navigate("/favourites");
  };

  return (
    <div className="page-container">
      <div className="bookings-wrapper">
        <button className="back-btn">←</button>

        <SearchBar value={search} onChange={(val) => setSearch(val)} />

        <h3 className="section-title">Your Bookings</h3>

        {filteredBookings.length === 0 ? (
          <p className="empty-message">
            No bookings yet — start booking a stay!
          </p>
        ) : (
          filteredBookings.map((item, index) => (
            <BookingCard
              key={index}
              title={item}
              onShare={() => alert(`Shared ${item}`)}
              onFavorite={() => handleFavorite(item)}
            />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookingsPage;
