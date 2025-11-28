import { useState } from "react";
import PrivateNavBar from "../../src/components/PrivateNaveBar";
import Footer from "../../src/components/Footer";
import SearchBar from "../../src/components/searchBar";
import Button from "../../src/components/Button";


import "../../src/assets/css/favourites.css";
import { FaArrowLeft } from "react-icons/fa";

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
      </div>

      <div className="favourites-content">
        <Button icon={<FaArrowLeft />} />  

      <div className="search-bar-container">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search items..."
        />
      </div>



      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
