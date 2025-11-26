import React, { useState, useEffect } from "react";
import Button from "./Button";
import "../ProfileModal.css";
// Redux hooks
import { useAppDispatch } from "../storeSlices/hooks";
// Actions
import { updateCustomerProfile } from "../storeSlices/customerSlice";
import { updateAdminProfile } from "../storeSlices/adminSlice";
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Works for admin OR customer
  userType: "customer" | "admin"; // tells modal who is being edited
}
const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userType,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    if (!user?.id) return;
    if (userType === "customer") {
      dispatch(updateCustomerProfile({ id: user.id, updates: formData }));
    } else {
      dispatch(updateAdminProfile({ id: user.id, updates: formData }));
    }
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Edit Profile</h2>
        <form className="modal-form">
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
          <input name="email" value={formData.email} onChange={handleChange} />
          <label>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <Button
              name="Save Changes"
              backgroundColor="#846D29"
              color="white"
              className="modal-btn"
              onClick={handleSave}
            />
            <Button
              name="Cancel"
              backgroundColor="gray"
              color="white"
              className="modal-btn"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProfileModal;
    