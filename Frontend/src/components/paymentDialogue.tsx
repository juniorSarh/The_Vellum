import React, { useEffect, useRef, useState } from "react";
import "./paymentDialogue.css"; // styles for both dialog and form

export interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholder: string;
}

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentData) => Promise<void> | void;
  title?: string;
}

/**
 * Reference image (wireframe used for design): /mnt/data/payment-screen.png
 */
const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Make a payment",
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaymentData>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholder: "",
  });
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setData({ cardNumber: "", expiry: "", cvv: "", cardholder: "" });
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleChange =
    (key: keyof PaymentData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      // simple formatting for card number and expiry
      if (key === "cardNumber") {
        value = value.replace(/\D/g, "").slice(0, 16);
        value = value.replace(/(.{4})/g, "$1 ").trim(); // 4-digit groups
      }
      if (key === "expiry") {
        value = value.replace(/\D/g, "").slice(0, 4);
        if (value.length >= 3) value = value.slice(0, 2) + " / " + value.slice(2);
      }
      if (key === "cvv") {
        value = value.replace(/\D/g, "").slice(0, 4);
      }
      setData((s) => ({ ...s, [key]: value }));
    };

  const isValid = () => {
    const cn = data.cardNumber.replace(/\s/g, "");
    const exp = data.expiry.replace(/\s|\/|-/g, "");
    return cn.length >= 12 && exp.length === 4 && data.cvv.length >= 3 && data.cardholder.trim().length > 2;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValid()) return;
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (err) {
      console.error("Payment submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pv-backdrop" ref={backdropRef} onClick={handleBackdropClick} aria-modal="true" role="dialog" aria-labelledby="pv-title">
      <div className="pv-dialog" role="document">
        <header className="pv-header">
          <div className="pv-logo">V</div>
          <h1 id="pv-title" className="pv-title">{title}</h1>
          <button className="pv-close" aria-label="Close" onClick={onClose}>✕</button>
        </header>

        <form className="pv-body" onSubmit={handleSubmit}>
          <label className="pv-label">Card Number</label>
          <input
            className="pv-input"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={data.cardNumber}
            onChange={handleChange("cardNumber")}
            required
            maxLength={19}
          />

          <div className="pv-row">
            <div className="pv-col">
              <label className="pv-label">Expiry Date</label>
              <input
                className="pv-input"
                placeholder="MM / YY"
                value={data.expiry}
                onChange={handleChange("expiry")}
                required
                maxLength={7}
              />
            </div>

            <div className="pv-col pv-col-small">
              <label className="pv-label">CVV</label>
              <input
                className="pv-input"
                placeholder="•••"
                inputMode="numeric"
                value={data.cvv}
                onChange={handleChange("cvv")}
                required
                maxLength={4}
              />
            </div>
          </div>

          <label className="pv-label">Cardholder Name</label>
          <input
            className="pv-input"
            placeholder="Full Name"
            value={data.cardholder}
            onChange={handleChange("cardholder")}
            required
          />

          <div className="pv-actions">
            <button
              type="button"
              className="pv-btn pv-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="pv-btn pv-btn-primary"
              disabled={!isValid() || loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>

        <footer className="pv-footer">
          <div className="pv-footer-left">The Vellum © copyright</div>
        </footer>
      </div>
    </div>
  );
};

export default PaymentDialog;
