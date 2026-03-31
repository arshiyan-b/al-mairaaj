import React, { useState } from "react";
import { Plus, CheckCircle, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";

const coursesData = [
  {
    id: 1,
    title: "Move from Graphic Designer to UX DESIGNER - Class 1",
    date: "Dec 10",
    location: "HCMC",
    students: "8/10",
    
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t1ekfp0JJWEqrpRtQyn22uqxCcTBhLfAMJi1baT1TVBx116Kvt_mqhk7gAkaBaL7tCo&usqp=CAU",
  },
  {
    id: 2,
    title: "Move from Graphic Designer to UX DESIGNER - Class 2",
    date: "Dec 15",
    location: "HCMC",
    students: "10/10",
    
    img: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    title: "User Experience Design For Mobile Apps & Websites",
    date: "Dec 18",
    location: "HCMC",
    students: "10/10",
   
    img: "https://via.placeholder.com/300x200",
  },
  {
    id: 4,
    title: "The Complete Android Material Design Course",
    date: "Jan 10",
    location: "HCMC",
    students: "3/10",
    status: "draft",
    img: "https://via.placeholder.com/300x200",
  },
  {
    id: 5,
    title: "How To Create a Simple Website With Bootstrap 4",
    date: "Jan 20",
    location: "HCMC",
    students: "8/10",
    
    img: "https://via.placeholder.com/300x200",
  },
  {
    id: 6,
    title: "Become a UI/UX Designer - Everything You Need to Know",
    date: "Feb 2",
    location: "HCMC",
    students: "10/10",
   
    img: "https://via.placeholder.com/300x200",
  },
];

export default function MyCourses() {
  const [search, setSearch] = useState("");

  // 🔎 Filter courses by search
  const filteredCourses = coursesData.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-8 py-10">
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r text-black bg-clip-text">
          Explore Our Courses
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Find the perfect course across multiple subjects.
        </p>
      </motion.div>

      {/* 🔍 Search Bar */}
      <motion.div 
        className="relative mb-8 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={{ y: -5 }} /* Added small pop to mimic other cards' hover, preserving shadow transition */
            >
              {/* Status Icon */}
              {course.status === "completed" && (
                <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full z-10">
                  <CheckCircle size={20} />
                </div>
              )}
              {course.status === "draft" && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white p-1 rounded-full z-10">
                  <Clock size={20} />
                </div>
              )}

              <img
                src={course.img}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">by Herman Wong</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <p>👥 {course.students}</p>
                  <p>📅 {course.date}</p>
                  <p>📍 {course.location}</p>
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
