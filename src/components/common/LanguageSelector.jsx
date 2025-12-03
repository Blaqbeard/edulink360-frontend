import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "ar", name: "العربية" },
    { code: "ha", name: "Hausa" },
    { code: "yo", name: "Yoruba" },
    { code: "ig", name: "Igbo" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        title="Select Language"
      >
        <Globe className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Select Language</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-not-allowed opacity-60"
              >
                <span className="text-sm text-gray-700">{lang.name}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


