import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import Input from "../../src/components/input";
import "../../src/assets/css/checkout.css";
import PrivatNav from "../../src/components/PrivatNav";
import { Link } from "react-router-dom";

export default function Checkout() {
  return (
    <div className="checkout-container">
      <PrivatNav />

      <div className="checkout-content">
        {/* TOP SECTION: IMAGE + HOTEL DETAILS */}
        <div className="checkout-top-section">
          <div className="checkout-image-box">
            <img
              src="../src/assets/The-vellum-logo.png"
              alt="picture of a hotel"
              className="image"
            />
          </div>

          <div className="checkout-info-box">
            <h2>Hotel name</h2>

            <h3>location</h3>

            <p>xxxxxxxxxx</p>
            <p>xxxxxxxxxx</p>
            <p>xxxxxxxxxx</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="checkout-form">
          <form className="form">
            {/* COLUMN 1 */}
            <div className="form-column">
              <div className="input-group">
                <label>Room Type</label>
                <select name="room_type" defaultValue="">
                  <option value="" disabled>
                    Select Room Type
                  </option>
                  <option value="delux">delux</option>
                  <option value="suite">suite</option>
                  <option value="starndard">starndard</option>
                </select>
              </div>
            </div>

            {/* ROW 1 - removed unnecessary fields */}

            {/* ROW 2: Keep only Check-in and Check-out dates */}
            <div className="form-row">
              <Input
                label="Check-in Date"
                type="date"
                value=""
                onChange={() => {}}
              />
              <Input
                label="Check-out Date"
                type="date"
                value=""
                onChange={() => {}}
              />
            </div>
          </form>

          {/* BUTTONS */}
          <div className="checkout-buttons">
            <Link to="/payment">
              <Button
                name="Pay"
                color="white"
                backgroundColor="#846d29"
                className="btn"
              />
            </Link>

            <Link to="/hotel">
              <Button
                name="Cancel"
                color="white"
                backgroundColor="red"
                className="btn"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
