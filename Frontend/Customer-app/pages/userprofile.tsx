<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { updateCustomerProfile } from "../../src/storeSlices/customerSlice";

export default function UserProfile() {
  const dispatch = useAppDispatch();

  // Get logged-in user from Redux
  const { customer, loading, error } = useAppSelector(
    (state) => state.customer
  );

  // Local state for edit form
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Load user data into the form on mount
  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name ?? "",
        last_name: customer.last_name ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer?.id) {
      alert("User not logged in");
      return;
    }

    const resultAction = await dispatch(
      updateCustomerProfile({ id: customer.id, updates: formData })
    );

    if (updateCustomerProfile.fulfilled.match(resultAction)) {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
=======
import React, { useState } from "react";
import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/Userprofile.css";
import logo from "../../src/assets/The-vellum-logo.png";
import Footer from "../../src/components/Footer";

const ProfilePage: React.FC = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Fake user data
  const user = {
    fullName: "Zack Snyder",
    email: "zack@gmail.com",
    phone: "067 243 34565",
    joined: "January 15, 2024",
  };

  // Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
>>>>>>> f12a8ea91306145ac8263c26acd6619c0de0bbf6
    }
  };

  return (
<<<<<<< HEAD
    <div className="profile-container">
      <h2>User Profile</h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />

        <label>Last Name</label>
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />

        <label>Address</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
}
=======
    <div className="page-container">
      <div className="profile-wrapper">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="sidebar-logo">
            <img src={logo} alt="" />
          </div>

          <button className="sidebar-option">Favorites</button>
          <button className="sidebar-option">My Bookings</button>
        </aside>

        {/* Main content */}
        <div className="profile-content">
          {/* Profile Image */}
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
              onChange={handleImageUpload}
            />
          </div>

          {/* User Information */}
          <div className="profile-info">
            <p className="profile-label">Full Name</p>
            <p className="profile-value">{user.fullName}</p>

            <p className="profile-label">Email</p>
            <p className="profile-value">{user.email}</p>

            <p className="profile-label">Phone Number</p>
            <p className="profile-value">{user.phone}</p>

            <p className="profile-label">Joined at:</p>
            <p className="profile-value">{user.joined}</p>
          </div>

          {/* Buttons */}
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
            />
          </div>
        </div>

        {/* Edit Modal */}
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
>>>>>>> f12a8ea91306145ac8263c26acd6619c0de0bbf6
