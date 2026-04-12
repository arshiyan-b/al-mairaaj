"use client";
import React, { useState } from "react";
import { Filter, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

const papers = [
  { id: 1, subject: "Physics", year: "2023", file: "#" },
  { id: 2, subject: "Chemistry", year: "2022", file: "#" },
  { id: 3, subject: "Mathematics", year: "2021", file: "#" },
  { id: 4, subject: "Biology", year: "2023", file: "#" },
  { id: 5, subject: "Computer Science", year: "2022", file: "#" },
];

const PastPapers = () => {
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  const filteredPapers = papers.filter(
    (p) =>
      (filterSubject === "All" || p.subject === filterSubject) &&
      (filterYear === "All" || p.year === filterYear)
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      {/* Page Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Past Papers
        </h1>
        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Browse past exam papers by subject and year to practice effectively.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white border shadow-md rounded-xl p-5 mb-10 max-w-5xl mx-auto"
      >
        <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          Filters
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
      </motion.div>

      {/* Papers List */}
      <div className="grid gap-5 max-w-6xl mx-auto">
        {filteredPapers.map((paper, idx) => (
          <motion.div
            key={paper.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {paper.subject} – {paper.year}
                </h3>
                <p className="text-sm text-gray-500">
                  Exam paper for {paper.subject}, {paper.year}
                </p>
              </div>
            </div>
            <a
              href={paper.file}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PastPapers;
