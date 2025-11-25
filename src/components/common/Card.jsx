import React from "react";

/**
 * A simple, reusable card component that provides a consistent container style.
 * It accepts any content as its children.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the card.
 */
export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
