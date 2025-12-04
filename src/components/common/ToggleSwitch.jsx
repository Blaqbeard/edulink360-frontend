import React from "react";

export default function ToggleSwitch({ isOn, onToggle, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={isOn}
      onClick={onToggle}
      // 1. Adjusted size and colors to match the design
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        ${isOn ? "bg-gray-800" : "bg-gray-200"}
      `}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
          ${isOn ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
