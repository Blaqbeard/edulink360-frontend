import React from "react";
import { X, LogOut } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Log Out</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





