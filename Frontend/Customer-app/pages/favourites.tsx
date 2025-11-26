import { useState } from "react";
import PrivateNavBar from "../../src/components/PrivateNaveBar";
import Footer from "../../src/components/Footer";
import SearchBar from "../../src/components/searchBar";
import Button from "../../src/components/Button";
import HotelCard from "../../src/components/hotelCard";

import "../../src/assets/css/favourites.css";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../src/assets/The-vellum-logo.png";

export default function Favourites() {
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
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
        <HotelCard
          name="The Vellum"
          location="pmb"
          price={2000}
          image={logo}
          isLoggedIn={true}
        />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
