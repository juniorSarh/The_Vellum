import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin } from "../../src/storeSlices/adminSlice";
import Input from "../../src/components/input";
import Button from "../../src/components/Button";
import "../../src/addAdminPage.css";
import Footer from "../../src/components/Footer";
import PrivatNav from "../../src/components/PrivatNav";
import type { RootState, AppDispatch } from "../../store";
import { Link } from "react-router-dom";

const Addadmin = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state: RootState) => state.admin);

  // ---------------- HANDLERS ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(registerAdmin(form));
  };

  return (
    <div>
      <PrivatNav />

      <div className="addminContainer">
        <form className="adminBox" onSubmit={handleSubmit}>
          <h2>Add Admin</h2>

          <Input
            label="First Name"
            placeholder="Enter first name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          
          {error && <p className="error">{error}</p>}

          <Button
            name={loading ? "Adding..." : "Add"}
            backgroundColor="#846D29"
            color="white"
            className="AdminBtn"
          />

        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Addadmin;
