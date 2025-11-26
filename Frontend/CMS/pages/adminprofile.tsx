import { useState } from "react";
import type { RootState } from "../../store";
import { logout, setAdmin } from "../../src/storeSlices/adminSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../src/components/Button";
import ProfileModal from "../../src/components/profileModal";
import "../../src/AdminProfile.css";
import Footer from "../../src/components/Footer";
import PrivatNav from "../../src/components/PrivatNav";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";

export default function AdminProfile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get logged-in admin from Redux
  const admin = useAppSelector((state: RootState) => state.admin.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local preview state
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // ===== IMAGE UPLOAD HANDLER =====
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const adminId = (admin as any)?.id;

    if (!file || !adminId) return;

    // 1️⃣ Instant preview
    const previewURL = URL.createObjectURL(file);
    setProfilePic(previewURL);

    // 2️⃣ Send to backend
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `http://localhost:4040/api/admins/upload/${adminId}/image`,
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
        // 3️⃣ Update Redux state with new image
        const updatedAdmin = { ...admin, image: result.image } as any;
        dispatch(setAdmin(updatedAdmin));

        // 4️⃣ Update stored image URL
        setProfilePic(`http://localhost:4040/uploads/${result.image}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <PrivatNav />

      <div className="page-container">
        <div className="profile-wrapper">
          <div className="profile-content">
            {/* --- Profile Image --- */}
            <div className="profile-image-container">
              <label htmlFor="upload-photo" className="profile-image-circle">
                <img
                  src={
                    profilePic || // instant preview before upload
                    (admin?.image // saved image from DB/localStorage
                      ? `http://localhost:4040/uploads/${admin.image}`
                      : "/default-avatar.png") // fallback
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

            {/* --- Admin Information --- */}
            <div className="profile-info">
              <p className="profile-label">First Name</p>
              <p className="profile-value">{admin?.first_name || "-"}</p>

              <p className="profile-label">Last Name</p>
              <p className="profile-value">{admin?.last_name || "-"}</p>

              <p className="profile-label">Email</p>
              <p className="profile-value">{admin?.email || "-"}</p>

              <p className="profile-label">Phone</p>
              <p className="profile-value">{admin?.phone || "-"}</p>

              <p className="profile-label">Address</p>
              <p className="profile-value">{admin?.address || "-"}</p>
            </div>

            {/* --- Buttons --- */}
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
        </div>

        {/* Edit Profile Modal */}
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={admin}
          userType="admin"
        />

        <Footer />
      </div>
    </div>
  );
}




           

