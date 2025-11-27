import React, { useState } from "react";
import "./paymentCard.css";
import { useAppDispatch, useAppSelector } from "../storeSlices/hooks";
import { initializePayment } from "../storeSlices/paymentSlice";
import {
  createBooking,
  clearPendingBooking,
} from "../storeSlices/bookingSlice";
import { useNavigate } from "react-router-dom";

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
    (state) => state.booking.pendingBooking
  );
  const authUser = useAppSelector((state: any) => state.auth?.user);

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
    const amount = pendingBooking.total_cost; // Rands
    const email = authUser?.email ?? "guest@example.com";

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

    // 2️⃣ Load Paystack
    try {
      await loadPaystackScript();
    } catch {
      alert("Paystack script failed to load!");
      return;
    }

    // 3️⃣ Define a plain function for callback (NO async directly)
    const handlePaystackSuccess = (response: any) => {
      alert("Payment successful! Reference: " + response.reference);

      // Run async logic inside an IIFE
      (async () => {
        try {
          await dispatch(createBooking(pendingBooking)).unwrap();
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
      navigate("/home")
    };

    // 4️⃣ Open Paystack popup with plain function callbacks
    window.PaystackPop.setup({
      key: "pk_test_d86a1ffa2f5df37791d028a6da25da95d8524fe7", // TODO: env
      email,
      amount: amount * 100, // Paystack expects amount in kobo
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

      <button className="pc-btn" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentCard;
