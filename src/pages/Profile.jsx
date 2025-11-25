import React, { useState } from "react";
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

// Mock data for the page
const initialUserData = {
  fullName: "Ada Okafor",
  email: "adaokafor@edulink360.com",
  phone: "+234 813 456 7890",
  bio: "Passionate about coding and UX design. I love building beautiful interfaces and solving complex problems with elegant solutions. Currently exploring React patterns and accessibility best practices.",
  studentId: "STU2025-234",
  class: "SS2D",
  initials: "AO",
  avatarUrl: "", // We can leave this empty and use initials
};

const progressStats = [
  {
    icon: <User />,
    value: "12",
    label: "Assignments Completed",
    color: "blue",
  },
  {
    icon: <BookOpen />,
    value: "6",
    label: "Courses Enrolled",
    color: "orange",
  },
  {
    icon: <BarChart2 />,
    value: "80%",
    label: "Average Performance",
    color: "green",
  },
];

export default function Profile() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // In a real app, you would send this data to an API
    console.log("Saving data:", userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUserData(initialUserData); // Revert changes
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Header Card */}
      <Card>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="h-24 w-24 flex items-center justify-center rounded-full bg-blue-600 text-white text-4xl font-bold">
              {userData.initials}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md border hover:bg-gray-100">
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
            {userData.class} - Student ID: {userData.studentId}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="text-gray-500" />
            <span className="text-gray-700">{userData.phone}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="text-gray-500" />
            <span className="text-gray-700">{userData.email}</span>
          </div>
        </div>
      </Card>

      {/* About Me Form Card */}
      <Card>
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
            value={userData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            id="phone"
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
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        )}
      </Card>

      {/* Progress Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Progress Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Your Class Teacher Card */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Your Class Teacher</h3>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold">
              AA
            </div>
            <div>
              <p className="font-bold text-gray-800">Mr. Aina Adewale</p>
              <p className="text-sm text-gray-500">Computer Science</p>
              <p className="text-xs text-gray-400">
                Office Hours: Mon-Fri, 10AM - 2PM
              </p>
            </div>
          </div>
          <Button className="py-1 px-4">Send Message</Button>
        </div>
      </Card>

      {/* Encouragement Banner */}
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
