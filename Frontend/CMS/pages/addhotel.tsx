import { useState, useEffect } from "react";
import PrivateNavBar from "../../src/components/PrivateNaveBar";
import Footer from "../../src/components/Footer";
import HotelForm from "../../src/components/hotelModal";
import "../../src/assets/css/addHotel.css";

import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import Button from "../../src/components/Button";

import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  setHotels,
  deletehotel,
  type Hotel,
} from "../../src/storeSlices/hotelSlice";

export default function AddHotel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const dispatch = useAppDispatch();
  const { hotels, loading, error } = useAppSelector((state) => state.hotel );

  const openAddModal = () => {
    setEditingHotel(null);
    setIsModalOpen(true);
  };

  const openEditModal = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHotel(null);
  };

  // Fetch hotels on first load
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:4040/api/hotels");
        const data = await res.json();
        dispatch(setHotels(data));
      } catch (err) {
        console.error("Failed to load hotels:", err);
      }
    };

    fetchHotels();
  }, [dispatch]);

  const handleDelete = (hotel_id?: number) => {
    if (!hotel_id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (!confirmDelete) return;

    dispatch(deletehotel(hotel_id));
  };

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
          onClick={openAddModal}
          name="Add Hotel"
        />
      </div>

      {/* LOADING / ERROR */}
      {loading && <p className="status-text">Loading hotels...</p>}
      {error && <p className="status-text error-text">{error}</p>}

      {/* TABLE */}
      <div className="hotels-table-wrapper">
        <table className="hotels-table">
          <thead>
            <tr>
              <th>Hotel Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Rooms Available</th>
              <th>Price Range</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {hotels.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No hotels found. Click "Add Hotel" to create one.
                </td>
              </tr>
            ) : (
              hotels.map((hotel) => (
                <tr key={hotel.hotel_id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.location}</td>
                  <td>{hotel.star_rating ?? "-"}</td>
                  <td>{hotel.description ?? "-"}</td>
                  <td>-</td>
                  <td>-</td>
                  <td className="action-icons">
                    <Button
                      icon={<FaEdit />}
                      className="icon-button edit"
                      onClick={() => openEditModal(hotel)}
                    />
                    <Button
                      icon={<FaTrash className="icon delete" />}
                      className="icon-button delete"
                      onClick={() => handleDelete(hotel.hotel_id)}
                    />
                  </td>
                </tr>
              ))
            )}
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
            <h2>{editingHotel ? "Edit Hotel" : "Add Hotel"}</h2>

            <HotelForm
              key={editingHotel?.hotel_id ?? "new"} // forces reset between add/edit
              onClose={closeModal}
              mode={editingHotel ? "edit" : "add"}
              initialHotel={editingHotel}
              adminId={editingHotel?.admin_id ?? undefined}
            />

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
