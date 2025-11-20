import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { registerCustomer } from "../src/storeSlices/customerSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const { customer, loading, error } = useAppSelector(
    (state) => state.customer
  );

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Dispatch the registerCustomer thunk
    dispatch(
      registerCustomer({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      })
    );
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Display success message */}
      {customer && (
        <p style={{ color: "green", marginTop: "10px" }}>
          Registered successfully! Welcome {customer.first_name}.
        </p>
      )}

      {/* Display error message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
