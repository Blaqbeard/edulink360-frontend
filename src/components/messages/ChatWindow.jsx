import React from "react";

import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  ArrowLeft,
  Play,
  Lightbulb,
  ArrowRight,
  Check,
} from "lucide-react";

const TextMessage = ({ msg, conversation }) => {
  // Ensure sender is always a string
  const senderName = typeof msg.sender === 'string' 
    ? msg.sender 
    : (typeof msg.sender === 'object' && msg.sender?.name) 
      ? msg.sender.name 
      : String(msg.sender || "User");
  const senderInitial = senderName.charAt(0) || "U";
  
  return (
  <div
    className={`flex items-end gap-2 ${
      msg.isSender ? "justify-end" : "justify-start"
    }`}
  >
    {!msg.isSender && (
      <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-sm">
        {senderInitial}
      </div>
    )}
    <div className="max-w-md">
      {!msg.isSender && (
        <p className="text-sm font-medium text-gray-700 mb-1">{senderName}</p>
      )}
      <div
        className={`px-4 py-2 rounded-2xl ${
          msg.isSender
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{msg.text}</p>
      </div>
      <p
        className={`text-xs mt-1 ${
          msg.isSender ? "text-right" : "text-left"
        } text-gray-400`}
      >
        {msg.time}
      </p>
    </div>
    {msg.isSender && (
      <div className="h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold text-xs">
        {conversation.currentUserInitial}
      </div>
    )}
  </div>
  );
};

// Special feedback message card
const FeedbackMessage = ({ msg }) => {
  const senderName = typeof msg.sender === 'string' 
    ? msg.sender 
    : (typeof msg.sender === 'object' && msg.sender?.name) 
      ? msg.sender.name 
      : String(msg.sender || "User");
  const senderInitial = senderName.charAt(0) || "U";
  
  return (
  <div className="flex items-end gap-2">
    <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-sm">
      {senderInitial}
    </div>
    <div className="max-w-md w-full">
      <p className="text-sm font-medium text-gray-700 mb-1">{senderName}</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
        <p className="font-semibold text-yellow-800">Feedback</p>
        <div>
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <Check size={16} /> Strengths
          </div>
          <p className="text-sm text-gray-700 pl-6">{msg.feedback.strengths}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-orange-600 font-semibold">
            <ArrowRight size={16} /> Improvements
          </div>
          <p className="text-sm text-gray-700 pl-6">
            {msg.feedback.improvements}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <Lightbulb size={16} /> Suggestions
          </div>
          <p className="text-sm text-gray-700 pl-6">
            {msg.feedback.suggestions}
          </p>
        </div>
      </div>
      <p className="text-xs mt-1 text-left text-gray-400">{msg.time}</p>
    </div>
  </div>
  );
};

// Audio message bubble
const AudioMessage = ({ msg }) => {
  const senderName = typeof msg.sender === 'string' 
    ? msg.sender 
    : (typeof msg.sender === 'object' && msg.sender?.name) 
      ? msg.sender.name 
      : String(msg.sender || "User");
  const senderInitial = senderName.charAt(0) || "U";
  
  return (
  <div className="flex items-end gap-2">
    <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
      {senderInitial}
    </div>
    <div className="max-w-md">
      <p className="text-sm font-medium text-gray-700 mb-1">{senderName}</p>
      <div className="bg-gray-100 rounded-full flex items-center px-4 py-2 space-x-3">
        <button className="text-gray-600">
          <Play size={20} />
        </button>
        <div
          className="w-40 h-6 bg-contain bg-no-repeat"
          style={{ backgroundImage: "url('/path/to/waveform.svg')" }}
        ></div>
        <span className="text-sm text-gray-500">{msg.audio.duration}</span>
      </div>
      <p className="text-xs mt-1 text-left text-gray-400">{msg.time}</p>
    </div>
  </div>
  );
};

// Image grid message
const ImageMessage = ({ msg, conversation }) => (
  <div className="flex items-end gap-2 justify-end">
    <div className="max-w-md">
      <div className="grid grid-cols-3 gap-1">
        {msg.images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`attachment ${index + 1}`}
            className="rounded-md aspect-square object-cover"
          />
        ))}
      </div>
      <p className="text-xs mt-1 text-right text-gray-400">{msg.time}</p>
    </div>
    <div className="h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-xs">
      {conversation.currentUserInitial}
    </div>
  </div>
);

// --- Main ChatWindow Component ---

export default function ChatWindow({
  conversation,
  onHeaderClick,
  isPanelOpen,
  onBack, // 2. Accept the new 'onBack' prop
  onSendMessage, // Accept onSendMessage prop
}) {
  const [messageInput, setMessageInput] = React.useState("");

  const handleSend = (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !onSendMessage) return;
    onSendMessage(messageInput.trim());
    setMessageInput("");
  };
  // If no conversation is selected, show a placeholder on desktop and nothing on mobile.
  if (!conversation) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  const renderMessage = (msg) => {
    switch (msg.type) {
      case "feedback":
        return <FeedbackMessage key={msg.id} msg={msg} />;
      case "audio":
        return <AudioMessage key={msg.id} msg={msg} />;
      case "image":
        return (
          <ImageMessage key={msg.id} msg={msg} conversation={conversation} />
        );
      default:
        return (
          <TextMessage key={msg.id} msg={msg} conversation={conversation} />
        );
    }
  };

  return (
    <div
      className={`flex-1 flex-col h-full bg-white ${
        isPanelOpen ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 w-full">
        <div className="flex items-center space-x-3">
          {/* 4. BACK ARROW FOR MOBILE */}
          <button onClick={onBack} className="md:hidden text-gray-600 mr-2">
            <ArrowLeft size={24} />
          </button>

          {/* The rest of the header is a button to open the info panel */}
          <button
            onClick={onHeaderClick}
            className="flex items-center space-x-3 text-left"
          >
            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-purple-100">
              <img src={conversation.avatarUrl} alt="" className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900">
                {conversation.name}
              </p>
              <p className="text-sm text-gray-500">
                {conversation.subtitle || conversation.sender}
              </p>
            </div>
          </button>
        </div>

        {/* Header Icons */}
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100">
            <Phone size={20} />
          </div>
          <div className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100">
            <Video size={20} />
          </div>
          <div className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100">
            <MoreVertical size={20} />
          </div>
        </div>
      </div>

      {/* Messages Area (unchanged) */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-8">
          {conversation.messages.map(renderMessage)}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSend}
          className="flex items-center space-x-4 bg-gray-100 rounded-lg px-4 py-2"
        >
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Handle file attachment
            }}
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Send message or feedback..."
            className="flex-1 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
