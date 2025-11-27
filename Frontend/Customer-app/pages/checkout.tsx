import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../src/storeSlices/hooks";
import {
  createBooking,
  clearPendingBooking,
} from "../../src/storeSlices/bookingSlice";
import "../../src/assets/css/checkout.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get booking prepared from previous page
  const pendingBooking = useAppSelector(
    (state) => state.booking.pendingBooking
  );
  const loading = useAppSelector((state) => state.booking.loading);
  const error = useAppSelector((state) => state.booking.error);

  if (!pendingBooking) {
    return (
      <div className="checkout-empty">
        <p>No booking found.</p>
        <button onClick={() => navigate("/hotels/:id")}>Back to Hotels</button>
      </div>
    );
  }

  // Extract data
  const {
    hotelName,
    hotelLocation,
    roomType,
    check_in_date,
    check_out_date,
    nights,
    price_per_night,
    total_cost,
  } = pendingBooking as any;

  // Handle Payment > Save to database
  const handlePayNow = async () => {
    try {
      await dispatch(createBooking(pendingBooking));
      navigate("/payment");
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
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

        <div className="checkout-actions">
          <button
            className="cancel-btn"
            onClick={() => {
              dispatch(clearPendingBooking());
              navigate("/hotel");
            }}
          >
            Cancel
          </button>

          <button className="pay-btn" disabled={loading} onClick={handlePayNow}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
