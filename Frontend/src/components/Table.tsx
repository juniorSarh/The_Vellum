import { useState } from "react";
import Button from "./Button";
import "../assets/css/table.css";

interface Booking {
  guest: string;
  hotel: string;
  checkin: string;
  checkout: string;
  status: string;
}

interface TableProps {
  title?: string;
  data: Booking[];
}

export default function Table({ title, data }: TableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

 
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="table-wrapper">
      {title && <h2 className="table-title">{title}</h2>}

      <table className="custom-table">
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Hotel</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((booking, index) => (
            <tr key={index}>
              <td>{booking.guest}</td>
              <td>{booking.hotel}</td>
              <td>{booking.checkin}</td>
              <td>{booking.checkout}</td>
              <td>{booking.status}</td>
              <td>
                <Button
                  name="View details"
                  className="res-btn view"
                  onClick={() => handleViewBooking(booking)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW MODAL — SAME STYLE AS ReservationList */}
      {selectedBooking && (
        <div className="res-modal-overlay" onClick={closeModal}>
          <div className="res-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reservation Details</h3>

            <div className="res-modal-section">
              <h4>Hotel Information</h4>
              <p>
                <strong>Hotel:</strong> {selectedBooking.hotel}
              </p>
            </div>

            <div className="res-modal-section">
              <h4>Stay Details</h4>
              <p>
                <strong>Check-in:</strong> {selectedBooking.checkin}
              </p>
              <p>
                <strong>Check-out:</strong> {selectedBooking.checkout}
              </p>
            </div>

            <div className="res-modal-section">
              <h4>User Information</h4>
              <p>
                <strong>Guest:</strong> {selectedBooking.guest}
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
    </div>
  );
}
