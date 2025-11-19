<<<<<<< HEAD
export default function Registeredusers() {
  return <div></div>;
}
=======
import React, { useState } from "react";
import SearchBar from "../../src/components/searchBar";
import RegUsers from "../../src/components/regUsers";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { useNavigate } from "react-router-dom";
import "../../src/reservationPage.css";
import { FaArrowLeft } from "react-icons/fa";
import PrivatNav from "../../src/components/PrivatNav";

const RegisteredUsers = () => {
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

        <h2 className="Title">Registered Users</h2>

        <div className="List">
          <RegUsers name="Hello" onDelete={() => {}} />
          <RegUsers name="gdfhy" onDelete={() => {}} />
        </div>
      </div>
      <div className="footer"></div>
      <Footer />
    </div>
  );
};

export default RegisteredUsers;
>>>>>>> feat/regusers
