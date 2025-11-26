import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { profileService } from "../services/profileService";
import { dashboardService } from "../services/dashboardService";
import { messageService } from "../services/messageService";
import { useNotifications } from "../context/NotificationContext";
import { authService } from "../services/authService";

function TeacherProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teachingOverview, setTeachingOverview] = useState(null);
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const { unreadCount } = useNotifications();
  const user = authService.getCurrentUser();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    fetchProfile();
    fetchTeachingData();
    fetchRecentMessages();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Keep default values for MVP
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachingData = async () => {
    try {
      const [stats, performance] = await Promise.all([
        dashboardService.getDashboardStats().catch(() => null),
        dashboardService.getClassPerformance().catch(() => null),
      ]);

      if (stats?.data || stats) {
        const statsData = stats?.data || stats;
        setTeachingOverview({
          activeClasses: statsData.totalClasses || 0,
          totalStudents: statsData.totalStudents || 0,
          pendingReviews: statsData.pendingReviews || 0,
        });
      }

      // Fetch recent classes from performance data if available
      if (performance?.data || performance) {
        const perfData = performance?.data || performance;
        if (perfData.recentClasses) {
          setRecentClasses(perfData.recentClasses);
        }
      }
    } catch (error) {
      console.error("Error fetching teaching data:", error);
      setTeachingOverview({
        activeClasses: 0,
        totalStudents: 0,
        pendingReviews: 0,
      });
    }
  };

  const fetchRecentMessages = async () => {
    try {
      const response = await messageService.getConversations("all");
      const conversations = response?.data || response || [];
      // Get the most recent 2 conversations
      const sorted = conversations
        .sort(
          (a, b) =>
            new Date(b.lastMessage?.timestamp || b.updatedAt || 0) -
            new Date(a.lastMessage?.timestamp || a.updatedAt || 0)
        )
        .slice(0, 2);
      setRecentMessages(sorted);
    } catch (error) {
      console.error("Error fetching recent messages:", error);
      setRecentMessages([]);
    }
  };

  const handleEditClick = (field) => {
    alert(
      `Coming soon: Edit ${field} functionality will be available in the next update.`
    );
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await profileService.uploadProfilePicture(file);
      await fetchProfile();
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#0b1633] text-white rounded-lg flex items-center justify-center hover:bg-[#1A2332] transition-colors"
      >
        <i className="bi bi-list text-xl"></i>
      </button>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed left-0 top-0 w-64 bg-[#0b1633] flex flex-col h-screen z-40 transition-transform duration-300 ${
          showMobileSidebar
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center my-3 mx-3 animate-[fadeInDown_0.8s_ease-out]">
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
            <span className="hidden md:block">
              <svg
                width="70"
                height="20"
                viewBox="0 0 114 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8582 1.55692C10.8028 2.12439 10.7613 2.67802 10.7336 3.21781C10.7198 3.74377 10.7129 4.14515 10.7129 4.42196C10.7129 4.68494 10.7198 4.941 10.7336 5.19013C10.7475 5.42542 10.7613 5.62612 10.7752 5.79221H10.2977C10.1869 4.83719 10.007 4.08979 9.75786 3.54999C9.50873 2.99636 9.16963 2.60882 8.74056 2.38737C8.32534 2.15207 7.77863 2.03442 7.10043 2.03442H5.95856C5.54333 2.03442 5.225 2.06903 5.00354 2.13823C4.78209 2.20744 4.62984 2.35276 4.5468 2.57422C4.47759 2.79567 4.44299 3.13477 4.44299 3.59152V14.2213C4.44299 14.6642 4.47759 15.0033 4.5468 15.2386C4.62984 15.46 4.78209 15.6053 5.00354 15.6745C5.225 15.7437 5.54333 15.7784 5.95856 15.7784H7.14195C7.84783 15.7784 8.43606 15.6469 8.90665 15.3839C9.39108 15.1209 9.77862 14.6918 10.0693 14.0967C10.3599 13.4877 10.5745 12.6572 10.7129 11.6053H11.1904C11.1489 12.0344 11.1281 12.588 11.1281 13.2662C11.1281 13.5569 11.135 13.979 11.1489 14.5327C11.1765 15.0863 11.2181 15.6607 11.2734 16.2559C10.5675 16.2282 9.7717 16.2143 8.88589 16.2143C8.00008 16.2005 7.21115 16.1936 6.51911 16.1936C6.20077 16.1936 5.77863 16.1936 5.25268 16.1936C4.74057 16.1936 4.18001 16.2005 3.57102 16.2143C2.97586 16.2143 2.36687 16.2213 1.74403 16.2351C1.13504 16.2351 0.553722 16.242 8.94083e-05 16.2559V15.8406C0.456836 15.813 0.795936 15.7576 1.01739 15.6745C1.25268 15.5915 1.40493 15.4254 1.47414 15.1763C1.55718 14.9271 1.5987 14.5534 1.5987 14.0552V3.75761C1.5987 3.2455 1.55718 2.87179 1.47414 2.6365C1.40493 2.38737 1.25268 2.22128 1.01739 2.13823C0.795936 2.04135 0.456836 1.98598 8.94083e-05 1.97214V1.55692C0.553722 1.57076 1.13504 1.5846 1.74403 1.59844C2.36687 1.59844 2.97586 1.60536 3.57102 1.6192C4.18001 1.6192 4.74057 1.6192 5.25268 1.6192C5.77863 1.6192 6.20077 1.6192 6.51911 1.6192C7.15579 1.6192 7.87551 1.6192 8.67828 1.6192C9.49489 1.60536 10.2215 1.5846 10.8582 1.55692ZM7.51565 8.65725C7.51565 8.65725 7.51565 8.72646 7.51565 8.86487C7.51565 9.00327 7.51565 9.07248 7.51565 9.07248H3.82015C3.82015 9.07248 3.82015 9.00327 3.82015 8.86487C3.82015 8.72646 3.82015 8.65725 3.82015 8.65725H7.51565ZM8.11773 5.91677C8.06236 6.7057 8.03468 7.30777 8.03468 7.723C8.04852 8.13822 8.05544 8.51885 8.05544 8.86487C8.05544 9.21089 8.06236 9.59151 8.0762 10.0067C8.09004 10.422 8.12465 11.024 8.18001 11.813H7.7025C7.6333 11.3424 7.52257 10.8995 7.37032 10.4842C7.23191 10.0552 7.00354 9.71608 6.6852 9.46694C6.3807 9.20397 5.9378 9.07248 5.35648 9.07248V8.65725C5.78555 8.65725 6.13157 8.56729 6.39454 8.38736C6.67136 8.20743 6.89281 7.97905 7.0589 7.70224C7.22499 7.41158 7.34956 7.114 7.43261 6.80951C7.52949 6.49117 7.5987 6.19359 7.64022 5.91677H8.11773ZM22.6723 -0.000174707V13.9929C22.6723 14.6157 22.7761 15.0794 22.9837 15.3839C23.1913 15.6745 23.5581 15.8199 24.0841 15.8199V16.2559C23.655 16.2143 23.2259 16.1936 22.7969 16.1936C22.2848 16.1936 21.8003 16.2143 21.3436 16.2559C20.8868 16.2974 20.4578 16.3735 20.0564 16.4842V2.49117C20.0564 1.86834 19.9526 1.41159 19.745 1.12093C19.5512 0.816433 19.1844 0.664184 18.6446 0.664184V0.228199C19.0875 0.269721 19.5166 0.290482 19.9318 0.290482C20.4578 0.290482 20.9491 0.269721 21.4059 0.228199C21.8626 0.172836 22.2848 0.0967114 22.6723 -0.000174707ZM17.7104 5.23165C18.3194 5.23165 18.8661 5.3493 19.3505 5.58459C19.8349 5.81989 20.1948 6.21435 20.4301 6.76798L20.181 6.97559C19.9872 6.57421 19.7242 6.27663 19.392 6.08286C19.0599 5.88909 18.6862 5.79221 18.2709 5.79221C17.5235 5.79221 16.9215 6.21435 16.4647 7.05864C16.0218 7.88909 15.8003 9.16936 15.8003 10.8995C15.8003 12.0621 15.8903 13.0033 16.0702 13.723C16.2502 14.4289 16.5062 14.941 16.8384 15.2593C17.1844 15.5777 17.5927 15.7368 18.0633 15.7368C18.5616 15.7368 19.0114 15.5361 19.4128 15.1348C19.8142 14.7195 20.0495 14.1313 20.1187 13.37L20.264 13.9514C20.0841 14.7957 19.745 15.4393 19.2467 15.8822C18.7484 16.3251 18.091 16.5465 17.2744 16.5465C16.4439 16.5465 15.7035 16.3458 15.0529 15.9444C14.4163 15.5292 13.918 14.9064 13.5581 14.0759C13.2121 13.2316 13.0391 12.1659 13.0391 10.8787C13.0391 9.61919 13.2467 8.57421 13.6619 7.74376C14.0772 6.89947 14.6377 6.26971 15.3436 5.85449C16.0495 5.43926 16.8384 5.23165 17.7104 5.23165ZM35.0418 5.29394V14.0136C35.0418 14.6365 35.1456 15.1002 35.3532 15.4046C35.5608 15.6953 35.9276 15.8406 36.4535 15.8406V16.2766C36.0245 16.2351 35.5954 16.2143 35.1663 16.2143C34.6542 16.2143 34.1629 16.2351 33.6923 16.2766C33.2356 16.3181 32.8134 16.3943 32.4259 16.505V14.4289C32.0798 15.1901 31.6023 15.7368 30.9933 16.069C30.3982 16.3873 29.7546 16.5465 29.0625 16.5465C28.5228 16.5465 28.066 16.4704 27.6923 16.3181C27.3324 16.1797 27.0418 15.986 26.8203 15.7368C26.585 15.4739 26.419 15.1278 26.3221 14.6988C26.2252 14.2697 26.1767 13.7161 26.1767 13.0379V7.78528C26.1767 7.16245 26.0729 6.7057 25.8653 6.41504C25.6715 6.11054 25.3048 5.9583 24.765 5.9583V5.52231C25.2079 5.56383 25.6369 5.58459 26.0522 5.58459C26.5643 5.58459 27.0487 5.56383 27.5055 5.52231C27.976 5.46695 28.4051 5.39082 28.7927 5.29394V13.7645C28.7927 14.1382 28.8203 14.4704 28.8757 14.7611C28.9449 15.0517 29.0764 15.287 29.2702 15.4669C29.4639 15.633 29.7546 15.7161 30.1421 15.7161C30.5712 15.7161 30.9587 15.5915 31.3048 15.3424C31.6508 15.0932 31.9207 14.7541 32.1144 14.3251C32.3221 13.896 32.4259 13.4116 32.4259 12.8718V7.78528C32.4259 7.16245 32.3221 6.7057 32.1144 6.41504C31.9207 6.11054 31.5539 5.9583 31.0141 5.9583V5.52231C31.457 5.56383 31.8861 5.58459 32.3013 5.58459C32.8134 5.58459 33.2978 5.56383 33.7546 5.52231C34.2252 5.46695 34.6542 5.39082 35.0418 5.29394Z"
                  fill="#4278FF"
                />
                <path
                  d="M43.7341 1.55692V1.97214C43.2635 1.98598 42.9036 2.04135 42.6545 2.13823C42.4192 2.22128 42.26 2.38737 42.177 2.6365C42.0939 2.87179 42.0524 3.2455 42.0524 3.75761V14.2213C42.0524 14.6642 42.087 15.0033 42.1562 15.2386C42.2393 15.46 42.3846 15.6053 42.5922 15.6745C42.7998 15.7437 43.0974 15.7784 43.4849 15.7784H44.6683C45.2081 15.7784 45.6787 15.6815 46.0801 15.4877C46.4953 15.2939 46.8552 15.0102 47.1597 14.6365C47.4642 14.2628 47.7133 13.806 47.9071 13.2662C48.1009 12.7126 48.2393 12.0898 48.3223 11.3977H48.7998C48.7583 11.8545 48.7375 12.4496 48.7375 13.1832C48.7375 13.4877 48.7445 13.9237 48.7583 14.4912C48.786 15.0586 48.8275 15.6469 48.8829 16.2559C48.177 16.2282 47.3811 16.2143 46.4953 16.2143C45.6095 16.2005 44.8206 16.1936 44.1285 16.1936C43.7964 16.1936 43.3742 16.1936 42.8621 16.1936C42.35 16.1936 41.7894 16.2005 41.1805 16.2143C40.5853 16.2143 39.9763 16.2213 39.3535 16.2351C38.7445 16.2351 38.1632 16.242 37.6095 16.2559V15.8406C38.0663 15.813 38.4054 15.7576 38.6268 15.6745C38.8621 15.5915 39.0144 15.4254 39.0836 15.1763C39.1666 14.9271 39.2081 14.5534 39.2081 14.0552V3.75761C39.2081 3.2455 39.1666 2.87179 39.0836 2.6365C39.0144 2.38737 38.8621 2.22128 38.6268 2.13823C38.4054 2.04135 38.0663 1.98598 37.6095 1.97214V1.55692C37.9555 1.57076 38.3984 1.5846 38.9382 1.59844C39.478 1.61228 40.0593 1.6192 40.6822 1.6192C41.2497 1.6192 41.8102 1.61228 42.3638 1.59844C42.9175 1.5846 43.3742 1.57076 43.7341 1.55692ZM52.4857 0.228199C52.984 0.228199 53.3923 0.366607 53.7107 0.643423C54.029 0.920239 54.1882 1.28702 54.1882 1.74377C54.1882 2.20051 54.029 2.5673 53.7107 2.84411C53.3923 3.12093 52.984 3.25934 52.4857 3.25934C51.9875 3.25934 51.5792 3.12093 51.2608 2.84411C50.9425 2.5673 50.7833 2.20051 50.7833 1.74377C50.7833 1.28702 50.9425 0.920239 51.2608 0.643423C51.5792 0.366607 51.9875 0.228199 52.4857 0.228199ZM53.939 5.29394V14.3251C53.939 14.9064 54.0428 15.3008 54.2504 15.5085C54.4719 15.7161 54.8387 15.8199 55.3508 15.8199V16.2559C55.1017 16.242 54.721 16.2282 54.2089 16.2143C53.6968 16.1867 53.1778 16.1728 52.6518 16.1728C52.1397 16.1728 51.6207 16.1867 51.0947 16.2143C50.5688 16.2282 50.1743 16.242 49.9114 16.2559V15.8199C50.4235 15.8199 50.7833 15.7161 50.9909 15.5085C51.2124 15.3008 51.3231 14.9064 51.3231 14.3251V7.80604C51.3231 7.16937 51.2193 6.7057 51.0117 6.41504C50.8179 6.11054 50.4511 5.9583 49.9114 5.9583V5.52231C50.3543 5.56383 50.7833 5.58459 51.1985 5.58459C51.7107 5.58459 52.1951 5.56383 52.6518 5.52231C53.1224 5.46695 53.5515 5.39082 53.939 5.29394ZM63.7511 5.23165C64.3325 5.23165 64.7961 5.30778 65.1421 5.46003C65.502 5.61228 65.7927 5.80605 66.0141 6.04134C66.2632 6.30432 66.4363 6.64342 66.5331 7.05864C66.6439 7.47386 66.6992 8.03442 66.6992 8.7403V14.3251C66.6992 14.9064 66.803 15.3008 67.0106 15.5085C67.2321 15.7161 67.5989 15.8199 68.111 15.8199V16.2559C67.8619 16.242 67.4743 16.2282 66.9484 16.2143C66.4363 16.1867 65.938 16.1728 65.4536 16.1728C64.9414 16.1728 64.4432 16.1867 63.9587 16.2143C63.4743 16.2282 63.1145 16.242 62.8792 16.2559V15.8199C63.3221 15.8199 63.6335 15.7161 63.8134 15.5085C63.9934 15.3008 64.0833 14.9064 64.0833 14.3251V8.03442C64.0833 7.66072 64.0487 7.32854 63.9795 7.03788C63.9103 6.73338 63.7719 6.49809 63.5643 6.332C63.3567 6.15207 63.0591 6.0621 62.6716 6.0621C62.2148 6.0621 61.8065 6.18667 61.4466 6.4358C61.1006 6.68494 60.8238 7.03096 60.6162 7.47386C60.4224 7.90293 60.3255 8.38736 60.3255 8.92715V14.3251C60.3255 14.9064 60.4155 15.3008 60.5954 15.5085C60.7754 15.7161 61.0868 15.8199 61.5297 15.8199V16.2559C61.2944 16.242 60.9415 16.2282 60.4709 16.2143C60.0003 16.1867 59.5228 16.1728 59.0383 16.1728C58.5262 16.1728 58.0072 16.1867 57.4812 16.2143C56.9553 16.2282 56.5608 16.242 56.2979 16.2559V15.8199C56.81 15.8199 57.1698 15.7161 57.3774 15.5085C57.5989 15.3008 57.7096 14.9064 57.7096 14.3251V7.78528C57.7096 7.16245 57.6058 6.7057 57.3982 6.41504C57.2044 6.11054 56.8377 5.9583 56.2979 5.9583V5.52231C56.7408 5.56383 57.1698 5.58459 57.5851 5.58459C58.0972 5.58459 58.5816 5.56383 59.0383 5.52231C59.5089 5.46695 59.938 5.39082 60.3255 5.29394V7.37006C60.6716 6.58113 61.1491 6.0275 61.7581 5.70916C62.3671 5.39082 63.0314 5.23165 63.7511 5.23165ZM72.8113 -0.000174707V14.3251C72.8113 14.9064 72.9082 15.3008 73.102 15.5085C73.2957 15.7161 73.6279 15.8199 74.0985 15.8199V16.2559C73.8632 16.242 73.5033 16.2282 73.0189 16.2143C72.5345 16.1867 72.0431 16.1728 71.5449 16.1728C71.0328 16.1728 70.5068 16.1867 69.967 16.2143C69.4411 16.2282 69.0466 16.242 68.7836 16.2559V15.8199C69.2957 15.8199 69.6556 15.7161 69.8632 15.5085C70.0847 15.3008 70.1954 14.9064 70.1954 14.3251V2.49117C70.1954 1.86834 70.0916 1.41159 69.884 1.12093C69.6902 0.816433 69.3234 0.664184 68.7836 0.664184V0.228199C69.2265 0.269721 69.6556 0.290482 70.0708 0.290482C70.5968 0.290482 71.0881 0.269721 71.5449 0.228199C72.0016 0.172836 72.4238 0.0967114 72.8113 -0.000174707ZM79.5379 5.52231V5.93753C79.1227 6.02058 78.7213 6.17975 78.3338 6.41504C77.9462 6.63649 77.5656 6.94791 77.1919 7.3493L75.1366 9.4877L75.3649 9.03096L79.0189 14.7403C79.2127 15.0171 79.3926 15.2524 79.5587 15.4462C79.7386 15.6261 79.9601 15.7507 80.2231 15.8199V16.2559C80.0431 16.242 79.7594 16.2282 79.3718 16.2143C78.9843 16.1867 78.5968 16.1728 78.2092 16.1728C77.7386 16.1728 77.2542 16.1867 76.7559 16.2143C76.2715 16.2282 75.9047 16.242 75.6556 16.2559V15.8199C75.9324 15.8199 76.1193 15.7576 76.2161 15.633C76.3269 15.4946 76.313 15.3216 76.1746 15.114L74.0155 11.4808C73.8217 11.1763 73.6348 10.9825 73.4549 10.8995C73.275 10.8026 73.0328 10.7541 72.7283 10.7541V10.3389C73.0743 10.3112 73.358 10.2489 73.5795 10.1521C73.8148 10.0552 74.0362 9.90293 74.2438 9.69531L75.8009 8.13822C76.2577 7.68148 76.486 7.29393 76.486 6.97559C76.4999 6.65726 76.3545 6.41504 76.05 6.24895C75.7594 6.06902 75.3788 5.96522 74.9082 5.93753V5.52231C75.2819 5.53615 75.6971 5.55691 76.1539 5.58459C76.6106 5.59843 76.9981 5.60535 77.3165 5.60535C77.5656 5.60535 77.8286 5.60535 78.1054 5.60535C78.3961 5.59151 78.666 5.57767 78.9151 5.56383C79.1781 5.54999 79.3857 5.53615 79.5379 5.52231ZM85.2933 5.23165C85.9438 5.23165 86.5182 5.32854 87.0165 5.52231C87.5286 5.71608 87.93 5.9929 88.2207 6.35276C88.5113 6.69878 88.6566 7.12092 88.6566 7.61919C88.6566 8.14514 88.4906 8.63649 88.1584 9.09324C87.8262 9.54999 87.3695 9.94445 86.7881 10.2766C86.2207 10.6088 85.5632 10.8649 84.8158 11.0448C85.6601 11.031 86.4283 11.1417 87.1203 11.377C87.8124 11.5984 88.366 11.9514 88.7812 12.4358C89.1964 12.9064 89.4041 13.5015 89.4041 14.2213C89.4041 14.8579 89.238 15.4462 88.9058 15.986C88.5736 16.5119 88.1238 16.9825 87.5563 17.3977C87.0027 17.8268 86.3591 18.1867 85.6255 18.4773C84.8919 18.7818 84.1238 19.0102 83.321 19.1624C82.5321 19.3147 81.7501 19.3908 80.975 19.3908V18.9963C81.6394 18.9687 82.3037 18.851 82.9681 18.6434C83.6463 18.4358 84.2622 18.1313 84.8158 17.7299C85.3833 17.3285 85.8331 16.8372 86.1653 16.2559C86.5113 15.6607 86.6843 14.9825 86.6843 14.2213C86.6843 13.4047 86.4906 12.7334 86.103 12.2074C85.7155 11.6815 85.1826 11.3908 84.5044 11.3355C84.2968 11.4185 84.103 11.4946 83.9231 11.5638C83.757 11.633 83.5978 11.6676 83.4456 11.6676C83.3349 11.6676 83.2449 11.6469 83.1757 11.6053C83.1203 11.55 83.0926 11.4669 83.0926 11.3562C83.0926 11.2178 83.1549 11.114 83.2795 11.0448C83.4041 10.9756 83.5494 10.941 83.7155 10.941C83.8262 10.941 83.9369 10.9479 84.0477 10.9617C84.1722 10.9756 84.3037 10.9894 84.4421 11.0033C85.0234 10.588 85.4317 10.1382 85.667 9.65379C85.9162 9.15552 86.0407 8.65725 86.0407 8.15898C86.0407 7.52231 85.8746 7.05864 85.5425 6.76798C85.2103 6.46348 84.7674 6.31124 84.2137 6.31124C83.6601 6.31124 83.1411 6.45656 82.6567 6.74722C82.1861 7.02404 81.7916 7.44618 81.4733 8.01366L81.1203 7.8268C81.3556 7.37006 81.6463 6.94791 81.9923 6.56037C82.3522 6.15899 82.802 5.84065 83.3418 5.60535C83.8816 5.35622 84.5321 5.23165 85.2933 5.23165ZM99.0707 1.2455L99.1537 1.66072C98.6693 1.81297 98.1779 2.01366 97.6797 2.2628C97.1952 2.49809 96.7247 2.82335 96.2679 3.23858C95.825 3.63996 95.4305 4.16591 95.0845 4.81643C94.7385 5.46695 94.4617 6.26971 94.2541 7.22473C94.0603 8.17975 93.9634 9.33545 93.9634 10.6919C93.9634 12.0898 94.0672 13.1901 94.2748 13.9929C94.4963 14.7818 94.7662 15.3354 95.0845 15.6538C95.4167 15.9721 95.7489 16.1313 96.0811 16.1313C96.4271 16.1313 96.7523 15.9929 97.0568 15.7161C97.3613 15.4254 97.6035 14.9617 97.7835 14.3251C97.9772 13.6745 98.0741 12.8303 98.0741 11.7922C98.0741 10.7957 97.9842 9.99981 97.8042 9.40466C97.6381 8.8095 97.4098 8.38044 97.1191 8.11746C96.8285 7.85449 96.5032 7.723 96.1433 7.723C95.8942 7.723 95.6105 7.7922 95.2921 7.93061C94.9738 8.06902 94.6831 8.29739 94.4202 8.61573C94.1572 8.93407 93.9634 9.37006 93.8388 9.92369H93.6312C93.7281 9.21781 93.9496 8.66417 94.2956 8.26279C94.6416 7.86141 95.043 7.57075 95.4997 7.39082C95.9703 7.21089 96.4271 7.12092 96.87 7.12092C97.5759 7.12092 98.2264 7.30085 98.8215 7.66071C99.4305 8.02058 99.915 8.53961 100.275 9.21781C100.649 9.88217 100.835 10.6919 100.835 11.6469C100.835 12.6849 100.607 13.5777 100.15 14.3251C99.6935 15.0586 99.0845 15.6123 98.3233 15.986C97.5759 16.3597 96.7523 16.5465 95.8527 16.5465C94.4132 16.5465 93.2783 16.0344 92.4478 15.0102C91.6174 13.9721 91.2022 12.5188 91.2022 10.6503C91.2022 9.39082 91.3683 8.27663 91.7004 7.30777C92.0465 6.33892 92.4963 5.50155 93.0499 4.79567C93.6174 4.07594 94.2471 3.47387 94.9392 2.98944C95.6312 2.50501 96.3371 2.12439 97.0568 1.84757C97.7766 1.55692 98.4478 1.35623 99.0707 1.2455ZM108.161 5.23165C109.227 5.23165 110.168 5.46003 110.985 5.91677C111.802 6.37352 112.438 7.0102 112.895 7.8268C113.366 8.64341 113.601 9.60535 113.601 10.7126C113.601 11.8199 113.359 12.8164 112.874 13.7022C112.404 14.588 111.746 15.287 110.902 15.7991C110.058 16.2974 109.068 16.5465 107.933 16.5465C106.895 16.5465 105.961 16.3251 105.13 15.8822C104.314 15.4254 103.67 14.7818 103.2 13.9514C102.729 13.1209 102.494 12.1521 102.494 11.0448C102.494 9.95137 102.729 8.96867 103.2 8.0967C103.67 7.22473 104.328 6.53269 105.172 6.02058C106.03 5.49463 107.027 5.23165 108.161 5.23165ZM107.975 5.60535C107.186 5.60535 106.535 6.08286 106.023 7.03788C105.511 7.97905 105.255 9.29393 105.255 10.9825C105.255 12.2282 105.386 13.2316 105.649 13.9929C105.912 14.7541 106.265 15.3078 106.708 15.6538C107.151 15.9998 107.622 16.1728 108.12 16.1728C108.923 16.1728 109.573 15.6953 110.072 14.7403C110.584 13.7853 110.84 12.4635 110.84 10.7749C110.84 9.52923 110.708 8.53269 110.445 7.78528C110.182 7.02404 109.836 6.47041 109.407 6.12438C108.978 5.77836 108.501 5.60535 107.975 5.60535Z"
                  fill="#FF8A3D"
                />
              </svg>
            </span>
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
            }}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#1A2332] rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <i className="bi bi-grid text-xl"></i>
            <span className="font-medium">Dashboard</span>
          </a>

          {/* Messages */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/messages");
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/messages")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-chat-dots text-xl"></i>
            <span className="font-medium">Messages</span>
          </a>

          {/* Notifications */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/notifications");
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/notifications")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-bell text-xl"></i>
            <span className="font-medium">Notifications</span>
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
            }}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#1A2332] rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <i className="bi bi-gear text-xl"></i>
            <span className="font-medium">Settings</span>
          </a>

          {/* Log out */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#1A2332] rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <i className="bi bi-box-arrow-right text-xl"></i>
            <span className="font-medium">Log out</span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4 sm:py-6 sticky top-0 z-10 animate-[fadeInDown_0.5s_ease-out]">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-black">Profile</h1>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div
                onClick={() => navigate("/teacher/notifications")}
                className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
              >
                <i className="bi bi-bell text-gray-600 text-xl hover:text-gray-900 transition-colors"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div
                onClick={() => navigate("/teacher/profile")}
                className="w-10 h-10 bg-[#FF8A56] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
              >
                <span className="text-white font-bold text-sm">
                  {profile?.name
                    ? profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)
                    : user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)
                    : "T"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
            {/* Title with Back Button */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate("/teacher/dashboard")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <i className="bi bi-arrow-left text-xl"></i>
              </button>
              <h2 className="text-2xl font-bold text-black">Profile</h2>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-[#FF8A56] rounded-full flex items-center justify-center mb-4">
                  {profile?.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-4xl">
                      {profile?.name
                        ? profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)
                        : user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)
                        : "T"}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border-4 border-white cursor-pointer hover:bg-gray-600 transition-colors">
                  <i className="bi bi-camera text-white text-sm"></i>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name with Edit Icon */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-black">
                  {loading
                    ? "Loading..."
                    : profile?.name || "No name available"}
                </h3>
                {profile?.name && (
                  <i
                    className="bi bi-pencil text-gray-500 cursor-pointer hover:text-[#00B4D8] transition-colors"
                    onClick={() => handleEditClick("name")}
                    title="Coming soon: Edit name"
                  ></i>
                )}
              </div>

              {/* Subject and ID */}
              <p className="text-black mb-1">
                {loading
                  ? "Loading..."
                  : profile?.subject || "No subject available"}
              </p>
              <p className="text-sm text-black">
                Teacher ID:{" "}
                {loading ? "Loading..." : profile?.teacherId || "N/A"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <i className="bi bi-telephone text-blue-400"></i>
                </div>
                <div>
                  <p className="text-sm text-black">Phone</p>
                  <p className="text-gray-900 font-medium">
                    {profile?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <i className="bi bi-envelope text-blue-400"></i>
                </div>
                <div>
                  <p className="text-sm text-black">Email</p>
                  <p className="text-gray-900 font-medium">
                    {profile?.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* About Me Section */}
            <div className="mb-8 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-black">About Me</h3>
                <i
                  className="bi bi-pencil text-gray-500 cursor-pointer hover:text-[#00B4D8] transition-colors"
                  onClick={() => handleEditClick("bio")}
                  title="Coming soon: Edit bio"
                ></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black mb-2">Bio</h4>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3 mb-3 hover:shadow-md transition-shadow">
                  <p className="text-black leading-relaxed">
                    {loading
                      ? "Loading..."
                      : profile?.bio || "No bio available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours Section */}
            <div className="animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Office Hours
              </h3>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3 mb-3 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <i className="bi bi-clock text-blue-400"></i>
                </div>
                <p className="text-black font-medium">
                  {loading ? "Loading..." : profile?.officeHours || "Not set"}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Feel free to drop by during office hours or schedule a meeting
                via the messaging system.
              </p>
              <button
                onClick={() => handleEditClick("office hours")}
                className="mt-2 text-sm text-[#00B4D8] hover:underline"
              >
                Coming soon: Edit office hours
              </button>
            </div>
          </div>

          {/* Teaching Overview Section - Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
            <h2 className="text-2xl font-bold text-black mb-6">
              Teaching Overview
            </h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Classes Card */}
              <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#203875] rounded-lg flex items-center justify-center">
                    <i className="bi bi-book text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {teachingOverview?.activeClasses || 0}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      Active Classes
                    </p>
                  </div>
                </div>
              </div>

              {/* Students Card */}
              <div className="bg-orange-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                    <i className="bi bi-people text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#5c2300]">
                      {teachingOverview?.totalStudents || 0}
                    </h3>
                    <p className="text-sm font-medium text-[#5c2300]">
                      students
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Reviews Card */}
              <div className="bg-green-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                    <i className="bi bi-chat-quote text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#004f15]">
                      {teachingOverview?.pendingReviews || 0}
                    </h3>
                    <p className="text-sm font-medium text-[#004f15]">
                      Pending Reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Classes Section - Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm animate-[fadeInUp_0.6s_ease-out_0.45s_both]">
            <h3 className="text-xl font-bold text-black mb-4">
              Recent Classes
            </h3>
            {recentClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent classes available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentClasses.map((classItem, index) => {
                  const colors = ["#0857bf", "#18c947", "#ff8b3d"];
                  const color = colors[index % colors.length];
                  return (
                    <div
                      key={classItem.id || index}
                      className="bg-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all duration-300 hover:translate-x-1 border border-gray-200"
                      style={{ borderLeftWidth: "4px", borderLeftColor: color }}
                    >
                      <div>
                        <h4 className="font-semibold text-[#0b1633] mb-1">
                          {classItem.name || classItem.subject || "Class"}
                        </h4>
                        <p className="text-sm text-black">
                          {classItem.sections || classItem.className || ""} -{" "}
                          {classItem.studentCount || 0} Students
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        View Class
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Messages Section - Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#0b1633]">
                Recent Messages
              </h3>
              <button
                onClick={() => navigate("/teacher/messages")}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <span className="text-black text-sm font-medium hover:underline">
                  View All Messages
                </span>
              </button>
            </div>
            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent messages available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((message, index) => {
                  const name =
                    message.name ||
                    message.studentName ||
                    message.participantName ||
                    "Student";
                  const initials = name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2);
                  const subject =
                    message.subject || message.className || "General";
                  const lastMessage =
                    message.lastMessage?.content ||
                    message.preview ||
                    "No message preview";

                  return (
                    <div
                      key={message.id || index}
                      className="bg-gray-200 border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 hover:translate-x-1 cursor-pointer"
                      onClick={() => navigate("/teacher/messages")}
                    >
                      <div className="w-12 h-12 bg-[#0b1633] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">
                          {initials}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#0b1633] mb-1">
                          {name}
                        </h4>
                        <p className="text-sm text-black mb-1">{subject}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Banner */}
          <div className="bg-[#0857bf] rounded-lg p-8 text-center animate-[fadeInUp_0.6s_ease-out_0.55s_both]">
            <p className="text-white text-xl font-bold mb-2">
              Making a difference one student at a time{" "}
              <i className="bi bi-star-fill text-yellow-400"></i>
            </p>
            <p className="text-white/80 text-sm">
              Your dedication shapes the future of your students
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TeacherProfile;
