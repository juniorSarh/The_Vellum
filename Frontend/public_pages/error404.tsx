import PrivateNavBar from "../src/components/PrivateNaveBar";
import Footer from "../src/components/Footer";
import Button from "../src/components/Button";
import Input from "../src/components/input";
import "../src/assets/css/checkout.css";

export default function Checkout() {
  return (
    <div className="checkout-container">
      {/* NAVBAR */}
      <div className="nav">
        <PrivateNavBar />
      </div>

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
          <div className="form">
            <div className="form-column">
              <Input
                placeholder="Enter Name & Surname"
                label="Name & Surname"
              />
              <Input
                placeholder="Please Provide Email"
                type="email"
                label="Email"
              />
              <Input
                label="Number of Rooms"
                placeholder="Number of Rooms"
                type="number"
              />
              <Input
                label="Number of People"
                placeholder="Number of People"
                type="number"
              />
            </div>

            <div className="form-row">
              <Input label="ID Number" placeholder="Please Enter ID Number" />
              <Input placeholder="Check-in Time" type="time" />
            </div>

            <div className="form-row">
              <Input label="Check-in Date" type="date" />
              <Input label="Check-out Date" type="date" />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="checkout-buttons">
            <Button
              name="Pay"
              color="white"
              backgroundColor="#846d29"
              className="btn"
            />
            <Button
              name="Cancel"
              color="white"
              backgroundColor="Red"
              className="btn"
            />
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
