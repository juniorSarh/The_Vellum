import React, { useState } from "react";
import "./paymentCard.css";
import { useAppDispatch } from "../storeSlices/hooks";
import { initializePayment } from "../storeSlices/paymentSlice";

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
    // 1️⃣ Initialize payment via backend
    const result: any = await dispatch(
      initializePayment({
        email: "siyabongakhanyile76@gmail.com",
        amount: 5000, 
      })
    );

    console.log(result)

    const payload = result.payload;
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

    // 3️⃣ Open Paystack popup
    window.PaystackPop.setup({
      key: "pk_test_d86a1ffa2f5df37791d028a6da25da95d8524fe7",
      email: "siyabongakhanyile76@gmail.com",
      amount: 5000 * 100,
      currency: "ZAR",
      reference: payload.reference,
      callback: (response: any) => {
        alert("Payment successful! Reference: " + response.reference);
      },
      onClose: () => {
        alert("Payment window closed.");
      },
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
