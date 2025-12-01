// src/pages/BookingHistory.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { fetchBookingsByCustomer } from "../../src/storeSlices/bookingSlice";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import type { RootState } from "../../store";
import "../../src/bookingHistory.css";

const BookingHistory = () => {
  const dispatch = useAppDispatch();

  // Logged-in customer from customerSlice
  const customer = useAppSelector(
    (state: RootState) => state.customer.customer
  );

  // Bookings from bookingSlice
  const { bookings, loading, error } = useAppSelector(
    (state: RootState) => state.booking
  );

  // Fetch bookings for this specific customer
  useEffect(() => {
    if (customer?.id) {
      dispatch(fetchBookingsByCustomer(customer.id));
    }
  }, [customer, dispatch]);

  // If not logged in
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
                <div className="booking-header">
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

                {/* Safely display total_cost */}
                {(() => {
                  const raw = b.total_cost;
                  const numeric =
                    typeof raw === "string" ? parseFloat(raw) : Number(raw);

                  const display = Number.isFinite(numeric)
                    ? numeric.toFixed(2)
                    : String(raw ?? "0.00");

                  return <div className="booking-total">Total: R{display}</div>;
                })()}
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
