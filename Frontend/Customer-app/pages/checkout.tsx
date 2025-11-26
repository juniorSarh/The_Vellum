import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../src/storeSlices/hooks";
import "../../src/assets/styles/checkout.css";

const CheckoutPage = () => {
  const navigate = useNavigate();

  // GET BOOKING DETAILS FROM REDUX
  const { selectedBooking } = useAppSelector((state) => state.booking);

  if (!selectedBooking) {
    return (
      <div className="checkout-empty">
        <p>No booking found.</p>
        <button onClick={() => navigate("/hotels")}>Back to Hotels</button>
      </div>
    );
  }

  const {
    hotelName,
    hotelLocation,
    roomType,
    checkIn,
    checkOut,
    price,
    totalNights,
    totalPrice,
  } = selectedBooking;

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
            <strong>Check-In:</strong> {checkIn}
          </p>
          <p>
            <strong>Check-Out:</strong> {checkOut}
          </p>
          <p>
            <strong>Nights:</strong> {totalNights}
          </p>
          <p>
            <strong>Room Type:</strong> {roomType}
          </p>
        </div>

        <div className="slip-section">
          <h3 className="slip-label">Price Breakdown</h3>
          <p>
            <strong>Price per Night:</strong> R{price}
          </p>
          <p className="total-line">
            <strong>Total:</strong> R{totalPrice}
          </p>
        </div>

        <div className="checkout-actions">
          <button className="cancel-btn" onClick={() => navigate("/hotel")}>
            Cancel
          </button>

          <button className="pay-btn" onClick={() => navigate("/payment")}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
