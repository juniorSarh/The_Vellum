import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import NavBar from "../src/components/navBar";
import Button from "../src/components/Button";
import Footer from "../src/components/Footer";
import {
  FaArrowLeft,
  FaRegHeart,
  FaShare,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../src/assets/css/hotelDetails.css";

import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { setHotels, type Hotel } from "../src/storeSlices/hotelSlice";

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { hotels, loading, error } = useAppSelector((state) => state.hotel);

  // Fetch hotels if we don't have them yet
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:4040/api/hotels");
        const data = await res.json();
        dispatch(setHotels(data));
      } catch (err) {
        console.error("Failed to load hotels in HotelDetails:", err);
      }
    };

    if (hotels.length === 0) {
      fetchHotels();
    }
  }, [dispatch, hotels.length]);

  const hotelId = id ? Number(id) : undefined;

  const selectedHotel: Hotel | undefined = hotelId
    ? hotels.find((h) => h.hotel_id === hotelId)
    : undefined;

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookNow = () => {
    if (!selectedHotel?.hotel_id) return;
    navigate("/checkout", {
      state: {
        hotelId: selectedHotel.hotel_id,
        hotelName: selectedHotel.name,
      },
    });
  };

  const displayHotelName = selectedHotel?.name || "Hotel Name";
  const displayHotelLocation = selectedHotel?.location || "Location";
  const displayHotelDescription =
    selectedHotel?.description ||
    "No description available for this hotel yet.";

  return (
    <div className="hotel-details-page">
      {/* NAV */}
      <div className="nav-row">
        <NavBar />
      </div>

      {/* MAIN WRAPPER */}
      <div className="hotel-details-wrapper">
        {/* LEFT COLUMN */}
        <div className="hotel-left">
          <Button
            icon={<FaArrowLeft />}
            backgroundColor="white"
            color="black"
            onClick={handleBack}
          />

          <h1 className="hotel-title">{displayHotelName}</h1>
          <p className="hotel-location">{displayHotelLocation}</p>

          <div className="image-container">
            <img
              src={
                selectedHotel?.images && selectedHotel.images.length > 0
                  ? selectedHotel.images[0]
                  : "../src/assets/images.jpg"
              }
              alt={displayHotelName}
            />
          </div>

          <h2 className="desc-title">Description:</h2>

          <p className="hotel-description">{displayHotelDescription}</p>

          {loading && <p className="status-text">Loading hotel details...</p>}
          {error && <p className="status-text error-text">{error}</p>}
        </div>

        {/* RIGHT COLUMN */}
        <div className="hotel-right">
          {/* Icons + Book Button */}
          <div className="right-top-actions">
            <Button
              icon={<FaRegHeart />}
              className="icon"
              backgroundColor="white"
              color="black"
            />
            <Button
              icon={<FaShare />}
              className="icon"
              backgroundColor="white"
              color="black"
            />

            <Button
              name="Book Now"
              backgroundColor="#000"
              color="white"
              className="book-btn"
              onClick={handleBookNow}
            />
          </div>

          {/* REVIEWS BOX (dummy for now) */}
          <div className="review-panel">
            <p>
              <strong>Total Good reviews:</strong> 320
            </p>
            <p>
              <strong>Comments:</strong>
            </p>

            <div className="review-item">
              • Amazing place, loved the environment.
            </div>
            <div className="review-item">• Very clean and peaceful stay.</div>
            <div className="review-item">
              • Staff were friendly and helpful.
            </div>
            <div className="review-item">
              • Amazing place, loved the environment.
            </div>
            <div className="review-item">• Very clean and peaceful stay.</div>
            <div className="review-item">
              • Staff were friendly and helpful.
            </div>
          </div>

          {/* MAP BUTTON */}
          <div className="map-button-box">
            <Button
              icon={<FaMapMarkerAlt />}
              name="Show on Map"
              backgroundColor="#e5e5e5"
              color="black"
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
