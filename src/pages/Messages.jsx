import React, { useEffect, useMemo, useRef, useState } from "react";
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

const formatList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  return typeof value === "string" ? value : "";
};

const getTeacherSubtitle = (teacher = {}) => {
  const managed = formatList(
    teacher.managedCourses || teacher.courses || teacher.subjects
  );
  const classes = formatList(
    teacher.classes ||
      teacher.classLevels ||
      teacher.className ||
      teacher.department
  );
  const extras = teacher.specialization || teacher.role || teacher.subject;
  const parts = [managed, classes].filter(Boolean);
  if (parts.length === 0 && extras) {
    parts.push(extras);
  }
  return parts.join(" • ");
};

const normalizeMessages = (
  messages = [],
  teacherName = null,
  contacts = []
) => {
  // Get current user info to determine if message is from current student
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?.id || currentUser?.userId;
  const currentUserRole = currentUser?.role?.toUpperCase() || "STUDENT";
  const currentUserName = currentUser?.name || "Student";

  // Get teacher ID from contacts to help identify message sender
  const teacherContact = contacts.find((t) => t.name === teacherName);
  const teacherId = teacherContact?.id || teacherContact?.userId || null;

  return messages.map((message, index) => {
    const baseId =
      message.id ||
      message.messageId ||
      `${message.conversationId || "msg"}-${index}-${generateTempId(
        "message"
      )}`;
    const hasImages = Array.isArray(message.images || message.attachments);

    // Determine if message is from current student
    // Use same logic as teacher messages for consistency
    const senderRole = (message.senderRole || message.role || "").toUpperCase();
    const senderId =
      message.senderId ||
      message.sender?.id ||
      message.userId ||
      message.fromUserId;

    // Get teacher ID from conversation context to help identify message sender
    const teacherId = teacherName
      ? contacts.find((t) => t.name === teacherName)?.id ||
        contacts.find((t) => t.name === teacherName)?.userId
      : null;

    // Get receiverId to help determine message direction
    const receiverId = message.receiverId || message.toUserId || message.toId;

    // If senderRole is empty, infer it from senderId and receiverId:
    // - If senderId matches currentUserId, it's from student
    // - If senderId matches teacherId, it's from teacher
    // - If receiverId matches currentUserId, message is TO student (so FROM teacher)
    // - If receiverId matches teacherId, message is TO teacher (so FROM student)
    let inferredSenderRole = senderRole;
    if (!inferredSenderRole) {
      if (
        senderId &&
        currentUserId &&
        String(senderId) === String(currentUserId)
      ) {
        inferredSenderRole = "STUDENT";
      } else if (
        senderId &&
        teacherId &&
        String(senderId) === String(teacherId)
      ) {
        inferredSenderRole = "TEACHER";
      } else if (receiverId) {
        // Use receiverId as inverse indicator
        if (currentUserId && String(receiverId) === String(currentUserId)) {
          // Message is TO current user, so FROM teacher
          inferredSenderRole = "TEACHER";
        } else if (teacherId && String(receiverId) === String(teacherId)) {
          // Message is TO teacher, so FROM student
          inferredSenderRole = "STUDENT";
        }
      }
    }

    // Check if message is from current student
    // Use same logic as teacher: Priority: 1) Check role string, 2) Check senderId match
    let isFromCurrentStudent = false;

    // Priority 1: Explicit flags from backend
    if (typeof message.isSender === "boolean" && message.isSender) {
      isFromCurrentStudent = true;
    } else if (message.sentByCurrentUser === true) {
      isFromCurrentStudent = true;
    }
    // Priority 2: Check senderId match (most reliable) - if IDs match, it's from current student
    else if (
      senderId &&
      currentUserId &&
      String(senderId) === String(currentUserId)
    ) {
      // If senderId matches current user, it's from current student (unless role is explicitly TEACHER)
      if (inferredSenderRole !== "TEACHER") {
        isFromCurrentStudent = true;
      }
    }
    // Priority 3: Check inferred role and ID combination
    else if (
      inferredSenderRole === "STUDENT" &&
      senderId &&
      currentUserId &&
      String(senderId) === String(currentUserId)
    ) {
      isFromCurrentStudent = true;
    }
    // Priority 4: If senderId matches teacherId, it's definitely from teacher (not student)
    if (teacherId && senderId && String(senderId) === String(teacherId)) {
      isFromCurrentStudent = false;
    }
    // Priority 5: Use receiverId as inverse indicator (if available)
    // If receiverId matches currentUserId, message is TO student, so FROM teacher
    // If receiverId matches teacherId, message is TO teacher, so FROM student
    else if (receiverId) {
      if (currentUserId && String(receiverId) === String(currentUserId)) {
        // Message is TO current user (student), so FROM teacher
        isFromCurrentStudent = false;
      } else if (teacherId && String(receiverId) === String(teacherId)) {
        // Message is TO teacher, so FROM student
        isFromCurrentStudent = true;
      }
    }
    // Priority 6: Fallback heuristic - if senderId is 1 (seems to be a default/system ID)
    // and doesn't match currentUserId, assume it's from teacher by default
    // This handles the case where backend always returns senderId: 1 for all messages
    // Optimistic message matching will override this for student messages
    else if (
      senderId &&
      String(senderId) === "1" &&
      currentUserId &&
      String(currentUserId) !== "1"
    ) {
      // senderId is 1 (default) but currentUserId is not 1, so likely from teacher
      // BUT: optimistic message matching will override this if it's actually a student message
      isFromCurrentStudent = false;
    }
    // Priority 7: Check original senderRole (if provided)
    else if (
      senderRole === "STUDENT" &&
      senderId &&
      currentUserId &&
      String(senderId) === String(currentUserId)
    ) {
      isFromCurrentStudent = true;
    }

    // Get sender name - if from current student, ALWAYS use current user's name; otherwise use backend response
    let senderName;
    if (isFromCurrentStudent && currentUserName) {
      // Always use actual student name for student messages (prevents wrong initials)
      senderName = currentUserName;
    } else if (senderRole === "TEACHER" && teacherName) {
      // For teacher messages, use the teacher name from conversation context (prevents wrong initials like "J")
      senderName = teacherName;
    } else {
      // Use backend response for other cases
      senderName =
        message.senderName ||
        message.sender?.name ||
        message.sender ||
        (senderRole === "TEACHER" ? "Teacher" : "Student");
      // Ensure it's a string
      if (typeof senderName !== "string") {
        if (typeof senderName === "object" && senderName?.name) {
          senderName = senderName.name;
        } else {
          senderName = String(senderName || "User");
        }
      }
    }

    const normalized = {
      id: baseId,
      type:
        message.type ||
        (hasImages ? "image" : message.feedback ? "feedback" : "text"),
      text: message.text || message.content || "",
      time: formatRelativeTime(message.time || message.createdAt),
      isSender: isFromCurrentStudent,
      sender: senderName,
      feedback: message.feedback,
      audio: message.audio,
      images: message.images || message.attachments || [],
    };

    return normalized;
  });
};

