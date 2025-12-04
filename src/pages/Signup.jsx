import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const certificateFileRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    role: "student",
    teacherId: "",
    schoolName: "",
  });
  const [certificateFileName, setCertificateFileName] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setCertificateFileName(file ? file.name : "");
  };

  // Validation function (similar to Login)
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (!formData.agreeToTerms)
      return "You must agree to the Terms of Service and Privacy Policy";

    if (formData.role === "teacher") {
      if (!formData.teacherId.trim()) return "Teacher ID is required";
      if (!formData.schoolName.trim()) return "School name is required";
      if (!certificateFileRef.current?.files?.[0]) {
        return "Please upload your teaching certificate for verification";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    // 1️⃣ Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // 2️⃣ Create FormData for API call (match backend spec)
      const submitData = new FormData();
      const normalizedRole =
        formData.role?.toUpperCase() === "TEACHER" ? "TEACHER" : "STUDENT";
      const isTeacherSignup = normalizedRole === "TEACHER";

      submitData.append("name", formData.name.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("password", formData.password);
      submitData.append("role", normalizedRole);

      // Only add teacher-specific fields if role is "TEACHER"
      if (isTeacherSignup) {
        submitData.append("teacherId", formData.teacherId.trim());
        submitData.append("schoolName", formData.schoolName.trim());

        // Add credential file if provided (backend expects `file`)
        const certificateFile = certificateFileRef.current?.files?.[0];
        if (certificateFile) {
          submitData.append("file", certificateFile);
        }
      }
      // For students, teacherId/schoolName/file are intentionally not appended

      // 3️⃣ Call signup API
      const response = await authService.signup(submitData);

      // 4️⃣ Show success notification
      alert(
        `Account created successfully! ${
          isTeacherSignup
            ? "Your account will be activated after credential review."
            : "You can now log in."
        }`
      );

      // 5️⃣ Redirect based on role
      if (response.token) {
        // Auto-login if token is returned
        const redirectPath = isTeacherSignup ? "/teacher/dashboard" : "/";
        navigate(redirectPath);
      } else {
        // Redirect to login if no auto-login
        navigate("/login");
      }
    } catch (error) {
      // 6️⃣ Handle errors
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed. Please try again.";
      setFormError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      {/* Form Header */}
      <div className="mb-6 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 text-sm">
              Sign up to get started with your learning journey
            </p>
          </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
            <div className="animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                required
              />
            </div>

        {/* Email Field */}
            <div className="animate-[fadeInUp_0.5s_ease-out_0.4s_both]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                required
              />
            </div>

        {/* Role Selection */}
            <div className="animate-[fadeInUp_0.5s_ease-out_0.45s_both]">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                I am signing up as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["student", "teacher"].map((roleOption) => (
                  <button
                    type="button"
                    key={roleOption}
                    onClick={() => handleRoleChange(roleOption)}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 font-semibold ${
                      formData.role === roleOption
                        ? "bg-blue-700 text-white border-transparent shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#00B4D8]"
                    }`}
                  >
                    {roleOption === "student" ? "Student" : "Teacher"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Teachers will be asked to verify their credentials to keep the
                community secure.
              </p>
            </div>

        {/* Password Field */}
            <div className="animate-[fadeInUp_0.5s_ease-out_0.55s_both]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    } text-lg`}
                  ></i>
                </button>
              </div>
            </div>

        {/* Confirm Password Field */}
            <div className="animate-[fadeInUp_0.5s_ease-out_0.6s_both]">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    } text-lg`}
                  ></i>
                </button>
              </div>
            </div>

        {/* Teacher Verification Fields */}
        {formData.role === "teacher" && (
              <div className="space-y-4 animate-[fadeInUp_0.5s_ease-out_0.65s_both] border border-blue-100 rounded-xl p-4 bg-blue-50/40">
                <div>
                  <label
                    htmlFor="teacherId"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Teacher ID / Certification Number
                  </label>
                  <input
                    type="text"
                    id="teacherId"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    placeholder="e.g. TCH-4521"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="schoolName"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    School / Institution
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Enter your present school"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Upload Teaching Certificate (PDF/JPG/PNG)
                  </p>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="certificateUpload"
                      className="px-4 py-2 bg-white border border-dashed border-[#00B4D8] text-[#00B4D8] rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-200 text-sm font-semibold"
                    >
                      {certificateFileName
                        ? "Replace document"
                        : "Upload document"}
                    </label>
                    {certificateFileName && (
                      <span className="text-xs text-gray-600">
                        {certificateFileName}
                      </span>
                    )}
                    <input
                      id="certificateUpload"
                      ref={certificateFileRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We will review this document before activating your teacher
                    dashboard.
                  </p>
                </div>
              </div>
        )}

        {/* Terms and Privacy Checkbox */}
        <div className="flex items-start gap-3 animate-[fadeInUp_0.5s_ease-out_0.7s_both]">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-[#00B4D8] bg-gray-100 border-gray-300 rounded focus:ring-[#00B4D8] focus:ring-2 cursor-pointer transition-all duration-200 hover:scale-110"
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-700 hover:underline transition-all duration-200 hover:scale-105 inline-block"
                >
                  Terms Of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-700 hover:underline transition-all duration-200 hover:scale-105 inline-block"
                >
                  Privacy Policy
                </a>
              </label>
        </div>

        {formData.role === "teacher" && (
              <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-3 animate-[fadeInUp_0.5s_ease-out_0.75s_both]">
                Teacher accounts are activated after credential review. Ensure
                the information above is accurate so we can verify you quickly.
              </div>
        )}

        {formError && (
              <div className="text-sm text-red-600 font-semibold animate-[fadeIn_0.4s_ease-out_0.8s_both]">
                {formError}
              </div>
        )}

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-[#0096B3] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:ring-offset-2 animate-[fadeInUp_0.5s_ease-out_0.8s_both] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-700 animate-[fadeInUp_0.5s_ease-out_0.9s_both]">
          already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-700 hover:underline font-medium transition-all duration-200 hover:scale-105 inline-block"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
