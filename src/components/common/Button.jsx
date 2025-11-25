import React from "react";

/**
 * A reusable button component with different visual styles.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The text or icon inside the button.
 * @param {function} [props.onClick] - The function to call when the button is clicked.
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - The style variant of the button.
 * @param {string} [props.className] - Optional additional CSS classes.
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}) {
  // Base styles for all buttons
  const baseStyles =
    "px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant-specific styles
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
