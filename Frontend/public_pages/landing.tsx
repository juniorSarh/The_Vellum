import { useState } from "react";
import NavBar from "../src/components/navBar";
import Footer from "../src/components/Footer";
import HotelCard from "../src/components/hotelCard";
import logo from "../src/assets/The-vellum-logo.png";
import SearchBar from "../src/components/searchBar";

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState("");

  // This function will receive the search input value whenever it changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    console.log("Searching for:", value);
  };
  return (
<<<<<<< HEAD
    <div>
=======
    <div className="landing">
      <div className="nav">
        <NavBar />
      </div>
      <SearchBar
        value={searchTerm} // current search term
        onChange={handleSearchChange} // updates search term
        placeholder="Search items..." // optional, defaults to "Search"
      />
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
>>>>>>> dev
    </div>
  );
}
