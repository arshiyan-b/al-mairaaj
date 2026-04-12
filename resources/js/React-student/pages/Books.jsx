"use client";

import { useState } from "react";
import SpotlightCard from "../components/SpotlightCard";
import {
  GraduationCap,
  BookOpen,
  Atom,
  FlaskConical,
  Binary,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

const books = [
  { title: "Programming Basics", subject: "Computer Science", description: "Learn the fundamentals of programming and coding.", icon: <Binary className="w-4 h-4" />, color: "rgba(45, 212, 191, 0.25)" },
  { title: "Introduction to Physics", subject: "Physics", description: "A comprehensive overview of the principles of physics.", icon: <Atom className="w-4 h-4" />, color: "rgba(16, 185, 129, 0.25)" },
  { title: "Organic Chemistry", subject: "Chemistry", description: "Dive into the world of organic chemistry and compounds.", icon: <FlaskConical className="w-4 h-4" />, color: "rgba(5, 150, 105, 0.25)" },
  { title: "Calculus 101", subject: "Mathematics", description: "Master the concepts of calculus including differentiation and integration.", icon: <GraduationCap className="w-4 h-4" />, color: "rgba(20, 184, 166, 0.25)" },
  { title: "Modern Biology", subject: "Biology", description: "Explore the principles of biology and the diversity of life.", icon: <BookOpen className="w-4 h-4" />, color: "rgba(34, 197, 94, 0.25)" },
];

const Books = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredBooks = books.filter(
    (book) =>
      (filter === "All" || book.subject === filter) &&
      book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      {/* Heading */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Explore Our Books
        </h1>
        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Find the perfect book across multiple subjects.
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
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* Filter */}
          <div className="relative w-full md:w-1/3 md:max-w-xs">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
            >
              <option value="All">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, idx) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="h-full"
            >
              <SpotlightCard
                className="custom-spotlight-card relative overflow-hidden rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 p-4 h-full"
                spotlightColor={book.color}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold flex items-center gap-2 text-base text-gray-800">
                        {book.icon} {book.title}
                      </h3>
                      <span className="text-xs bg-gradient-to-r from-green-700 to-teal-900 text-white px-2 py-0.5 rounded">
                        {book.subject}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-4">{book.description}</p>
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => alert(`Open ${book.title}`)}
                      className="px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-teal-700 hover:from-teal-600 hover:to-green-500 rounded-lg shadow-sm hover:shadow transition"
                    >
                      Read Now
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center text-sm">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Books;
