import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
}) {
  return (
    // 1. Wrapper div to create the white card effect for the input field
    <div
      className={`bg-white border border-gray-200 rounded-lg p-3 ${className}`}
    >
      <label htmlFor={id} className="block text-xs font-medium text-gray-500">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        // 2. Input field is now borderless and has a transparent/gray background
        className="w-full bg-transparent text-gray-800 font-medium focus:outline-none disabled:bg-transparent"
      />
    </div>
  );
}
