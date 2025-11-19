import React, { useState } from "react";
import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/userProfile.css";
import logo from "../../src/assets/The-vellum-logo.png";
import Footer from "../../src/components/Footer";
import PrivatNav from "../../src/components/PrivatNav";
import { Link } from "react-router-dom";

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
    }
  };

  return (
    <div>
      <div>
        <PrivatNav />
      </div>

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
              <Link to="/" className="link-reset">
                <Button
                  name="Logout"
                  backgroundColor="#846D29"
                  color="white"
                  className="profile-btn"
                />
              </Link>
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
    </div>
  );
};

export default ProfilePage;
