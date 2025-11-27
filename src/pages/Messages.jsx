import React, { useEffect, useMemo, useState } from "react";
import ConversationsList from "../components/messages/ConversationsList";
import ChatWindow from "../components/messages/ChatWindow";
import GroupInfoPanel from "../components/messages/GroupInfoPanel";
import { messageService } from "../services/messageService";

const generateTempId = (prefix = "item") =>
  `${prefix}-${Math.random().toString(36).slice(2, 11)}`;

const formatRelativeTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
};

const normalizeMessages = (messages = []) =>
  messages.map((message, index) => {
    const baseId =
      message.id ||
      message.messageId ||
      `${message.conversationId || "msg"}-${index}-${generateTempId("message")}`;
    const hasImages = Array.isArray(message.images || message.attachments);
    return {
      id: baseId,
      type: message.type || (hasImages ? "image" : message.feedback ? "feedback" : "text"),
      text: message.text || message.content || "",
      time: formatRelativeTime(message.time || message.createdAt),
      isSender:
        typeof message.isSender === "boolean"
          ? message.isSender
          : message.senderRole
          ? message.senderRole.toLowerCase() === "student"
          : Boolean(message.sentByCurrentUser),
      sender: message.senderName || message.sender || "Teacher",
      feedback: message.feedback,
      audio: message.audio,
      images: message.images || message.attachments || [],
    };
  });

const normalizeConversation = (conversation = {}) => {
  const id = conversation.id || conversation.conversationId || generateTempId("conversation");
  return {
    id,
    name:
      conversation.name ||
      conversation.groupName ||
      conversation.title ||
      "Study Group",
    sender:
      conversation.lastSender ||
      conversation.teacherName ||
      conversation.createdBy ||
      "Instructor",
    time: formatRelativeTime(
      conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt
    ),
    lastMessage:
      conversation.lastMessage?.text ||
      conversation.lastMessage ||
      conversation.preview ||
      "No messages yet",
    unreadCount: conversation.unreadCount ?? conversation.unread ?? 0,
    isStarred: Boolean(conversation.isStarred),
    avatarUrl: conversation.avatarUrl || "/book-icon.svg",
    currentUserInitial: "S",
    description: conversation.description || "",
    members: conversation.members || [],
    messages: normalizeMessages(conversation.messages || []),
  };
};

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [messagesCache, setMessagesCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [conversationError, setConversationError] = useState(null);
  const [messageError, setMessageError] = useState(null);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setConversationError(null);
        const response = await messageService.getConversations("all", "student");
        const list = Array.isArray(response?.conversations)
          ? response.conversations
          : Array.isArray(response)
          ? response
          : response?.data || [];
        const normalized = list.map(normalizeConversation);
        setConversations(normalized);
        setActiveConversationId((prev) => prev ?? normalized[0]?.id ?? null);
      } catch (error) {
        setConversationError(error?.message || "Unable to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleConversationSelect = async (id) => {
    setActiveConversationId(id);
    setIsInfoPanelOpen(false);
    if (!messagesCache[id]) {
      await fetchMessages(id);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setIsFetchingMessages(true);
      setMessageError(null);
      const response = await messageService.getMessages(
        conversationId,
        1,
        50,
        "student"
      );
      const list = Array.isArray(response?.messages)
        ? response.messages
        : Array.isArray(response)
        ? response
        : response?.data || [];
      setMessagesCache((prev) => ({
        ...prev,
        [conversationId]: normalizeMessages(list),
      }));
    } catch (error) {
      setMessageError(error?.message || "Unable to load messages for this chat.");
    } finally {
      setIsFetchingMessages(false);
    }
  };

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    const baseConversation = conversations.find(
      (conversation) => conversation.id === activeConversationId
    );
    if (!baseConversation) return null;
    const messages =
      messagesCache[activeConversationId] || baseConversation.messages || [];
    return {
      ...baseConversation,
      messages,
    };
  }, [activeConversationId, conversations, messagesCache]);

  const conversationsToRender = conversations.length
    ? conversations
    : [];

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      <ConversationsList
        conversations={conversationsToRender}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
      />
      {conversationError && (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 text-red-600">
          {conversationError}
        </div>
      )}
      <ChatWindow
        conversation={activeConversation}
        onHeaderClick={() => setIsInfoPanelOpen(true)}
        isPanelOpen={isInfoPanelOpen}
        // the 'onBack' prop to allow navigation back to the list.
        onBack={() => setActiveConversationId(null)}
      />
      <GroupInfoPanel
        conversation={activeConversation}
        isOpen={isInfoPanelOpen}
        onClose={() => setIsInfoPanelOpen(false)}
      />
      {(loading || isFetchingMessages) && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {loading ? "Loading conversations..." : "Fetching messages..."}
            </p>
          </div>
        </div>
      )}
      {messageError && (
        <div className="absolute bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow">
          {messageError}
        </div>
      )}
    </div>
  );
}
