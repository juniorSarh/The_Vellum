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

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { bookings, loading, error } = useAppSelector((state) => state.booking);

  const authUser = useAppSelector((state: any) => state.auth?.user);

  // Fetch bookings on mount
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Cancel a booking by updating status
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

  // Update – here we just navigate to a future edit screen
  const handleUpdateBooking = (booking: Booking) => {
    if (!booking.booking_id) return;
    navigate(`/reservations/${booking.booking_id}/edit`);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  // Filter bookings using the search bar
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredBookings = bookings.filter((b: Booking) => {
    const combined = `${b.booking_id ?? ""} ${b.status} ${b.check_in_date} ${
      b.check_out_date
    }`.toLowerCase();
    return combined.includes(normalizedSearch);
  });

  // Extract user info for modal
  const userFirstName = authUser?.firstName || authUser?.name || "Guest";
  const userLastName = authUser?.lastName || authUser?.surname || "";

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

          {filteredBookings.map((booking) => (
            <div className="reservation-card" key={booking.booking_id}>
              <div className="reservation-main">
                <div>
                  <p className="res-id">
                    <strong>Booking #</strong>
                    {booking.booking_id}
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
          ))}
        </div>
      </div>

      {/* Modal for View details */}
      {selectedBooking && (
        <div className="res-modal-overlay" onClick={closeModal}>
          <div
            className="res-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h3>Reservation Details</h3>

            <div className="res-modal-section">
              <h4>Hotel Information</h4>
              <p>
                <strong>Name:</strong>{" "}
                {/* these fields are optional – make sure your API returns them or adjust */}
                {(selectedBooking as any).hotel_name || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {(selectedBooking as any).hotel_description ||
                  "No description available."}
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
                <strong>Name:</strong> {userFirstName} {userLastName}
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

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default ReservationList;
