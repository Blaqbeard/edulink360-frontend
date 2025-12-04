import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";
import Button from "../common/Button";
import Card from "../common/Card";
import { BookOpen, GraduationCap } from "lucide-react";

// Mock data for available courses and classes
const AVAILABLE_COURSES = [
  "Mathematics",
  "English Language",
  "Physics",
  "History",
  "Biology",
];

const AVAILABLE_CLASSES = ["JSS1-A", "JSS2-B", "SSS1-C", "SSS3-A"];

export default function CourseClassSelector() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Load existing selections from profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await studentService.getProfile();
        // Handle different response structures
        const profileData = profile?.data || profile || {};
        if (Array.isArray(profileData.courses)) {
          setSelectedCourses(profileData.courses);
        }
        if (Array.isArray(profileData.classes)) {
          setSelectedClasses(profileData.classes);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Silently fail - user can still select courses/classes
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleCourseToggle = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleClassToggle = (classLevel) => {
    // For class level, we allow multiple selections but visually guide as single-select
    // User can select multiple if needed
    setSelectedClasses((prev) =>
      prev.includes(classLevel)
        ? prev.filter((c) => c !== classLevel)
        : [...prev, classLevel]
    );
  };

  const handleSave = async () => {
    setStatus(null);
    setSaving(true);
    try {
      const payload = {
        courses: selectedCourses,
        classes: selectedClasses,
      };
      await studentService.updateProfile(payload);
      setStatus({
        type: "success",
        message: "Courses and Class Level updated!",
      });
      // Clear status after 3 seconds
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update courses and class level. Please try again.",
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
        {/* Select Courses Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Select Courses
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Select all courses you are enrolled in (multiple selections allowed)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_COURSES.map((course) => (
              <label
                key={course}
                className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={() => handleCourseToggle(course)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">{course}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Select Class Level Section */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Select Class Level
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Select your class level (you can select multiple if needed)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_CLASSES.map((classLevel) => (
              <label
                key={classLevel}
                className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(classLevel)}
                  onChange={() => handleClassToggle(classLevel)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">{classLevel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Courses & Class Level"}
          </Button>
        </div>
      </div>
    </Card>
  );
}


