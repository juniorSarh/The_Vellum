// src/pages/CheckoutPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../src/storeSlices/hooks";
import {
  //createBooking, // still imported but used on payment page only
  clearPendingBooking,
  setPendingBooking,
  type Booking,
} from "../../src/storeSlices/bookingSlice";
import "../../src/assets/css/checkout.css";
import type { RootState } from "../../store";

type CheckoutLocationState = {
  hotelName: string;
  hotelLocation: string;
  roomType: string;
  check_in_date: string;
  check_out_date: string;
  people: string;
  nights: number;
  price_per_night: number;
  total_cost: number;
  room_id?: number;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const state = location.state as CheckoutLocationState | null;

  const { loading, error } = useAppSelector((s) => s.booking);
  const authUserid = useAppSelector((s: RootState) => s.customer.customer?.id);

  if (!state) {
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
    room_id,
  } = state;

  const customerId: number = authUserid!! // TODO: replace fallback 1
  const resolvedRoomId: number = room_id ?? 1; // TODO: replace fallback

  const buildBookingPayload = (): Omit<Booking, "booking_id"> => ({
    customer_id: customerId,
    room_id: resolvedRoomId,
    check_in_date,
    check_out_date,
    status: "pending", 
    total_cost,
    additional_requests: "",
  });

  const handlePayNow = () => {
    const payload = buildBookingPayload();
    // 1️⃣ store it in Redux
    dispatch(setPendingBooking(payload));
    // 2️⃣ navigate to payment page
    navigate("/payment");
  };

  const handleCancel = () => {
    dispatch(clearPendingBooking());
    navigate(-1);
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

        {error && <p className="checkout-error">{error}</p>}

        <div className="checkout-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>

          <button className="pay-btn" disabled={loading} onClick={handlePayNow}>
            Pay with Paystack
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
