// src/components/HotelForm.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeSlices/hooks"; // 🔁 adjust path if needed
import { addhotel } from "../storeSlices/hotelSlice";
import "../HotelForm.css";

interface HotelFormProps {
  adminId?: number; // e.g. logged-in admin's ID
  onClose?: () => void; // optional callback to close modal on success
}

function HotelForm({ adminId, onClose }: HotelFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.hotel);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [starRating, setStarRating] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imagesInput, setImagesInput] = useState(""); // comma-separated string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const images =
      imagesInput.trim().length > 0
        ? imagesInput.split(",").map((img) => img.trim())
        : [];

    try {
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

      // Clear form on success
      setName("");
      setLocation("");
      setStarRating("");
      setDescription("");
      setImagesInput("");

      if (onClose) onClose();
    } catch {
      // error message is already stored in Redux (state.hotels.error)
    }
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
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

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Hotel"}
        </button>
        {onClose && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}

export default HotelForm;
