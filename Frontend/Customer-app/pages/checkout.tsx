import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import Input from "../../src/components/input";
import "../../src/assets/css/checkout.css";
import PrivatNav from "../../src/components/PrivatNav";

import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { type Hotel } from "../../src/storeSlices/hotelSlice";
import { fetchRooms, type Room } from "../../src/storeSlices/roomSlice";

interface CheckoutLocationState {
  hotelId?: number;
  hotelName?: string; // ✅ include name in state
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId, hotelName } =
    (location.state as CheckoutLocationState) || {};

  const dispatch = useAppDispatch();
  const { hotels } = useAppSelector((state) => state.hotel);
  const { rooms } = useAppSelector((state) => state.room);

  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    if (!hotelId) {
     // navigate("/payment");
    }
  }, [hotelId, navigate]);

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchRooms({ hotelId }));
    }
  }, [dispatch, hotelId]);

  const selectedHotel: Hotel | undefined = hotelId
    ? hotels.find((h) => h.hotel_id === hotelId)
    : undefined;

  const hotelRooms: Room[] = hotelId
    ? rooms.filter((room) => room.hotel_id === hotelId)
    : [];

  const selectedRoom: Room | undefined =
    selectedRoomId === ""
      ? undefined
      : hotelRooms.find((room) => room.room_id === selectedRoomId);

  const currentPrice = selectedRoom ? selectedRoom.price : 0;

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRoomId(value ? Number(value) : "");
  };

  // Prefer Redux hotel name, but fall back to router state name
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
          <form className="form">
            <div className="form-column">
              <div className="input-group">
                <label>Room Type</label>
                <select
                  name="room_type"
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
                      {room.room_type} – R{room.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <Input
                label="Check-in Date"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
              <Input
                label="Check-out Date"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>

            <div className="price-summary">
              <h3>Price Summary</h3>
              <p>
                Room Price per night:{" "}
                <strong>
                  {selectedRoom
                    ? `R${selectedRoom.price.toFixed(2)}`
                    : "Select a room type"}
                </strong>
              </p>
            </div>
          </form>

          {/* BUTTONS */}
          <div className="checkout-buttons">
            <Link
              to="/payment"
              state={{
                hotelId,
                hotelName: displayHotelName, // ✅ pass hotel name to payment page too
                roomId: selectedRoom?.room_id,
                price: currentPrice,
                checkInDate,
                checkOutDate,
              }}
            >
              <Button
                name="Pay"
                color="white"
                backgroundColor="#846d29"
                className="btn"
              />
            </Link>

            <Link to="/hotel">
              <Button
                name="Cancel"
                color="white"
                backgroundColor="red"
                className="btn"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
