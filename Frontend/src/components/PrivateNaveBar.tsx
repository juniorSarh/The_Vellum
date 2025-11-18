import React from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import "../NavBar.css";
import logo from "../assets/The-vellum-logo.png";
import { FaUserCircle } from "react-icons/fa";

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
            name="Logout"
            color="black"
            backgroundColor="white"
            className="nav-btn"
          />
        </Link>

        <Link to="/login" className="link-reset">
          <Button
            icon={<FaUserCircle />}
            color="black"
            backgroundColor="white"
            className="profile-btn"
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
