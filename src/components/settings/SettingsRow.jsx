import React from "react";
import ToggleSwitch from "../common/ToggleSwitch";

/**
 * A reusable row for a settings page.
 * Displays a title, description, and a control on the right.
 *
 * @param {object} props
 * @param {string} props.title - The main title of the setting.
 * @param {string} props.description - The description below the title.
 * @param {'toggle' | 'link'} props.controlType - The type of control to display.
 * @param {boolean} [props.isToggled] - The state for the toggle switch.
 * @param {function} [props.onToggle] - The function to call when toggled.
 * @param {string} [props.linkLabel='Manage'] - The text for the link.
 * @param {function} [props.onLinkClick] - The function to call when the link is clicked.
 */
export default function SettingsRow({
  title,
  description,
  controlType,
  isToggled,
  onToggle,
  linkLabel = "Manage",
  onLinkClick,
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div>
        {controlType === "toggle" && (
          <ToggleSwitch isOn={isToggled} onToggle={onToggle} />
        )}
        {controlType === "link" && (
          <button
            onClick={onLinkClick}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            {linkLabel}
          </button>
        )}
      </div>
    </div>
  );
}
