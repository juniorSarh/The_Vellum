import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import "../NavBar.css";
import logo from "../assets/The-vellum-logo.png";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutCustomer } from "../storeSlices/customerSlice";
import { logout as logoutAdmin } from "../storeSlices/adminSlice";
import type { RootState } from "../../store";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { customer } = useSelector((state: RootState) => state.customer);
  const { admin } = useSelector((state: RootState) => state.admin);

  const handleLogout = () => {
    if (admin) dispatch(logoutAdmin());
    if (customer) dispatch(logoutCustomer());
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <div className="logo-box">
          <img src={logo} alt="The Vellum Logo" />
        </div>
        <h1 className="title">The Vellum</h1>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* -------- User Logged In (Admin OR Customer) -------- */}
        {(admin || customer) && (
          <>
            <Link
              to={admin ? "/admin-profile" : "/user-profile"}
              className="link-reset"
            >
              <Button
                name="Profile"
                icon={<FaUser size={18} />}
                backgroundColor="white"
                color="black"
                className="nav-btn"
              />
            </Link>

            <Button
              name="Logout"
              backgroundColor="white"
              color="black"
              className="nav-btn"
              onClick={handleLogout}
            />
          </>
        )}

        {/* -------- Guest (NOT Logged In) -------- */}
        {!admin && !customer && (
          <>
            <Link to="/register" className="link-reset">
              <Button
                name="Register"
                color="black"
                backgroundColor="white"
                className="nav-btn"
              />
            </Link>

            <Link to="/login" className="link-reset">
              <Button
                name="Login"
                color="black"
                backgroundColor="white"
                className="nav-btn"
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
