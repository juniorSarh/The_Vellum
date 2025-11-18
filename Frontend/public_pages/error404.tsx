import React, { useState } from "react";
import PrivateNavBar from "../src/components/PrivateNaveBar";
import Footer from "../src/components/Footer";
import SearchBar from "../src/components/searchBar";
import Button from "../src/components/Button";
import HotelCard from "../src/components/hotelCard";

import "../src/assets/css/favourites.css";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../src/assets/hotelImage.jpg";

export default function Error404() {
  const [searchTerm, setSearchTerm] = useState("");

  // This function will receive the search input value whenever it changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    console.log("Searching for:", value);
  };

 

  return (
    <div className="landing">
      <div className="nav">
        <PrivateNavBar />

        <Button icon={<FaArrowLeft />} />
      </div>

      <div className="search-bar-container">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search items..."
        />
      </div>

      <div className="cards">
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
        <HotelCard name="The Vellum" location="pmb" price={2000} image={logo} />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
