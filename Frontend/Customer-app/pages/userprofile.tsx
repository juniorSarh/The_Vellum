import React, { useState, useEffect } from "react";
import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import type { RootState } from "../../store";
import "../../src/Userprofile.css";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../src/assets/The-vellum-logo.png";
import Footer from "../../src/components/Footer";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { logout, setUser } from "../../src/storeSlices/customerSlice";
import PrivatNav from "../../src/components/PrivatNav";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Logged-in customer
  const customer = useAppSelector(
    (state: RootState) => state.customer.customer
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Load image from Redux/localStorage on mount
  useEffect(() => {
    if (customer?.image) {
      setProfilePic(`http://localhost:4040/uploads/${customer.image}`);
    }
  }, [customer]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !customer?.id) return;

    // Preview immediately
    const previewURL = URL.createObjectURL(file);
    setProfilePic(previewURL);

    // Send to backend
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `http://localhost:4040/api/customers/upload/${customer.id}/image`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Upload failed with status:", response.status);
        return;
      }

      const result = await response.json();
      console.log("Upload result:", result);

      if (result.image) {
        const updatedCustomer = { ...customer, image: result.image } as any;
        dispatch(setUser(updatedCustomer));

        setProfilePic(`http://localhost:4040/uploads/${result.image}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleMyBookingsClick = () => {
    navigate("/booking-history"); // 👈 your booking history route
  };

  return (
    <>
      <PrivatNav />
      <div className="page-container">
        <div className="profile-wrapper">
          <aside className="profile-sidebar">
            <Button
              icon={<FaArrowLeft />}
              className="back-btn"
              onClick={() => window.history.back()}
            />

            <div className="sidebar-logo">
              <img src={logo} alt="Logo" />
            </div>

            <Link to="/favourites">
              <button className="sidebar-option" type="button">
                Favorites
              </button>
            </Link>

            <button
              className="sidebar-option"
              type="button"
              onClick={handleMyBookingsClick} // 👈 navigate to history
            >
              My Bookings
            </button>
          </aside>

          <div className="profile-content">
            {/* Profile Image */}
            <div className="profile-image-container">
              <label htmlFor="upload-photo" className="profile-image-circle">
                <img
                  src={
                    profilePic ||
                    (customer?.image
                      ? `http://localhost:4040/uploads/${customer.image}`
                      : "/default-avatar.png")
                  }
                  alt="Profile"
                  className="profile-img"
                />
              </label>
              <input
                id="upload-photo"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Customer Info */}
            <div className="profile-info">
              <p className="profile-label">First Name</p>
              <p className="profile-value">{customer?.first_name}</p>

              <p className="profile-label">Last Name</p>
              <p className="profile-value">{customer?.last_name}</p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{customer?.email}</p>

              <p className="profile-label">Phone</p>
              <p className="profile-value">{customer?.phone || "Not set"}</p>

              <p className="profile-label">Address</p>
              <p className="profile-value">{customer?.address || "Not set"}</p>
            </div>

            {/* Actions */}
            <div className="profile-actions">
              <Button
                name="Edit Profile"
                backgroundColor="#846D29"
                color="white"
                className="profile-btn"
                onClick={() => setIsModalOpen(true)}
              />
              <Button
                name="Logout"
                backgroundColor="#846D29"
                color="white"
                className="profile-btn"
                onClick={handleLogout}
              />
            </div>
          </div>

          <ProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={customer}
            userType="customer"
          />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
