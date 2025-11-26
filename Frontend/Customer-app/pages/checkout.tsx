import React, { useState, useEffect } from "react";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import Input from "../../src/components/input";
import "../../src/assets/css/checkout.css";
import PrivatNav from "../../src/components/PrivatNav";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  createBooking,
  clearBookingError,
} from "../../src/storeSlices/bookingSlice";

export default function Checkout() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.booking);


  // -------------------------
  // Form state
  // -------------------------
  const [formData, setFormData] = useState({
    customer_id: 1, 
    room_id: 1, 
    check_in_date: "",
    check_out_date: "",
    status: "pending",
    additional_requests: "",
    total_cost: 0,
  });

  const [success, setSuccess] = useState(false);

  // -------------------------
  // Handle input changes
  // -------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // -------------------------
  // Handle form submit
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await dispatch(createBooking(formData)).unwrap(); // unwrap to catch errors
      setSuccess(true);
      dispatch(clearBookingError());
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <div className="checkout-container">
      <PrivatNav />

      <div className="checkout-content">
        {/* TOP SECTION: IMAGE + HOTEL DETAILS */}
        <div className="checkout-top-section">
          <div className="checkout-image-box">
            <img
              src="../src/assets/The-vellum-logo.png"
              alt="picture of a hotel"
              className="image"
            />
          </div>

          <div className="checkout-info-box">
            <h2>Hotel name</h2>
            <h3>location</h3>
            <p>xxxxxxxxxx</p>
            <p>xxxxxxxxxx</p>
            <p>xxxxxxxxxx</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="checkout-form">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-column">
              <div className="input-group">
                <label>Room Type</label>
                <select name="room_type" defaultValue="">
                  <option value="" disabled>
                    Select Room Type
                  </option>
                  <option value="delux">delux</option>
                  <option value="suite">suite</option>
                  <option value="starndard">starndard</option>
                </select>
              </div>
            </div>

            {/* ROW 1 - removed unnecessary fields */}

            {/* ROW 2: Keep only Check-in and Check-out dates */}
            <div className="form-row">
              <Input
                label="Check-in Date"
                name="check_in_date"
                type="date"
                value={formData.check_in_date}
                onChange={handleChange}
              />
              <Input
                placeholder="Check-out Date"
                label="Check-out Date"
                name="check_out_date"
                type="date"
                value={formData.check_out_date}
                onChange={handleChange}
              />
              <Input
                label="Total Cost"
                type="number"
                name="total_cost"
                value={formData.total_cost.toString()}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-buttons">
              <Button
                name={loading ? "Saving..." : "Pay"}
                color="white"
                backgroundColor="#846d29"
                className="btn"
                type="submit" // ✅ fixed type issue
              />

              <Button
                name="Cancel"
                color="white"
                backgroundColor="red"
                className="btn"
                onClick={() => window.history.back()}
              />
            </div>

            {/* Feedback messages */}
            {success && (
              <p className="success">Booking created successfully!</p>
            )}
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
