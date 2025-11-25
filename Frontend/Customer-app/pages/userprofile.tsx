import React, { useState } from "react";
import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/Userprofile.css";
import logo from "../../src/assets/The-vellum-logo.png";
import Footer from "../../src/components/Footer";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { logout } from "../../src/storeSlices/customerSlice";
import PrivatNav from "../../src/components/PrivatNav";
import { useNavigate } from "react-router-dom"; // 👈 Added

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // 👈 Added

  // Get logged-in customer from Redux
  const { customer } = useAppSelector((state) => state.customer);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // 👇 LOGOUT FIX
  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // redirect after logout
  };

  return (
    <>
      <PrivatNav />
      <div className="page-container">
        <div className="profile-wrapper">
          <aside className="profile-sidebar">
            <div className="sidebar-logo">
              <img src={logo} alt="" />
            </div>

            <button className="sidebar-option">Favorites</button>
            <button className="sidebar-option">My Bookings</button>
          </aside>

          <div className="profile-content">
            <div className="profile-image-container">
              <label htmlFor="upload-photo" className="profile-image-circle">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="profile-img" />
                ) : (
                  <span className="upload-text">Upload</span>
                )}
              </label>
              <input
                id="upload-photo"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                value={customer.image}
                onChange={handleImageUpload}
              />
            </div>

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

            <div className="profile-actions">
              <Button
                name="Edit Profile"
                backgroundColor="#846D29"
                color="white"
                className="profile-btn"
                onClick={() => setIsModalOpen(true)}
              />

              {/* 🔥 Updated Logout Button */}
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
