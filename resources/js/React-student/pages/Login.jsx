import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png"; // your Al Mairaaj logo
import sideImage from "../assets/sideimage.png"; // right side image

export default function Login() {
  const appDiv = document.getElementById("app");
  const loginRoute = appDiv?.dataset?.loginRoute;
  const csrfToken = appDiv?.dataset?.csrf;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    let isSuccess = false;

    try {
      const response = await fetch(loginRoute, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Unexpected response format");
      }

      if (!response.ok || data.status === "error") {
        setErrorMsg(data.message || "Invalid credentials. Please try again.");
        return;
      }

      if (data.status === "success") {
        isSuccess = true;
        setSuccessMsg("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Network error. Please try again.");
    } finally {
      if (!isSuccess) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 to-teal-400 p-4 relative">
      {/* Toast Notifications */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 w-[90%] max-w-md items-center">
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
              className="bg-white border-b-4 border-red-500 shadow-2xl rounded-lg flex items-center justify-center px-4 py-4 w-full"
            >
              <div className="text-red-500 font-semibold text-center">
                {errorMsg}
              </div>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
              className="bg-white border-b-4 border-green-500 shadow-2xl rounded-lg flex items-center justify-center px-4 py-4 w-full"
            >
              <div className="text-green-600 font-semibold text-center">
                {successMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Al Mairaaj" className="w-40 h-auto mb-2" />
            <h2 className="text-xl font-semibold text-gray-800">Login</h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Enter your information to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-teal-600 hover:underline font-medium"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <img
            src={sideImage}
            alt="Learning Platform"
            className="w-3/4 h-auto object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
