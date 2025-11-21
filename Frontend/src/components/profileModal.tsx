import React, { useState, useEffect } from "react";
import Button from "./Button";
import "../ProfileModal.css";
import { useAppDispatch } from "../storeSlices/hooks";
import { updateCustomerProfile } from "../storeSlices/customerSlice";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
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
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!customer?.id) return;
    dispatch(updateCustomerProfile({ id: customer.id, updates: formData }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Edit Profile</h2>

        <form className="modal-form">
          <label >First Name</label>
          <input
            className=""
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <label className="">Last Name</label>
          <input
            className=""
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <label className="">Email</label>
          <input
            className=""
            name="last_name"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="">Phone Number</label>
          <input
            className=""
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label className="">Address</label>
          <input
            className=""
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
