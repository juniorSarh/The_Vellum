// src/pages/BookingHistory.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { fetchBookingsByCustomer } from "../../src/storeSlices/bookingSlice";
import {
  fetchUserFavourites,
  addToFavourites,
  removeFavourite,
} from "../../src/storeSlices/favouritesSlice";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import type { RootState } from "../../store";
import { FiShare2 } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "../../src/bookingHistory.css";
import SearchBar from "../../src/components/searchBar";
import { fetchRoomById, fetchRooms } from "../../src/storeSlices/roomSlice";

const BookingHistory = () => {
  const dispatch = useAppDispatch();

  const customer = useAppSelector(
    (state: RootState) => state.customer.customer
  );
  const { bookings, loading, error } = useAppSelector(
    (state: RootState) => state.booking
  );
  const { list: favourites } = useAppSelector(
    (state: RootState) => state.favourites
  );

  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});


  // Fetch bookings and favourites on page load
  useEffect(() => {
    if (customer?.id) {
      dispatch(fetchBookingsByCustomer(customer.id));
      dispatch(fetchUserFavourites(customer.id));
    }
  }, [customer, dispatch]);

  // Toggle favourite
  const toggleFavorite = async (b: (typeof bookings)[0]) => {
    if (!customer?.id) return;

    // Access hotel_id safely
    const hotel_id = (b as any).hotel_id;
    if (!hotel_id) {
      console.error("Booking does not have hotel_id", b);
      return;
    }

    const isFav = favourites.some((f) => f.hotel_id === hotel_id);

    if (isFav) {
      await dispatch(removeFavourite({ customer_id: customer.id, hotel_id }));
    } else {
      await dispatch(addToFavourites({ customer_id: customer.id, hotel_id }));
    }

    // Refresh favourites list from backend
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


 const handleCommentChange = (bookingId: number | undefined, value: string) => {
   if (bookingId === undefined) return; // <- type guard
   setComments((prev) => ({ ...prev, [bookingId]: value }));
 };

 const handleRatingChange = (bookingId: number, value: number) => {
   setRatings((prev) => ({ ...prev, [bookingId]: value }));
 };


const submitComment = async (b: (typeof bookings)[0], comment: string) => {
  if (!customer?.id) return;
  // console.log("Submitting comment for booking:", b);

  const room_id = (b as any).room_id; // ensure hotel_id exists
  const hotel_id = await fetchRoomById(room_id as number).then((room) => room.hotel_id);
  if (!hotel_id) {
    console.error("Booking does not have hotel_id", b);
    return;
  }

  const star_rating = ratings[b.booking_id ?? 0] ?? null;

  try {
    const res = await fetch("http://localhost:4040/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: customer.id,
        hotel_id,
        comment: comment || null,
        star_rating,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to submit review");
    }

    alert("Review submitted successfully!");
    setComments((prev) => ({ ...prev, [b.booking_id ?? 0]: "" }));
    setRatings((prev) => ({ ...prev, [b.booking_id ?? 0]: 0 }));
  } catch (err: any) {
    console.error(err);
    alert("Failed to submit review: " + err.message);
  }
};




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
            {bookings.map((b) => (
              <div key={b.booking_id} className="booking-card">
                <div className="booking-header">
                  {b.booking_id && (
                    <div className="top-right-buttons">
                      {/* {favourites.some(
                        (f) => f.hotel_id === (b as any).hotel_id
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
                      )} */}
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
                  <span>{new Date(b.check_in_date).toLocaleDateString()}</span>
                </div>

                <div className="booking-row">
                  <span>Check-out:</span>
                  <span>{new Date(b.check_out_date).toLocaleDateString()}</span>
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

                <div className="booking-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        ratings[b.booking_id ?? 0] >= star ? "filled" : ""
                      }`}
                      onClick={() =>
                        b.booking_id && handleRatingChange(b.booking_id, star)
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="booking-comment">
                  <textarea
                    placeholder="Leave a comment..."
                    value={b.booking_id ? comments[b.booking_id] || "" : ""}
                    onChange={(e) =>
                      b.booking_id &&
                      handleCommentChange(b.booking_id, e.target.value)
                    }
                  />

                  <button
                    className="comment-btn"
                    disabled={
                      !b.booking_id ||
                      !comments[b.booking_id]?.trim() ||
                      !ratings[b.booking_id]
                    }
                    onClick={() =>
                      b.booking_id &&
                      submitComment(b, comments[b.booking_id] || "")
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BookingHistory;
