// src/pages/CheckoutPage.tsx (or wherever this file is)
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../src/storeSlices/hooks";
import {
  createBooking,
  clearPendingBooking,
} from "../../src/storeSlices/bookingSlice";
import "../../src/assets/css/checkout.css";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // From Redux (old flow)
  const pendingBooking = useAppSelector(
    (state) => state.booking.pendingBooking
  );
  const loading = useAppSelector((state) => state.booking.loading);
  const error = useAppSelector((state) => state.booking.error);

  // From HotelDetails -> navigate(..., { state: {...} })
  const bookingFromState = location.state as any | null;

  // Prefer data from HotelDetails; fall back to pendingBooking
  const booking = bookingFromState || pendingBooking;

  if (!booking) {
    return (
      <div className="checkout-empty">
        <p>No booking found.</p>
        <button onClick={() => navigate("/hotel")}>Back to Hotels</button>
      </div>
    );
  }

  const {
    hotelName,
    hotelLocation,
    roomType,
    check_in_date,
    check_out_date,
    nights,
    price_per_night,
    total_cost,
    people,
  } = booking;

  const handlePayNow = async () => {
    try {
      await dispatch(createBooking(booking));
      navigate("/payment");
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <>
      <PrivatNav />
      <div className="checkout-wrapper">
        <div className="checkout-slip">
          <h2 className="slip-title">Reservation Summary</h2>
          <div className="slip-section">
            <h3 className="slip-label">Hotel Details</h3>
            <p>
              <strong>Hotel:</strong> {hotelName}
            </p>
            <p>
              <strong>Location:</strong> {hotelLocation}
            </p>
          </div>

          <div className="slip-section">
            <h3 className="slip-label">Stay Information</h3>
            <p>
              <strong>Check-In:</strong> {check_in_date}
            </p>
            <p>
              <strong>Check-Out:</strong> {check_out_date}
            </p>
            <p>
              <strong>Nights:</strong> {nights}
            </p>
            <p>
              <strong>Guests:</strong> {people}
            </p>
            <p>
              <strong>Room Type:</strong> {roomType}
            </p>
          </div>

          <div className="slip-section">
            <h3 className="slip-label">Price Breakdown</h3>
            <p>
              <strong>Price per Night:</strong> R{price_per_night}
            </p>
            <p className="total-line">
              <strong>Total:</strong> R{total_cost}
            </p>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="checkout-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                dispatch(clearPendingBooking());
                navigate(-1);
              }}
            >
              Cancel
            </button>

            <button
              className="pay-btn"
              disabled={loading}
              onClick={handlePayNow}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
