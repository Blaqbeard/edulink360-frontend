import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation + API error message
  const [error, setError] = useState("");

  // Frontend validation
  const validateForm = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 1️⃣ Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // 2️⃣ Backend login (AuthContext)
    const res = await login(email, password);

    if (!res.success) {
      setError(res.message || "Authentication failed. Try again.");
      return;
    }

    // 3️⃣ Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="animate-fadeIn">
      <button
        onClick={() => navigate("/signup")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Sign Up
      </button>

      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back to EduLink360
      </h1>
      <p className="mt-2 text-gray-600">
        Sign in to continue to your dashboard
      </p>

      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-100 text-red-600 text-sm border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error && error.toLowerCase().includes("email")}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error && error.toLowerCase().includes("password")}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
