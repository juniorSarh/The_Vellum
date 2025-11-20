import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../src/storeSlices/hooks";
import { loginCustomer } from "../src/storeSlices/customerSlice";

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

  // Redirect when logged in
  useEffect(() => {
    if (customer) {
      navigate("/home", { replace: true });
    }
  }, [customer, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginCustomer(formData));
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
