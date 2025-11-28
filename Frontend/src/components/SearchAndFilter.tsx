import { useState } from "react";
import Button from "./Button";
import FilterModal from "./filterModal";
import "./searchBar.css";

export default function SearchAndFilter() {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyFilters = (filter: Record<string, unknown>) => {
    console.log("Applied filter:", filter);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="searchbar">
        {/* Search Input */}
        <div className="searchbar-input-container">
          <span className="searchbar-input-icon">🔍</span>
          <input
            type="text"
            className="searchbar-input"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Filter Button */}
        <Button
          name="Filter ▾"
          type="button"
          className="searchbar-filter-button"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* FILTER MODAL */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
}
