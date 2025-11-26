import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { registerCustomer } from "../src/storeSlices/customerSlice";
import "../src/Register.css";
import Footer from "../src/components/Footer";
import NavBar from "../src/components/navBar";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { customer, loading, error } = useAppSelector(
    (state) => state.customer
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (customer) navigate("/home");
  }, [customer, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
    };
    dispatch(registerCustomer(payload));
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      try {
        const base64Url = credentialResponse.credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const googleUser = JSON.parse(jsonPayload);
        const googlePayload = {
          first_name: googleUser.given_name,
          last_name: googleUser.family_name,
          email: googleUser.email,
          password: googleUser.sub,
        };

        dispatch(registerCustomer(googlePayload));
      } catch (err) {
        console.error("Google login failed:", err);
      }
    }
  };

  const handleGoogleFailure = () => {
    alert("Google sign-in failed. Please try again.");
  };

  return (
    <>
      <NavBar />
      <div className="loginPage">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Create Account</h2>

            <input
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-btn"
              style={{
                backgroundColor: "#846D29",
                color: "white",
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                marginBottom: "20px", // space below button before Google
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* --- Google Button BELOW form, CENTERED --- */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                width="100%"
              />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
