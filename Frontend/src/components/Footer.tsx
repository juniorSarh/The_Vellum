import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import "../assets/css/footer.css";
import Button from "./Button";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-text">
        <h1>The Vellum</h1>
        <p>@Copyright</p>
      </div>

      <div className="footer-icons">
        <span>Contact Us</span>
        <Button icon={<FaFacebook />} className="footer-buttons" />
        <Button icon={<FaInstagram />} className="footer-buttons" />
        <Button icon={<FaTwitter />} className="footer-buttons" />
      </div>
    </div>
  );
}
