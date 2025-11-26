import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { loginCustomer } from "../src/storeSlices/customerSlice";
import { loginAdmin } from "../src/storeSlices/adminSlice";
import { useNavigate } from "react-router-dom";
import "../src/Login.css";
import Footer from "../src/components/Footer";
import NavBar from "../src/components/navBar";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ---- CLEAR OLD SESSIONS WHEN LOGIN PAGE LOADS ----
  useEffect(() => {
    localStorage.removeItem("admin");
    localStorage.removeItem("customer");
  }, []);

  // ---- Grab both slices ----
  const {
    customer,
    loading: customerLoading,
    error: customerError,
  } = useAppSelector((state) => state.customer);

  const {
    admin,
    loading: adminLoading,
    error: adminError,
  } = useAppSelector((state) => state.admin);

  // Toggle customer | admin
  const [loginAs, setLoginAs] = useState<"customer" | "admin">("customer");

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect after successful login
  useEffect(() => {
    if (admin) {
      navigate("/dashboard");
    } else if (customer) {
      navigate("/home");
    }
  }, [admin, customer, navigate]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginAs === "admin") {
      dispatch(loginAdmin(formData));
    } else {
      dispatch(loginCustomer(formData));
    }
  };

  // Derived UI state
  const loading = loginAs === "admin" ? adminLoading : customerLoading;
  const error = loginAs === "admin" ? adminError : customerError;

  return (
    <>
      <NavBar />

      <div className="loginPage">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Welcome Back</h2>

            {/* Role toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <label>
                <input
                  type="radio"
                  value="customer"
                  checked={loginAs === "customer"}
                  onChange={() => setLoginAs("customer")}
                />{" "}
                Customer
              </label>

              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={loginAs === "admin"}
                  onChange={() => setLoginAs("admin")}
                />{" "}
                Admin
              </label>
            </div>

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
