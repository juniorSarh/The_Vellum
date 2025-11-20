import NavBar from "../src/components/navBar";
import Footer from "../src/components/Footer";
import Button from "../src/components/Button";
import {
  FaArrowLeft,
  FaRegHeart,
  FaShare,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../src/assets/css/hotelDetails.css";
// import hotelImage from "../src/assets/images/hotel.jpg";

export default function HotelDetails() {
  return (
    <div className="hotel-details-page">
      {/* NAV */}
      <div className="nav-row">
        <NavBar />
      </div>

      <Button icon={<FaArrowLeft />} backgroundColor="white" color="black" />

      {/* MAIN WRAPPER */}
      <div className="hotel-details-wrapper">
        {/* LEFT COLUMN */}
        <div className="hotel-left">
          <h1 className="hotel-title">Hotel Name</h1>
          <p className="hotel-location">Location Name</p>

          <div className="image-container">
            {/* <img src={hotelImage} alt="Hotel" /> */}
          </div>

          <h2 className="desc-title">Description:</h2>

          <p className="hotel-description">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta,
            eligendi. Accusamus, assumenda voluptas saepe qui commodi laboriosam
            error dicta at animi enim excepturi, tempora optio repellat impedit
            nihil doloribus nostrum. <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Necessitatibus, consequuntur dolore. Labore accusamus minus eaque
            eum perspiciatis earum corporis autem molestias debitis voluptate,
            cum qui est modi officiis nesciunt! Quo. <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            atque ad, asperiores in dolor veniam repudiandae necessitatibus
            perspiciatis quaerat ipsum tenetur commodi animi quos, fugiat
            explicabo perferendis quia et nemo?
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hotel-right">
          {/* Icons + Book Button */}
          <div className="right-top-actions">
            <Button
              icon={<FaRegHeart />}
              className="icon"
              backgroundColor="white"
              color="black"
            />
            <Button
              icon={<FaShare />}
              className="icon"
              backgroundColor="white"
              color="black"
            />

            <Button
              name="Book Now"
              backgroundColor="#000"
              color="white"
              className="book-btn"
            />
          </div>

          {/* REVIEWS BOX */}
          <div className="review-panel">
            <p>
              <strong>Total Good reviews:</strong> 320
            </p>
            <p>
              <strong>Comments:</strong>
            </p>

            <div className="review-item">
              • Amazing place, loved the environment.
            </div>
            <div className="review-item">• Very clean and peaceful stay.</div>
            <div className="review-item">
              • Staff were friendly and helpful.
            </div>
            <div className="review-item">
              • Amazing place, loved the environment.
            </div>
            <div className="review-item">• Very clean and peaceful stay.</div>
            <div className="review-item">
              • Staff were friendly and helpful.
            </div>
          </div>

          {/* MAP BUTTON */}
          <div className="map-button-box">
            <Button
              icon={<FaMapMarkerAlt />}
              name="Show on Map"
              backgroundColor="#e5e5e5"
              color="black"
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
