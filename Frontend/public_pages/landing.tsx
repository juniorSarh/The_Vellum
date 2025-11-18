import React from "react";
import NavBar from "../src/components/navBar";
import Footer from "../src/components/Footer";
import HotelCard from "../src/components/hotelCard";
import logo from "../src/assets/hotelImage.jpg";
import SearchBar from "../src/components/searchBar";

export default function landing() {
  return (
    <div className="landing">
      <div className="nav">
        <NavBar />
      </div>
      <div className="nav">
        <SearchBar/>
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
