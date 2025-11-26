import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import SettingsRow from "../components/settings/SettingsRow";

export default function Settings() {
  // State for the form fields
  const [email, setEmail] = useState("adaokafor@edulink360.com");

  // State for all the toggle switches
  const [toggles, setToggles] = useState({
    assignmentUpdate: true,
    feedbackAlerts: true,
    messageNotification: false,
    deadlineReminders: true,
    showProfile: true,
    performanceAnalytics: true,
  });

  // Handler to update a specific toggle
  const handleToggleChange = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
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

      {/* Account Info Card */}
      <Card className="mb-8">
        <Input
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={true} //
        />
      </Card>

      {/* Security Section */}
      <div className="mb-8 p-4 border-y">
        <div className="flex items-center justify-between py-2">
          <button className="font-semibold text-blue-600 hover:underline">
            Change Password
          </button>
        </div>
        <div className="flex items-center justify-between py-2">
          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
          <Button variant="secondary" className="py-1 px-4">
            Enable
          </Button>
        </div>
      </div>

      {/* Notifications Card */}
      <Card className="mb-8 divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-gray-500">
            Control how you stay updated with your class progress
          </p>
        </div>
        <div className="px-6">
          <SettingsRow
            title="Assignment Update"
            description="Control how you stay updated with your class progress"
            controlType="toggle"
            isToggled={toggles.assignmentUpdate}
            onToggle={() => handleToggleChange("assignmentUpdate")}
          />
          <SettingsRow
            title="Feedback Alerts"
            description="Get notified when new assignments are posted"
            controlType="toggle"
            isToggled={toggles.feedbackAlerts}
            onToggle={() => handleToggleChange("feedbackAlerts")}
          />
          <SettingsRow
            title="Message Notification"
            description="Get notified about new messages"
            controlType="toggle"
            isToggled={toggles.messageNotification}
            onToggle={() => handleToggleChange("messageNotification")}
          />
          <SettingsRow
            title="Deadline Reminders"
            description="Receive reminders before assignment deadline"
            controlType="toggle"
            isToggled={toggles.deadlineReminders}
            onToggle={() => handleToggleChange("deadlineReminders")}
          />
        </div>
      </Card>

      {/* Privacy and other cards would follow the same pattern... */}
      {/* For brevity, I'll add the final account actions */}

      <div className="mt-12 text-sm">
        <button className="text-red-600 font-semibold hover:underline">
          Deactivate Account
        </button>

        <button className="text-red-600 font-semibold hover:underline mt-2">
          Delete Account
        </button>
      </div>
    </div>
  );
}
