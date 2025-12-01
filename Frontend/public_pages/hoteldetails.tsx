import { useEffect, useState, useCallback } from "react";
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

type Review = {
  review_id?: number;
  customer_id: number;
  hotel_id: number;
  star_rating?: number | null;
  comment?: string | null;
  created_at?: string;
  // optionally include user details if backend returns them
  user_name?: string;
};

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { hotels, loading, error } = useAppSelector(
    (state: RootState) => state.hotel
  );
  const { rooms } = useAppSelector((state: RootState) => state.room);

  const hotel = hotels.find((h) => h.hotel_id === Number(id)) || null;

  // -------- IMAGE GALLERY STATE --------
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages =
    hotel?.images?.filter((img: string) => img && img.trim().length) || [];

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
  const goPrev = () =>
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  const goNext = () =>
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));

  // -------- RESERVATION STATE --------
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

  // SHARE
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

  // FAVOURITES
  const customer_id = useAppSelector(
    (state: RootState) => state.customer.customer?.id
  );
  const favourites = useAppSelector(
    (state: RootState) => state.favourites.list || []
  );

  const isFavourite = (hotel_id: number) =>
    favourites.some((f) => f.hotel_id === hotel_id);

  const handleToggleFavourite = (hotel_id: number) => {
    if (!customer_id) {
      alert("Please log in to manage favourites.");
      return;
    }
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

  // ------------- REVIEWS LOGIC -------------
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;
  const [hasMore, setHasMore] = useState(false);

  const computeAvgAndTotal = (list: Review[], totalFromApi?: number) => {
    const arr = list || [];
    const sum = arr.reduce((acc, r) => acc + (r.star_rating ?? 0), 0);
    const count = typeof totalFromApi === "number" ? totalFromApi : arr.length;
    setTotalReviews(count);
    setAvgRating(
      count > 0 ? parseFloat((sum / (arr.length || 1)).toFixed(2)) : null
    );
  };

  const fetchReviewsForHotel = useCallback(
    async (opts?: { reset?: boolean; nextOffset?: number }) => {
      if (!id) return;
      const hotelId = Number(id);
      const nextOff =
        typeof opts?.nextOffset === "number"
          ? opts.nextOffset
          : opts?.reset
          ? 0
          : offset;
      const q = `hotel_id=${hotelId}&limit=${LIMIT}&offset=${nextOff}`;
      const url = `http://localhost:4040/api/reviews?${q}`;

      setReviewsLoading(true);
      setReviewsError(null);

      try {
        const res = await fetch(url);
        const json = await res.json();

        // API might return either array of reviews OR an object like { reviews: [...], total: N }
        let fetched: Review[] = [];
        let totalFromApi: number | undefined = undefined;

        if (Array.isArray(json)) {
          fetched = json as Review[];
          totalFromApi = json.length;
        } else if (json && Array.isArray(json.reviews)) {
          fetched = json.reviews;
          if (typeof json.total === "number") totalFromApi = json.total;
        } else {
          // unexpected shape
          throw new Error("Unexpected reviews response shape");
        }

        if (opts?.reset) {
          setReviews(fetched);
        } else {
          // append
          setReviews((prev) => {
            // avoid duplicates by review_id if present
            const existingIds = new Set(prev.map((r) => r.review_id));
            const uniqueToAdd = fetched.filter(
              (r) => r.review_id == null || !existingIds.has(r.review_id)
            );
            return [...prev, ...uniqueToAdd];
          });
        }

        // set hasMore: if totalFromApi exists, compare; otherwise, infer from fetched length
        const currentTotal =
          typeof totalFromApi === "number" ? totalFromApi : undefined;
        if (typeof currentTotal === "number") {
          setHasMore((prevReviews) =>
            prevReviews
              ? (opts?.reset
                  ? fetched.length
                  : reviews.length + fetched.length) < currentTotal
              : fetched.length < currentTotal
          );
        } else {
          // infer: if fetched length === LIMIT then likely more
          setHasMore(fetched.length === LIMIT);
        }

        // if total provided, set it; else compute
        if (typeof currentTotal === "number") {
          computeAvgAndTotal(
            opts?.reset ? fetched : [...reviews, ...fetched],
            currentTotal
          );
          setTotalReviews(currentTotal);
        } else {
          computeAvgAndTotal(opts?.reset ? fetched : [...reviews, ...fetched]);
        }

        setOffset(nextOff + fetched.length);
      } catch (err: any) {
        console.error("Failed to fetch reviews", err);
        setReviewsError(err.message || "Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, offset, reviews.length] // intentionally minimal deps
  );

  // initial fetch
  useEffect(() => {
    // reset pagination on hotel change
    setOffset(0);
    setReviews([]);
    setHasMore(false);
    fetchReviewsForHotel({ reset: true, nextOffset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Listen for cross-page "reviewSubmitted" event to refresh the list
  useEffect(() => {
    const handler = (e: any) => {
      const payload = e.detail || {};
      // if event provides hotel_id, confirm it matches current page (optional)
      if (!payload.hotel_id || Number(payload.hotel_id) === Number(id)) {
        // refresh and reset
        setOffset(0);
        fetchReviewsForHotel({ reset: true, nextOffset: 0 });
      }
    };
    window.addEventListener("reviewSubmitted", handler);
    return () => window.removeEventListener("reviewSubmitted", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // compute average/total whenever reviews array changes and server didn't provide a total
  useEffect(() => {
    computeAvgAndTotal(reviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews]);

  // load more
  const loadMore = async () => {
    await fetchReviewsForHotel({ nextOffset: offset });
  };

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

  if (loading) return <p className="loading">Loading hotel...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!hotel) return <p>No hotel found.</p>;

  return (
    <div className="hotel-details-page">
      <div className="nav-row">
        <NavBar />
      </div>

      <div className="hotel-details-wrapper">
        <div className="hotel-left">
          <Button
            icon={<FaArrowLeft />}
            backgroundColor="white"
            color="black"
            onClick={() => navigate(-1)}
          />

          <h1 className="hotel-title">{hotel.name}</h1>
          <p className="hotel-location">{hotel.location}</p>

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

          <div className="reservation-section">
            <h2>Make a Reservation</h2>

            <div className="reservation-form">
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

              <div className="total-price-box">
                <p>
                  <strong>Total Price: </strong> R{totalPrice}
                </p>
              </div>

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

        {/* RIGHT PANEL */}
        <div className="hotel-right">
          <div className="right-top-actions">
            <Button
              icon={<FaRegHeart />}
              backgroundColor="white"
              color="black"
              className="icon-btn"
              onClick={() => handleToggleFavourite(hotel.hotel_id!!)}
            />
            <Button
              icon={<FaShare />}
              backgroundColor="white"
              color="black"
              className="icon-btn"
              onClick={handleShare}
            />
          </div>

          <div className="review-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: 0 }}>
                  <strong>Total Reviews: </strong>{" "}
                  {reviewsLoading ? "..." : totalReviews}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Average Rating: </strong>{" "}
                  {avgRating !== null ? `${avgRating} / 5` : "N/A"}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {reviewsLoading && reviews.length === 0 && (
                <p>Loading reviews...</p>
              )}
              {reviewsError && <p className="error">{reviewsError}</p>}
              {reviews.length === 0 && !reviewsLoading && (
                <p>No reviews yet. Be the first to leave one!</p>
              )}

              {reviews.slice(0, LIMIT).map((r) => (
                <div
                  key={r.review_id ?? Math.random()}
                  className="review-item"
                  style={{ marginBottom: 8 }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {r.user_name ?? `User ${r.customer_id ?? "—"}`}{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        marginLeft: 8,
                        fontSize: 13,
                        color: "#666",
                      }}
                    >
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <div style={{ margin: "4px 0" }}>
                    {"★".repeat(Math.max(0, r.star_rating ?? 0)) +
                      "☆".repeat(5 - Math.max(0, r.star_rating ?? 0))}
                  </div>
                  <div style={{ color: "#333" }}>{r.comment ?? ""}</div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div style={{ marginTop: 8 }}>
                <button
                  className="view-more-btn"
                  onClick={loadMore}
                  disabled={reviewsLoading}
                >
                  {reviewsLoading ? "Loading..." : "View more reviews"}
                </button>
              </div>
            )}
          </div>

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

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
