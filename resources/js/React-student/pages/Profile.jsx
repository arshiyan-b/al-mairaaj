import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Camera, Save, User, Phone, MapPin, AlignLeft, ChevronDown, Mail, Users } from "lucide-react";

const Profile = ({ user }) => {
    const [profileData, setProfileData] = useState({
        fullName: user.name,
        email: user.email,
        bio: "Passionate learner and UI/UX enthusiast.",
        countryCode: "+1",
        phone: "555-0123",
        gender: "Prefer not to say",
        country: "United States",
    });

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Profile saved successfully!");
    };

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
                <p className="text-gray-500 mt-2 text-sm md:text-base">Mange your personal information and preferences.</p>
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
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                                        <img
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                                            alt="Profile"
                                            className="w-full h-full object-cover group-hover:blur-[2px] transition-all duration-300"
                                        />
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
                                {/* Full Name */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <User className="w-4 h-4 text-teal-600" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Phone number with country code */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-teal-600" /> Phone Number
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative w-28">
                                            <select
                                                name="countryCode"
                                                value={profileData.countryCode}
                                                onChange={handleChange}
                                                className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                                            >
                                                <option value="+1">+1 (US)</option>
                                                <option value="+44">+44 (UK)</option>
                                                <option value="+91">+91 (IN)</option>
                                                <option value="+61">+61 (AU)</option>
                                                <option value="+92">+92 (PK)</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white w-full"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-teal-600" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-teal-600" /> Gender
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleChange}
                                            className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-teal-600" /> Country
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="country"
                                            value={profileData.country}
                                            onChange={handleChange}
                                            className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                                        >
                                            <option value="United States">United States</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Australia">Australia</option>
                                            <option value="Pakistan">Pakistan</option>
                                            <option value="India">India</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <AlignLeft className="w-4 h-4 text-teal-600" /> Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white resize-none"
                                        placeholder="Write a short summary about yourself..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Changes
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
                        <h3 className="text-xl font-bold mb-2">Complete Your Profile!</h3>
                        <p className="text-teal-100 text-sm mb-6">A complete profile increases your chances of getting noticed by instructors and peers alike.</p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Profile Completion</span>
                                    <span className="font-bold">75%</span>
                                </div>
                                <div className="w-full bg-teal-950/50 rounded-full h-2">
                                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
