import React, { useState } from "react";
import "./paymentCard.css";

const PaymentCard: React.FC = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

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

      <button className="pc-btn">Pay Now</button>
    </div>
  );
};

export default PaymentCard;
