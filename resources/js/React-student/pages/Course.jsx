import React from "react";
import { motion } from "framer-motion";
import { BookOpen, User, GraduationCap, PlayCircle, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const courseDetails = {
    title: "Mastering Advanced Mathematics",
    description: "This comprehensive course covers deep concepts of Calculus, Algebra, and Analytics. Perfect for students preparing for their final examinations. We will go through various problem-solving techniques, historical contexts, and real-world applications of higher mathematics.",
    board: "Cambridge Assessment International Education",
    subject: "Mathematics",
    teacher: "Prof. Sarah Jenkins",
    bgImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2664&auto=format&fit=crop",
    videos: [
        { id: 1, title: "1. Introduction to Advanced Integration", duration: "45:10", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop", status: "completed" },
        { id: 2, title: "2. Exploring Differential Equations", duration: "52:30", thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=400&auto=format&fit=crop", status: "completed" },
        { id: 3, title: "3. Complex Numbers and Their Geometry", duration: "38:15", thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop", status: "current" },
        { id: 4, title: "4. Vectors and 3D Planes", duration: "41:05", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&auto=format&fit=crop", status: "current" },
        { id: 5, title: "5. Past Paper Walkthrough: 2024", duration: "1:15:00", thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop", status: "current" }
    ]
};

const Course = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero Section */}
            <div
                className="relative h-[480px] w-full bg-cover bg-center flex items-end pb-16"
                style={{ backgroundImage: `url('${courseDetails.bgImage}')` }}
            >
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-black/30" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                {courseDetails.subject}
                            </span>
                            <span className="bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                {courseDetails.board}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg text-balance">
                            {courseDetails.title}
                        </h1>

                        <div className="flex items-center gap-8 text-gray-200 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2.5">
                                <User className="w-5 h-5 text-teal-400" />
                                <span>{courseDetails.teacher}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <PlayCircle className="w-5 h-5 text-teal-400" />
                                <span>{courseDetails.videos.length} Lectures</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 flex flex-col gap-8">

                {/* About Section */}
                <motion.div
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        Course Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        {courseDetails.description}
                    </p>
                </motion.div>

                {/* Curriculum / Videos List border */}
                <motion.div
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                        Course Modules
                    </h2>

                    <div className="flex flex-col gap-4">
                        {courseDetails.videos.map((video, idx) => (
                            <motion.div
                                key={video.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 p-4 rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-indigo-100 hover:shadow-md"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 + (idx * 0.1) }}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-40 h-24 rounded-xl overflow-hidden flex-shrink-0 group cursor-pointer shadow-sm">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                                        <PlayCircle className="w-10 h-10 text-white" fill="rgba(0,0,0,0.5)" />
                                    </div>
                                    {/* Video duration badge overlay */}
                                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow">
                                        {video.duration}
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg mb-2 truncate text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {video.duration}
                                        </span>
                                    </div>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Course;