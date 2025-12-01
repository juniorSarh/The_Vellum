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

  // ✅ Main hotel image (single URL)
  const [mainImage, setMainImage] = useState(initialHotel?.main_image ?? "");

  // ✅ Gallery images as an array of fields (not comma separated)
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialHotel?.images && initialHotel.images.length > 0
      ? initialHotel.images
      : [""]
  );

  const handleImageChange = (index: number, value: string) => {
    setImageUrls((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addImageField = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const removeImageField = (index: number) => {
    setImageUrls((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy.length ? copy : [""];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedImages = imageUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

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
              main_image: mainImage.trim() || null,
              images: cleanedImages,
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
            main_image: mainImage.trim() || null,
            images: cleanedImages,
          })
        ).unwrap();

        // Clear form on successful add
        setName("");
        setLocation("");
        setStarRating("");
        setDescription("");
        setMainImage("");
        setImageUrls([""]);
      }

      if (onClose) onClose();
    } catch {
      // error already handled in Redux
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

        {/* ✅ Main image field */}
        <div className="form-group">
          <label htmlFor="hotel-main-image">Main Image URL:</label>
          <input
            id="hotel-main-image"
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="https://example.com/main-image.jpg"
          />
          <p className="helper-text">
            This will be used as the primary cover image of the hotel.
          </p>
        </div>

        {/* ✅ Gallery images as dynamic list */}
        <div className="form-group">
          <label>Gallery Images (one URL per field):</label>
          <p className="helper-text">
            Click &quot;Add another image&quot; to include more gallery photos.
          </p>

          {imageUrls.map((url, index) => (
            <div key={index} className="image-row">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL #${index + 1}`}
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  className="small-btn"
                  onClick={() => removeImageField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" className="small-btn" onClick={addImageField}>
            + Add another image
          </button>
        </div>

        <div className="modal-actions">
          <button
            type="submit"
            className="modal-btn modal-btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
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
