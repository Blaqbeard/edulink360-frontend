import React from "react";
import Card from "./Card"; // We are using our new Card component!

/**
 * A card for displaying a single, important statistic.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - The icon to display.
 * @param {string} props.value - The main statistic value (e.g., "80", "12").
 * @param {string} props.label - The title for the statistic (e.g., "Progress Rate").
 * @param {string} [props.subtitle] - Optional smaller text below the label.
 * @param {'blue' | 'orange' | 'green'} [props.color='blue'] - The color theme for the icon.
 */
export default function StatCard({
  icon,
  value,
  label,
  subtitle,
  color = "blue",
}) {
  const colorVariants = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        {/* Left side: Text content */}
        <div>
          <p className="text-4xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-600 mt-1">{label}</p>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>

        {/* Right side: Icon */}
        <div className={`p-3 rounded-lg ${colorVariants[color]}`}>
          <div className="h-6 w-6">{icon}</div>
        </div>
      </div>
    </Card>
  );
}
