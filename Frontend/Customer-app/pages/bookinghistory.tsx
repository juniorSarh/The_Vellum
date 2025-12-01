// src/pages/BookingHistory.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { fetchBookingsByCustomer } from "../../src/storeSlices/bookingSlice";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import type { RootState } from "../../store";
import { FiShare2 } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "../../src/bookingHistory.css";

const BookingHistory = () => {
  const dispatch = useAppDispatch();

  const customer = useAppSelector(
    (state: RootState) => state.customer.customer
  );
  const { bookings, loading, error } = useAppSelector(
    (state: RootState) => state.booking
  );

  const [favorites, setFavorites] = useState<number[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (customer?.id) {
      dispatch(fetchBookingsByCustomer(customer.id));
    }
  }, [customer, dispatch]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleCommentChange = (id: number, value: string) => {
    setComments((prev) => ({ ...prev, [id]: value }));
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
          </div>

          {loading && <p className="bh-loading">Loading your bookings...</p>}
          {error && <p className="bh-error">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <p className="empty-message">You have no bookings yet.</p>
          )}

          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b.booking_id} className="booking-card">
                {/* Favorite heart in top-right corner */}

                <div className="booking-header">
                  {b.booking_id && (
                    <div className="top-right-buttons">
                      {favorites.includes(b.booking_id) ? (
                        <AiFillHeart
                          className="favorite-btn active"
                          onClick={() => toggleFavorite(b.booking_id!)}
                        />
                      ) : (
                        <AiOutlineHeart
                          className="favorite-btn"
                          onClick={() => toggleFavorite(b.booking_id!)}
                        />
                      )}
                      <FiShare2 className="share-btn" />
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

                {(() => {
                  const raw = b.total_cost;
                  const numeric =
                    typeof raw === "string" ? parseFloat(raw) : Number(raw);
                  const display = Number.isFinite(numeric)
                    ? numeric.toFixed(2)
                    : String(raw ?? "0.00");
                  return <div className="booking-total">Total: R{display}</div>;
                })()}

                {/* Comment Section */}
                <div className="booking-comment">
                  <textarea
                    placeholder="Leave a comment..."
                    value={comments[b.booking_id!] || ""}
                    onChange={(e) =>
                      handleCommentChange(b.booking_id!, e.target.value)
                    }
                  />
                  <button
                    className="comment-btn"
                    onClick={() => alert("Comment submitted!")}
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
