import React from "react";

/**
 
 * @param {object} props
 * @param {React.ReactNode} props.icon 
 * @param {string} props.value 
 * @param {string} props.label 
 * @param {string} props.subLabel 
 * @param {'blue' | 'orange' | 'green'} [props.color='blue'] 
 */
export default function StatCard({
  icon,
  value,
  label,
  subLabel,
  color = "blue",
}) {
  // Define color variants for the card's background and the icon's background
  const cardColorVariants = {
    blue: "bg-blue-50",
    orange: "bg-orange-50",
    green: "bg-green-50",
  };

  const iconColorVariants = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    // 1. The main container now has its own background color and doesn't use the base Card.
    <div className={`p-6 rounded-xl ${cardColorVariants[color]}`}>
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg ${iconColorVariants[color]}`}
      >
        {icon}
      </div>

      <div className="mt-4">
        <p className="text-5xl font-bold text-gray-800">{value}</p>
        <p className="text-md font-semibold text-gray-700 mt-2">{label}</p>
        <p className="text-sm text-gray-500">{subLabel}</p>
      </div>
    </div>
  );
}
