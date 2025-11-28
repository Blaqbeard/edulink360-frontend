import { useState, useEffect } from "react";
import { portfolioService } from "../services/portfolioService";

export default function Portfolio() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portfolioService.getPortfolio();
      const list = Array.isArray(data) 
        ? data 
        : Array.isArray(data?.documents) 
        ? data.documents 
        : Array.isArray(data?.data) 
        ? data.data 
        : [];
      setDocuments(list);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load portfolio documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setStatusMessage(null);
      setError(null);
      await portfolioService.uploadDocument(file);
      setStatusMessage("Document uploaded successfully!");
      await fetchPortfolio();
      event.target.value = ""; // Reset file input
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      setError(null);
      await portfolioService.deleteDocument(documentId);
      setStatusMessage("Document deleted successfully.");
      await fetchPortfolio();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to delete document. Please try again."
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext)) return "bi-file-earmark-pdf";
    if (["doc", "docx"].includes(ext)) return "bi-file-earmark-word";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "bi-file-earmark-image";
    if (["zip", "rar"].includes(ext)) return "bi-file-earmark-zip";
    return "bi-file-earmark";
  };

  return (
    <div className="w-full max-w-6xl p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Portfolio</h1>
          <p className="text-sm text-gray-500">
            Upload and manage your academic achievements and documents.
          </p>
        </div>
        <label className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
          />
          {uploading ? "Uploading..." : "Upload Document"}
        </label>
      </div>

      {statusMessage && (
        <div className="px-4 py-2 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm">
          {statusMessage}
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading portfolio...</p>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center text-gray-500">
          <i className="bi bi-folder-x text-4xl mb-4 block"></i>
          <p className="text-lg font-medium mb-2">No documents yet</p>
          <p className="text-sm">Upload your first document to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <i className={`bi ${getFileIcon(doc.fileName || doc.name)} text-2xl text-blue-600`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {doc.fileName || doc.name || "Document"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(doc.uploadedAt || doc.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id || doc.documentId)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Delete document"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              {doc.filePath && (
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <i className="bi bi-download"></i>
                  View/Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

