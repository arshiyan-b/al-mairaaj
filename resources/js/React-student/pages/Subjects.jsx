import React, { useState } from "react";
import SpotlightCard from "../components/SpotlightCard";
import { GraduationCap, FlaskConical, Sigma, Dna, Laptop, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const subjects = [
  {
    name: "Physics",
    level: "A-Level",
    desc: "Explore the laws of motion, energy, and the universe.",
    color: "rgba(0, 229, 255, 0.3)",
    icon: GraduationCap
  },
  {
    name: "Chemistry",
    level: "O-Level",
    desc: "Understand atoms, molecules, and chemical reactions.",
    color: "rgba(255, 99, 71, 0.3)",
    icon: FlaskConical
  },
  {
    name: "Mathematics",
    level: "A-Level",
    desc: "Master problem-solving, logic, and abstract concepts.",
    color: "rgba(34, 197, 94, 0.3)",
    icon: Sigma
  },
  {
    name: "Biology",
    level: "O-Level",
    desc: "Discover the science of life, plants, and humans.",
    color: "rgba(168, 85, 247, 0.3)",
    icon: Dna
  },
  {
    name: "Computer Science",
    level: "A-Level",
    desc: "Learn coding, algorithms, and modern computing.",
    color: "rgba(251, 191, 36, 0.3)",
    icon: Laptop
  },
];

const Subjects = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredSubjects = subjects.filter(
    (subject) =>
      (filter === "All" || subject.level === filter) &&
      subject.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      {/* Page Heading */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Explore Our Subjects
        </h1>
        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Choose from a variety of subjects to start learning, enhance your knowledge,
          and build a strong academic foundation.
        </p>
      </motion.div>

      {/* Search & Filter Box */}
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
          {/* Search */}
          <div className="relative w-full flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* Filter by Level */}
          <div className="relative w-full md:w-1/3 md:max-w-xs">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
            >
              <option value="All">All Levels</option>
              <option value="A-Level">A-Level</option>
              <option value="O-Level">O-Level</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, idx) => {
            const Icon = subject.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <SpotlightCard
                  spotlightColor={subject.color}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6  
                             transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    {/* Icon */}
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: subject.color }}
                    >
                      <Icon className="h-6 w-6 text-gray-800" />
                    </div>

                    {/* Subject Level */}
                    <span className="text-xs md:text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                      {subject.level}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {subject.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                    {subject.desc}
                  </p>

                  {/* Explore Button */}
                  <Button
                    onClick={() => navigate("/courses")}
                    className="mt-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
                  >
                    Explore
                  </Button>
                </SpotlightCard>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-full">No subjects found.</p>
        )}
      </div>
    </div>
  );
};

export default Subjects;
