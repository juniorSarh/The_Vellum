import Button from "../components/Button";
import { Link } from "react-router-dom";
import "../NavBar.css";
import logo from "../assets/The-vellum-logo.png";

const NavBar = () => {
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
      </div>
    </nav>
  );
};

export default NavBar;
