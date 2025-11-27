import React from "react";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
