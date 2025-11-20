import { useState } from "react";
import Input from "../src/components/input";
import Button from "../src/components/Button";
import { Link } from "react-router-dom";
import "../src/Register.css";
import NavBar from "../src/components/navBar";
import Footer from "../src/components/Footer";

interface RegisterFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4040/api/customers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Customer registered successfully!");
        console.log("Registered Customer:", data.data);
        // Optional: redirect to login page
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error registering customer:", err);
    }
  };

  return (
    <div>
      <NavBar />

      <div className="register-container">
        <form className="register-box" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <Input
            label="First Name"
            placeholder="Enter first name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            placeholder="Enter phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Address"
            placeholder="Enter address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <Button
            name="Register"
            backgroundColor="#846D29"
            color="white"
            className="auth-btn"
          />

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}
