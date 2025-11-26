import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { messageService } from "../services/messageService";

function TeacherMessages() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const [activeTab, setActiveTab] = useState("groups");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [detailsTab, setDetailsTab] = useState("overview");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  
  // API state
  const [groups, setGroups] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [students, setStudents] = useState([]);
  const [unreadConversations, setUnreadConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [conversationDetails, setConversationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch conversations based on active tab
  useEffect(() => {
    fetchConversations();
  }, [activeTab]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      fetchConversationDetails(selectedConversation);
      markConversationAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const type = activeTab === "groups" ? "groups" : activeTab === "favorites" ? "favorites" : activeTab === "students" ? "students" : "unread";
      const response = await messageService.getConversations(type);
      
      if (type === "groups") {
        setGroups(response.data?.groups || []);
      } else if (type === "favorites") {
        setFavorites(response.data?.favorites || []);
      } else if (type === "students") {
        setStudents(response.data?.students || []);
      } else {
        setUnreadConversations(response.data?.unread || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // Keep sample data as fallback for MVP
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      if (messages[conversationId]) return; // Already loaded
      const response = await messageService.getMessages(conversationId);
      setMessages(prev => ({
        ...prev,
        [conversationId]: response.data?.messages?.map(msg => ({
          ...msg,
          time: formatTime(msg.createdAt),
        })) || []
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchConversationDetails = async (conversationId) => {
    try {
      const response = await messageService.getConversationDetails(conversationId);
      setConversationDetails(response.data);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const markConversationAsRead = async (conversationId) => {
    try {
      await messageService.markAsRead(conversationId);
      // Update local state to remove unread badge
      setGroups(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ));
      setFavorites(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ));
      setStudents(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ));
      setUnreadConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    try {
      setSendingMessage(true);
      await messageService.sendMessage(selectedConversation, {
        text: newMessage,
        type: "text"
      });
      
      // Refresh messages
      await fetchMessages(selectedConversation);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  // Sample data - fallback for MVP when API is not available
  const sampleGroups = [
    {
      id: "web-development",
      title: "Web Development",
      teacher: "Mr. Aina Adewale",
      lastMessage: "Great work on the lab report",
      unread: 3,
      time: "10:30 AM",
      isFavorite: true,
      isActive: true,
    },
    {
      id: "data-structure",
      title: "Data Structure",
      teacher: "Mr. Aina Adewale",
      lastMessage: "Don't forget the quiz on Friday",
      unread: 0,
      time: "Yesterday",
      isFavorite: true,
      isActive: false,
    },
    {
      id: "ux-research",
      title: "UX Research 101",
      teacher: "Ms Emily Uyai",
      lastMessage: "UX research guidelines attached",
      unread: 0,
      time: "2 days ago",
      isFavorite: false,
      isActive: false,
    },
  ];

  const sampleFavorites = [
    {
      id: "web-development",
      title: "Web Development",
      teacher: "Physics Teacher",
      lastMessage: "Great Work on the lab report",
      unread: 3,
      time: "10:30 AM",
      isFavorite: true,
    },
    {
      id: "advanced-physics-study",
      title: "Advanced Physics Study",
      teacher: "Physics Teacher",
      lastMessage: "Don't forget the quiz on Friday",
      unread: 0,
      time: "Yesterday",
      isFavorite: true,
    },
  ];

  const sampleStudents = [
    {
      id: "ada-okafor",
      name: "Ada Okafor",
      subject: "Web Development",
      lastMessage: "Thank you for the feedback",
      unread: 1,
      time: "9:15 AM",
      isFavorite: false,
    },
    {
      id: "mike-chen",
      name: "Mike Chen",
      subject: "Data Structure",
      lastMessage: "Can I submit my assignment by",
      unread: 1,
      time: "Yesterday",
      isFavorite: false,
    },
    {
      id: "emily-davis",
      name: "Emily Davis",
      subject: "Grade 11 - Physics",
      lastMessage: "I have a question about Newton's",
      unread: 0,
      time: "2 days ago",
      isFavorite: false,
    },
  ];

  const sampleUnreadConversations = [
    {
      id: "ada-okafor",
      name: "Ada Okafor",
      subject: "Web Development",
      lastMessage: "Thank you for the feedback sir",
      unread: 1,
      time: "9:15 AM",
      isFavorite: false,
    },
    {
      id: "mike-chen",
      name: "Mike Chen",
      subject: "Web Development",
      lastMessage: "Can I submit my assignment by",
      unread: 1,
      time: "Yesterday",
      isFavorite: false,
    },
    {
      id: "physics-101-section",
      title: "Physics 101 - Section",
      teacher: "Electricity",
      lastMessage: "Great work on the lab report",
      unread: 2,
      time: "2 days ago",
      isFavorite: false,
    },
  ];

  const groupMessages = [
    {
      id: 1,
      sender: "teacher",
      text: "Good morning everyone!",
      time: "9:00 AM",
    },
    {
      id: 2,
      sender: "student",
      text: "Good morning! Ready for this week's lessons.",
      time: "9:05 AM",
    },
    {
      id: 3,
      sender: "teacher",
      type: "feedback",
      time: "10:00 AM",
      feedback: {
        strengths: [
          "Most of you showed excellent understanding of the basics of web development.",
        ],
        improvements: [
          "Some reports need more detailed analysis of the fundamentals.",
        ],
        suggestions: [
          "For next time, try to include more comparative analysis with theoretical values.",
        ],
      },
    },
    {
      id: 4,
      sender: "student",
      text: "Thank you for the detailed feedback",
      time: "10:15 AM",
    },
    {
      id: 5,
      sender: "teacher",
      text: "Great work on the reports everyone!",
      time: "10:30 AM",
    },
    {
      id: 6,
      sender: "student",
      type: "audio",
      duration: "0:42",
      time: "10:40 AM",
      senderInitial: "J",
    },
    {
      id: 7,
      sender: "student",
      text: "Here are the pictures",
      time: "10:55 AM",
      attachments: 3,
    },
  ];

  // Student/Unread threads share the same structure but you can edit this data block
  // to update their copy without touching the layout logic.
  const studentMessages = [
    {
      id: 1,
      sender: "teacher",
      text: "Ada, I reviewed your write-up and loved the introduction.",
      time: "9:00 AM",
    },
    {
      id: 2,
      sender: "student",
      text: "Thank you sir! I made sure to follow your outline closely.",
      time: "9:06 AM",
    },
    {
      id: 3,
      sender: "teacher",
      type: "feedback",
      time: "9:45 AM",
      feedback: {
        strengths: [
          "You presented the research findings clearly with solid references.",
        ],
        improvements: [
          "Add more context around the methodology you adopted for the tests.",
        ],
        suggestions: [
          "Consider attaching a short summary slide so classmates can skim quickly.",
        ],
      },
    },
    {
      id: 4,
      sender: "student",
      text: "Got it. I will expand the methodology section right away.",
      time: "9:55 AM",
    },
    {
      id: 5,
      sender: "teacher",
      text: "Great. Feel free to reach out if you need another review.",
      time: "10:05 AM",
    },
    {
      id: 6,
      sender: "student",
      type: "audio",
      duration: "0:38",
      time: "10:12 AM",
      senderInitial: "J",
    },
    {
      id: 7,
      sender: "student",
      text: "Sharing the updated screenshots now.",
      time: "10:30 AM",
      attachments: 3,
    },
  ];

  // Get current conversation list based on active tab - use API data only
  const getCurrentConversations = () => {
    if (activeTab === "groups") return groups;
    if (activeTab === "favorites") return favorites;
    if (activeTab === "students") return students;
    return unreadConversations;
  };

  // Get messages for selected conversation
  const getCurrentMessages = () => {
    if (!selectedConversation) return [];
    return messages[selectedConversation] || messagesByConversation[selectedConversation] || [];
  };

  // Get selected conversation object
  const selectedConv = selectedConversation 
    ? getCurrentConversations().find(conv => conv.id === selectedConversation)
    : null;
  
  const isSelectedGroup = selectedConv ? selectedConv.hasOwnProperty("title") : false;
  const activeMessages = getCurrentMessages();

  const messagesByConversation = {
    "web-development": groupMessages,
    "data-structure": groupMessages,
    "ux-research": groupMessages,
    "advanced-physics-study": groupMessages,
    "ada-okafor": studentMessages,
    "mike-chen": studentMessages,
    "emily-davis": studentMessages,
    "physics-101-section": studentMessages,
  };

  const members = [
    {
      id: 1,
      name: "Ada Okafor",
      initial: "AO",
      displayInitial: "S",
      status: "online",
    },
    {
      id: 2,
      name: "Mike Chen",
      initial: "MC",
      displayInitial: "M",
      status: "away",
    },
    {
      id: 3,
      name: "Emily Davis",
      initial: "ED",
      displayInitial: "E",
      status: "offline",
    },
    {
      id: 4,
      name: "James Wilson",
      initial: "JW",
      displayInitial: "J",
      status: "online",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  // Filter conversations based on active tab
  const getFilteredConversations = () => {
    switch (activeTab) {
      case "groups":
        return groups;
      case "students":
        return students;
      case "favorites":
        return favorites;
      case "unread":
        return unreadConversations;
      default:
        return groups;
    }
  };

  const conversations = getFilteredConversations();

  // Auto-select first conversation when switching tabs if current selection is not in filtered list
  useEffect(() => {
    const filtered = getFilteredConversations();
    const currentSelected = filtered.find(
      (conv) => conv.id === selectedConversation
    );
    if (!currentSelected && filtered.length > 0) {
      setSelectedConversation(filtered[0].id);
    } else if (
      filtered.length === 0 &&
      (activeTab === "favorites" || activeTab === "unread")
    ) {
      // If no conversations in filtered list for favorites/unread, clear selection
      setSelectedConversation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#0b1633] text-white rounded-lg flex items-center justify-center hover:bg-[#1A2332] transition-colors"
      >
        <i className="bi bi-list text-xl"></i>
      </button>

      {/* Left Sidebar - Fixed */}
      <div
        className={`fixed left-0 top-0 w-20 bg-[#0b1633] flex flex-col h-screen z-40 animate-[fadeInLeft_0.6s_ease-out] transition-transform duration-300 ${
          showMobileSidebar
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center mx-2.5 my-2.5 animate-[fadeInDown_0.8s_ease-out] shrink-0">
          <div className="flex items-center px-3 py-1.5 border border-[#FF8A56] rounded hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              width="20"
              height="40"
              viewBox="0 0 31 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="21.0305"
                width="9.24673"
                height="9.24673"
                rx="4.62337"
                fill="#4278FF"
              />
              <rect
                x="0.000976562"
                y="18.4932"
                width="9.24673"
                height="9.24673"
                rx="4.62337"
                fill="#4278FF"
              />
              <rect
                x="21.0305"
                y="34.6006"
                width="9.24673"
                height="9.24673"
                rx="4.62337"
                fill="#4278FF"
              />
              <path
                d="M22.6701 4.62256C20.3002 4.62256 17.9536 5.08933 15.7641 5.99623C13.5747 6.90313 11.5853 8.23239 9.90959 9.90812C8.23386 11.5839 6.90459 13.5732 5.9977 15.7627C5.0908 17.9521 4.62402 20.2988 4.62402 22.6686C4.62402 25.0384 5.0908 27.3851 5.9977 29.5745C6.9046 31.764 8.23386 33.7533 9.90959 35.4291C11.5853 37.1048 13.5747 38.4341 15.7641 39.341C17.9536 40.2479 20.3002 40.7146 22.6701 40.7146V38.4272C20.6006 38.4272 18.5514 38.0196 16.6395 37.2276C14.7276 36.4357 12.9904 35.2749 11.5271 33.8116C10.0638 32.3483 8.90299 30.6111 8.11105 28.6991C7.3191 26.7872 6.9115 24.738 6.9115 22.6686C6.9115 20.5992 7.3191 18.55 8.11104 16.6381C8.90299 14.7261 10.0638 12.9889 11.5271 11.5256C12.9904 10.0623 14.7276 8.90152 16.6395 8.10958C18.5514 7.31764 20.6006 6.91003 22.6701 6.91003V4.62256Z"
                fill="#4278FF"
              />
              <path
                d="M22.7445 11.4834C21.2266 11.4834 19.7236 11.7824 18.3212 12.3632C16.9189 12.9441 15.6447 13.7955 14.5714 14.8688C13.4981 15.9421 12.6467 17.2163 12.0659 18.6186C11.485 20.0209 11.186 21.5239 11.186 23.0418C11.186 24.5597 11.485 26.0627 12.0659 27.465C12.6467 28.8674 13.4981 30.1416 14.5714 31.2148C15.6447 32.2881 16.9189 33.1395 18.3212 33.7204C19.7236 34.3013 21.2266 34.6002 22.7445 34.6002V33.1351C21.419 33.1351 20.1065 32.874 18.8819 32.3668C17.6573 31.8596 16.5447 31.1161 15.6074 30.1789C14.6702 29.2416 13.9267 28.1289 13.4195 26.9044C12.9122 25.6798 12.6512 24.3673 12.6512 23.0418C12.6512 21.7163 12.9122 20.4039 13.4195 19.1793C13.9267 17.9547 14.6702 16.842 15.6074 15.9048C16.5447 14.9675 17.6573 14.2241 18.8819 13.7168C20.1065 13.2096 21.419 12.9485 22.7445 12.9485V11.4834Z"
                fill="#FF8A3D"
              />
              <path
                d="M22.7445 11.4834C21.0153 11.4834 19.3082 11.8714 17.7488 12.6187C16.1895 13.3661 14.8178 14.4538 13.7346 15.8017C12.6515 17.1496 11.8846 18.7233 11.4904 20.4069C11.0962 22.0906 11.0848 23.8412 11.457 25.5298L12.8878 25.2144C12.5627 23.7399 12.5727 22.2111 12.9169 20.7409C13.2611 19.2707 13.9308 17.8964 14.8767 16.7194C15.8225 15.5424 17.0204 14.5925 18.3821 13.9399C19.7437 13.2873 21.2345 12.9485 22.7445 12.9485V11.4834Z"
                fill="#4278FF"
              />
              <rect
                x="22.0786"
                y="15.0625"
                width="3.36531"
                height="3.36531"
                rx="1.68265"
                fill="#FF8A3D"
              />
              <rect
                x="22.0786"
                y="27.6558"
                width="3.36531"
                height="3.36531"
                rx="1.68265"
                fill="#FF8A3D"
              />
              <path
                d="M22.6762 16.7451C21.8137 16.7451 20.9596 16.915 20.1628 17.2451C19.366 17.5751 18.6419 18.0589 18.0321 18.6688C17.4222 19.2786 16.9384 20.0027 16.6083 20.7995C16.2783 21.5964 16.1084 22.4504 16.1084 23.3129C16.1084 24.1754 16.2783 25.0294 16.6083 25.8263C16.9384 26.6231 17.4222 27.3471 18.0321 27.957C18.6419 28.5669 19.366 29.0507 20.1628 29.3807C20.9596 29.7108 21.8137 29.8807 22.6762 29.8807V29.0482C21.923 29.0482 21.1772 28.8998 20.4814 28.6116C19.7856 28.3234 19.1533 27.9009 18.6207 27.3683C18.0882 26.8358 17.6657 26.2035 17.3775 25.5077C17.0893 24.8118 16.9409 24.0661 16.9409 23.3129C16.9409 22.5597 17.0893 21.8139 17.3775 21.1181C17.6657 20.4223 18.0882 19.79 18.6207 19.2575C19.1533 18.7249 19.7856 18.3024 20.4814 18.0142C21.1772 17.726 21.923 17.5776 22.6762 17.5776V16.7451Z"
                fill="#FF8A3D"
              />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {/* Dashboard */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/dashboard");
              setShowMobileSidebar(false);
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/dashboard")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-grid text-xl"></i>
          </a>

          {/* Messages - Active */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/messages");
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/messages")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-chat-dots text-xl"></i>
          </a>

          {/* Notifications */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/notifications");
              setShowMobileSidebar(false);
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/notifications")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-bell text-xl"></i>
          </a>
        </nav>

        {/* Bottom Navigation - Settings and Logout */}
        <div className="p-4 space-y-2 border-t border-white/10">
          {/* Settings */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/settings");
              setShowMobileSidebar(false);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/settings")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-gear text-xl"></i>
            <span className="text-xs">Settings</span>
          </a>

          {/* Log out */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
            className="flex flex-col items-center gap-1 px-4 py-3 text-white/80 hover:bg-[#1A2332] rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <i className="bi bi-box-arrow-right text-xl"></i>
            <span className="text-xs">Logout</span>
          </a>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex md:ml-20">
        {/* Middle Column - Messages List */}
        <div
          className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col animate-[fadeInUp_0.6s_ease-out] transition-transform duration-300 ${
            showMobileConversations
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } fixed md:relative inset-0 md:inset-auto z-30 md:z-auto`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button
                onClick={() => setShowMobileConversations(false)}
                className="md:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {["Groups", "Students", "Favorites", "Unread"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.toLowerCase()
                      ? "bg-white text-gray-900 shadow-sm"
                      : "bg-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                <i className="bi bi-hourglass-split text-4xl mb-2 animate-spin"></i>
                <p className="text-sm">Loading conversations...</p>
              </div>
            ) : getCurrentConversations().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                <i className="bi bi-inbox text-4xl mb-2"></i>
                <p className="text-sm">
                  {activeTab === "favorites"
                    ? "No favorites yet"
                    : activeTab === "unread"
                    ? "No unread messages"
                    : "No conversations"}
                </p>
              </div>
            ) : (
              getCurrentConversations().map((conv) => {
                // Check if conversation is a group (has 'title') or student (has 'name')
                const isGroup = conv.hasOwnProperty("title");
                const displayName = isGroup ? conv.title : conv.name;
                const displaySubtitle = isGroup ? conv.teacher : conv.subject;
                const isActive = selectedConversation === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv.id);
                      setShowMobileConversations(false);
                    }}
                    className={`relative flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      isActive ? "bg-white" : ""
                    }`}
                  >
                    {/* Blue vertical bar for active conversation */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#145efc]"></div>
                    )}

                    {/* Avatar - Book SVG for groups, Initials for students */}
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center shrink-0">
                      {isGroup ? (
                        conv.id === "advanced-physics-study" ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="5"
                              y="11"
                              width="4"
                              height="10"
                              rx="2"
                              fill="#0EA5E9"
                            />
                            <rect
                              x="15"
                              y="11"
                              width="4"
                              height="10"
                              rx="2"
                              fill="#0EA5E9"
                            />
                            <path
                              d="M9 13H15"
                              stroke="#0EA5E9"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M11 17H13"
                              stroke="#0EA5E9"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <circle
                              cx="12"
                              cy="7"
                              r="3"
                              stroke="#0EA5E9"
                              strokeWidth="2"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="20"
                            viewBox="0 0 20 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="2"
                              y="10"
                              width="16"
                              height="4"
                              rx="1"
                              fill="#3B82F6"
                            />
                            <rect
                              x="3"
                              y="6"
                              width="14"
                              height="4"
                              rx="1"
                              fill="#EF4444"
                            />
                            <rect
                              x="4"
                              y="2"
                              width="12"
                              height="4"
                              rx="1"
                              fill="#22C55E"
                            />
                          </svg>
                        )
                      ) : (
                        <span className="text-purple-700 font-bold text-sm">
                          {displayName.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Timestamp */}
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {displayName}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 shrink-0">
                          {conv.time}
                        </span>
                      </div>

                      {/* Sender/Teacher Name */}
                      <p className="text-xs text-gray-500 mb-1 truncate">
                        {displaySubtitle}
                      </p>

                      {/* Message Preview with icon and right side elements */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <i className="bi bi-chat-left-text text-gray-400 text-xs shrink-0"></i>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 bg-[#145efc] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                              {conv.unread}
                            </span>
                          )}
                          {conv.isFavorite && (
                            <i className="bi bi-star-fill text-yellow-400 text-base"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column - Chat View */}
        <div className="flex-1 flex">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileConversations(true)}
                  className="md:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 mr-2"
                >
                  <i className="bi bi-list text-xl"></i>
                </button>
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center shrink-0">
                  {selectedConv && isSelectedGroup ? (
                    selectedConv.id === "advanced-physics-study" ? (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="4"
                          height="10"
                          rx="2"
                          fill="#0EA5E9"
                        />
                        <rect
                          x="16"
                          y="10"
                          width="4"
                          height="10"
                          rx="2"
                          fill="#0EA5E9"
                        />
                        <path
                          d="M8 12L16 12"
                          stroke="#0EA5E9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 16L14 16"
                          stroke="#0EA5E9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="12"
                          cy="6"
                          r="3"
                          stroke="#0EA5E9"
                          strokeWidth="2"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="16"
                        viewBox="0 0 20 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="10"
                          width="16"
                          height="4"
                          rx="1"
                          fill="#3B82F6"
                        />
                        <rect
                          x="3"
                          y="6"
                          width="14"
                          height="4"
                          rx="1"
                          fill="#EF4444"
                        />
                        <rect
                          x="4"
                          y="2"
                          width="12"
                          height="4"
                          rx="1"
                          fill="#22C55E"
                        />
                      </svg>
                    )
                  ) : (
                    <span className="text-purple-700 font-semibold text-sm">
                      {selectedConv
                        ? (selectedConv.name || selectedConv.title || "")
                            .substring(0, 2)
                            .toUpperCase()
                        : ""}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-base">
                    {selectedConv
                      ? isSelectedGroup
                        ? selectedConv.title
                        : selectedConv.name
                      : "Select a conversation"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedConv
                      ? isSelectedGroup
                        ? selectedConv.teacher
                        : selectedConv.subject
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Details Toggle Button */}
                <button
                  onClick={() => setShowMobileDetails(true)}
                  className="md:hidden w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <i className="bi bi-info-circle text-gray-900 text-sm"></i>
                </button>
                {/* Telephone Button */}
                <button 
                  onClick={() => alert("Coming soon: Voice calls will be available in the next update.")}
                  className="hidden md:flex w-9 h-9 border border-gray-300 rounded items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Coming soon: Voice calls"
                >
                  <i className="bi bi-telephone text-gray-900 text-sm"></i>
                </button>
                {/* Video Camera Button */}
                <button 
                  onClick={() => alert("Coming soon: Video calls will be available in the next update.")}
                  className="hidden md:flex w-9 h-9 border border-gray-300 rounded items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Coming soon: Video calls"
                >
                  <i className="bi bi-camera-video text-gray-900 text-sm"></i>
                </button>
                {/* More Options Button */}
                <button 
                  onClick={() => alert("Coming soon: More options will be available in the next update.")}
                  className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Coming soon: More options"
                >
                  <i className="bi bi-three-dots-vertical text-gray-900 text-sm"></i>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {!selectedConv ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <i className="bi bi-chat-dots text-4xl mb-2"></i>
                    <p className="text-sm">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <i className="bi bi-hourglass-split text-4xl mb-2 animate-spin"></i>
                    <p className="text-sm">Loading messages...</p>
                  </div>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  // Special case: audio message from student "J" should be left-aligned
                  const isStudentAudioJ =
                    msg.type === "audio" &&
                    msg.sender === "student" &&
                    msg.senderInitial === "J";
                  const isLeftAligned =
                    msg.sender === "teacher" || isStudentAudioJ;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${
                        isLeftAligned ? "justify-start" : "justify-end"
                      } animate-[fadeInUp_0.4s_ease-out]`}
                    >
                      {/* Teacher Avatar (left side) */}
                      {msg.sender === "teacher" && (
                        <div className="w-8 h-8 bg-[#dcfce7] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#0eab4a] font-bold text-xs">
                            {msg.senderInitial || "A"}
                          </span>
                        </div>
                      )}

                      {/* Student Audio "J" Avatar (left side) */}
                      {isStudentAudioJ && (
                        <div className="w-8 h-8 bg-[#ffe0cc] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#d66233] font-bold text-xs">
                            {msg.senderInitial || "J"}
                          </span>
                        </div>
                      )}

                      {msg.type === "feedback" ? (
                        <div className="flex flex-col">
                          <div className="bg-yellow-50 border-t-2 border-t-orange-300 rounded-lg p-4 max-w-md">
                            <div className="flex items-center gap-2 mb-3">
                              <i className="bi bi-chat text-orange-500"></i>
                              <h4 className="font-semibold text-orange-500">
                                Feedback
                              </h4>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <i className="bi bi-check text-green-500"></i>
                                  <h5 className="font-medium text-green-600">
                                    Strengths
                                  </h5>
                                </div>
                                <p className="text-sm text-gray-700 ml-6">
                                  {msg.feedback.strengths[0]}
                                </p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <i className="bi bi-arrow-right text-orange-500"></i>
                                  <h5 className="font-medium text-orange-600">
                                    Improvements
                                  </h5>
                                </div>
                                <p className="text-sm text-gray-700 ml-6">
                                  {msg.feedback.improvements[0]}
                                </p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <i className="bi bi-lightbulb-fill text-blue-400"></i>
                                  <h5 className="font-medium text-blue-500">
                                    Suggestions
                                  </h5>
                                </div>
                                <p className="text-sm text-gray-700 ml-6">
                                  {msg.feedback.suggestions[0]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs text-gray-500">{msg.time}</p>
                            <i class="bi bi-pin text-gray-400 text-xs"></i>
                          </div>
                        </div>
                      ) : msg.type === "audio" ? (
                        <div className="flex flex-col">
                          <div className="bg-orange-100 rounded-lg p-3 flex items-center gap-3 max-w-md">
                            <i className="bi bi-play-circle text-[#ba4e00] text-lg"></i>
                            <div className="flex items-center gap-2 flex-1">
                              <div className="flex gap-1 items-end h-6">
                                {[...Array(20)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-[#ba4e00] rounded-full"
                                    style={{
                                      height: `${Math.random() * 15 + 5}px`,
                                    }}
                                  ></div>
                                ))}
                              </div>
                              <span className="text-xs text-gray-700 font-medium">
                                {msg.duration}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-1 ${
                              isLeftAligned ? "ml-10" : "justify-end"
                            }`}
                          >
                            <p className="text-xs text-gray-500">{msg.time}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div
                            className={`max-w-md rounded-lg p-3 ${
                              msg.sender === "student"
                                ? "bg-[#145efc] text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          {msg.attachments && (
                            <div className="grid grid-cols-3 gap-2 mt-2 max-w-md">
                              {[...Array(msg.attachments)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-full h-20 bg-blue-400 rounded-lg"
                                ></div>
                              ))}
                            </div>
                          )}
                          <div
                            className={`flex items-center gap-1 mt-1 ${
                              msg.sender === "student"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <p className="text-xs text-gray-500">{msg.time}</p>
                            {msg.sender === "student" && (
                              <i className="bi bi-check2-all text-[#00B4D8] text-xs"></i>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Student Avatar (right side) - exclude audio from student "J" */}
                      {msg.sender === "student" && !isStudentAudioJ && (
                        <div className="w-8 h-8 bg-[#dbebff] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#145efc] font-bold text-xs">
                            S
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            {selectedConv && (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <i 
                    className="bi bi-paperclip text-gray-500 text-xl cursor-pointer hover:text-[#00B4D8] transition-colors"
                    title="Coming soon: File attachments"
                  ></i>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Send message or feedback..."
                    className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] text-sm"
                    disabled={sendingMessage}
                  />
                  <i 
                    className="bi bi-emoji-smile text-gray-500 text-xl cursor-pointer hover:text-[#00B4D8] transition-colors"
                    title="Coming soon: Emoji picker"
                  ></i>
                  <i 
                    className="bi bi-mic text-gray-500 text-xl cursor-pointer hover:text-[#00B4D8] transition-colors"
                    title="Coming soon: Voice messages"
                  ></i>
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="bi bi-send text-white text-xl border bg-[#145efc] p-2 rounded-lg cursor-pointer hover:bg-[#0096B3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  ></button>
                </div>
              </form>
            )}
          </div>

          {/* Mobile Details Overlay */}
          {showMobileDetails && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowMobileDetails(false)}
            ></div>
          )}

          {/* Details Panel */}
          <div
            className={`w-full md:w-80 bg-white border-l border-gray-200 flex flex-col animate-[fadeInRight_0.6s_ease-out] transition-transform duration-300 ${
              showMobileDetails
                ? "translate-x-0"
                : "translate-x-full md:translate-x-0"
            } fixed md:relative inset-0 md:inset-auto z-40 md:z-auto`}
          >
            {/* Panel Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-end mb-4 md:hidden">
                <button
                  onClick={() => setShowMobileDetails(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <i className="bi bi-x-lg text-xl"></i>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mb-3">
                    {selectedConv && isSelectedGroup ? (
                      selectedConv.id === "advanced-physics-study" ? (
                        <svg
                          width="44"
                          height="44"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="4"
                            y="11"
                            width="5"
                            height="11"
                            rx="2.5"
                            fill="#0EA5E9"
                          />
                          <rect
                            x="15"
                            y="11"
                            width="5"
                            height="11"
                            rx="2.5"
                            fill="#0EA5E9"
                          />
                          <path
                            d="M9 14H15"
                            stroke="#0EA5E9"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11 18H13"
                            stroke="#0EA5E9"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="12"
                            cy="7"
                            r="3.5"
                            stroke="#0EA5E9"
                            strokeWidth="2"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="40"
                          height="32"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="10"
                            width="16"
                            height="4"
                            rx="1"
                            fill="#3B82F6"
                          />
                          <rect
                            x="3"
                            y="6"
                            width="14"
                            height="4"
                            rx="1"
                            fill="#EF4444"
                          />
                          <rect
                            x="4"
                            y="2"
                            width="12"
                            height="4"
                            rx="1"
                            fill="#22C55E"
                          />
                        </svg>
                      )
                    ) : (
                      <span className="text-purple-700 font-bold text-2xl">
                        {selectedConv
                          ? (selectedConv.name || selectedConv.title || "")
                              .substring(0, 2)
                              .toUpperCase()
                          : ""}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {selectedConv
                      ? isSelectedGroup
                        ? selectedConv.title
                        : selectedConv.name
                      : "Select a conversation"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConv
                      ? isSelectedGroup
                        ? "4 members"
                        : selectedConv.subject
                      : ""}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <i className="bi bi-pin text-gray-500 text-lg cursor-pointer hover:text-[#00B4D8] transition-colors"></i>
                  <i className="bi bi-person-plus text-gray-500 text-lg cursor-pointer hover:text-[#00B4D8] transition-colors"></i>
                  <i className="bi bi-gear text-gray-500 text-lg cursor-pointer hover:text-[#00B4D8] transition-colors"></i>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-4 pt-4 border-b border-gray-200">
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { name: "Overview", icon: "bi-file-earmark-text" },
                    { name: "Feedback", icon: "bi-chat" },
                    { name: "Media", icon: "bi-images" },
                    { name: "Settings", icon: "bi-gear" },
                  ].map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setDetailsTab(tab.name.toLowerCase())}
                      className={`flex flex-col items-center gap-1 px-2.5 py-2 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                        detailsTab === tab.name.toLowerCase()
                          ? "text-[#00B4D8] border-b-2 border-[#00B4D8]"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <i className={`${tab.icon} text-base`}></i>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {!selectedConv ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <i className="bi bi-info-circle text-4xl mb-2"></i>
                      <p className="text-sm">
                        Select a conversation to view details
                      </p>
                    </div>
                  </div>
                ) : detailsTab === "overview" ? (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedConv
                          ? isSelectedGroup
                            ? "Web Development class group for discussions, assignments, and collaborative learning."
                            : "Direct messaging for personalized feedback and support."
                          : "Select a conversation to view details."}
                      </p>
                    </div>

                    {/* Members */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Members ({members.length})
                      </h4>
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <div className="w-10 h-10 bg-[#dbebff] rounded-full flex items-center justify-center shrink-0">
                              <span className="text-[#145efc] font-bold text-sm">
                                {member.displayInitial || member.initial}
                              </span>
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {member.name}
                              </p>
                              <div
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusColor(
                                  member.status
                                )}`}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : detailsTab === "feedback" ? (
                  <div className="space-y-4">
                    {/* Pinned Feedback Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        Pinned Feedback
                      </h4>
                      <input
                        type="text"
                        placeholder="Search feedback..."
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                      />
                    </div>

                    {/* Feedback Cards */}
                    <div className="space-y-3">
                      {/* Card 1: Lab Report Assessment */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <i className="bi bi-chat text-orange-500 text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Lab Report Assessment
                          </h5>
                          <p className="text-xs text-gray-500 mb-2">
                            2 days ago
                          </p>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            strengths
                          </span>
                        </div>
                      </div>

                      {/* Card 2: Group Project Milestone */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <i className="bi bi-chat text-orange-500 text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Group Project Milestone
                          </h5>
                          <p className="text-xs text-gray-500 mb-2">
                            5 days ago
                          </p>
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                            improvements
                          </span>
                        </div>
                      </div>

                      {/* Card 3: Quiz Performance */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <i className="bi bi-chat text-orange-500 text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Quiz Performance
                          </h5>
                          <p className="text-xs text-gray-500 mb-2">
                            1 week ago
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            suggestions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : detailsTab === "media" ? (
                  <div className="space-y-4">
                    {/* Shared Media Header */}
                    <h4 className="font-semibold text-gray-900 text-lg mb-4">
                      Shared Media
                    </h4>

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* diagram.png */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center justify-center mb-3">
                          <i className="bi bi-image text-yellow-500 text-2xl"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-900 text-center">
                          diagram.png
                        </p>
                      </div>

                      {/* syllabus.pdf */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center mb-3">
                          <i className="bi bi-file-earmark text-gray-600 text-2xl"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-900 text-center">
                          syllabus.pdf
                        </p>
                      </div>

                      {/* notes.jpg */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center justify-center mb-3">
                          <i className="bi bi-image text-yellow-500 text-2xl"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-900 text-center">
                          notes.jpg
                        </p>
                      </div>

                      {/* lecture.mp4 */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                          <i className="bi bi-camera-video-fill text-white text-2xl"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-900 text-center">
                          lecture.mp4
                        </p>
                      </div>
                    </div>
                  </div>
                ) : detailsTab === "settings" ? (
                  <div className="space-y-6">
                    {/* Notifications Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Notifications
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <input
                            type="radio"
                            name="notifications"
                            value="all"
                            defaultChecked
                            className="w-4 h-4 text-[#00B4D8] focus:ring-[#00B4D8]"
                          />
                          <span className="text-sm text-gray-900">
                            All messages
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <input
                            type="radio"
                            name="notifications"
                            value="mentions"
                            className="w-4 h-4 text-[#00B4D8] focus:ring-[#00B4D8]"
                          />
                          <span className="text-sm text-gray-900">
                            Mentions only
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <input
                            type="radio"
                            name="notifications"
                            value="mute"
                            className="w-4 h-4 text-[#00B4D8] focus:ring-[#00B4D8]"
                          />
                          <span className="text-sm text-gray-900">
                            Mute conversation
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Leave Group */}
                    <div className="pt-4 border-t border-gray-200">
                      <button className="text-red-600 text-sm font-medium hover:underline">
                        Leave Group
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherMessages;
