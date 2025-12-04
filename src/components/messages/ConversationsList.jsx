import React, { useState } from "react";
import { Search, Star, MessageSquareText } from "lucide-react";

const FilterTabs = ({ tabs = ["Groups", "Students", "Favorites", "Unread"], activeTab, onTabChange }) => {
  return (
    <div className="flex items-center space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange?.(tab)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === tab
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const ConversationItem = ({ convo, isActive, onClick }) => {
  const initials =
    (convo.sender || convo.name || "T")
      .toString()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "T";

  return (
  <button
    onClick={onClick}
      className={`w-full text-left p-4 flex space-x-4 items-start border-b border-gray-200 transition-colors hover:bg-gray-50 ${
      isActive ? "bg-blue-50" : ""
    }`}
  >
    {/* Blue indicator for active chat */}
    <div
      className={`w-1 rounded-full h-12 ${
        isActive ? "bg-blue-600" : "bg-transparent"
      }`}
    ></div>

      {/* Avatar with teacher initials */}
      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
        {initials}
    </div>

    {/* Main Content */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <p className="font-semibold text-gray-800 truncate">{convo.name}</p>
        <p className="text-xs text-gray-500 flex-shrink-0">{convo.time}</p>
      </div>

      {/* Teacher/Sender Name */}
        {(convo.subtitle || convo.sender) && (
      <div className="mb-2">
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {convo.subtitle || convo.sender}
        </span>
      </div>
        )}

      {/* Last Message Line with Icons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm text-gray-500 truncate">
          <MessageSquareText size={16} className="flex-shrink-0" />
          <p className="truncate">{convo.lastMessage}</p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {convo.unreadCount > 0 && (
            <div className="h-5 w-5 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full font-bold">
              {convo.unreadCount}
            </div>
          )}
          {convo.isStarred && (
            <Star size={16} className="text-yellow-500 fill-current" />
          )}
        </div>
      </div>
    </div>
  </button>
);
};

// Main Component
export default function ConversationsList({
  conversations,
  activeConversationId,
  onConversationSelect, // Use the new prop name
  onNewMessage, // Optional: callback for "New Message" button
  tabs, // Optional: custom tabs array
  activeTab, // Optional: active tab state
  onTabChange, // Optional: tab change handler
}) {
  return (
    // 1. Add conditional classes to hide this component on mobile when a chat is active.
    <div
      className={`w-full md:w-[360px] h-full border-r border-gray-200 bg-white flex-col flex-shrink-0 ${
        activeConversationId ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header Area */}
      <div className="p-4 space-y-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          {onNewMessage && (
            <button
              onClick={onNewMessage}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              New
            </button>
          )}
        </div>
        <FilterTabs 
          tabs={tabs || ["Groups", "Students", "Favorites", "Unread"]}
          activeTab={activeTab || "Groups"}
          onTabChange={onTabChange}
        />
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversation Items List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((convo) => (
          <ConversationItem
            key={convo.id}
            convo={convo}
            isActive={activeConversationId === convo.id}
            // 2. Call the correct handler function from the parent.
            onClick={() => onConversationSelect(convo.id)}
          />
        ))}
      </div>
    </div>
  );
}
