// src/pages/AddHotel.tsx (or wherever this lives)
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

import {
  fetchRooms,
  adroom,
  updateroom,
  deleteroom,
  type Room,
} from "../../src/storeSlices/roomSlice";
import SearchBar from "../../src/components/searchBar";

export default function AddHotel() {
  // Hotel modals
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // Rooms list modal (View Rooms)
  const [isRoomsListModalOpen, setIsRoomsListModalOpen] = useState(false);
  const [hotelForRoomsList, setHotelForRoomsList] = useState<Hotel | null>(
    null
  );

  // Room form modal (Add / Edit room)
  const [isRoomFormModalOpen, setIsRoomFormModalOpen] = useState(false);
  const [hotelForRoomForm, setHotelForRoomForm] = useState<Hotel | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const dispatch = useAppDispatch();
  const { hotels, loading, error } = useAppSelector((state) => state.hotel);
  const { rooms } = useAppSelector((state) => state.room);

  // Room form local state
  const [roomType, setRoomType] = useState("");
  const [roomPrice, setRoomPrice] = useState<number | "">("");
  const [roomStatus, setRoomStatus] = useState("available");
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomLoading, setRoomLoading] = useState(false);

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Filter hotels by search term (name or location)
  const filteredHotels: Hotel[] = hotels.filter((hotel) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = hotel.name?.toLowerCase().includes(term);
    const locationMatch = hotel.location?.toLowerCase().includes(term);
    return nameMatch || locationMatch;
  });

  // -------- Hotel modal handlers --------
  const openAddHotelModal = () => {
    setEditingHotel(null);
    setIsHotelModalOpen(true);
  };

  const openEditHotelModal = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsHotelModalOpen(true);
  };

  const closeHotelModal = () => {
    setIsHotelModalOpen(false);
    setEditingHotel(null);
  };

  // -------- Rooms list modal (View Rooms) --------
  const openRoomsListModal = (hotel: Hotel) => {
    setHotelForRoomsList(hotel);
    setIsRoomsListModalOpen(true);
  };

  const closeRoomsListModal = () => {
    setIsRoomsListModalOpen(false);
    setHotelForRoomsList(null);
  };

  // -------- Room form modal (Add / Edit room) --------
  const openRoomFormForAdd = (hotel: Hotel) => {
    setHotelForRoomForm(hotel);
    setEditingRoom(null);
    setRoomType("");
    setRoomPrice("");
    setRoomStatus("available");
    setRoomError(null);
    setIsRoomFormModalOpen(true);
  };

  const openRoomFormForEdit = (hotel: Hotel, room: Room) => {
    setHotelForRoomForm(hotel);
    setEditingRoom(room);
    setRoomType(room.room_type);
    setRoomPrice(room.price);
    setRoomStatus(room.status);
    setRoomError(null);
    setIsRoomFormModalOpen(true);

    // Optional: close the list modal while editing
    setIsRoomsListModalOpen(false);
  };

  const closeRoomFormModal = () => {
    setIsRoomFormModalOpen(false);
    setHotelForRoomForm(null);
    setEditingRoom(null);
    setRoomType("");
    setRoomPrice("");
    setRoomStatus("available");
    setRoomError(null);
  };

  // -------- Initial data fetch --------
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("https://the-vellum.onrender.com/api/hotels");
        const data = await res.json();
        dispatch(setHotels(data));
      } catch (err) {
        console.error("Failed to load hotels:", err);
      }
    };

    fetchHotels();
  }, [dispatch]);

  useEffect(() => {
    // Load all rooms once; we'll filter by hotel_id in the UI
    dispatch(fetchRooms());
  }, [dispatch]);

  // -------- Handlers --------
  const handleDeleteHotel = (hotel_id?: number) => {
    if (!hotel_id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (!confirmDelete) return;

    dispatch(deletehotel(hotel_id));
  };

  const handleDeleteRoom = (room_id?: number) => {
    if (!room_id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) return;

    dispatch(deleteroom(room_id));
  };

  const handleRoomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hotelForRoomForm?.hotel_id) {
      setRoomError("No hotel selected for this room.");
      return;
    }
    if (!roomType || roomPrice === "" || !roomStatus) {
      setRoomError("All fields are required.");
      return;
    }

    setRoomLoading(true);
    setRoomError(null);

    try {
      if (editingRoom && editingRoom.room_id) {
        // UPDATE
        await dispatch(
          updateroom({
            id: editingRoom.room_id,
            updates: {
              hotel_id: hotelForRoomForm.hotel_id,
              room_type: roomType,
              price: Number(roomPrice),
              status: roomStatus,
            },
          })
        ).unwrap();
      } else {
        // ADD
        await dispatch(
          adroom({
            hotel_id: hotelForRoomForm.hotel_id,
            room_type: roomType,
            price: Number(roomPrice),
            status: roomStatus,
          })
        ).unwrap();
      }

      setRoomLoading(false);
      closeRoomFormModal();
    } catch (err: any) {
      setRoomLoading(false);
      setRoomError(typeof err === "string" ? err : "Failed to save room");
    }
  };

  // Rooms for a hotel
  const getRoomsForHotel = (hotelId?: number): Room[] => {
    if (!hotelId) return [];
    return rooms.filter((room) => room.hotel_id === hotelId);
  };

  const getRoomsAvailableForHotel = (hotelId?: number) =>
    getRoomsForHotel(hotelId).length;

  // status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return { background: "green", color: "white" };
      case "maintenance":
        return { background: "goldenrod", color: "black" };
      case "booked":
        return { background: "red", color: "white" };
      default:
        return {};
    }
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
          onClick={openAddHotelModal}
          name="Add Hotel"
        />
      </div>

      <div className="hero-search">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Find a hotel"
        />

        {/* LOADING / ERROR */}
        {loading && <p className="status-text">Loading hotels...</p>}
        {error && <p className="status-text error-text">{error}</p>}

        {/* TABLE */}
        <div className="hotels-table-wrapper"></div>

        <table className="hotels-table">
          <thead>
            <tr>
              <th>Main Image</th>
              <th>Hotel Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Gallery</th>
              <th>Rooms Available</th>
              <th>List of Rooms</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredHotels.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>
                  No hotels match your search.
                </td>
              </tr>
            ) : (
              filteredHotels.map((hotel) => (
                <tr key={hotel.hotel_id}>
                  {/* Main image */}
                  <td>
                    {hotel.main_image ? (
                      <img
                        src={hotel.main_image}
                        alt={hotel.name}
                        style={{
                          width: "70px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <span>-</span>
                    )}
                  </td>

                  <td>{hotel.name}</td>
                  <td>{hotel.location}</td>
                  <td>{hotel.star_rating ?? "-"}</td>
                  <td>{hotel.description ?? "-"}</td>

                  {/* Gallery info */}
                  <td>
                    {hotel.images && hotel.images.length > 0 ? (
                      <span>{hotel.images.length} image(s)</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>

                  {/* Rooms Available */}
                  <td>{getRoomsAvailableForHotel(hotel.hotel_id)}</td>

                  {/* View Rooms */}
                  <td>
                    <Button
                      className="view-rooms-btn"
                      name="View Rooms"
                      onClick={() => openRoomsListModal(hotel)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="action-icons">
                    <div className="icons-wrapper">
                      <Button
                        className="icon-button add-rooms"
                        name="add-rooms"
                        onClick={() => openRoomFormForAdd(hotel)}
                      />

                      <Button
                        icon={<FaEdit />}
                        className="icon-button edit"
                        onClick={() => openEditHotelModal(hotel)}
                      />

                      <Button
                        icon={<FaTrash className="icon delete" />}
                        className="icon-button delete"
                        onClick={() => handleDeleteHotel(hotel.hotel_id)}
                      />
                    </div>
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

      {/* HOTEL MODAL (Add/Edit) */}
      {isHotelModalOpen && (
        <div className="modal-overlay" onClick={closeHotelModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <HotelForm
              key={editingHotel?.hotel_id ?? "new"}
              onClose={closeHotelModal}
              mode={editingHotel ? "edit" : "add"}
              initialHotel={editingHotel}
              adminId={editingHotel?.admin_id ?? undefined}
            />
          </div>
        </div>
      )}

      {/* ROOMS LIST MODAL (View Rooms) */}
      {isRoomsListModalOpen && hotelForRoomsList && (
        <div className="modal-overlay" onClick={closeRoomsListModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rooms – {hotelForRoomsList.name}</h2>

            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getRoomsForHotel(hotelForRoomsList.hotel_id).length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No rooms yet for this hotel.
                    </td>
                  </tr>
                ) : (
                  getRoomsForHotel(hotelForRoomsList.hotel_id).map((room) => (
                    <tr key={room.room_id}>
                      <td>{room.room_type}</td>
                      <td>{room.price}</td>
                      <td>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontWeight: "600",
                            textTransform: "capitalize",
                            ...getStatusColor(room.status),
                          }}
                        >
                          {room.status}
                        </span>
                      </td>

                      <td className="action-icons">
                        {/* UPDATE ROOM */}
                        <Button
                          className="icon-button edit"
                          icon={<FaEdit />}
                          onClick={() =>
                            openRoomFormForEdit(hotelForRoomsList, room)
                          }
                        />

                        {/* DELETE ROOM */}
                        <Button
                          className="icon-button delete"
                          icon={<FaTrash className="icon delete" />}
                          onClick={() => handleDeleteRoom(room.room_id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="rooms-list-actions">
              <Button
                className="add-room-btn"
                name="Add Room"
                onClick={() => openRoomFormForAdd(hotelForRoomsList)}
              />
              <Button
                className="modal-close-btn"
                onClick={closeRoomsListModal}
                name="Close"
              />
            </div>
          </div>
        </div>
      )}

      {/* ROOM FORM MODAL (Add / Edit room) */}
      {isRoomFormModalOpen && hotelForRoomForm && (
        <div className="modal-overlay" onClick={closeRoomFormModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingRoom
                ? `Edit Room – ${hotelForRoomForm.name}`
                : `Add Room – ${hotelForRoomForm.name}`}
            </h2>

            <form className="modal-form" onSubmit={handleRoomFormSubmit}>
              <div className="form-group">
                <label htmlFor="room-type">Room Type</label>
                <input
                  id="room-type"
                  type="text"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  placeholder="e.g. Deluxe, Standard, Suite"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="room-price">Price</label>
                <input
                  id="room-price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={roomPrice}
                  onChange={(e) =>
                    setRoomPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="room-status">Status</label>
                <select
                  id="room-status"
                  value={roomStatus}
                  onChange={(e) => setRoomStatus(e.target.value)}
                >
                  <option value="available">available</option>
                  <option value="booked">booked</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </div>

              {roomError && <p className="error-text">{roomError}</p>}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="modal-btn modal-btn-primary"
                  disabled={roomLoading}
                >
                  {roomLoading
                    ? "Saving..."
                    : editingRoom
                    ? "Save Changes"
                    : "Add Room"}
                </button>
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={closeRoomFormModal}
                  disabled={roomLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
