import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo.png";

export default function Otp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Get Laravel route + CSRF token from Blade
  const appDiv = document.getElementById("app");
  const otpVerifyRoute = `${appDiv?.dataset?.otpVerifyRoute}`;
  const csrfToken = appDiv?.dataset?.csrf;

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

    try {
      const response = await fetch(otpVerifyRoute, {
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

      if (!response.ok) {
        setErrorMsg(data.message || "OTP verification failed. Please try again.");
      } else if (data.status === "success") {
        setSuccessMsg(data.message);
        // Redirect to dashboard
        window.location.href = data.redirect;
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 to-teal-400 p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full p-10 flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6 text-center">
          <img src={logo} alt="Al Mairaaj" className="w-60 h-auto mb-2" />
          <p className="text-sm text-gray-500 mt-1">
            Please enter your OTP to verify your account
          </p>
        </div>

        {/* Feedback */}
        {errorMsg && <div className="text-red-500 text-center mb-4">{errorMsg}</div>}
        {successMsg && <div className="text-green-600 text-center mb-4">{successMsg}</div>}

        {/* Form */}
        <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* OTP */}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-teal-600 hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
