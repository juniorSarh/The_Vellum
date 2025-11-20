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
    }
  };

  return (
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
