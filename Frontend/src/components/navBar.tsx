import React from "react";
import "../NavBar.css";
import logo from "../assets/The-vellum-logo.png"


const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="b">
        <img src={logo} alt="" />
        </div>
        <h1 className="title">The Vellum</h1>
      </div>

      <div className="navbar-right">
       
      </div>
    </nav>
  );
};

export default NavBar;
