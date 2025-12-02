import Button from "../components/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const currentPath = location.pathname;

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
        {/* -------- ADMIN LOGGED IN -------- */}
        {admin && (
          <>
            {currentPath === "/dashboard" ? (
              <Link to="/admin-profile" className="link-reset">
                <Button
                  name="Profile"
                  icon={<FaUser size={18} />}
                  backgroundColor="white"
                  color="black"
                  className="nav-btn"
                />
              </Link>
            ) : (
              <Link to="/dashboard" className="link-reset">
                <Button
                  name="Dashboard"
                  backgroundColor="white"
                  color="black"
                  className="nav-btn"
                />
              </Link>
            )}

            <Button
              name="Logout"
              backgroundColor="white"
              color="black"
              className="nav-btn"
              onClick={handleLogout}
            />
          </>
        )}

        {/* -------- CUSTOMER LOGGED IN -------- */}
        {customer && (
          <>
            {["/home", "/checkout", "/hotel/:id"].includes(currentPath) ? (
              <>
                <Link to="/user-profile" className="link-reset">
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
            ) : (
              <>
                <Link to="/home" className="link-reset">
                  <Button
                    name="Home"
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
          </>
        )}

        {/* -------- GUEST (NOT LOGGED IN) -------- */}
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

export default PrivatNav;
