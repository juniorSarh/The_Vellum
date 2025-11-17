// Input.tsx
import React from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 outline-none transition 
          ${
            error ? "border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
