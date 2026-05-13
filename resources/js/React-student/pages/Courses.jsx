import React, { useState } from "react";
import { Plus, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const coursesData = [
  {
    id: 1,
    title: "Move from Graphic Designer to UX DESIGNER - Class 1",
    board: "CAIE",
    subject: "UI/UX Design",
    teacher: "Herman Wong",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
  {
    id: 2,
    title: "Move from Graphic Designer to UX DESIGNER - Class 2",
    board: "Edexcel",
    subject: "UI/UX Design",
    teacher: "Alice Smith",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
  {
    id: 3,
    title: "User Experience Design For Mobile Apps & Websites",
    board: "AQA",
    subject: "UI/UX Design",
    teacher: "Bob Johnson",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
  {
    id: 4,
    title: "The Complete Android Material Design Course",
    status: "draft",
    board: "CAIE",
    subject: "Computer Science",
    teacher: "Dr. Alan Turing",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
  {
    id: 5,
    title: "How To Create a Simple Website With Bootstrap 4",
    board: "Edexcel",
    subject: "Web Development",
    teacher: "Tim Berners-Lee",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
  {
    id: 6,
    title: "Become a UI/UX Designer - Everything You Need to Know",
    board: "AQA",
    subject: "UI/UX Design",
    teacher: "Herman Wong",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
];

export default function MyCourses() {
  const [search, setSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  // 🔎 Filter courses
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = boardFilter ? course.board === boardFilter : true;
    const matchesSubject = subjectFilter ? course.subject === subjectFilter : true;
    return matchesSearch && matchesBoard && matchesSubject;
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
          Explore Our Courses
        </h1>
        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Find the perfect course across multiple subjects.
        </p>
      </motion.div>

      {/* Search Box */}
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
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          <div className="w-full flex-1">
            <select
              value={boardFilter}
              onChange={(e) => setBoardFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition cursor-pointer bg-white text-gray-700"
            >
              <option value="">All Boards</option>
              <option value="CAIE">CAIE</option>
              <option value="Edexcel">Edexcel</option>
              <option value="AQA">AQA</option>
            </select>
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
            </select>
          </div>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative border border-gray-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={{ y: -5 }} /* Added small pop to mimic other cards' hover, preserving shadow transition */
            >
              {/* Status Icon */}
              {course.status === "completed" && (
                <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full z-10 shadow">
                  <CheckCircle size={20} />
                </div>
              )}
              {course.status === "draft" && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white p-1 rounded-full z-10 shadow">
                  <Clock size={20} />
                </div>
              )}

              <img
                src={course.img}
                alt={course.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-teal-50 text-teal-700 font-semibold text-xs px-2.5 py-1 rounded-md border border-teal-100">{course.subject}</span>
                  <span className="bg-indigo-50 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded-md border border-indigo-100">{course.board}</span>
                </div>

                <Link to={`/course/${course.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2 hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/80 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold">
                      {course.teacher.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-700">{course.teacher}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No courses found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}