<<<<<<< HEAD
import React from 'react'
=======
import { useState } from "react";
import Input from "../src/components/input";
import Button from "../src/components/Button";
import { Link } from "react-router-dom";
import "../src/Register.css"
import NavBar from "../src/components/navBar";
import Footer from "../src/components/Footer";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormValues>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof RegisterFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("REGISTER DETAILS:", formData);
  };
>>>>>>> feat/ProfileModal

export default function register() {
  return (
    <div>
<<<<<<< HEAD
      
    </div>
  )
}
=======
       <div>
        <NavBar />
        </div>

      <div className="register-container">
        <form className="register-box" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />

          <Button
            name="Register"
            backgroundColor="#846D29"
            color="white"
            className="auth-btn"
            onClick={handleSubmit}
          />

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
       
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Register;
>>>>>>> feat/ProfileModal
