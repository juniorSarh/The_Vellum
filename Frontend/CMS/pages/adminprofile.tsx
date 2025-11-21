import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../src/storeSlices/adminSlice";
import { useNavigate } from "react-router-dom";

import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/AdminProfile.css";
import Footer from "../../src/components/Footer";
import PrivatNav from "../../src/components/PrivatNav";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux logged-in admin
  const admin = useSelector((state: RootState) => state.admin.admin);

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
    }
  };

  // 🔥 Logout handler
  const handleLogout = () => {
    dispatch(logout()); // clears redux + localStorage
    navigate("/"); // redirect to login/landing
  };

  return (
    <div>
      <PrivatNav />

      <div className="page-container">
        <div className="profile-wrapper">
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

            {/* Admin Info */}
            <div className="profile-info">
              <p className="profile-label">First Name</p>
              <p className="profile-value">{admin?.first_name || "-"}</p>

              <p className="profile-label">Last Name</p>
              <p className="profile-value">{admin?.last_name || "-"}</p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{admin?.email || "-"}</p>

              <p className="profile-label">Phone</p>
              <p className="profile-value">{admin?.phone || "-"}</p>
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

              {/* 🔥 FIXED LOGOUT BUTTON */}
              <Button
                name="Logout"
                backgroundColor="#846D29"
                color="white"
                className="profile-btn"
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={admin}
        />

        <Footer />
      </div>
    </div>
  );
}
