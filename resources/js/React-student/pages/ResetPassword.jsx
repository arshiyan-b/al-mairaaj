import React, { useEffect, useState } from "react";
import { data, Link } from "react-router-dom";
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

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function ResetPassword() {
  const appDiv = document.getElementById("app");
  const verifyResetOtpRoute = appDiv?.dataset?.verifyResetOtpRoute;
  const resetPasswordRoute = appDiv?.dataset?.resetPasswordRoute;
  const csrfToken = appDiv?.dataset?.csrf;

  const [step, setStep] = useState(1); // 1 = OTP, 2 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = document.getElementById("app");
    if (el && el.dataset.email) {
      setEmail(el.dataset.email);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromUrl = urlParams.get("email");
      if (emailFromUrl) {
        setEmail(emailFromUrl);
      } else {
        const stored = sessionStorage.getItem("reset_email");
        if (stored) setEmail(stored);
      }
    }
  }, []);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(verifyResetOtpRoute, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        setErrorMsg(data.message || "Invalid or expired OTP. Please try again.");
        return;
      }

      // Server may return a short-lived reset token to authorize the next step
      if (data.reset_token) {
        setResetToken(data.reset_token);
      }

      setSuccessMsg(data.message);
      setStep(2);
    } catch (error) {
      setErrorMsg(data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    let isSuccess = false;

    try {
      const response = await fetch(resetPasswordRoute, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
          reset_token: resetToken,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        setErrorMsg(data.message || "Could not reset password. Please try again.");
        return;
      }

      if (data.status === "success") {
        isSuccess = true;
        setSuccessMsg(data.message || "Password reset successfully.");
        sessionStorage.removeItem("reset_email");

        setTimeout(() => {
          window.location.href = data.redirect || "/login";
        }, 1500);
      }
    } catch (error) {
      setErrorMsg(data.message);
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
          <h2 className="text-xl font-semibold text-gray-800 mt-1">
            {step === 1 ? "Verify OTP" : "Reset Password"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1
              ? "Enter the OTP sent to your email to continue."
              : "Choose a new password for your account."}
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div variants={fieldVariants} className="flex items-center gap-2 mb-6">
          <div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? "bg-teal-500" : "bg-gray-200"}`} />
          <div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? "bg-teal-500" : "bg-gray-200"}`} />
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="otp-step"
              initial="enter"
              animate="center"
              exit="exit"
              variants={stepVariants}
              onSubmit={handleOtpSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div>
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
              </div>

              <div>
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
              </div>

              <motion.button
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
            </motion.form>
          ) : (
            <motion.form
              key="password-step"
              initial="enter"
              animate="center"
              exit="exit"
              variants={stepVariants}
              onSubmit={handleResetSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                />
              </div>

              <motion.button
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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

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