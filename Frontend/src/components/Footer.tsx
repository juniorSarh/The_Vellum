import React from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import "../assets/css/footer.css";
import Button from "./Button";

export default function Footer() {
  return (
    <div className="footer-container">
        <div className="footer-heading">
          <h1>The Vellum</h1>
        </div>

        <div className="footer-icons">
          <Button icon={<FaFacebook />} />
          <Button icon={<FaInstagram />} />
          <Button icon={<FaTwitter />} />
        </div>
        
    </div>
  );
}
