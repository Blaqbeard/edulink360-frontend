import { useState, useEffect } from "react";
import { careerService } from "../services/careerService";

export default function CareerGuidance() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [careerStories, setCareerStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "quiz") {
      fetchQuizQuestions();
    } else {
      fetchCareerStories();
    }
  }, [activeTab]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careerService.getQuizQuestions();
      const questions = Array.isArray(data) 
        ? data 
        : Array.isArray(data?.questions) 
        ? data.questions 
        : Array.isArray(data?.data) 
        ? data.data 
        : [];
      setQuizQuestions(questions);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load quiz questions."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCareerStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careerService.getCareerStories();
      const stories = Array.isArray(data) 
        ? data 
        : Array.isArray(data?.stories) 
        ? data.stories 
        : Array.isArray(data?.data) 
        ? data.data 
        : [];
      setCareerStories(stories);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load career stories."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Career Guidance</h1>
        <p className="text-sm text-gray-500">
          Explore career paths and discover your potential.
        </p>
      </div>

      {/* AI Mentor Chat - Coming Soon */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="bi bi-robot text-2xl text-blue-600"></i>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">AI-Powered Mentor Chat</h3>
            <p className="text-sm text-blue-700">
              Coming Soon: Get personalized career guidance from our AI mentor. The AI mentor chat feature will be available in a future update.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "quiz"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Career Quiz
        </button>
        <button
          onClick={() => setActiveTab("stories")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "stories"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Career Stories
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : activeTab === "quiz" ? (
        quizQuestions.length > 0 ? (
          <div className="space-y-4">
            {quizQuestions.map((question, index) => (
              <div
                key={question.id || index}
                className="border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-3">
                  {index + 1}. {question.question || question.text}
                </h3>
                {question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id || index}`}
                          value={option}
                          className="text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Submit Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
            <i className="bi bi-clipboard-question text-4xl text-gray-300 mb-4 block"></i>
            <p className="text-gray-500 font-medium">No quiz questions available</p>
          </div>
        )
      ) : (
        careerStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerStories.map((story, index) => (
              <div
                key={story.id || index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {story.title || story.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {story.description || story.content || story.story}
                </p>
                {story.author && (
                  <p className="text-xs text-gray-500 mt-3">
                    By {story.author}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
            <i className="bi bi-book text-4xl text-gray-300 mb-4 block"></i>
            <p className="text-gray-500 font-medium">No career stories available</p>
          </div>
        )
      )}
    </div>
  );
}

