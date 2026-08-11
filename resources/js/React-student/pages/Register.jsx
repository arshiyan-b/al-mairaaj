import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo_text.png";
import SearchablePhoneInput from "../components/SearchablePhoneInput";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Register() {
  // Get Laravel route + CSRF token from Blade
  const appDiv = document.getElementById("app");
  const registerRoute = `${appDiv.dataset.registerRoute}`;
  const csrfToken = appDiv.dataset.csrf;

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    email: "",
    phone: "",
    whatsapp: "",
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
        sessionStorage.setItem("otp_email", data.email);
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8 md:p-10 mx-4"
      >
        {/* Logo Section */}
        <motion.div variants={fieldVariants} className="flex flex-col items-center mb-6">
          <img src={logo} alt="AL Mairaaj" className="w-56 h-auto mb-2" />
          <h2 className="text-xl font-semibold">Student Registration Form</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter your information to create an account.
          </p>
        </motion.div>

        {/* Feedback */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-center mb-4"
          >
            {errorMsg}
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 text-center mb-4"
          >
            {successMsg}
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <motion.div variants={fieldVariants}>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* Last Name */}
          <motion.div variants={fieldVariants}>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* Father Name */}
          <motion.div variants={fieldVariants}>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={fieldVariants}>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* Phone */}
          <motion.div variants={fieldVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            {errors.phone && (
              <p className="text-red-500 text-xs mb-1">{errors.phone}</p>
            )}
            <SearchablePhoneInput
              name="phone"
              value={formData.phone}
              onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
              defaultCountry="pk"
              required
            />
          </motion.div>

          {/* WhatsApp */}
          <motion.div variants={fieldVariants}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            {errors.whatsapp && (
              <p className="text-red-500 text-xs mb-1">{errors.whatsapp}</p>
            )}
            <SearchablePhoneInput
              name="whatsapp"
              value={formData.whatsapp}
              onChange={(whatsapp) => setFormData((prev) => ({ ...prev, whatsapp }))}
              defaultCountry="pk"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={fieldVariants}>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={fieldVariants}>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fieldVariants} className="md:col-span-2">
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
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div variants={fieldVariants} className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline font-medium">
            Sign In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}