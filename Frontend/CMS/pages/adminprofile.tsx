import { useState } from "react";

import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/AdminProfile.css";
import Footer from "../../src/components/Footer";
import { Link } from "react-router-dom";
import PrivatNav from "../../src/components/PrivatNav";

export default function Adminprofile() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Fake user data
  const user = {
    first_Name: " ",
    last_Name: "",
    email: "",
    password:"",
    joined: "",
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
              <p className="profile-label">First_Name</p>
              <p className="profile-value">{user.first_Name}</p>
              <p className="profile-label">Last_Name</p>
              <p className="profile-value">{user.last_Name}</p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{user.email}</p>

              <p className="profile-label">Password</p>
              <p className="profile-value">{user.password}</p>

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
}
