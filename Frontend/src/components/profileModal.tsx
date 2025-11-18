import React from "react";
import Button from "../components/Button";
import "../EditModal.css";

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<UpdateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2 className="modal-title">Update Profile</h2>

        <form className="modal-form">
          <label>First Name:</label>
          <input type="text" />

          <label>Last Surname:</label>
          <input type="text" />

          <label>Password:</label>
          <input type="password" />

          <label>Email:</label>
          <input type="email" />

          <Button
            name="Update"
            backgroundColor="black"
            color="white"
            className="submit-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;