const normalizeConversation = (conversation = {}) => {
  // Get current user to set correct initials
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const studentName = currentUser?.name || "Student";
  const studentInitials =
    studentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "S";

  const id =
    conversation.id ||
    conversation.conversationId ||
    generateTempId("conversation");
  return {
    id,
    name:
      conversation.name ||
      conversation.groupName ||
      conversation.title ||
      "Study Group",
    sender:
      conversation.sender ||
      conversation.lastSender ||
      conversation.teacherName ||
      conversation.createdBy ||
      "Instructor",
    time: formatRelativeTime(
      conversation.lastMessageAt ||
        conversation.updatedAt ||
        conversation.createdAt
    ),
    lastMessage:
      conversation.lastMessage?.text ||
      conversation.lastMessage ||
      conversation.preview ||
      "No messages yet",
    unreadCount: conversation.unreadCount ?? conversation.unread ?? 0,
    isStarred: Boolean(conversation.isStarred),
    avatarUrl: conversation.avatarUrl || "/book-icon.svg",
    currentUserInitial: studentInitials,
    description: conversation.description || "",
    members: conversation.members || [],
    subtitle:
      conversation.subtitle ||
      formatList(conversation.managedCourses) ||
      "",
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

  const [contacts, setContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [activeTab, setActiveTab] = useState("Groups");
  const [teachers, setTeachers] = useState([]);

  const lastMessageKeysRef = useRef({});

  const matchesId = (item, targetId) => {
    if (!item || !targetId) return false;
    const itemId = item.id ?? item.userId;
    if (!itemId) return false;
    const targetIdStr = String(targetId);
    const itemIdStr = String(itemId);
    return itemIdStr === targetIdStr;
  };

  const getMessageKey = (msg) => {
    if (!msg) return "";
    return (
      msg.id ||
      `${msg.sender || "user"}-${msg.text || ""}-${
        msg.createdAt || msg.time || msg.timestamp || ""
      }`
    );
  };

  const updateConversationMeta = (conversationId, updater) => {
    if (!conversationId || typeof updater !== "function") return;

    setConversations((prev) =>
      prev.map((conv) =>
        matchesId(conv, conversationId) ? updater(conv) : conv
      )
    );

    setTeachers((prev) =>
      prev.map((teacher) =>
        matchesId(teacher, conversationId) ? updater(teacher) : teacher
      )
    );
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setConversationError(null);

        // Load contacts (teachers for students)
        try {
          if (
            !messageService ||
            typeof messageService.getContacts !== "function"
          ) {
            console.warn("messageService.getContacts is not available");
            setContacts([]);
            setTeachers([]);
          } else {
            const contactsData = await messageService.getContacts();
            const contactsList = Array.isArray(contactsData)
              ? contactsData.filter((c) => c.role?.toUpperCase() === "TEACHER")
              : Array.isArray(contactsData?.teachers)
              ? contactsData.teachers
              : Array.isArray(contactsData?.data)
              ? contactsData.data.filter(
                  (c) => c.role?.toUpperCase() === "TEACHER"
                )
              : [];
            setContacts(contactsList);

            // Format teachers as conversation list for display (normalized)
            const formattedTeachers = contactsList.map((teacher) => {
              const subtitle = getTeacherSubtitle(teacher);
              return normalizeConversation({
                id: teacher.id || teacher.userId,
                userId: teacher.id || teacher.userId,
                name: teacher.name || "Teacher",
                email: teacher.email || "",
                lastMessage: "",
                unread: 0,
                time: formatRelativeTime(new Date()),
                isFavorite: false,
                avatarUrl: "/book-icon.svg",
                sender: teacher.name || "Teacher",
                subtitle,
                managedCourses: teacher.managedCourses,
                messages: [],
              });
            });
            setTeachers(formattedTeachers);
          }
        } catch (err) {
          // Silently handle 403/401 errors for contacts endpoint
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            console.log("Contacts endpoint not available or unauthorized");
          } else {
            console.error("Error loading contacts:", err);
          }
          setContacts([]);
          setTeachers([]);
        }

        // For students, conversations are derived from contacts (teachers)
        // The backend guide doesn't show a /student/messages/conversations endpoint
        // So we skip this and rely on teachers list and contacts
        setConversations([]);
        setConversationError(null);
      } catch (error) {
        // Only show error for critical failures
        console.error("Critical error loading messages:", error);
        setConversationError(
          "Unable to load messages. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleStartConversation = async (teacherId) => {
    try {
      // Find the teacher from contacts using consistent ID matching
      const teacher = contacts.find((t) => matchesId(t, teacherId));
      if (!teacher) {
        console.error("Teacher not found");
        return;
      }

      const actualTeacherId = teacher.id || teacher.userId || teacherId;

      // Create a conversation object for this teacher
      const teacherConversation = {
        id: actualTeacherId,
        userId: actualTeacherId,
        name: teacher.name || "Teacher",
        email: teacher.email || "",
        subtitle: getTeacherSubtitle(teacher),
        lastMessage: "",
        unread: 0,
        time: formatRelativeTime(new Date()),
        isFavorite: false,
    avatarUrl: "/book-icon.svg",
        sender: teacher.name || "Teacher",
        managedCourses: teacher.managedCourses,
        messages: [],
      };

      const normalizedConversation = normalizeConversation(teacherConversation);
      normalizedConversation.unreadCount = 0;

      // Add to conversations if not already present
      setConversations((prev) => {
        const exists = prev.find((c) => matchesId(c, actualTeacherId));
        if (!exists) {
          return [...prev, normalizedConversation];
        }
        return prev;
      });

      // Select the teacher conversation (use actual ID)
      setActiveConversationId(actualTeacherId);
      setShowContacts(false);

      // Fetch messages for this conversation (don't send a message, just load existing ones)
      try {
        await fetchMessages(actualTeacherId);
      } catch (fetchError) {
        // If fetch fails, still show the conversation (might be a new conversation)
        console.log("No existing messages found, starting new conversation");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      setMessageError("Failed to start conversation. Please try again.");
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeConversationId || !content.trim()) return;

    const messageContent = content.trim();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const studentName = currentUser?.name || "Student";
    const studentInitials =
      studentName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "S";

    const sentAt = new Date();
    const sentAtISO = sentAt.toISOString();

    // Optimistic update - add message immediately to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
        type: "text",
      text: messageContent,
      time: formatRelativeTime(sentAt),
      createdAt: sentAtISO,
        isSender: true,
      sender: studentName,
      feedback: null,
      audio: null,
      images: [],
    };

    setMessagesCache((prev) => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] || []),
        optimisticMessage,
      ],
    }));

    updateConversationMeta(activeConversationId, (conv) => {
      if (!conv) return conv;
      return {
        ...conv,
        lastMessage: messageContent,
        time: formatRelativeTime(sentAt),
    unreadCount: 0,
      };
    });

    lastMessageKeysRef.current[activeConversationId] =
      getMessageKey(optimisticMessage);

    try {
      // Send message using correct payload format
      const response = await messageService.sendMessage({
        receiverId: activeConversationId,
        content: messageContent,
      });

      // Refresh messages to get server response (removes optimistic message, adds real one)
      // This ensures message is confirmed and any new messages from teacher are fetched
      await fetchMessages(activeConversationId, true);
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", error?.response?.data || error?.message);

      // Remove optimistic message on error
      setMessagesCache((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).filter(
          (msg) => msg.id !== optimisticMessage.id
        ),
      }));

      setMessageError("Failed to send message. Please try again.");
      // Clear error after 3 seconds
      setTimeout(() => setMessageError(null), 3000);
    }
  };

  const handleConversationSelect = async (id) => {
    setIsInfoPanelOpen(false);

    // Update conversations in a single state update to ensure consistency
    setConversations((prev) => {
      // Check if conversation already exists
      const existing = prev.find((c) => matchesId(c, id));

      // If selecting a teacher from Teachers tab and conversation doesn't exist, create it
      if (activeTab === "Teachers" && !existing) {
        const teacher = contacts.find((t) => matchesId(t, id));
        if (teacher) {
          const teacherId = teacher.id || teacher.userId || id;
          const teacherConversation = {
            id: teacherId,
            userId: teacherId,
            name: teacher.name || "Teacher",
            email: teacher.email || "",
            lastMessage: "",
            unread: 0,
            time: formatRelativeTime(new Date()),
            isFavorite: false,
    avatarUrl: "/book-icon.svg",
            sender: teacher.name || "Teacher",
            messages: [],
          };

          const normalizedConv = normalizeConversation(teacherConversation);
          normalizedConv.unreadCount = 0;
          // Add new conversation and mark as read
          return [...prev, normalizedConv];
        }
      }

      // Mark existing conversation as read
      if (existing) {
        return prev.map((conv) =>
          matchesId(conv, id) ? { ...conv, unreadCount: 0 } : conv
        );
      }

      return prev;
    });

    // Set active conversation - activeConversation useMemo will handle finding it
    setActiveConversationId(id);

    // Clear unread count for both conversations and teachers lists
    updateConversationMeta(id, (conv) => {
      if (!conv) return conv;
      return { ...conv, unreadCount: 0 };
    });

    // Fetch messages if not cached
    if (!messagesCache[id]) {
      try {
        await fetchMessages(id);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Don't show error for new conversations
      }
    }
  };

  const fetchMessages = async (conversationId, forceRefresh = false) => {
    try {
      // Skip if already loaded and not forcing refresh (for initial load optimization)
      if (!forceRefresh && messagesCache[conversationId]) {
        return; // Already loaded, skip fetch
      }

      setIsFetchingMessages(true);
      setMessageError(null);

      // For student conversations with teachers, use getChatHistory
      // Check if this is a teacher conversation (from contacts)
      const isTeacherConversation = contacts.some((t) =>
        matchesId(t, conversationId)
      );

      // Get teacher name from contacts for proper teacher message display
      const teacherContact = contacts.find((t) => matchesId(t, conversationId));
      const teacherName = teacherContact?.name || "Teacher";
      const studentProfile = JSON.parse(localStorage.getItem("user") || "{}");
      const studentName = studentProfile?.name || "Student";
      const previousMessages = messagesCache[conversationId] || [];
      const previousKeys = new Set(
        previousMessages.map((msg) => getMessageKey(msg)).filter(Boolean)
      );

      let messageList = [];
      if (isTeacherConversation) {
        // Use getChatHistory for teacher conversations
        messageList = await messageService.getChatHistory(
          conversationId,
          "student"
        );
      } else {
        // Use legacy getMessages for group conversations
        const response = await messageService.getMessages(
          conversationId,
          1,
          50,
          "student"
        );
        messageList = Array.isArray(response?.messages)
          ? response.messages
          : Array.isArray(response)
          ? response
          : response?.data || [];
      }

      // Normalize messages with current user context and teacher name
      const normalizedMessages = normalizeMessages(
        messageList,
        teacherName,
        contacts
      );

      let newIncomingMessages = 0;
      normalizedMessages.forEach((msg) => {
        const key = getMessageKey(msg);
        const isKnown = key && previousKeys.has(key);
        if (key && !isKnown) {
          previousKeys.add(key);
        }
        if (!isKnown && !msg.isSender) {
          newIncomingMessages += 1;
        }
      });

      // Merge with existing optimistic messages (don't replace them)
      setMessagesCache((prev) => {
        const existing = prev[conversationId] || [];
        // Filter optimistic messages - ensure id is a string before checking startsWith
        const existingOptimistic = existing.filter((m) => {
          const msgId = m?.id;
          return (
            msgId && typeof msgId === "string" && msgId.startsWith("temp-")
          );
        });
        const serverMessages = normalizedMessages;

        // Combine: keep optimistic messages, add/update server messages
        const combined = [...existingOptimistic];
        serverMessages.forEach((serverMsg) => {
          // Replace optimistic message with same content if found
          const optimisticIndex = combined.findIndex((m) => {
            const msgId = m?.id;
            const isOptimistic =
              msgId && typeof msgId === "string" && msgId.startsWith("temp-");
            if (!isOptimistic) return false;

            // Check if content and time match (within 10 seconds)
            const timeDiff = Math.abs(
              new Date(m.time || 0).getTime() -
                new Date(serverMsg.time || 0).getTime()
            );
            return m.text === serverMsg.text && timeDiff < 10000;
          });

          if (optimisticIndex >= 0) {
            // Replace optimistic with server version, but ALWAYS preserve isSender=true from optimistic
            // This ensures student messages stay on the right even after server confirmation
            const optimisticMsg = combined[optimisticIndex];
            // Always preserve isSender from optimistic (it's our own message we just sent)
            // Also ensure sender name is correct
            combined[optimisticIndex] = {
              ...serverMsg,
              isSender: true,
              sender: studentName,
            };
          } else {
            // Add new server message if not already in list
            const exists = combined.some((m) => {
              const msgId = m?.id;
              const serverId = serverMsg?.id;
              if (msgId && serverId && msgId === serverId) return true;

              // Check by content and time (within 5 seconds)
              const timeDiff = Math.abs(
                new Date(m.time || 0).getTime() -
                  new Date(serverMsg.time || 0).getTime()
              );
              return m.text === serverMsg.text && timeDiff < 5000;
            });

            if (!exists) {
              combined.push(serverMsg);
            }
          }
        });

        // Sort by time
        combined.sort((a, b) => {
          const timeA = new Date(a.time || a.createdAt || 0).getTime();
          const timeB = new Date(b.time || b.createdAt || 0).getTime();
          return timeA - timeB;
        });

        return {
          ...prev,
          [conversationId]: combined,
        };
      });

      if (normalizedMessages.length > 0) {
        const lastNormalized =
          normalizedMessages[normalizedMessages.length - 1];
        const lastMessageText = lastNormalized?.text || "";
        const lastMessageTime =
          lastNormalized?.time ||
          formatRelativeTime(lastNormalized?.createdAt || new Date());
        const isActiveConversation = activeConversationId === conversationId;

        updateConversationMeta(conversationId, (conv) => {
          if (!conv) return conv;
          const baseUnread = conv.unreadCount || 0;
          const updatedUnread = isActiveConversation
            ? 0
            : baseUnread + newIncomingMessages;
          return {
            ...conv,
            lastMessage: lastMessageText || conv.lastMessage || "",
            time: lastMessageTime || conv.time || "",
            unreadCount: updatedUnread,
          };
        });

        const lastRawMessage =
          Array.isArray(messageList) && messageList.length
            ? messageList[messageList.length - 1]
            : null;
        if (lastRawMessage) {
          const previewKey = getMessageKey({
            id: lastRawMessage.id || lastRawMessage.messageId,
            sender:
              lastNormalized?.sender ||
              lastNormalized?.senderName ||
              lastRawMessage.senderName ||
              lastRawMessage.sender ||
              "User",
            text: lastMessageText,
            createdAt:
              lastRawMessage.createdAt ||
              lastRawMessage.timestamp ||
              lastRawMessage.time,
          });
          if (previewKey) {
            lastMessageKeysRef.current[conversationId] = previewKey;
          }
        }
      }
    } catch (error) {
      // Only show error for non-polling requests
      if (!forceRefresh) {
        setMessageError(
          error?.message || "Unable to load messages for this chat."
        );
      }
    } finally {
      setIsFetchingMessages(false);
    }
  };

  // Ensure conversation is added to conversations list when activeConversationId changes
  useEffect(() => {
    if (!activeConversationId || activeTab !== "Teachers") return;

    // Check if conversation already exists
    const exists = conversations.find((c) =>
      matchesId(c, activeConversationId)
    );
    if (exists) return;

    // Find teacher from contacts
    const teacher = contacts.find((t) => matchesId(t, activeConversationId));
    if (teacher) {
      const teacherId = teacher.id || teacher.userId || activeConversationId;
      const teacherConversation = {
        id: teacherId,
        userId: teacherId,
        name: teacher.name || "Teacher",
        email: teacher.email || "",
        lastMessage: "",
        unread: 0,
        time: formatRelativeTime(new Date()),
        isFavorite: false,
    avatarUrl: "/book-icon.svg",
        sender: teacher.name || "Teacher",
        messages: [],
      };

      const normalizedConv = normalizeConversation(teacherConversation);
      normalizedConv.unreadCount = 0;

      setConversations((prev) => {
        if (!prev.find((c) => matchesId(c, activeConversationId))) {
          return [...prev, normalizedConv];
        }
        return prev;
      });
    }
  }, [activeConversationId, activeTab, contacts, conversations]);

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;

    // First check conversations list (most reliable source)
    let baseConversation = conversations.find((conversation) =>
      matchesId(conversation, activeConversationId)
    );

    // If not found in conversations, check teachers list (for Teachers tab)
    if (!baseConversation && activeTab === "Teachers") {
      baseConversation = teachers.find((teacher) =>
        matchesId(teacher, activeConversationId)
      );
    }

    // If still not found, create from contacts (fallback - ensures conversation always exists)
    if (!baseConversation) {
      const teacher = contacts.find((t) => matchesId(t, activeConversationId));
      if (teacher) {
        const teacherId = teacher.id || teacher.userId || activeConversationId;
        baseConversation = normalizeConversation({
          id: teacherId,
          userId: teacherId,
          name: teacher.name || "Teacher",
          email: teacher.email || "",
          subtitle: getTeacherSubtitle(teacher),
          lastMessage: "",
          unread: 0,
          time: formatRelativeTime(new Date()),
          isFavorite: false,
          avatarUrl: "/book-icon.svg",
          sender: teacher.name || "Teacher",
          managedCourses: teacher.managedCourses,
          messages: [],
        });
      }
    }

    // Always return a conversation if activeConversationId is set (prevents blank screen)
    if (!baseConversation) {
      // Last resort: create minimal conversation object
      baseConversation = normalizeConversation({
        id: activeConversationId,
        userId: activeConversationId,
        name: "Teacher",
        email: "",
        subtitle: "",
        lastMessage: "",
        unread: 0,
        time: formatRelativeTime(new Date()),
        isFavorite: false,
        avatarUrl: "/book-icon.svg",
        sender: "Teacher",
        messages: [],
      });
    }

    const messages =
      messagesCache[activeConversationId] || baseConversation.messages || [];
    return {
      ...baseConversation,
      messages,
    };
  }, [
    activeConversationId,
    conversations,
    messagesCache,
    contacts,
    teachers,
    activeTab,
  ]);

  // Filter conversations based on active tab
  const getFilteredConversations = () => {
    switch (activeTab) {
      case "Groups":
        return conversations.filter(
          (c) => c.members?.length > 0 || c.description
        );
      case "Teachers":
        return teachers;
      case "Favorites":
        return conversations.filter((c) => c.isStarred);
      case "Unread":
        return conversations.filter((c) => (c.unreadCount || 0) > 0);
      default:
        return conversations;
    }
  };

  const conversationsToRender = getFilteredConversations();

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      <ConversationsList
        conversations={conversationsToRender}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onNewMessage={() => setShowContacts(!showContacts)}
        tabs={["Groups", "Teachers", "Favorites", "Unread"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {showContacts && contacts.length > 0 && (
        <div className="absolute inset-0 bg-white z-50 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Select a Teacher</h3>
            <button
              onClick={() => setShowContacts(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="space-y-2">
            {contacts.map((teacher) => (
              <button
                key={teacher.id || teacher.userId}
                onClick={() =>
                  handleStartConversation(teacher.id || teacher.userId)
                }
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center">
                  {(teacher.name || "T")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{teacher.name || "Teacher"}</p>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                  {getTeacherSubtitle(teacher) && (
                    <p className="text-xs text-gray-400">
                      {getTeacherSubtitle(teacher)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {conversationError && (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 text-red-600">
          {conversationError}
        </div>
      )}
      {activeConversation ? (
        <>
      <ChatWindow
        conversation={activeConversation}
        onHeaderClick={() => setIsInfoPanelOpen(true)}
        isPanelOpen={isInfoPanelOpen}
        // the 'onBack' prop to allow navigation back to the list.
        onBack={() => setActiveConversationId(null)}
            onSendMessage={handleSendMessage}
      />
      <GroupInfoPanel
        conversation={activeConversation}
        isOpen={isInfoPanelOpen}
        onClose={() => setIsInfoPanelOpen(false)}
      />
        </>
      ) : activeConversationId ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading conversation...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            Select a conversation to start chatting
          </p>
        </div>
      )}
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
