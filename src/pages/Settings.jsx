import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Input from "../components/common/Input";
import ToggleSwitch from "../components/common/ToggleSwitch";

const SettingItem = ({ title, description, control }) => (
  <div className="flex items-center justify-between py-4">
    <div className="pr-4">
      <p className="font-semibold text-gray-800">{title}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <div className="flex-shrink-0">{control}</div>
  </div>
);

export default function Settings() {
  const [email, setEmail] = useState("adaokafor@edulink360.com");
  const [toggles, setToggles] = useState({
    assignmentUpdate: true,
    feedbackAlerts: true,
    messageNotification: false,
    deadlineReminders: true,
    showProfile: true,
    performanceAnalytics: true,
  });

  const handleToggleChange = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    // Main container with a light gray background
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">
              Manage your account preferences and settings
            </p>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="space-y-4 mb-8">
          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={true}
          />
          <a
            href="#"
            className="block text-sm font-medium text-blue-600 hover:underline"
          >
            Change Password
          </a>
        </div>

        {/* Two-Factor Auth Section */}
        <div className="flex items-center justify-between py-4 border-y mb-8">
          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
          <button className="text-sm font-semibold bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300">
            Enable
          </button>
        </div>

        {/* Notifications Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold">Notifications</h2>
          <p className="text-sm text-gray-500 mb-2">
            Control how you stay updated with your class progress
          </p>
          <div className="divide-y divide-gray-100">
            <SettingItem
              title="Assignment Update"
              description="Control how you stay updated with your class progress"
              control={
                <ToggleSwitch
                  isOn={toggles.assignmentUpdate}
                  onToggle={() => handleToggleChange("assignmentUpdate")}
                />
              }
            />
            <SettingItem
              title="Feedback Alerts"
              description="Get notified when new assignments are posted"
              control={
                <ToggleSwitch
                  isOn={toggles.feedbackAlerts}
                  onToggle={() => handleToggleChange("feedbackAlerts")}
                />
              }
            />
            <SettingItem
              title="Message Notification"
              description="Get notified about new messages"
              control={
                <ToggleSwitch
                  isOn={toggles.messageNotification}
                  onToggle={() => handleToggleChange("messageNotification")}
                />
              }
            />
            <SettingItem
              title="Deadline Reminders"
              description="Receive reminders before assignment deadline"
              control={
                <ToggleSwitch
                  isOn={toggles.deadlineReminders}
                  onToggle={() => handleToggleChange("deadlineReminders")}
                />
              }
            />
          </div>
        </div>

        {/* Privacy and Accessibility Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold">Privacy and Accessibility</h2>
          <p className="text-sm text-gray-500 mb-2">
            Make your learning space feel like you
          </p>
          <div className="divide-y divide-gray-100">
            <SettingItem
              title="Show profile to other students"
              description="Allow other students view your profile details"
              control={
                <ToggleSwitch
                  isOn={toggles.showProfile}
                  onToggle={() => handleToggleChange("showProfile")}
                />
              }
            />
            <SettingItem
              title="Data Sharing"
              control={
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Manage
                </a>
              }
            />
          </div>
        </div>

        {/* Performance Analytics Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <SettingItem
            title="Performance Analytics"
            description="Enable detailed tracking"
            control={
              <ToggleSwitch
                isOn={toggles.performanceAnalytics}
                onToggle={() => handleToggleChange("performanceAnalytics")}
              />
            }
          />
          <div className="border-t border-gray-100">
            <SettingItem
              title="Feedback Template"
              control={
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Manage
                </a>
              }
            />
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-12 space-y-2">
          <a
            href="#"
            className="block text-sm font-medium text-red-600 hover:underline"
          >
            Deactivate Account
          </a>
          <a
            href="#"
            className="block text-sm font-medium text-red-600 hover:underline"
          >
            Delete Account
          </a>
        </div>
      </div>
    </div>
  );
}
