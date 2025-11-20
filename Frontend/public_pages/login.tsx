import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { loginCustomer } from "../src/storeSlices/customerSlice";
import { useNavigate } from "react-router-dom";
import "../src/Login.css"; // <-- Make sure your CSS file is imported
import Footer from "../src/components/Footer";
import NavBar from "../src/components/navBar";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { customer, loading, error } = useAppSelector(
    (state) => state.customer
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect to home after successful login
  useEffect(() => {
    if (customer) {
      navigate("/home");
    }
  }, [customer, navigate]);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginCustomer(formData));
  };

  return (
    <>
    <NavBar />
      <div className="loginPage">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Welcome Back</h2>

            {/* Email */}
            <input
              className="input-field"
              name="email"
              type="email"
              placeholder="Enter your email"
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

            {/* Password */}
            <input
              className="input-field"
              name="password"
              type="password"
              placeholder="Enter your password"
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

            {/* Error message */}
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

            {/* Login button */}
            <button
              type="submit"
              className="login-btn"
              style={{ backgroundColor: "#846D29", color: "white" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
