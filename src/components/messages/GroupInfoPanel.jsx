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

const InfoTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = [
    { name: "Overview", icon: <FileText size={18} /> },
    { name: "Feedback", icon: <MessageSquare size={18} /> },
    { name: "Media", icon: <Image size={18} /> },
    { name: "Settings", icon: <Cog size={18} /> },
  ];

  return (
    <div className="w-full border-b border-gray-100">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.name
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
          {member.name.charAt(0)}
        </div>
        <p className="font-medium text-gray-800">{member.name}</p>
      </div>
      <div
        className={`h-2.5 w-2.5 rounded-full ${statusColors[member.status]}`}
      ></div>
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
      <div className="absolute inset-0 z-20 bg-white lg:static lg:z-auto lg:w-1/4 lg:border-l border-gray-100 lg:flex-shrink-0 flex flex-col">
        <button onClick={onClose} className="mb-4">
          <ArrowLeft />
        </button>
        <p>No conversation selected.</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-20 bg-white lg:static lg:z-auto lg:w-1/4 lg:border-l border-gray-200 lg:flex-shrink-0 flex flex-col">
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
          <div className="h-20 w-20 mb-4 flex items-center justify-center rounded-full bg-purple-100">
            <img src={conversation.avatarUrl} alt="" className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {conversation.name}
          </h2>
          <p className="text-sm text-gray-500">
            {conversation.members.length} members
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
              Members ({conversation.members.length})
            </h3>
            <div className="space-y-4">
              {conversation.members.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
