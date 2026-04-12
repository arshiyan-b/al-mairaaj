import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, BookOpen, Mail, Award, User } from "lucide-react";

const teachersData = [
    {
        id: 1,
        name: "Prof. Sarah Jenkins",
        subject: "Mathematics",
        rating: 4.9,
        courses: 12,
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
        bio: "Specialist in Advanced Mathematics with 10+ years of teaching experience. Inspires students to love numbers and problem-solving.",
    },
    {
        id: 2,
        name: "Herman Wong",
        subject: "UI/UX Design",
        rating: 4.8,
        courses: 8,
        img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop",
        bio: "Passionate about creating intuitive and engaging user experiences. Leads our UX fundamentals track.",
    },
    {
        id: 3,
        name: "Dr. Alan Turing",
        subject: "Computer Science",
        rating: 5.0,
        courses: 15,
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
        bio: "Pioneer in the digital sphere, focusing on foundational algorithms and modern coding practices.",
    },
    {
        id: 4,
        name: "Alice Smith",
        subject: "UI/UX Design",
        rating: 4.7,
        courses: 6,
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
        bio: "Expert in mobile-first design and accessibility who helps students craft perfect portfolios.",
    },
    {
        id: 5,
        name: "Tim Berners-Lee",
        subject: "Web Development",
        rating: 4.9,
        courses: 20,
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
        bio: "Brings the history and future of the web into the classroom. Focused on HTML, CSS, and modern framework architectures.",
    },
    {
        id: 6,
        name: "Bob Johnson",
        subject: "Physics",
        rating: 4.6,
        courses: 4,
        img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=300&auto=format&fit=crop",
        bio: "A pragmatic instructor emphasizing scientific workflows and professional lab report methodology.",
    }
];

export default function Teachers() {
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");

    const filteredTeachers = teachersData.filter((teacher) => {
        const matchesSearch = teacher.name.toLowerCase().includes(search.toLowerCase());
        const matchesSubject = subjectFilter ? teacher.subject === subjectFilter : true;
        return matchesSearch && matchesSubject;
    });

    return (
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    Meet Our Instructors
                </h1>
                <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
                    Learn from industry leaders and passionate educators dedicated to your success.
                </p>
            </motion.div>

            {/* Filter Section */}
            <motion.div
                className="bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl p-4 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-teal-600" />
                    Filters
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <div className="relative w-full flex-[2]">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
                        />
                    </div>

                    <div className="w-full flex-1">
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition cursor-pointer bg-white text-gray-700"
                        >
                            <option value="">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Physics">Physics</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher, idx) => (
                        <motion.div
                            key={teacher.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col group"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Top Banner / Avatar Area */}
                            <div className="h-28 bg-gradient-to-r from-indigo-50 to-teal-50 relative flex justify-center">
                                <div className="absolute -bottom-10 w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white z-10">
                                    <img src={teacher.img} alt={teacher.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            </div>

                            {/* Teacher Info */}
                            <div className="pt-14 pb-6 px-6 flex flex-col items-center flex-1 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {teacher.name}
                                </h3>
                                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                                    {teacher.subject}
                                </span>

                                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                                    {teacher.bio}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-center gap-6 w-full pt-5 border-t border-gray-100 mt-auto">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                            <Star className="w-4 h-4 fill-yellow-500" />
                                            <span>{teacher.rating}</span>
                                        </div>
                                        <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">Rating</span>
                                    </div>

                                    <div className="h-8 w-px bg-gray-200"></div>

                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                                            <BookOpen className="w-4 h-4 text-indigo-500" />
                                            <span>{teacher.courses}</span>
                                        </div>
                                        <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">Courses</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Action Area */}
                            <div className="bg-gray-50/80 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                                    <Mail className="w-4 h-4" /> Message
                                </button>
                                <button className="text-sm font-bold text-indigo-700 bg-indigo-100/50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors shadow-sm">
                                    View Profile
                                </button>
                            </div>

                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                        <User className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-1">No teachers found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
