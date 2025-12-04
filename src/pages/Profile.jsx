import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Camera,
  Phone,
  Mail,
  User,
  BookOpen,
  BarChart2,
} from "lucide-react";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import StatCard from "../components/common/StatCard";
import CourseClassSelector from "../components/Student/CourseClassSelector";
import { studentService } from "../services/studentService";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((segment) => segment?.[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .substring(0, 2) || "ST";

const normalizeProfile = (profile = {}) => {
  const firstName = profile.firstName || profile.firstname;
  const lastName = profile.lastName || profile.lastname;
  const fallbackName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const fullName = profile.fullName || profile.name || fallbackName || "Student";
  const className =
    profile.className ||
    profile.class ||
    profile.classroom ||
    profile.currentClass ||
    "";

  return {
    fullName,
    email: profile.email || "",
    phone: profile.phone || profile.phoneNumber || "",
    bio: profile.bio || profile.about || "",
    studentId:
      profile.studentId ||
      profile.studentID ||
      profile.student_id ||
      profile.id ||
      "",
    className,
    initials: getInitials(fullName),
    avatarUrl: profile.avatarUrl || profile.photoUrl || profile.profilePhoto || "",
    courses: Array.isArray(profile.courses)
      ? profile.courses.filter(Boolean)
      : [],
    classes: Array.isArray(profile.classes)
      ? profile.classes.filter(Boolean)
      : [],
  };
};

const formatStatValue = (value, suffix = "") =>
  typeof value === "number" && !Number.isNaN(value) ? `${value}${suffix}` : "—";

const buildProgressStats = (summary) => [
  {
    icon: <User />,
    value: formatStatValue(
      summary?.completedAssignments ?? summary?.completed ?? null
    ),
    label: "Assignments Completed",
    color: "blue",
  },
  {
    icon: <BookOpen />,
    value: formatStatValue(
      summary?.totalCourses ?? summary?.coursesEnrolled ?? null
    ),
    label: "Courses Enrolled",
    color: "orange",
  },
  {
    icon: <BarChart2 />,
    value: formatStatValue(
      summary?.averageGrade ?? summary?.performance ?? null,
      "%"
    ),
    label: "Average Performance",
    color: "green",
  },
];

export default function Profile() {
  const [userData, setUserData] = useState(normalizeProfile());
  const [profileSnapshot, setProfileSnapshot] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [profileRes, summaryRes] = await Promise.all([
          studentService.getProfile().catch(() => null),
          studentService.getDashboardSummary().catch(() => null),
        ]);

        if (profileRes) {
          const normalized = normalizeProfile(profileRes);
          setUserData(normalized);
          setProfileSnapshot(normalized);
        }

        if (summaryRes) {
          setDashboardSummary(summaryRes);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setStatus(null);
    setIsSaving(true);
    try {
      const payload = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        bio: userData.bio,
      };
      const updatedProfile = await studentService.updateProfile(payload);
      const normalized = normalizeProfile(updatedProfile ?? payload);
      setUserData(normalized);
      setProfileSnapshot(normalized);
    setIsEditing(false);
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to save changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileSnapshot) {
      setUserData(profileSnapshot);
    }
    setIsEditing(false);
    setStatus(null);
  };

  const progressStats = buildProgressStats(dashboardSummary);
  const renderChipList = (items = [], emptyLabel = "Not selected") =>
    items && items.length ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">{emptyLabel}</p>
    );
  const classTeacher =
    dashboardSummary?.classTeacher ||
    dashboardSummary?.advisor ||
    dashboardSummary?.homeroomTeacher ||
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      <Card>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="h-24 w-24 flex items-center justify-center rounded-full bg-blue-600 text-white text-4xl font-bold">
              {userData.initials}
            </div>
            <button
              className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md border hover:bg-gray-100"
              onClick={() =>
                setStatus({
                  type: "info",
                  message: "Profile photo uploads are coming soon.",
                })
              }
            >
              <Camera size={16} className="text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {userData.fullName}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Edit2 size={18} />
            </button>
          </div>
          <p className="text-gray-500">
            {userData.className || "Class info coming soon"} - Student ID:{" "}
            {userData.studentId || "N/A"}
          </p>
          {(userData.courses?.length > 0 || userData.classes?.length > 0) && (
            <p className="text-sm text-gray-600 mt-1">
              {userData.courses?.length > 0 && (
                <span>Courses: {userData.courses.join(", ")}</span>
              )}
              {userData.courses?.length > 0 && userData.classes?.length > 0 && " • "}
              {userData.classes?.length > 0 && (
                <span>Classes: {userData.classes.join(", ")}</span>
              )}
            </p>
          )}
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="text-gray-500" />
            <span className="text-gray-700">
              {userData.phone || "Not provided"}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="text-gray-500" />
            <span className="text-gray-700">
              {userData.email || "Not provided"}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        {status && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : status.type === "error"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-blue-50 text-blue-600 border border-blue-100"
            }`}
          >
            {status.message}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">About Me</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit2 size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <Input
            label="Full Name"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <div className="w-full">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={userData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            ></textarea>
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </Card>

      {/* Course and Class Level Selection */}
      <CourseClassSelector />

      {/* Display selected courses/classes */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Your Courses & Classes</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Courses</p>
            {renderChipList(
              userData.courses,
              "Select your courses to populate this list."
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Classes</p>
            {renderChipList(
              userData.classes,
              "Select your classes to populate this list."
            )}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Progress Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Your Class Teacher</h3>
        {classTeacher ? (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold">
                {getInitials(classTeacher.name || "Teacher")}
            </div>
            <div>
                <p className="font-bold text-gray-800">{classTeacher.name}</p>
                <p className="text-sm text-gray-500">
                  {classTeacher.role || "Class Advisor"}
                  {classTeacher.class
                    ? ` • ${classTeacher.class}`
                    : userData.className
                    ? ` • ${userData.className}`
                    : ""}
                </p>
                {classTeacher.officeHours && (
              <p className="text-xs text-gray-400">
                    Office Hours: {classTeacher.officeHours}
              </p>
                )}
            </div>
          </div>
          <Button className="py-1 px-4">Send Message</Button>
        </div>
        ) : (
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-100">
            Teacher assignment info will appear here once your school shares it.
          </div>
        )}
      </Card>

      <div className="bg-blue-600 text-white text-center p-6 rounded-lg">
        <h4 className="font-bold">
          Keep up the great work, {userData.fullName.split(" ")[0]} 👋
        </h4>
        <p className="text-sm text-blue-200">
          You're on track to achieve amazing things this term.
        </p>
      </div>
    </div>
  );
}
