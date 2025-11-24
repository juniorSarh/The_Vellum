import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import "../PrivatNav.css";
import logo from "../assets/The-vellum-logo.png";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutCustomer } from "../storeSlices/customerSlice";
import { logout as logoutAdmin } from "../storeSlices/adminSlice";
import type { RootState } from "../../store";

const PrivatNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customer } = useSelector((state: RootState) => state.customer);
  const { admin } = useSelector((state: RootState) => state.admin);

  const handleLogout = () => {
    if (admin) dispatch(logoutAdmin());
    if (customer) dispatch(logoutCustomer());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="The Vellum Logo" className="logo-img" />
        <h1 className="title">The Vellum</h1>
      </div>

      <div className="navbar-right">
        {/* If ADMIN logged in */}
        {admin && (
          <>
            <Link to="/admin-profile" className="link-reset">
              <Button
                name=""
                icon={<FaUser />}
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

        {/* If CUSTOMER logged in */}
        {customer && (
          <>
            <Link to="/User-profile">
              <Button
                name="Profile"
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

        {/* If nobody is logged in */}
        {!admin && !customer && (
          <Link to="/login" className="link-reset">
            <Button
              name="Login"
              backgroundColor="white"
              color="black"
              className="nav-btn"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PrivatNav;
