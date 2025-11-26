import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin } from "../../src/storeSlices/adminSlice";
import Input from "../../src/components/input";
import Button from "../../src/components/Button";
import "../../src/addAdminPage.css";
import Footer from "../../src/components/Footer";
import PrivatNav from "../../src/components/PrivatNav";
import type { RootState, AppDispatch } from "../../store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addadmin = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);
  console.log("Local error:", localError);

  const { loading } = useSelector((state: RootState) => state.admin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { first_name, last_name, email, password } = form;

    if (!first_name || !last_name || !email || !password) {
      setLocalError("Some fields are required");
      toast.error("Some fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 5) {
      setLocalError("Password must have at least 5 characters");
      toast.error("Password must have at least 5 characters");
      return;
    }

    setLocalError(null);

    const res = await dispatch(registerAdmin(form));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Admin successfully added!");

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } else {
      const backendError =
        typeof res.payload === "string" ? res.payload : "Failed to add admin";
      toast.error(backendError);
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" />

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
