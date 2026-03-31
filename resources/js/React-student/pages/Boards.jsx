"use client";
import { useState } from "react";
import { GraduationCap, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

const boardsData = {
  "Pearson Edexcel": {
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    description: "International A-Level curriculum with globally recognized qualifications",
    courses: [
      {
        title: "Advanced Mathematics",
        desc: "Comprehensive mathematics covering calculus, algebra, statistics, and mechanics for A-Level students.",
        duration: "24 weeks",
        students: "1247",
      },
      {
        title: "Physics",
        desc: "Complete physics curriculum covering mechanics, waves, electricity, and modern physics.",
        duration: "20 weeks",
        students: "892",
      },
      {
        title: "Chemistry",
        desc: "Organic, inorganic, and physical chemistry with practical laboratory components.",
        duration: "22 weeks",
        students: "756",
      },
    ],
  },
  "Aga Khan University Examination Board": {
    color: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    description: "Curriculum focused on modern science and healthcare education pathways.",
    courses: [
      {
        title: "Biology",
        desc: "Comprehensive biology course covering genetics, human anatomy, and ecology.",
        duration: "18 weeks",
        students: "530",
      },
      {
        title: "Mathematics",
        desc: "Core mathematics concepts for undergraduate preparation.",
        duration: "22 weeks",
        students: "690",
      },
    ],
  },
  "Cambridge Assessment International Education": {
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    description: "Globally recognized Cambridge curriculum with strong academic foundation.",
    courses: [
      {
        title: "Economics",
        desc: "Understanding microeconomics, macroeconomics, and global trade.",
        duration: "20 weeks",
        students: "400",
      },
      {
        title: "History",
        desc: "World history covering ancient to modern civilizations.",
        duration: "25 weeks",
        students: "320",
      },
    ],
  },
  "International Baccalaureate": {
    color: "bg-orange-600",
    hoverColor: "hover:bg-orange-700",
    description: "IB curriculum designed for critical thinking and international education.",
    courses: [
      {
        title: "Global Politics",
        desc: "Study of political theories, international relations, and governance.",
        duration: "21 weeks",
        students: "278",
      },
      {
        title: "Computer Science",
        desc: "Programming, algorithms, and computational thinking.",
        duration: "23 weeks",
        students: "354",
      },
    ],
  },
};

// Custom Button Component
function CustomButton({ children, onClick, color = "bg-blue-600", hoverColor = "hover:bg-blue-700" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 ${color} ${hoverColor} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
    >
      {children}
    </button>
  );
}

export default function BoardsPage() {
  const [activeTab, setActiveTab] = useState("Pearson Edexcel");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Choose Your Educational Path
        </h1>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Select from our comprehensive collection of courses across different educational boards.
          Each pathway is designed to provide you with the knowledge and skills needed for academic success.
        </p>
      </motion.div>

      {/* Custom Tabs (Rendered as Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
        {Object.entries(boardsData).map(([board, data]) => (
          <button
            key={board}
            onClick={() => setActiveTab(board)}
            className={`px-4 py-6 text-sm md:text-base font-semibold flex items-center justify-center text-center transition-all duration-300 rounded-2xl shadow-sm border ${activeTab === board
              ? `${data.color} text-white shadow-md border-transparent scale-[1.03]`
              : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
              }`}
          >
            {board}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {Object.entries(boardsData).map(([board, data]) =>
        activeTab === board ? (
          <div key={board}>
            {/* Board Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`${data.color} text-white rounded-xl p-4 mb-6`}
            >
              <h2 className="text-lg md:text-xl font-semibold">{board}</h2>
              <p className="text-sm md:text-base">{data.description}</p>
            </motion.div>

            {/* Courses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {data.courses.map((course, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 border flex flex-col"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{course.title}</h3>
                    <span className="text-xs md:text-sm bg-gray-100 px-2 py-0.5 rounded">
                      A-Level
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{course.desc}</p>

                  <div className="flex justify-between text-gray-500 text-xs md:text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {course.students} students
                    </span>
                  </div>

                  {/* Custom Button */}
                  <CustomButton color={data.color} hoverColor={data.hoverColor}>
                    <GraduationCap className="w-4 h-4" /> Start Learning
                  </CustomButton>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
