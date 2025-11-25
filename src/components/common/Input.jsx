import React from "react";

/**
 * A reusable, styled input field component with a label.
 *
 * @param {object} props
 * @param {string} props.label - The text to display in the label above the input.
 * @param {string} props.id - A unique ID for the input, used to link the label correctly.
 * @param {string} props.type - The type of the input (e.g., 'text', 'email', 'password').
 * @param {string} props.value - The current value of the input.
 * @param {function} props.onChange - The function to call when the input's value changes.
 * @param {string} [props.placeholder] - The placeholder text for the input.
 * @param {boolean} [props.disabled=false] - Whether the input should be disabled.
 * @param {string} [props.className] - Optional additional CSS classes for the container.
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
        name={id} // It's good practice to have a name attribute
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseInputStyles} ${disabled ? disabledStyles : ""}`}
      />
    </div>
  );
}
