import React, { useState } from "react";
import SearchBar from "../src/components/searchBar";

const Home: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: "16px", maxWidth: "600px" }}>
      <SearchBar
        value={query}
        onChange={setQuery}
        onFilterClick={() => {
          // Here you can open a modal for date/location/availability filters
          console.log("Open filter panel");
        }}
      />
    </div>
  );
};

export default Home;
