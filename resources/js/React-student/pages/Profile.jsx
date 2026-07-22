import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Camera,
  Save,
  User,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Mail,
  Users,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const FIELD_KEYS = [
  "first_name",
  "middle_name",
  "last_name",
  "father_name",
  "phone_number",
  "whatsapp_number",
  "email",
  "date_of_birth",
  "address",
  "city",
  "country",
];

// Profile completion is based on how many of the editable fields are filled in.
function computeCompletion(profileData) {
  const filled = FIELD_KEYS.filter((key) => String(profileData[key] || "").trim().length > 0).length;
  return Math.round((filled / FIELD_KEYS.length) * 100);
}

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/profile-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProfileData(data.profile || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/student/profile-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || `Failed to save profile (${res.status})`);
      }

      if (data?.profile) setProfileData(data.profile);
      setSaved(true);
    } catch (err) {
      setSaveError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!profileData) return <ProfileSkeleton />;

  const displayName =
    profileData.full_name ||
    [profileData.first_name, profileData.middle_name, profileData.last_name].filter(Boolean).join(" ") ||
    "Your Profile";
  const completion = computeCompletion(profileData);

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      {/* Header section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
          Profile Settings
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">Manage your personal information and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 bg-white/70 backdrop-blur-xl dark:bg-gray-800/80 dark:border-gray-700">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center sm:items-start gap-4 mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Picture</label>
                <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full border-2 border-white shadow-sm">
                    <Camera className="text-white w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profileData.first_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Middle Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> Middle Name
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={profileData.middle_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your middle name"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileData.last_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Father Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" /> Father Name
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={profileData.father_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your father's name"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={profileData.phone_number || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="e.g. 923491855033"
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-teal-600" /> WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_number"
                    value={profileData.whatsapp_number || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="e.g. 923491855033"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profileData.date_of_birth || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" /> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your city"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" /> Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={profileData.country || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your country"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" /> Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Feedback */}
              {saveError && <p className="text-sm text-red-500">{saveError}</p>}
              {saved && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Profile saved successfully</span>
                </div>
              )}

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Right Column for decorative/info purposes */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 rounded-2xl shadow-sm border-0 bg-gradient-to-br from-teal-900 to-teal-700 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <User className="w-40 h-40 transform translate-x-10 -translate-y-10" />
            </div>
            <h3 className="text-xl font-bold mb-1">{displayName}</h3>
            <p className="text-teal-100 text-sm mb-6">
              A complete profile increases your chances of getting noticed by instructors and peers alike.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Profile Completion</span>
                  <span className="font-bold">{completion}%</span>
                </div>
                <div className="w-full bg-teal-950/50 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

function ProfileSkeleton() {
  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-[560px] rounded-2xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Profile;