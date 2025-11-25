import React from "react";
import Button from "./Button";
import "../filerModal.css";
import Input from "./input";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: {
    type: "date" | "location" | "price";
    value: string;
  }) => void;
}

const FilterModal = ({ isOpen, onClose, onApply }: FilterModalProps) => {
  const [selectedFilterType, setSelectedFilterType] = React.useState<
    "date" | "location" | "price"
  >("date");
  const [filterValue, setFilterValue] = React.useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    if (filterValue) {
      onApply({ type: selectedFilterType, value: filterValue });
      setFilterValue(""); // reset after applying
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Filter Results</h2>

        {/* Select which filter type to apply */}
        <div className="input-wrapper">
          <label className="input-label">Filter By</label>
          <select
            className="input-field"
            value={selectedFilterType}
            onChange={(e) =>
              setSelectedFilterType(
                e.target.value as "date" | "location" | "price"
              )
            }
          >
            <option value="date">Date</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
          </select>
        </div>

        {/* Select the value for the chosen filter */}
        <div className="input-wrapper">
          <label className="input-label">Value</label>
          {selectedFilterType === "date" && (
            <Input
                label="Check-in Date"
                type="date"
                value={filterValue}
                onChange={() => {}}
              />
          )}

          {selectedFilterType === "location" && (
            <Input
                label="Location"
                type="text"
                placeholder="Enter location"
                value={filterValue}
                onChange={() => {}}
              />
          )}

          {selectedFilterType === "price" && (
            <select
              className="input-field"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">Select price range</option>
              <option value="0-50">R0 - R1000</option>
              <option value="51-100">R1001 - R3000</option>
              <option value="101-200">R3001 - R5000</option>
              <option value="200+">R5000+</option>
            </select>
          )}
        </div>

        <div className="modal-buttons">
          <Button
            name="Close"
            backgroundColor="#e5e5e5"
            color="black"
            className="modal-btn"
            onClick={onClose}
          />

          <Button
            name="Apply Filter"
            backgroundColor="#846D29"
            color="white"
            className="modal-btn"
            onClick={handleApply}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
