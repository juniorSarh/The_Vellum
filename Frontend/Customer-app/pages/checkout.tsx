import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import Input from "../../src/components/input";
import "../../src/assets/css/checkout.css";
import PrivatNav from "../../src/components/PrivatNav";

import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  createBooking,
  clearBookingError,
  type Booking,
} from "../../src/storeSlices/bookingSlice";
import { type Hotel } from "../../src/storeSlices/hotelSlice";
import { fetchRooms, type Room } from "../../src/storeSlices/roomSlice";

interface CheckoutLocationState {
  hotelId?: number;
  hotelName?: string;
}

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { hotelId, hotelName } =
    (location.state as CheckoutLocationState) || {};

  // booking slice (note: reducer key is "bookings")
  const { loading, error } = useAppSelector((state) => state.Booking);

  const { hotels } = useAppSelector((state) => state.hotel);
  const { rooms } = useAppSelector((state) => state.room);

  // ------------ Guard if no hotel passed ------------
  useEffect(() => {
    if (!hotelId) {
      navigate("/");
    }
  }, [hotelId, navigate]);

  // ------------ Fetch rooms for this hotel ------------
  useEffect(() => {
    if (hotelId) {
      dispatch(fetchRooms({ hotelId }));
    }
  }, [dispatch, hotelId]);

  // ------------ Find selected hotel ------------
  const selectedHotel: Hotel | undefined = hotelId
    ? hotels.find((h) => h.hotel_id === hotelId)
    : undefined;

  const hotelRooms: Room[] = hotelId
    ? rooms.filter((room) => room.hotel_id === hotelId)
    : [];

  // ------------ Local booking form state ------------
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedRoom: Room | undefined =
    selectedRoomId === ""
      ? undefined
      : hotelRooms.find((room) => room.room_id === selectedRoomId);

  // ------------ Helpers ------------
  const calculateNights = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const nights = diffMs / (1000 * 60 * 60 * 24);
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights(checkInDate, checkOutDate);
  const totalCost =
    selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRoomId(value ? Number(value) : "");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!hotelId || !selectedRoom || !checkInDate || !checkOutDate) {
      alert("Please select a room and dates before proceeding.");
      return;
    }

    const bookingPayload: Omit<Booking, "booking_id"> = {
      // TODO: replace with real logged-in customer ID
      customer_id: 1,
      room_id: selectedRoom.room_id!,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      status: "pending",
      additional_requests: additionalRequests,
      total_cost: totalCost,
    };

    try {
      await dispatch(createBooking(bookingPayload)).unwrap();
      setSuccess(true);
      dispatch(clearBookingError());
      // Optional: navigate to payment page with booking data
      // navigate("/payment", { state: { hotelId, hotelName, totalCost, roomId: selectedRoom.room_id } });
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  const displayHotelName = selectedHotel?.name || hotelName || "Hotel name";
  const displayHotelLocation = selectedHotel?.location || "location";
  const displayHotelDescription =
    selectedHotel?.description || "No description available.";

  return (
    <div className="checkout-container">
      <PrivatNav />

      <div className="checkout-content">
        {/* TOP SECTION: IMAGE + HOTEL DETAILS */}
        <div className="checkout-top-section">
          <div className="checkout-image-box">
            <img
              src={
                selectedHotel?.images && selectedHotel.images.length > 0
                  ? selectedHotel.images[0]
                  : "../src/assets/The-vellum-logo.png"
              }
              alt={displayHotelName}
              className="image"
            />
          </div>

          <div className="checkout-info-box">
            <h2>{displayHotelName}</h2>
            <h3>{displayHotelLocation}</h3>
            <p>{displayHotelDescription}</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="checkout-form">
          <form className="form" onSubmit={handleSubmit}>
            {/* ROOM TYPE */}
            <div className="form-column">
              <div className="input-group">
                <label>Room Type</label>
                <select
                  name="room_id"
                  value={selectedRoomId === "" ? "" : selectedRoomId}
                  onChange={handleRoomChange}
                  disabled={hotelRooms.length === 0}
                >
                  <option value="">
                    {hotelRooms.length === 0
                      ? "No rooms available"
                      : "Select Room Type"}
                  </option>
                  {hotelRooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.room_type} – R{room.price.toFixed(2)} / night
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DATES */}
            <div className="form-row">
              <Input
                label="Check-in Date"
                name="check_in_date"
                type="date"
                value={checkInDate}
                onChange={(e) => {
                  setCheckInDate(e.target.value);
                  setSuccess(false);
                }}
              />
              <Input
                label="Check-out Date"
                name="check_out_date"
                type="date"
                value={checkOutDate}
                onChange={(e) => {
                  setCheckOutDate(e.target.value);
                  setSuccess(false);
                }}
              />
            </div>

            {/* ADDITIONAL REQUESTS */}
            <div className="form-row">
              <div className="input-group" style={{ width: "100%" }}>
                <label>Additional Requests</label>
                <textarea
                  name="additional_requests"
                  value={additionalRequests}
                  onChange={(e) => {
                    setAdditionalRequests(e.target.value);
                    setSuccess(false);
                  }}
                  rows={3}
                  style={{ width: "100%" }}
                  placeholder="e.g. Late check-in, extra pillows, etc."
                />
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className="price-summary">
              <h3>Price Summary</h3>
              <p>
                Nights: <strong>{nights || "-"}</strong>
              </p>
              <p>
                Room Price per night:{" "}
                <strong>
                  {selectedRoom
                    ? `R${selectedRoom.price.toFixed(2)}`
                    : "Select a room type"}
                </strong>
              </p>
              <p>
                Total Cost:{" "}
                <strong>
                  {totalCost > 0
                    ? `R${totalCost.toFixed(2)}`
                    : "Select room and valid dates"}
                </strong>
              </p>
            </div>

            {/* BUTTONS */}
            <div className="checkout-buttons">
              <Button
                name={loading ? "Saving..." : "Pay"}
                color="white"
                backgroundColor="#846d29"
                className="btn"
                type="submit"
                // disabled={!selectedRoom || nights <= 0 || loading}
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
