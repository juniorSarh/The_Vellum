// src/components/hotelModal.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeSlices/hooks";
import { addhotel, updatehotel, type Hotel } from "../storeSlices/hotelSlice";
import "../HotelForm.css";

interface HotelFormProps {
  adminId?: number;
  onClose?: () => void;
  mode?: "add" | "edit";
  initialHotel?: Hotel | null;
}

function HotelForm({
  adminId,
  onClose,
  mode = "add",
  initialHotel = null,
}: HotelFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.hotel);

  const [name, setName] = useState(initialHotel?.name ?? "");
  const [location, setLocation] = useState(initialHotel?.location ?? "");
  const [starRating, setStarRating] = useState<number | "">(
    initialHotel?.star_rating ?? ""
  );
  const [description, setDescription] = useState(
    initialHotel?.description ?? ""
  );
  const [imagesInput, setImagesInput] = useState(
    initialHotel?.images?.join(", ") ?? ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const images =
      imagesInput.trim().length > 0
        ? imagesInput.split(",").map((img) => img.trim())
        : [];

    try {
      if (mode === "edit" && initialHotel?.hotel_id) {
        // EDIT EXISTING HOTEL
        await dispatch(
          updatehotel({
            id: initialHotel.hotel_id,
            updates: {
              admin_id: adminId ?? initialHotel.admin_id ?? null,
              name,
              location,
              star_rating: starRating === "" ? null : Number(starRating),
              description,
              images,
            },
          })
        ).unwrap();
      } else {
        // ADD NEW HOTEL
        await dispatch(
          addhotel({
            admin_id: adminId ?? null,
            name,
            location,
            star_rating: starRating === "" ? null : Number(starRating),
            description,
            images,
          })
        ).unwrap();

        // Clear form on successful add
        setName("");
        setLocation("");
        setStarRating("");
        setDescription("");
        setImagesInput("");
      }

      if (onClose) onClose();
    } catch {
      // error already set in Redux
    }
  };

  return (
    <div className="hotel-form-container">
      <h2 className="modal-title">
        {mode === "edit" ? "Edit Hotel" : "Add Hotel"}
      </h2>

      <form className="hotel-form modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="hotel-name">Hotel Name:</label>
          <input
            id="hotel-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ocean View Hotel"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hotel-location">Location:</label>
          <input
            id="hotel-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hotel-star-rating">Star Rating (1–5):</label>
          <input
            id="hotel-star-rating"
            type="number"
            min={1}
            max={5}
            value={starRating}
            onChange={(e) =>
              setStarRating(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="hotel-description">Description:</label>
          <textarea
            id="hotel-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the hotel"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="hotel-images">Image URLs (comma separated):</label>
          <input
            id="hotel-images"
            type="text"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            placeholder="https://..., https://..."
          />
        </div>

        <div className="modal-actions">
          <button
            type="submit"
            className="modal-btn modal-btn-primary"
            disabled={loading}
          >
            {loading
              ? mode === "edit"
                ? "Saving..."
                : "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Add Hotel"}
          </button>

          {onClose && (
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default HotelForm;
