import React, { useState } from "react";
import SpotlightCard from "../components/SpotlightCard";
import { GraduationCap, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PAGE_SIZE = 9;

const Subjects = ({ subjects = [], grades = [], boards = [] }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [boardId, setBoardId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Subjects scoped to the currently selected board/grade — used to populate the dropdown itself
  const availableSubjectsForDropdown = subjects.filter((subject) => {
    const subjectBoardId = subject.grade?.board_id;
    const matchesBoard = !boardId || String(subjectBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(subject.grade_id) === String(gradeId);
    return matchesBoard && matchesGrade;
  });

  // Grades scoped to selected board — grade has board_id directly
  const filteredGrades = boardId
    ? grades.filter((g) => String(g.board_id) === String(boardId))
    : grades;

  // Subjects only carry grade_id; board comes through the nested grade relation
  const filteredSubjects = subjects.filter((subject) => {
    const subjectBoardId = subject.grade?.board_id;

    const matchesSearch =
      subject.name?.toLowerCase().includes(search.toLowerCase()) ||
      subject.code?.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = !boardId || String(subjectBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(subject.grade_id) === String(gradeId);
    const matchesSubject = !subjectId || String(subject.id) === String(subjectId);

    return matchesSearch && matchesBoard && matchesGrade && matchesSubject;
  });

  const visibleSubjects = filteredSubjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSubjects.length;

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
        className="bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl p-4 mb-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 w-full">
          {/* Search */}
          <div className="relative w-full flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* Board */}
          <select
            value={boardId}
            onChange={(e) => {
              setBoardId(e.target.value);
              setGradeId("");     // board changed, grade no longer valid
              setSubjectId("");   // subject may not belong to new board either
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full md:w-1/4 pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          >
            <option value="">All Boards</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>

          {/* Grade */}
          <select
            value={gradeId}
            onChange={(e) => {
              setGradeId(e.target.value);
              setSubjectId("");   // grade changed, reset subject to "All Subjects"
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full md:w-1/4 pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          >
            <option value="">All Grades</option>
            {filteredGrades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {boardId ? grade.name : `${grade.board?.name} - ${grade.name}`}
              </option>
            ))}
          </select>

          {/* Subject */}
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full md:w-1/4 pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          >
            <option value="">All Subjects</option>
            {availableSubjectsForDropdown.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSubjects.length > 0 ? (
          visibleSubjects.map((subject) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SpotlightCard
                spotlightColor="rgba(0, 229, 255, 0.3)"
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6
                           transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-teal-50">
                    <GraduationCap className="h-6 w-6 text-gray-800" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {subject.code} - {subject.name}
                </h3>

                <Button
                  onClick={() => navigate("/courses")}
                  className="mt-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
                >
                  Explore
                </Button>
              </SpotlightCard>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No subjects found.</p>
        )}
      </div>

      {/* Show more */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="text-teal-600 font-medium text-sm hover:underline"
          >
            Show more subjects
          </button>
        </div>
      )}
    </div>
  );
};

export default Subjects;