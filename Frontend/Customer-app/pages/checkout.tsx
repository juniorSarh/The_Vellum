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
              <Input
                type="name"
                placeholder="Enter your Name"
                label="Name"
                onChange={() => {}}
                value=""
              />
              <Input
                placeholder="Enter Name & Surname"
                label="Name & Surname"
                value=""
                onChange={() => {}}
              />
              <Input
                type="email"
                placeholder="Please Provide Email"
                label="Email"
                value=""
                onChange={() => {}}
              />
              <Input
                label="Number of Rooms"
                type="number"
                value=""
                onChange={() => {}}
              />
              <Input
                label="Number of People"
                type="number"
                value=""
                onChange={() => {}}
              />
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

            {/* ROW 1 */}
            <div className="form-row">
              <Input
                label="ID Number"
                placeholder="Please Enter ID Number"
                value=""
                onChange={() => {}}
              />

              <Input
                placeholder="Check-in Time"
                label=""
                type="time"
                value="12:00"
                onChange={() => {}}
              />
            </div>

            {/* ROW 2 */}
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
