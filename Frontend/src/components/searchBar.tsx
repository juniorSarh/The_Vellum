// import React, { useState } from "react";
import "./searchBar.css";
// import FilterModal from "./filterModal";

type SearchBarProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

// type FilterData = {
//   type: "date" | "location" | "price";
//   value: string;
// };

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search",
}) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleFilterClick = () => {
  //   setIsModalOpen(true);
  // };

  // const handleApplyFilters = (filters: FilterData) => {
  //   console.log("Applied Filters:", filters);

  //   // Example: if you want filter text to reflect applied values in search input
  //   // onChange(filters.location || "");

  //   setIsModalOpen(false);
  // };

  return (
    <>
      <div className="searchbar">
        {/* Search input */}
        <div className="searchbar-input-container">
          <span className="searchbar-input-icon">🔍</span>
          <input
            type="text"
            className="searchbar-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>

        {/* Filter button */}
        {/* <button
          type="button"
          className="searchbar-filter-button"
          onClick={handleFilterClick}
        >
          Filter ▾
        </button> */}
      </div>

      {/* ⭐ Filter Modal (Showns only if open) */}
      {/* <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFilters}
      /> */}
    </>
  );
};

export default SearchBar;

// Below is an example of how to use the SearchBar component in a page
// import React, { useState } from "react";
// import SearchBar from "../src/components/searchBar";

// const Home: React.FC = () => {
//   const [query, setQuery] = useState("");

//   return (
//     <div style={{ padding: "16px", maxWidth: "600px" }}>
//       <SearchBar
//         value={query}
//         onChange={setQuery}
//         onFilterClick={() => {
//           // Here you can open a modal for date/location/availability filters
//           console.log("Open filter panel");
//         }}
//       />
//     </div>
//   );
// };

// export default Home;
