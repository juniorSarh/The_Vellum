import React, { type ChangeEvent } from "react";
import "../input.css";

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string; // ✅ Add this
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  name,
}) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name} 
      />
    </div>
  );
};

export default Input;
