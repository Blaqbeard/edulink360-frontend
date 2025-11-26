import React from "react";

/**

 * @param {object} props
 * @param {boolean} props.isOn 
 * @param {function} props.onToggle 
 * @param {string} [props.id] 
 */
export default function ToggleSwitch({ isOn, onToggle, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={isOn}
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isOn ? "bg-gray-800" : "bg-gray-300"}
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
