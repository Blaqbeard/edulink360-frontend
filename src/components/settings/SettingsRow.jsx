import React from "react";
import ToggleSwitch from "../common/ToggleSwitch";

/**

 * @param {object} props
 * @param {string} props.title 
 * @param {string} props.description 
 * @param {'toggle' | 'link'} props.controlType 
 * @param {boolean} [props.isToggled] 
 * @param {function} [props.onToggle] 
 * @param {string} [props.linkLabel='Manage'] 
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
