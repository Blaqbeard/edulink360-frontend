import React, { useState, useEffect } from "react";
import { profileService } from "../../services/profileService";
import Button from "../common/Button";
import Card from "../common/Card";
import { BookOpen } from "lucide-react";

// Mock data for available courses a teacher can manage
const AVAILABLE_MANAGED_COURSES = [
  "Mathematics",
  "English Language",
  "Physics 101",
  "Chemistry Lab",
  "Biology Practical",
];

export default function SubjectSelector({ onUpdate }) {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Load existing selections from profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getProfile();
        const profileData = response?.data || response || {};
        const managed = Array.isArray(profileData.managedCourses)
          ? profileData.managedCourses
          : Array.isArray(profileData.classesManaged)
          ? profileData.classesManaged
          : Array.isArray(profileData.subjects)
          ? profileData.subjects
          : [];
        if (managed.length) {
          setSelectedCourses(managed);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Silently fail - user can still select subjects
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleCourseToggle = (courseName) => {
    setSelectedCourses((prev) =>
      prev.includes(courseName)
        ? prev.filter((c) => c !== courseName)
        : [...prev, courseName]
    );
  };

  const handleSave = async () => {
    setStatus(null);
    setSaving(true);
    try {
      const payload = {
        managedCourses: selectedCourses,
      };
      await profileService.updateProfile(payload);
      
      // Reload profile to get updated data
      try {
        const response = await profileService.getProfile();
        const profileData = response?.data || response || {};
        const managed = Array.isArray(profileData.managedCourses)
          ? profileData.managedCourses
          : Array.isArray(profileData.classesManaged)
          ? profileData.classesManaged
          : Array.isArray(profileData.subjects)
          ? profileData.subjects
          : [];
        // Update local state with fresh data from backend
        setSelectedCourses(managed);
      } catch (reloadError) {
        console.warn("Could not reload profile after save:", reloadError);
        // Keep the current selection even if reload fails
      }
      
      setStatus({
        type: "success",
        message: "Courses updated!",
      });
      
      // Notify parent component to refresh profile
      if (onUpdate && typeof onUpdate === "function") {
        onUpdate();
      }
      
      // Clear status after 3 seconds
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update courses. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {status && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="space-y-6">
        {/* Select Subjects Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Select Courses You Manage
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Select all courses or cohorts you currently manage (multiple selections allowed)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_MANAGED_COURSES.map((courseName) => (
              <label
                key={courseName}
                className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(courseName)}
                  onChange={() => handleCourseToggle(courseName)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  {courseName}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Courses"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

