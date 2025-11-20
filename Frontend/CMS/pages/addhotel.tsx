import { useState } from "react";
import PrivateNavBar from "../../src/components/PrivateNaveBar";
import Footer from "../../src/components/Footer";
import HotelForm from "../../src/components/hotelModal";
import "../../src/assets/css/addHotel.css";

import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import Button from "../../src/components/Button";

export default function AddHotel() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="hotels-page-container">
      {/* NAVBAR */}
      <div className="nav">
        <PrivateNavBar />
      </div>

      <div className="top-actions">
        <Button
          icon={<FaArrowLeft />}
          className="back-btn"
          onClick={() => window.history.back()}
        />
        <Button
          className="add-hotel-btn"
          onClick={openModal}
          name="Add Hotel"
        />
      </div>

      {/* TABLE */}
      <div className="hotels-table-wrapper">
        <table className="hotels-table">
          <thead>
            <tr>
              <th>Hotel Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Rooms Available</th>
              <th>Price Range</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4].map((item) => (
              <tr key={item}>
                <td>Grand Plaza Hotel</td>
                <td>New York, USA</td>
                <td>4.6</td>
                <td>45</td>
                <td>$200–$800</td>
                <td className="action-icons">
                  <Button icon={<FaEdit />} className="icon-button edit" />
                  <Button
                    icon={<FaTrash className="icon delete" />}
                    className="icon-button delete"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <Footer />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Hotel</h2>
            <HotelForm />

            <Button
              className="modal-close-btn"
              onClick={closeModal}
              name="close"
              color="white"
              backgroundColor="red"
            />
          </div>
        </div>
      )}
    </div>
  );
}
