import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { fetchCsrfToken } from "../utils/csrf";

// Fixed, well-known endpoint - no need to read it out of the page's DOM.
const OTP_VERIFY_ROUTE = "/verify-otp-auth";

// Animation variants
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

export default function Otp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get email from Laravel blade's data attribute
    const el = document.getElementById("app");

    if (el && el.dataset.email) {
      setEmail(el.dataset.email);
    } else {
      // Try to get email from URL params as fallback
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromUrl = urlParams.get('email');
      if (emailFromUrl) {
        setEmail(emailFromUrl);
      }
    }
  }, []);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    let isSuccess = false;

    try {
      const csrfToken = await fetchCsrfToken();

      const response = await fetch(OTP_VERIFY_ROUTE, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.redirect) {
        isSuccess = true;
        setSuccessMsg(data.message);

        setTimeout(() => {
          window.location.href = data.redirect;
        }, 1500);

        return;
      }

      if (!response.ok) {
        setErrorMsg(
          response.status === 419
            ? "Your session had expired. Please try again."
            : data.message || "OTP verification failed. Please try again."
        );
        return;
      }

      if (data.status === "success") {
        isSuccess = true;
        setSuccessMsg(data.message);
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
          <p className="text-sm text-gray-500 mt-1">
            Please enter your OTP to verify your account
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
          <motion.div variants={fieldVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* OTP */}
          <motion.div variants={fieldVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              OTP <span className="text-red-500">*</span>
            </label>
            <input
              name="otp"
              type="text"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow tracking-widest text-center text-lg font-semibold"
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
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div variants={fieldVariants} className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-teal-600 hover:underline font-medium"
          >
            Register
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}