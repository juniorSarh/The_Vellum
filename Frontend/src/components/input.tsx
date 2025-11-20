// src/components/input.tsx
import React, { type ChangeEvent } from "react";

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
        name={name} // ✅ Pass the name to the input element
      />
    </div>
  );
};

export default Input;
