import React, { useState } from "react";
import {
  Pin,
  UserPlus,
  Settings,
  ArrowLeft,
  FileText,
  MessageSquare,
  Image,
  Cog,
} from "lucide-react";

const getInitials = (value, fallback = "ED") => {
  if (!value || typeof value !== "string") return fallback;
  const initials = value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  return initials || fallback;
};

const InfoTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = [
    { name: "Overview", icon: FileText },
    { name: "Feedback", icon: MessageSquare },
    { name: "Media", icon: Image },
    { name: "Settings", icon: Cog },
  ];

  return (
    <div className="w-full border-b border-gray-200">
      <div className="grid grid-cols-4 gap-3 px-4 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 text-xs font-semibold transition-all ${
              activeTab === tab.name
                ? "text-blue-600 bg-blue-50 border border-blue-100 shadow-sm"
                : "text-gray-500 hover:text-gray-700 border border-transparent hover:border-gray-200"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === tab.name ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
              }`}
            >
              <tab.icon size={18} />
            </div>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const MemberItem = ({ member }) => {
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-300",
  };
  const name = member?.name || "Member";
  const initials = getInitials(name, "M");
  const statusClass = statusColors[member?.status] || "bg-gray-300";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
          {initials}
        </div>
        <p className="font-medium text-gray-800">{name}</p>
      </div>
      <div className={`h-2.5 w-2.5 rounded-full ${statusClass}`}></div>
    </div>
  );
};

// Main Component
export default function GroupInfoPanel({ conversation, isOpen, onClose }) {
  // If the panel is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  if (!conversation) {
    return (
      <div className="absolute inset-0 z-20 bg-white lg:static lg:z-auto lg:w-1/4 lg:border-l lg:border-l-gray-200 lg:flex-shrink-0 flex flex-col">
        <button onClick={onClose} className="mb-4">
          <ArrowLeft />
        </button>
        <p>No conversation selected.</p>
      </div>
    );
  }

  const memberCount = Array.isArray(conversation.members)
    ? conversation.members.length
    : 0;
  const panelInitials = getInitials(
    conversation.name || conversation.sender || "Teacher",
    "ED"
  );

  return (
    <div className="absolute inset-0 z-20 bg-white lg:static lg:z-auto lg:w-1/4 lg:border-l lg:border-l-gray-200 lg:flex-shrink-0 flex flex-col">
      {/* UNIVERSAL HEADER WITH BACK ARROW */}

      <div className="p-4 border-b border-gray-200 flex items-center space-x-4 flex-shrink-0">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-semibold text-lg text-gray-800">Group Info</h2>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Group Header (inside the scrollable area) */}
        <div className="flex flex-col items-center text-center p-6">
          <div className="h-20 w-20 mb-4 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-2xl font-semibold">
            {panelInitials}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {conversation.name}
          </h2>
          {conversation.subtitle && (
            <p className="text-sm text-gray-500">{conversation.subtitle}</p>
          )}
          <p className="text-sm text-gray-500">
            {memberCount} member{memberCount === 1 ? "" : "s"}
          </p>
          <div className="flex items-center space-x-6 mt-4 text-gray-500">
            <button className="hover:text-gray-800">
              <Pin size={20} />
            </button>
            <button className="hover:text-gray-800">
              <UserPlus size={20} />
            </button>
            <button className="hover:text-gray-800">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <InfoTabs />

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {/* Description Section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{conversation.description}</p>
          </div>

          {/* Members List Section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">
              Members ({memberCount})
            </h3>
            <div className="space-y-4">
              {(conversation.members || []).map((member) => (
                <MemberItem key={member?.id || member?.userId} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
