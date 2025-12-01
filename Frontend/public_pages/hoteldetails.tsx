import { useEffect, useState } from "react";
import NavBar from "../src/components/navBar";
import Button from "../src/components/Button";
import Footer from "../src/components/Footer";
import {
  FaArrowLeft,
  FaRegHeart,
  FaHeart,
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
  fetchUserFavourites,
} from "../src/storeSlices/favouritesSlice";
import type { RootState } from "../store";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- GLOBAL STATE ---
  const { hotels, loading, error } = useAppSelector((state) => state.hotel);
  const { rooms } = useAppSelector((state) => state.room);

  // Logged-in customer
  const customer_id = useAppSelector(
    (state: RootState) => state.customer.customer?.id
  );

  // Favourites list from Redux
  const favouritesList = useAppSelector((state) => state.favourites.list);

  // Find current hotel from store
  const hotel = hotels.find((h) => h.hotel_id === Number(id)) || null;

  // --- IMAGE GALLERY STATE ---
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages =
    hotel?.images?.filter((img) => img && img.trim().length) || [];

  const allImagesRaw: string[] = [
    ...(hotel?.main_image && hotel.main_image.trim().length
      ? [hotel.main_image]
      : []),
    ...galleryImages,
  ];
  const allImages = Array.from(new Set(allImagesRaw));

  useEffect(() => {
    if (!hotel) {
      setActiveImage(null);
      return;
    }

    const main =
      hotel.main_image && hotel.main_image.trim().length
        ? hotel.main_image
        : null;
    const firstGallery = galleryImages.length > 0 ? galleryImages[0] : null;

    setActiveImage(main || firstGallery);
  }, [hotel, galleryImages.length]);

  const buildImageUrl = (url: string) =>
    url.startsWith("http") ? url : `http://localhost:4040/${url}`;

  const openLightboxAt = (url?: string | null) => {
    if (!url || allImages.length === 0) return;
    const idx = allImages.findIndex((img) => img === url);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const goPrev = () => {
    if (allImages.length === 0) return;
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (allImages.length === 0) return;
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // --- RESERVATION FORM STATE ---
  const [reservation, setReservation] = useState({
    room_type: "",
    check_in_date: "",
    check_out_date: "",
    people: "",
  });

  const getPriceForRoomType = (type: string) => {
    const room = rooms.find(
      (r) => r.room_type.toLowerCase() === type.toLowerCase()
    );
    return room ? room.price : 0;
  };

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  // --- SHARE HANDLER ---
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

  // --- FETCH HOTEL + ROOMS ---
  useEffect(() => {
    if (id) {
      dispatch(getHotelById(Number(id)));
      dispatch(fetchRooms({ hotelId: Number(id) }));
    }
  }, [dispatch, id]);

  // --- FETCH USER FAVOURITES ONCE LOGGED IN ---
  useEffect(() => {
    if (customer_id) {
      dispatch(fetchUserFavourites(customer_id));
    }
  }, [dispatch, customer_id]);

  if (loading) return <p className="loading">Loading hotel...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!hotel) return <p>No hotel found.</p>;

  // Nights for checkout display
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

  // --- FAVOURITES LOGIC ---
  const isFavorite = hotel?.hotel_id
    ? favouritesList.some((fav) => fav.hotel_id === hotel.hotel_id)
    : false;

  const toggleFavourite = () => {
    if (!customer_id || !hotel?.hotel_id) {
      alert("Please log in to add favorites");
      return;
    }

    const hotelId = hotel.hotel_id;

    if (isFavorite) {
      dispatch(removeFavourite({ customer_id, hotel_id: hotelId }));
    } else {
      dispatch(addToFavourites({ customer_id, hotel_id: hotelId }));
    }
  };

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

          {/* MAIN IMAGE */}
          <div
            className={
              activeImage
                ? "image-container image-container-clickable"
                : "image-container"
            }
            onClick={() => activeImage && openLightboxAt(activeImage)}
          >
            {activeImage ? (
              <img src={buildImageUrl(activeImage)} alt={hotel.name} />
            ) : (
              <p>No image available</p>
            )}
          </div>

          {/* THUMBS */}
          {(hotel.main_image || galleryImages.length > 0) && (
            <div className="gallery-thumbnails">
              {hotel.main_image && hotel.main_image.trim().length > 0 && (
                <button
                  type="button"
                  className={`thumb-btn ${
                    activeImage === hotel.main_image ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(hotel.main_image!)}
                >
                  <img
                    src={buildImageUrl(hotel.main_image)}
                    alt={`${hotel.name} main`}
                  />
                </button>
              )}

              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumb-btn ${activeImage === img ? "active" : ""}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img
                    src={buildImageUrl(img)}
                    alt={`${hotel.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}

          <h2 className="desc-title">Description</h2>
          <p className="hotel-description">
            {hotel.description || "No description available."}
          </p>

          {/* RESERVATION SECTION */}
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

                  const selectedRoom = rooms.find(
                    (r) =>
                      r.room_type.toLowerCase() ===
                      reservation.room_type.toLowerCase()
                  );

                  const pricePerNight = selectedRoom ? selectedRoom.price : 0;
                  const roomId = selectedRoom ? selectedRoom.room_id : 1;

                  const checkInDate = new Date(reservation.check_in_date);
                  const checkOutDate = new Date(reservation.check_out_date);
                  const diffTime =
                    checkOutDate.getTime() - checkInDate.getTime();
                  const nightsCalc =
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) > 0
                      ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      : 0;

                  const totalCost = pricePerNight * nightsCalc;

                  navigate(`/checkout/${hotel.hotel_id}`, {
                    state: {
                      hotelName: hotel.name,
                      hotelLocation: hotel.location,
                      roomType: reservation.room_type,
                      check_in_date: reservation.check_in_date,
                      check_out_date: reservation.check_out_date,
                      people: reservation.people,
                      nights: nightsCalc,
                      price_per_night: pricePerNight,
                      total_cost: totalCost,
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
            {/* FAVOURITE BUTTON */}
            <Button
              icon={isFavorite ? <FaHeart color="#EAC248" /> : <FaRegHeart />}
              backgroundColor="white"
              color="black"
              className="icon-btn"
              onClick={toggleFavourite}
            />

            {/* SHARE BUTTON */}
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

      {/* LIGHTBOX */}
      {isLightboxOpen && allImages.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
            >
              ×
            </button>

            <div className="lightbox-main-image">
              <img
                src={buildImageUrl(allImages[lightboxIndex])}
                alt={`${hotel.name} large`}
              />
            </div>

            {allImages.length > 1 && (
              <div className="lightbox-nav">
                <button
                  type="button"
                  className="lightbox-nav-btn"
                  onClick={goPrev}
                >
                  ‹
                </button>
                <span className="lightbox-counter">
                  {lightboxIndex + 1} / {allImages.length}
                </span>
                <button
                  type="button"
                  className="lightbox-nav-btn"
                  onClick={goNext}
                >
                  ›
                </button>
              </div>
            )}

            <div className="lightbox-thumbs">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`lightbox-thumb-btn ${
                    index === lightboxIndex ? "active" : ""
                  }`}
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={buildImageUrl(img)}
                    alt={`${hotel.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
