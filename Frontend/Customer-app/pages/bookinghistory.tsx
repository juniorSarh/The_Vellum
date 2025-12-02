// src/pages/BookingHistory.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { fetchBookingsByCustomer } from "../../src/storeSlices/bookingSlice";
import {
  fetchUserFavourites,
  addToFavourites,
  removeFavourite,
} from "../../src/storeSlices/favouritesSlice";
import { fetchRooms } from "../../src/storeSlices/roomSlice";

import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import type { RootState } from "../../store";
import { FiShare2 } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "../../src/bookingHistory.css";
import SearchBar from "../../src/components/searchBar";
import { useNavigate } from "react-router-dom";





const BookingHistory = () => {
  const dispatch = useAppDispatch();

  // Logged-in customer
  const customer = useAppSelector(
    (state: RootState) => state.customer.customer
  );

  // Bookings from bookingSlice
  const { bookings, loading, error } = useAppSelector(
    (state: RootState) => state.booking
  );

  const navigate = useNavigate();

  // Favourites
  const { list: favourites } = useAppSelector(
    (state: RootState) => state.favourites
  );

  // Rooms (we'll use this to resolve hotel_id from room_id)
  const { rooms } = useAppSelector((state: RootState) => state.room);

  // Local state for comments & ratings
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  // Fetch bookings, favourites, and rooms on page load / customer change
  useEffect(() => {
    if (customer?.id) {
      dispatch(fetchBookingsByCustomer(customer.id));
      dispatch(fetchUserFavourites(customer.id));
      dispatch(fetchRooms());
    }
  }, [customer, dispatch]);

  // Toggle favourite (if you choose to show heart icons)
  const toggleFavorite = async (b: (typeof bookings)[0]) => {
    if (!customer?.id) return;

    // If booking already has hotel_id, use it; otherwise resolve from rooms (room_id -> hotel_id)
    let hotel_id = (b as any).hotel_id as number | undefined;
    if (!hotel_id && b.room_id) {
      const matchedRoom = rooms.find((r) => r.room_id === b.room_id);
      hotel_id = matchedRoom?.hotel_id;
    }

    if (!hotel_id) {
      console.error("Could not resolve hotel_id for booking", b);
      return;
    }

    const isFav = favourites.some((f) => f.hotel_id === hotel_id);

    if (isFav) {
      await dispatch(removeFavourite({ customer_id: customer.id, hotel_id }));
    } else {
      await dispatch(addToFavourites({ customer_id: customer.id, hotel_id }));
    }

    dispatch(fetchUserFavourites(customer.id));
  };

  // Share booking
  const handleShare = (booking: (typeof bookings)[0]) => {
    if (!booking) return;

    const checkIn = new Date(booking.check_in_date).toLocaleDateString();
    const checkOut = new Date(booking.check_out_date).toLocaleDateString();
    const total =
      typeof booking.total_cost === "string"
        ? parseFloat(booking.total_cost).toFixed(2)
        : Number(booking.total_cost).toFixed(2);

    const shareText = `📌 My Booking Details:
Hotel: ${booking.hotel_name ?? "Hotel"}
Room: ${booking.room_type ?? "N/A"}
Check-in: ${checkIn}
Check-out: ${checkOut}
Total: R${total}`;

    const shareData = {
      title: "My Booking",
      text: shareText,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error(err));
    } else {
      navigator.clipboard
        .writeText(shareText)
        .then(() => alert("Booking details copied to clipboard!"))
        .catch(() => alert("Failed to copy booking details."));
    }
  };

  // --- Comment & Rating handlers ---

  const handleCommentChange = (
    bookingId: number | undefined,
    value: string
  ) => {
    if (bookingId === undefined) return;
    setComments((prev) => ({ ...prev, [bookingId]: value }));
  };

  const handleRatingChange = (bookingId: number, value: number) => {
    setRatings((prev) => ({ ...prev, [bookingId]: value }));
  };

  // ✅ Submit review to /api/reviews
  const submitComment = async (b: (typeof bookings)[0], comment: string) => {
    if (!customer?.id) return;

    // 1) Resolve hotel_id from booking / rooms
    let hotel_id = (b as any).hotel_id as number | undefined;

    if (!hotel_id && b.room_id) {
      const matchedRoom = rooms.find((r) => r.room_id === b.room_id);
      hotel_id = matchedRoom?.hotel_id;
    }

    if (!hotel_id) {
      console.error("Booking does not have resolvable hotel_id", b);
      alert(
        "Could not resolve hotel for this booking. Please contact support."
      );
      return;
    }

    // 2) Rating from local state
    const bookingKey = b.booking_id ?? 0;
    const star_rating = ratings[bookingKey] ?? null;

    try {
      const res = await fetch("https://the-vellum.onrender.com/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // IMPORTANT: use customer_id (not user_id) to match your reviews service
          customer_id: customer.id,
          hotel_id,
          comment: comment || null,
          star_rating,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          (errorData as any).error ||
            (errorData as any).message ||
            "Failed to submit review"
        );
      }

      alert("Review submitted successfully!");

      // Clear comment & rating for this booking
      setComments((prev) => ({ ...prev, [bookingKey]: "" }));
      setRatings((prev) => ({ ...prev, [bookingKey]: 0 }));
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit review: " + (err.message || "Unknown error"));
    }
  };

  // --- Guards & UI ---

  if (!customer) {
    return (
      <>
        <PrivatNav />
        <div className="page-container">
          <div className="bookings-wrapper">
            <h2 className="section-title">Your Bookings</h2>
            <p>Please log in to view your booking history.</p>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <PrivatNav />
      <button className="back-btn" onClick={() => navigate("/user-profile")}>
        ⬅
      </button>
      <div className="page-container">
        <div className="bookings-wrapper">
          <div className="bookings-header">
            <h2 className="section-title">Your Booking History</h2>
            <div className="search-bar">
              <SearchBar placeholder="Search bookings..." onChange={() => {}} />
            </div>
          </div>

          {!loading && !error && bookings.length === 0 && (
            <p className="empty-message">You have no bookings yet.</p>
          )}

          <div className="bookings-list">
            {bookings.map((b) => {
              const bookingKey = b.booking_id ?? 0;

              return (
                <div key={b.booking_id} className="booking-card">
                  <div className="booking-header">
                    {b.booking_id && (
                      <div className="top-right-buttons">
                        {favourites.some(
                          (f) =>
                            f.hotel_id === (b as any).hotel_id ||
                            // fallback: match by room->hotel
                            rooms.find(
                              (r) =>
                                r.room_id === b.room_id &&
                                r.hotel_id === f.hotel_id
                            )
                        ) ? (
                          <AiFillHeart
                            className="favorite-btn active"
                            onClick={() => toggleFavorite(b)}
                          />
                        ) : (
                          <AiOutlineHeart
                            className="favorite-btn"
                            onClick={() => toggleFavorite(b)}
                          />
                        )}

                        <FiShare2
                          className="share-btn"
                          onClick={() => handleShare(b)}
                        />
                      </div>
                    )}

                    <div>
                      <p className="booking-hotel">{b.hotel_name ?? "Hotel"}</p>
                      {b.room_type && (
                        <p className="booking-room-type">
                          Room type: {b.room_type}
                        </p>
                      )}
                    </div>

                    <span
                      className={`booking-status ${
                        b.status ? b.status.toLowerCase() : ""
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="booking-row">
                    <span>Check-in:</span>
                    <span>
                      {new Date(b.check_in_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="booking-row">
                    <span>Check-out:</span>
                    <span>
                      {new Date(b.check_out_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="booking-total">
                    Total: R
                    {(() => {
                      const raw = b.total_cost;
                      const numeric =
                        typeof raw === "string" ? parseFloat(raw) : Number(raw);
                      return Number.isFinite(numeric)
                        ? numeric.toFixed(2)
                        : String(raw ?? "0.00");
                    })()}
                  </div>

                  {/* Rating stars */}
                  <div className="booking-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          ratings[bookingKey] >= star ? "filled" : ""
                        }`}
                        onClick={() =>
                          b.booking_id && handleRatingChange(bookingKey, star)
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment + submit */}
                  <div className="booking-comment">
                    <textarea
                      placeholder="Leave a comment..."
                      value={comments[bookingKey] || ""}
                      onChange={(e) =>
                        handleCommentChange(bookingKey, e.target.value)
                      }
                    />

                    <button
                      className="comment-btn"
                      disabled={
                        !b.booking_id ||
                        !comments[bookingKey]?.trim() ||
                        !ratings[bookingKey]
                      }
                      onClick={() =>
                        submitComment(b, comments[bookingKey] || "")
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BookingHistory;
