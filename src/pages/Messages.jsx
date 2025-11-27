import React, { useState } from "react";
import ConversationsList from "../components/messages/ConversationsList";
import ChatWindow from "../components/messages/ChatWindow";
import GroupInfoPanel from "../components/messages/GroupInfoPanel";

// The mockConversations data is correct and does not need changes.
const mockConversations = [
  // ... your existing mock data ...
  {
    id: 1,
    name: "Web Development",
    sender: "Mr. Aina Adewale",
    time: "10:30 AM",
    lastMessage: "Great work on the lab report",
    unreadCount: 3,
    isStarred: true,
    avatarUrl: "/book-icon.svg",
    currentUserInitial: "S",
    description:
      "Physics 101 class group for discussions, assignments, and collaborative learning.",
    members: [
      { id: 1, name: "Sarah Johnson", status: "online" },
      { id: 2, name: "Mike Chen", status: "away" },
      { id: 3, name: "Emily Davis", status: "offline" },
      { id: 4, name: "James Wilson", status: "online" },
    ],
    messages: [
      {
        id: 1,
        type: "text",
        text: "Good morning everyone!",
        time: "9:00 AM",
        isSender: false,
        sender: "Mr. Aina Adewale",
      },
      {
        id: 2,
        type: "text",
        text: "Good morning! Ready for this week's lessons",
        time: "9:05 AM",
        isSender: true,
      },
      {
        id: 3,
        type: "feedback",
        time: "10:00 AM",
        isSender: false,
        sender: "Mr. Aina Adewale",
        feedback: {
          strengths:
            "Most of you showed excellent understanding of the basics of web development.",
          improvements:
            "Some reports need more detailed analysis of the fundamentals.",
          suggestions:
            "For next time, try to include more comparative analysis with theoretical values.",
        },
      },
      {
        id: 4,
        type: "text",
        text: "Thank you for the detailed feedback",
        time: "10:15 AM",
        isSender: true,
      },
      {
        id: 5,
        type: "text",
        text: "Great work on the reports everyone!",
        time: "10:30 AM",
        isSender: false,
        sender: "Mr. Aina Adewale",
      },
      {
        id: 6,
        type: "audio",
        time: "10:40 AM",
        isSender: false,
        sender: "James Wilson",
        audio: { duration: "0:42" },
      },
      {
        id: 7,
        type: "image",
        time: "10:55 AM",
        isSender: true,
        images: [
          "/image-placeholder.png",
          "/image-placeholder.png",
          "/image-placeholder.png",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Data Structure",
    sender: "Mr. Aina Adewale",
    time: "Yesterday",
    lastMessage: "Don't forget the quiz on Friday",
    unreadCount: 0,
    isStarred: true,
    avatarUrl: "/book-icon.svg",
    currentUserInitial: "S",
    description: "Data Structure discussions and problem-solving.",
    members: [{ id: 1, name: "Alex Ray", status: "online" }],
    messages: [
      {
        id: 1,
        type: "text",
        text: "Don't forget the quiz on Friday",
        time: "Yesterday",
        isSender: false,
        sender: "Mr. Aina Adewale",
      },
    ],
  },
  {
    id: 3,
    name: "UX Research 101",
    sender: "Ms Emily Uyai",
    time: "2 days ago",
    lastMessage: "UX research guidelines attached",
    unreadCount: 0,
    isStarred: false,
    avatarUrl: "/book-icon.svg",
    currentUserInitial: "S",
    description: "All about UX research methodologies and practices.",
    members: [{ id: 1, name: "Jane Doe", status: "offline" }],
    messages: [
      {
        id: 1,
        type: "text",
        text: "UX research guidelines attached",
        time: "2 days ago",
        isSender: false,
        sender: "Ms Emily Uyai",
      },
    ],
  },
];

export default function Messages() {
  // 1. Start with no conversation selected to show the list first on mobile.
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  const activeConversation = mockConversations.find(
    (c) => c.id === activeConversationId
  );

  // 2. Create a handler function to manage conversation selection.
  const handleConversationSelect = (id) => {
    setActiveConversationId(id);
    setIsInfoPanelOpen(false); // Also close the info panel when switching chats.
  };

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      <ConversationsList
        conversations={mockConversations}
        activeConversationId={activeConversationId}
        // Pass the new handler instead of the raw state setter.
        onConversationSelect={handleConversationSelect}
      />
      <ChatWindow
        conversation={activeConversation}
        onHeaderClick={() => setIsInfoPanelOpen(true)}
        isPanelOpen={isInfoPanelOpen}
        // 3. Add the 'onBack' prop to allow navigation back to the list.
        onBack={() => setActiveConversationId(null)}
      />
      <GroupInfoPanel
        conversation={activeConversation}
        isOpen={isInfoPanelOpen}
        onClose={() => setIsInfoPanelOpen(false)}
      />
    </div>
  );
}
