import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const containerVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ForgotPassword() {
  const appDiv = document.getElementById("app");
  const forgotPasswordRoute = appDiv?.dataset?.forgotPasswordRoute;
  const csrfToken = appDiv?.dataset?.csrf;

  const [email, setEmail] = useState("");
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
      const response = await fetch(forgotPasswordRoute, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Unexpected response format");
      }

      if (!response.ok || data.status === "error") {
        setErrorMsg(data.message || "We couldn't find an account with that email.");
        return;
      }

      if (data.status === "success") {
        isSuccess = true;
        setSuccessMsg(data.message || "OTP sent to your email.");

        sessionStorage.setItem("reset_email", email);

        setTimeout(() => {
          window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
        }, 1200);
      }
    } catch (error) {
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full p-10 flex flex-col items-center"
      >
        {/* Logo Section */}
        <motion.div variants={fieldVariants} className="flex flex-col items-center mb-6 text-center">
          <img src={logo} alt="Al Mairaaj" className="w-60 h-auto mb-2" />
          <h2 className="text-xl font-semibold text-gray-800 mt-1">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we'll send you a one-time code to reset your password.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <motion.div variants={fieldVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          <motion.button
            variants={fieldVariants}
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div variants={fieldVariants} className="text-center mt-4 text-sm text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-teal-600 hover:underline font-medium">
            Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}