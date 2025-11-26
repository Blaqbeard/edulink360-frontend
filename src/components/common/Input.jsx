import React from "react";

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.id
 * @param {string} props.type
 * @param {string} props.value
 * @param {function} props.onChange
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
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
  // Base styles for the input field
  const baseInputStyles =
    "w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

  // Styles for the disabled state
  const disabledStyles = "bg-gray-100 cursor-not-allowed";

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
        className={`${baseInputStyles} ${disabled ? disabledStyles : ""}`}
      />
    </div>
  );
}
