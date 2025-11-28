import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { fetchBookings } from "../../src/storeSlices/bookingSlice";
import "../../src/bookinghistory.css";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";

export default function BookingHistory() {
  const dispatch = useDispatch<any>();

  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.booking
  );

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleShare = async (booking: any) => {
    try {
      await navigator.share({
        title: `Booking - ${booking.hotel_name}`,
        text: `Booking ID: ${booking.booking_id}
Hotel: ${booking.hotel_name}
Location: ${booking.location}
Room: ${booking.room_type}
Check-in: ${booking.check_in_date}
Check-out: ${booking.check_out_date}
Total Cost: R${booking.total_cost}`,
      });
    } catch (err) {
      console.log("Sharing cancelled or not supported.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="booking-history-container">
      <PrivatNav />

      <h2 className="booking-history-title">Your Booking History</h2>

      {bookings.length === 0 && (
        <p className="no-bookings">📭 No booking history found.</p>
      )}

      <div className="booking-grid">
        {bookings.map((booking) => (
          <div key={booking.booking_id} className="booking-card">
         

            <h3 className="hotel-name">{booking.hotel_name}</h3>
         

            <p>
              <strong>Room:</strong> {booking.room_type}
            </p>
            <p>
              <strong>Check-In:</strong> {booking.check_in_date}
            </p>
            <p>
              <strong>Check-Out:</strong> {booking.check_out_date}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${
                  booking.status.toLowerCase() === "confirmed"
                    ? "confirmed"
                    : "pending"
                }`}
              >
                {booking.status}
              </span>
            </p>
            <p className="booking-price">💵 R{booking.total_cost}</p>

            <div className="booking-actions">
              <button className="action-btn heart">
                <FaHeart className="action-icon heart" />
              </button>
              <button
                onClick={() => handleShare(booking)}
                className="action-btn share"
              >
                <FaShareAlt className="action-icon share" />
              </button>
            </div>

            <div className="booking-comment">
              <label htmlFor={`comment-${booking.booking_id}`}>
                Leave a comment:
              </label>
              <input
                type="text"
                id={`comment-${booking.booking_id}`}
                placeholder="Write your feedback..."
                className="comment-input"
              />
              <button className="submit-comment-btn">Submit</button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
