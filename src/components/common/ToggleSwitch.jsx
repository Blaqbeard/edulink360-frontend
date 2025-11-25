import React from "react";

/**
 * A reusable toggle switch component, controlled by a parent component.
 *
 * @param {object} props
 * @param {boolean} props.isOn - Whether the switch is currently in the "on" state.
 * @param {function} props.onToggle - A function to call when the switch is clicked. It should handle the state change.
 * @param {string} [props.id] - An optional ID for accessibility.
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
