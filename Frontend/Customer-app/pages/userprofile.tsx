import React, { useState } from "react";
import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/Userprofile.css";
import logo from "../../src/assets/The-vellum-logo.png";
import Footer from "../../src/components/Footer";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import { logout } from "../../src/storeSlices/customerSlice";
import PrivatNav from "../../src/components/PrivatNav";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get logged-in customer from Redux
  const { customer } = useAppSelector((state) => state.customer);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Load profile image (optional if stored in DB later)
  // useEffect(() => {
  //   if (customer?.profilePic) {
  //     setProfilePic(customer.profilePic);
  //   }
  // }, [customer]);

  // Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
    }
  };

  return (
    <>
      <PrivatNav />
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

          {/* Main Content */}
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
              <p className="profile-value">
                {customer?.first_name} {customer?.last_name}
              </p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{customer?.email}</p>

              <p className="profile-label">Phone Number</p>
              <p className="profile-value">{customer?.phone || "Not set"}</p>

              <p className="profile-label">Address</p>
              <p className="profile-value">{customer?.address || "Not set"}</p>

              {/* <p className="profile-label">Joined at</p>
            <p className="profile-value">
              {customer?.created_at
                ? new Date(customer.created_at).toDateString()
                : "Unknown"}
            </p> */}
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
                onClick={() => dispatch(logout())}
              />
            </div>
          </div>

          {/* Edit Modal */}
          <ProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
