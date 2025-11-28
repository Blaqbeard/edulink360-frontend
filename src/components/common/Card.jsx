import React from "react";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Card({ children, className = "" }) {
  const hasCustomBackground = /\bbg-/.test(className);
  const baseBackground = hasCustomBackground ? "" : "bg-white";

  return (
    <div className={`${baseBackground} rounded-xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
