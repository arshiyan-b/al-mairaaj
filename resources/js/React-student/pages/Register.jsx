import React, { useState } from "react";
import { Link } from "react-router-dom";
import image from "../assests/logo.png";

export default function Register() {
  // Get Laravel route + CSRF token from Blade
  const appDiv = document.getElementById("app");
  const registerRoute = `${appDiv.dataset.registerRoute}`;
  const csrfToken = appDiv.dataset.csrf;

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    father_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(registerRoute, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrorMsg(data.message || "Registration failed. Please try again.");
        }
      } else if (data.status === "success") {
        // save email temporarily (so OTP page can access it)
        sessionStorage.setItem("otp_email", data.email);
        
        // Redirect to OTP page with email parameter
        window.location.href = `${data.redirect}?email=${encodeURIComponent(data.email)}`;
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-300 to-teal-500 p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8 md:p-10 mx-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <img src={image} alt="AL Mairaaj" className="w-40 h-auto mb-2" />
          <h2 className="text-xl font-semibold">Student Registration Form</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter your information to create an account.
          </p>
        </div>

        {/* Feedback */}
        {errorMsg && <div className="text-red-500 text-center mb-4">{errorMsg}</div>}
        {successMsg && <div className="text-green-600 text-center mb-4">{successMsg}</div>}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="first_name"
              type="text"
              placeholder="Enter your first name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Middle Name
            </label>
            <input
              name="middle_name"
              type="text"
              placeholder="Enter your middle name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="last_name"
              type="text"
              placeholder="Enter your last name"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Father Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Father Name <span className="text-red-500">*</span>
            </label>
            <input
              name="father_name"
              type="text"
              placeholder="Enter your father name"
              required
              value={formData.father_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mb-1">{errors.email}</p>
            )}
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            {errors.phone && (
              <p className="text-red-500 text-xs mb-1">{errors.phone}</p>
            )}
            <input
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
              {errors.password && (
                <p className="text-red-500 text-xs mb-1">{errors.password}</p>
              )}
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirm your password"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
