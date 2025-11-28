import { useEffect, useState } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { getHotelById } from "../src/storeSlices/hotelSlice";
import { fetchRooms } from "../src/storeSlices/roomSlice";
import Input from "../src/components/input";


import {
  addToFavourites,
  removeFavourite,
} from "../src/storeSlices/favouritesSlice";
import type { RootState } from "../store";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { hotels, loading, error } = useAppSelector((state) => state.hotel);
  const { rooms } = useAppSelector((state) => state.room);

  const hotel = hotels.find((h) => h.hotel_id === Number(id)) || null;

  // FORM STATE
  const [reservation, setReservation] = useState({
    room_type: "",
    check_in_date: "",
    check_out_date: "",
    people: "",
  });

  // ROOM PRICE BASED ON TYPE
  const getPriceForRoomType = (type: string) => {
    const room = rooms.find(
      (r) => r.room_type.toLowerCase() === type.toLowerCase()
    );
    return room ? room.price : 0;
  };

  // TOTAL PRICE CALCULATION
  const calculateTotalPrice = () => {
    if (
      !reservation.room_type ||
      !reservation.check_in_date ||
      !reservation.check_out_date
    ) {
      return 0;
    }

    const pricePerNight = getPriceForRoomType(reservation.room_type);

    const checkIn = new Date(reservation.check_in_date);
    const checkOut = new Date(reservation.check_out_date);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (numDays <= 0) return 0;

    return pricePerNight * numDays;
  };

  const totalPrice = calculateTotalPrice();

  // FORM HANDLER
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  // SHARE HANDLER
  const handleShare = async () => {
    const shareData = {
      title: hotel?.name || "Hotel",
      text: `Check out ${hotel?.name} in ${hotel?.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard error:", err);
        alert(
          "Could not copy the link. Please copy it manually from the address bar."
        );
      }
    }
  };

//  const dispatch = useAppDispatch();


// Inside your component:

const customer_id = useAppSelector((state : RootState) => state.customer.customer?.id);
const favourites = useAppSelector((state : RootState) => state.favourites.list);

// Check if a hotel is in favourites
const isFavourite = (hotel_id: number) => {
  return favourites.some((f) => f.hotel_id === hotel_id);
};

// Toggle favourite (add or remove)
const handleToggleFavourite = (hotel_id: number) => {
  console.log(customer_id)
  if (!customer_id) return;

  if (isFavourite(hotel_id)) {
    dispatch(removeFavourite({ customer_id, hotel_id }));
  } else {
    dispatch(addToFavourites({ customer_id, hotel_id }));
  }
};
  

// FETCH ROOMS + HOTEL
  useEffect(() => {
    if (id) {
      dispatch(getHotelById(Number(id)));
      dispatch(fetchRooms({ hotelId: Number(id) }));
    }
  }, [dispatch, id]);

  if (loading) return <p className="loading">Loading hotel...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!hotel) return <p>No hotel found.</p>;

  // Nights for checkout
  const checkIn = reservation.check_in_date
    ? new Date(reservation.check_in_date)
    : null;
  const checkOut = reservation.check_out_date
    ? new Date(reservation.check_out_date)
    : null;
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return (
    <div className="hotel-details-page">
      {/* NAV */}
      <div className="nav-row">
        <NavBar />
      </div>

      {/* MAIN */}
      <div className="hotel-details-wrapper">
        {/* LEFT */}
        <div className="hotel-left">
          <Button
            icon={<FaArrowLeft />}
            backgroundColor="white"
            color="black"
            onClick={() => navigate(-1)}
          />

          <h1 className="hotel-title">{hotel.name}</h1>
          <p className="hotel-location">{hotel.location}</p>

          <div className="image-container">
            {hotel.images && hotel.images.length > 0 ? (
              <img
                src={
                  hotel.images[0].startsWith("http")
                    ? hotel.images[0]
                    : `http://localhost:4040/${hotel.images[0]}`
                }
                alt={hotel.name}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <h2 className="desc-title">Description</h2>
          <p className="hotel-description">
            {hotel.description || "No description available."}
          </p>

          {/* RESERVATION SECTION NOW ON LEFT */}
          <div className="reservation-section">
            <h2>Make a Reservation</h2>

            <div className="reservation-form">
              {/* Room type */}
              <div className="form-group">
                <label>Room Type</label>
                <select
                  name="room_type"
                  value={reservation.room_type}
                  onChange={handleChange}
                >
                  <option value="">Select room type</option>
                  <option value="Deluxe">
                    Deluxe - R{getPriceForRoomType("Deluxe")}
                  </option>
                  <option value="Standard">
                    Standard - R{getPriceForRoomType("Standard")}
                  </option>
                  <option value="Suite">
                    Suite - R{getPriceForRoomType("Suite")}
                  </option>
                </select>
              </div>

              {/* Dates */}
              <Input
                label="Check-in Date"
                type="date"
                name="check_in_date"
                value={reservation.check_in_date}
                onChange={handleChange}
              />
              <Input
                label="Check-out Date"
                type="date"
                name="check_out_date"
                value={reservation.check_out_date}
                onChange={handleChange}
              />

              {/* People */}
              <Input
                label="Number of People"
                type="number"
                name="people"
                value={reservation.people}
                onChange={handleChange}
              />
              <div className="nights-display">
                <p>
                  <strong>Nights:</strong> {nights}
                </p>
              </div>

              {/* TOTAL PRICE DISPLAY */}
              <div className="total-price-box">
                <p>
                  <strong>Total Price: </strong> R{totalPrice}
                </p>
              </div>

              {/* RESERVE BUTTON */}
              <Button
                name="Reserve"
                backgroundColor="#846d29"
                color="white"
                className="reserve-btn"
                onClick={() => {
                  if (
                    !reservation.room_type ||
                    !reservation.check_in_date ||
                    !reservation.check_out_date ||
                    !reservation.people
                  ) {
                    alert(
                      "Please fill in all reservation details before continuing."
                    );
                    return;
                  }

                  // Find the room by type to get room_id + price
                  const selectedRoom = rooms.find(
                    (r) =>
                      r.room_type.toLowerCase() ===
                      reservation.room_type.toLowerCase()
                  );

                  const pricePerNight = selectedRoom ? selectedRoom.price : 0;
                  const roomId = selectedRoom ? selectedRoom.room_id : 1; // fallback

                  const checkIn = new Date(reservation.check_in_date);
                  const checkOut = new Date(reservation.check_out_date);
                  const diffTime = checkOut.getTime() - checkIn.getTime();
                  const nights =
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) > 0
                      ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      : 0;

                  const totalPrice = pricePerNight * nights;

                  navigate(`/checkout/${hotel.hotel_id}`, {
                    state: {
                      hotelName: hotel.name,
                      hotelLocation: hotel.location,
                      roomType: reservation.room_type,
                      check_in_date: reservation.check_in_date,
                      check_out_date: reservation.check_out_date,
                      people: reservation.people,
                      nights,
                      price_per_night: pricePerNight,
                      total_cost: totalPrice,
                      room_id: roomId,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hotel-right">
          <div className="right-top-actions">
            {/* LIKE → FAVOURITES */}
            <Button
              icon={<FaRegHeart />}
              backgroundColor="white"
              color="black"
              className="icon-btn"
              onClick={() => handleToggleFavourite(hotel.hotel_id!!)} // Pass hotel_id here
            />

            {/* SHARE */}
            <Button
              icon={<FaShare />}
              backgroundColor="white"
              color="black"
              className="icon-btn"
              onClick={handleShare}
            />
          </div>

          <div className="review-panel">
            <p>
              <strong>Total Reviews:</strong> 320
            </p>
            <div className="review-item">
              • Amazing place, loved the environment.
            </div>
            <div className="review-item">• Very clean and peaceful stay.</div>
            <div className="review-item">
              • Staff were friendly and helpful.
            </div>
          </div>

          {/* GOOGLE MAPS EMBED */}
          <div className="map-box">
            <div className="map-header">
              <FaMapMarkerAlt className="map-icon" />
              <span>Location</span>
            </div>
            <div className="map-embed">
              <iframe
                title="Hotel location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  hotel.location
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
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
