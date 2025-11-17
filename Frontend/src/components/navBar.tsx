import React from "react";
import Button from "../components/Button";
import "../NavBar.css";
import logo from "../assets/The-vellum-logo.png"


const NavBar = () => {
  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <div className="logo-box">
          <img src={logo} alt="" />
        </div>
        <h1 className="title">The Vellum</h1>
      </div>

   
      <div className="navbar-right">
        <Button
          name="Register"
          color="black"
          backgroundColor="white"
          className="nav-btn"
          onClick={() => console.log("Register clicked")}
        />

        <Button
          name="Login"
          color="black"
          backgroundColor="white"
          className="nav-btn"
          onClick={() => console.log("Login clicked")}
        />
      </div>
    </nav>
  );
};

export default NavBar;
