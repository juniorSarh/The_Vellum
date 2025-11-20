import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { registerCustomer } from "../src/storeSlices/customerSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  // Update the handleSubmit function in register.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Dispatch and wait for the registration to complete
      await dispatch(
        registerCustomer({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
        })
      ).unwrap();

      // If we get here, registration was successful
      // The useEffect will handle the redirection when customer state updates
    } catch (error) {
      console.error("Registration failed:", error);
      // Error is already handled by the Redux slice
    }
  };

  // Update the useEffect to handle redirection
  useEffect(() => {
    if (customer) {
      navigate("/home");
    }
  }, [customer, navigate]);
  return (
    <form onSubmit={handleSubmit}>
      {/* First Name */}
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          type="text"
        />
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          type="text"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={loading}>
        Register
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}
