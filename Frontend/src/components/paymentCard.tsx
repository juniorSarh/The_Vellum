import React, { useState } from "react";
import "./paymentCard.css";
import { useAppDispatch, useAppSelector } from "../storeSlices/hooks";
import { initializePayment } from "../storeSlices/paymentSlice";
import {
  createBooking,
  clearPendingBooking,
  type Booking,
} from "../storeSlices/bookingSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PaymentCard: React.FC = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const pendingBooking = useAppSelector(
    (state: RootState) => state.booking.pendingBooking
  );
  // ✅ Use customerSlice as “auth”
  const customer = useAppSelector(
    (state: RootState) => state.customer.customer
  );

  const paymentLoading = useAppSelector(
    (state: RootState) => state.payment.loading
  );
  const paymentError = useAppSelector(
    (state: RootState) => state.payment.error
  );

  if (!pendingBooking) {
    return (
      <div className="payment-card">
        <h2 className="pc-title">Make a payment</h2>
        <p>No pending booking found.</p>
        <button className="pc-btn" onClick={() => navigate("/hotel")}>
          Back to Hotels
        </button>
      </div>
    );
  }

  // Dynamically load Paystack script
  const loadPaystackScript = () => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const rawAmount = (pendingBooking as any).total_cost;
    const amount = Number(rawAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Invalid booking amount.");
      return;
    }

    const email = customer?.email ?? "guest@example.com";

    // 1️⃣ Initialize payment via backend
    const result: any = await dispatch(
      initializePayment({
        email,
        amount,
      })
    );

    const payload = result?.payload;
    if (!payload || !payload.reference) {
      alert("Payment initialization failed");
      return;
    }

    // 2️⃣ Load Paystack script
    try {
      await loadPaystackScript();
    } catch {
      alert("Paystack script failed to load!");
      return;
    }

    // 3️⃣ Success / close callbacks
    const handlePaystackSuccess = (response: any) => {
      alert("Payment successful! Reference: " + response.reference);

      // Build clean booking payload that matches backend
      const bookingPayload: Omit<Booking, "booking_id"> = {
        customer_id: customer?.id ?? pendingBooking.customer_id ?? 1,
        room_id: pendingBooking.room_id,
        check_in_date: pendingBooking.check_in_date,
        check_out_date: pendingBooking.check_out_date,
        status: "confirmed",
        additional_requests: (pendingBooking as any).additional_requests ?? "",
        total_cost: Number(pendingBooking.total_cost ?? amount),
      };

      (async () => {
        try {
          await dispatch(createBooking(bookingPayload)).unwrap();
          dispatch(clearPendingBooking());
          navigate("/home", {
            state: { reference: response.reference },
          });
        } catch (err) {
          console.error("Error saving booking after payment:", err);
          alert(
            "Payment succeeded, but saving your booking failed. Please contact support."
          );
        }
      })();
    };

    const handlePaystackClose = () => {
      alert("Payment window closed.");
      navigate("/home");
    };

    // 4️⃣ Open Paystack popup
    window.PaystackPop.setup({
      key: "pk_test_d86a1ffa2f5df37791d028a6da25da95d8524fe7",
      email,
      amount: amount * 100, // smallest currency unit
      currency: "ZAR",
      reference: payload.reference,
      callback: handlePaystackSuccess,
      onClose: handlePaystackClose,
    }).openIframe();
  };

  return (
    <div className="payment-card">
      <h2 className="pc-title">Make a payment</h2>

      <label className="pc-label">Card Number</label>
      <input
        className="pc-input"
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <div className="pc-row">
        <div className="pc-col">
          <label className="pc-label">Expiry Date</label>
          <input
            className="pc-input"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>

        <div className="pc-col small">
          <label className="pc-label">CVV</label>
          <input
            className="pc-input"
            placeholder="•••"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      </div>

      <label className="pc-label">Cardholder Name</label>
      <input
        className="pc-input"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {paymentError && (
        <p className="pc-error">Payment error: {paymentError}</p>
      )}

      <button
        className="pc-btn"
        onClick={handlePayment}
        disabled={paymentLoading}
      >
        {paymentLoading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentCard;
