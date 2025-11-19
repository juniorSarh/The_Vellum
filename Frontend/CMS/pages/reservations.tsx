<<<<<<< HEAD
export default function Reservations() {
  return <div></div>;
}
=======
import React, { useState } from "react";
import SearchBar from "../../src/components/searchBar";
import ReservationCard from "../../src/components/reservationCard";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { useNavigate } from "react-router-dom";
import "../../src/reservationPage.css"
import { FaArrowLeft } from "react-icons/fa";
import PrivatNav from "../../src/components/PrivatNav";

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    console.log("Searching for:", value);
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="reservationPage">
      <div className="nav">
        <PrivatNav />
      </div>

      <div className="resBody">
        <div className="backButton">
          <Button
            name=""
            color="black"
            // backgroundColor="#FFFFFF"
            icon={<FaArrowLeft style={{ marginRight: "8px" }} />}
            onClick={handleBack}
            className="back"
          />
        </div>

        <div className="SearchBar">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </div>

        <h2 className="Title">Reservation List</h2>

        <div className="List">
          <ReservationCard username="Hello" onDelete={() => {}} />
          <ReservationCard username="lol" onDelete={() => {}} />
        </div>
      </div>
      <div className="footer"></div>
      <Footer />
    </div>
  );
};

export default ReservationList;
>>>>>>> feat/regusers
