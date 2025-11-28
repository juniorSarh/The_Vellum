// src/pages/ReservationList.tsx
import { useState, useEffect } from "react";
import SearchBar from "../../src/components/searchBar";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { useNavigate } from "react-router-dom";
import "../../src/reservationPage.css";
import { FaArrowLeft } from "react-icons/fa";
import PrivatNav from "../../src/components/PrivatNav";

import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  fetchBookings,
  updateBooking,
  type Booking,
} from "../../src/storeSlices/bookingSlice";
import { fetchRooms } from "../../src/storeSlices/roomSlice";

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const rooms = useAppSelector((state) => state.room.rooms);


  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    room_type: "",
    check_in_date: "",
    check_out_date: "",
    people: 1,
    total_cost: 0,
    nights: 1,
    room_id: 0,
  });


  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { bookings, loading, error } = useAppSelector((state) => state.booking);

  // Fetch bookings on mount
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);


  useEffect(() => {
    if (!editData.check_in_date || !editData.check_out_date) return;

    const checkIn = new Date(editData.check_in_date);
    const checkOut = new Date(editData.check_out_date);

    const diff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

    // Get price dynamically from store
    const selectedRoom = rooms.find(
      (r) => r.room_type.toLowerCase() === editData.room_type.toLowerCase()
    );

    const pricePerNight = selectedRoom?.price ?? 0;

    const total = nights > 0 ? nights * pricePerNight : 0;

    setEditData((prev) => ({
      ...prev,
      nights: nights > 0 ? nights : 0,
      room_id: selectedRoom?.room_id ?? prev.room_id,
      total_cost: total,
    }));
  }, [
    editData.room_type,
    editData.check_in_date,
    editData.check_out_date,
    rooms,
  ]);



  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancelBooking = (booking: Booking) => {
    if (!booking.booking_id) return;
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking #${booking.booking_id}?`
    );
    if (!confirmCancel) return;

    dispatch(
      updateBooking({
        id: booking.booking_id,
        updates: { status: "cancelled" },
      })
    );
  };

  const handleUpdateBooking = (booking: Booking) => {
    if (!booking.booking_id) return;

    setEditData({
      room_type: booking.room_type ?? "",
      check_in_date: booking.check_in_date,
      check_out_date: booking.check_out_date,
      people: booking.additional_requests
        ? Number(booking.additional_requests)
        : 1,
      total_cost: Number(booking.total_cost),
      nights: 1, // recalculated inside modal
      room_id: booking.room_id,
    });

    setSelectedBooking(booking);
    setIsUpdateModalOpen(true);
  };

  const handleSubmitBookingUpdate = (id: number) => {
    dispatch(
      updateBooking({
        id,
        updates: {
          check_in_date: editData.check_in_date,
          check_out_date: editData.check_out_date,
          room_id: editData.room_id,
          total_cost: editData.total_cost,
          additional_requests: String(editData.people),
          room_type: editData.room_type,
        },
      })
    );

    setIsUpdateModalOpen(false);
  };



  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  // Filter by search term (guest, hotel, status, dates)
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredBookings = bookings.filter((b: Booking) => {
    const guestName = `${b.customer_first_name ?? ""} ${
      b.customer_last_name ?? ""
    }`.toLowerCase();
    const hotelName = (b.hotel_name ?? "").toLowerCase();
    const combined =
      `${guestName} ${hotelName} ${b.status} ${b.check_in_date} ${b.check_out_date}`.toLowerCase();
    return combined.includes(normalizedSearch);
  });
  
  
  return (
    <div className="reservationPage">
      <div className="nav">
        <PrivatNav />
      </div>

      <div className="resBody">
        <div className="backButton">
          <Button
            name=""
            color="black"
            icon={<FaArrowLeft style={{ marginRight: "8px" }} />}
            onClick={handleBack}
            className="back"
          />
        </div>

        <div className="SearchBar">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search reservations..."
          />
        </div>

        <h2 className="Title">Reservation List</h2>

        {loading && <p className="res-loading">Loading bookings...</p>}
        {error && <p className="res-error">{error}</p>}

        <div className="List">
          {!loading && !error && filteredBookings.length === 0 && (
            <p className="res-empty">No reservations found.</p>
          )}

          {filteredBookings.map((booking) => {
            const guestName =
              `${booking.customer_first_name ?? ""} ${
                booking.customer_last_name ?? ""
              }`.trim() || `Customer #${booking.customer_id}`;

            const hotelName = booking.hotel_name || `Room #${booking.room_id}`;

            return (
              <div className="reservation-card" key={booking.booking_id}>
                <div className="reservation-main">
                  <div>
                    <p className="res-id">
                      <strong>Booking #</strong>
                      {booking.booking_id}
                    </p>
                    <p className="res-guest">
                      <strong>Guest:</strong> {guestName}
                    </p>
                    <p className="res-hotel">
                      <strong>Hotel:</strong> {hotelName}
                    </p>
                    <p className="res-dates">
                      <strong>Check-in:</strong> {booking.check_in_date}
                    </p>
                    <p className="res-dates">
                      <strong>Check-out:</strong> {booking.check_out_date}
                    </p>
                    <p className="res-status">
                      <strong>Status:</strong> {booking.status}
                    </p>
                    <p className="res-total">
                      <strong>Total:</strong> R{booking.total_cost}
                    </p>
                  </div>
                </div>

                <div className="reservation-actions">
                  <button
                    className="res-btn update"
                    onClick={() => handleUpdateBooking(booking)}
                  >
                    Update
                  </button>
                  <button
                    className="res-btn cancel"
                    onClick={() => handleCancelBooking(booking)}
                  >
                    Cancel
                  </button>
                  <button
                    className="res-btn view"
                    onClick={() => handleViewBooking(booking)}
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedBooking && (
        <div className="res-modal-overlay" onClick={closeModal}>
          <div className="res-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reservation Details</h3>

            <div className="res-modal-section">
              <h4>Hotel Information</h4>
              <p>
                <strong>Name:</strong>{" "}
                {selectedBooking.hotel_name ||
                  `Room #${selectedBooking.room_id}`}
              </p>
              <p>
                <strong>Room Type:</strong> {selectedBooking.room_type || "N/A"}
              </p>
            </div>

            <div className="res-modal-section">
              <h4>Stay Details</h4>
              <p>
                <strong>Check-in:</strong> {selectedBooking.check_in_date}
              </p>
              <p>
                <strong>Check-out:</strong> {selectedBooking.check_out_date}
              </p>
              <p>
                <strong>Total Price:</strong> R{selectedBooking.total_cost}
              </p>
            </div>

            <div className="res-modal-section">
              <h4>User Information</h4>
              <p>
                <strong>Name:</strong>{" "}
                {`${selectedBooking.customer_first_name ?? ""} ${
                  selectedBooking.customer_last_name ?? ""
                }`.trim() || `Customer #${selectedBooking.customer_id}`}
              </p>
            </div>

            <div className="res-modal-actions">
              <button className="res-btn close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && selectedBooking && (
        <div
          className="res-modal-overlay"
          onClick={() => setIsUpdateModalOpen(false)}
        >
          <div
            className="res-modal update"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Update Booking</h3>

            {/* Room type */}
            <div className="form-group">
              <label>Room Type</label>
              <select
                value={editData.room_type}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    room_type: e.target.value,
                  }))
                }
              >
                <option value="">Select room type</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Standard">Standard</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            {/* Dates */}
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                value={editData.check_in_date}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    check_in_date: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                value={editData.check_out_date}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    check_out_date: e.target.value,
                  }))
                }
              />
            </div>

            {/* People */}
            <div className="form-group">
              <label>Number of People</label>
              <input
                type="number"
                value={editData.people}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    people: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Nights */}
            <p>
              <strong>Nights:</strong> {editData.nights}
            </p>

            {/* Total */}
            <p>
              <strong>Total Price:</strong> R{editData.total_cost}
            </p>

            <div className="res-modal-actions">
              <button
                className="res-btn close"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="res-btn update"
                onClick={() =>
                  handleSubmitBookingUpdate(selectedBooking.booking_id!)
                }
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default ReservationList;
