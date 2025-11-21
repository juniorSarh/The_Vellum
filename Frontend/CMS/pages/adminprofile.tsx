import { useState } from "react";
<<<<<<< HEAD
import { useAppSelector, useAppDispatch } from "../../src/storeSlices/hooks";
import { logout } from "../../src/storeSlices/adminSlice";
=======
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../src/storeSlices/adminSlice";
import { useNavigate } from "react-router-dom";
>>>>>>> 3377c73867d1d95fe20b3e2aa81f8339cab8eb4b

import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/AdminProfile.css";
import Footer from "../../src/components/Footer";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import PrivatNav from "../../src/components/PrivatNav";

export default function Adminprofile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Read admin from Redux store
  const admin = useAppSelector((state) => state.admin.admin);

  // Modal state
=======
import PrivatNav from "../../src/components/PrivatNav";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux logged-in admin
  const admin = useSelector((state: RootState) => state.admin.admin);

  // Edit modal state
>>>>>>> 3377c73867d1d95fe20b3e2aa81f8339cab8eb4b
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

<<<<<<< HEAD
  // Logout handler
  const handleLogout = () => {
    dispatch(logout()); // clear Redux + localStorage
    navigate("/"); // redirect to login/home page
=======
  // 🔥 Logout handler
  const handleLogout = () => {
    dispatch(logout()); // clears redux + localStorage
    navigate("/"); // redirect to login/landing
>>>>>>> 3377c73867d1d95fe20b3e2aa81f8339cab8eb4b
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
<<<<<<< HEAD
              <p className="profile-value">{admin?.first_name || "—"}</p>

              <p className="profile-label">Last Name</p>
              <p className="profile-value">{admin?.last_name || "—"}</p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{admin?.email || "—"}</p>

              <p className="profile-label">Phone</p>
              <p className="profile-value">{admin?.phone || "—"}</p>

              <p className="profile-label">Address</p>
              <p className="profile-value">{admin?.address || "—"}</p>
=======
              <p className="profile-value">{admin?.first_name || "-"}</p>

              <p className="profile-label">Last Name</p>
              <p className="profile-value">{admin?.last_name || "-"}</p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{admin?.email || "-"}</p>

              <p className="profile-label">Phone</p>
              <p className="profile-value">{admin?.phone || "-"}</p>
>>>>>>> 3377c73867d1d95fe20b3e2aa81f8339cab8eb4b
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

<<<<<<< HEAD
=======
              {/* 🔥 FIXED LOGOUT BUTTON */}
>>>>>>> 3377c73867d1d95fe20b3e2aa81f8339cab8eb4b
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

<<<<<<< HEAD
=======
        {/* Edit Modal */}
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={admin}
        />

>>>>>>> 3377c73867d1d95fe20b3e2aa81f8339cab8eb4b
        <Footer />
      </div>
    </div>
  );
}
