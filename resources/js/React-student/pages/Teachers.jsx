import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, Mail, GraduationCap, User, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubjectDropdownLabel } from "../lib/subjectLabel";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// Flattens a teacher's allowed_classes into a de-duplicated list of "Board - Grade - Subject" labels
function getSubjectLabels(teacher) {
  const seen = new Map();

  (teacher.allowed_classes || []).forEach((ac) => {
    const board = ac.grade?.board?.name || "";
    const grade = ac.grade?.name || "";
    (ac.curriculum_subjects || []).forEach((s) => {
      const subjectLabel = s.complete_name || [s.code, s.name].filter(Boolean).join(" - ");
      const label = [board, grade, subjectLabel].filter(Boolean).join(" • ");
      if (label) seen.set(s.id, label);
    });
  });

  return Array.from(seen.values());
}

// Flattens a teacher's allowed_classes into de-duplicated grade_id and board_id sets (for filtering)
function getGradeBoardIds(teacher) {
  const gradeIds = new Set();
  const boardIds = new Set();
  (teacher.allowed_classes || []).forEach((ac) => {
    if (ac.grade_id) gradeIds.add(String(ac.grade_id));
    const bId = ac.grade?.board_id;
    if (bId) boardIds.add(String(bId));
  });
  return { gradeIds, boardIds };
}

function getInitials(name) {
  if (!name) return "T";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Teachers() {
  const [teachers, setTeachers] = useState(null);
  const [curriculumSubjects, setCurriculumSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [boardId, setBoardId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/teachers-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load teachers (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setTeachers(data.teachers || []);
        setCurriculumSubjects(data.curriculum_subjects || []);
        setGrades(data.grades || []);
        setBoards(data.boards || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Guard BEFORE touching `teachers` with .map() — this is what was crashing.
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!teachers) return <TeachersSkeleton />;

  const teachersWithSubjects = teachers.map((teacher) => {
    const { gradeIds, boardIds } = getGradeBoardIds(teacher);
    return {
      ...teacher,
      _subjects: getSubjectLabels(teacher),
      _gradeIds: gradeIds,
      _boardIds: boardIds,
    };
  });

  const filteredGrades = boardId
    ? grades.filter((g) => String(g.board_id) === String(boardId))
    : grades;

  const availableSubjectsForDropdown = curriculumSubjects.filter((subject) => {
    const subjectBoardId = subject.grade?.board_id;
    const matchesBoard = !boardId || String(subjectBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(subject.grade_id) === String(gradeId);
    return matchesBoard && matchesGrade;
  });

  const filteredTeachers = teachersWithSubjects.filter((teacher) => {
    const matchesSearch = teacher.name?.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = !boardId || teacher._boardIds.has(String(boardId));
    const matchesGrade = !gradeId || teacher._gradeIds.has(String(gradeId));
    const matchesSubject = !subjectId
      ? true
      : (teacher.allowed_classes || []).some((ac) =>
          (ac.curriculum_subjects || []).some((s) => String(s.id) === String(subjectId))
        );
    return matchesSearch && matchesBoard && matchesGrade && matchesSubject;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
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
        className="bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl p-4 mb-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          Filters
        </h2>

        {/* Row 1: Search */}
        <div className="relative w-full mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          />
        </div>

        {/* Row 2: Board, Grade, Subject */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <select
            value={boardId}
            onChange={(e) => {
              setBoardId(e.target.value);
              setGradeId("");
              setSubjectId("");
            }}
            className="w-full md:w-1/3 pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          >
            <option value="">All Boards</option>
            {boards.map((board) => (
              <option key={board.id} value={String(board.id)}>{board.name}</option>
            ))}
          </select>

          <select
            value={gradeId}
            onChange={(e) => {
              setGradeId(e.target.value);
              setSubjectId("");
            }}
            className="w-full md:w-1/3 pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          >
            <option value="">All Grades</option>
            {filteredGrades.map((grade) => (
              <option key={grade.id} value={String(grade.id)}>
                {boardId ? grade.name : `${grade.board?.name} - ${grade.name}`}
              </option>
            ))}
          </select>

          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full md:w-1/3 pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          >
            <option value="">All Subjects</option>
            {availableSubjectsForDropdown.map((subject) => (
              <option key={subject.id} value={String(subject.id)}>
                {getSubjectDropdownLabel(subject, boardId, gradeId)}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Teachers Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                variants={fadeUp}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -8 }}
                layout
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-shadow duration-300 overflow-hidden flex flex-col group"
              >
                {/* Top Banner / Avatar Area */}
                <div className="h-28 bg-gradient-to-r from-indigo-50 to-teal-50 relative flex justify-center">
                  {teacher.picture_url ? (
                    <img
                      src={teacher.picture_url}
                      alt={teacher.name}
                      className="absolute -bottom-10 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="absolute -bottom-10 h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-600 shadow-md z-10"
                    style={{ display: teacher.picture_url ? "none" : "flex" }}
                  >
                    {getInitials(teacher.name)}
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="pt-14 pb-6 px-6 flex flex-col items-center flex-1 text-center">
                  <Link
                    to={`/teacher/${teacher.id}`}
                    className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors"
                  >
                    {teacher.name}
                  </Link>

                  {teacher._subjects.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                      {teacher._subjects.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full uppercase tracking-wide"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 w-full pt-5 border-t border-gray-100 mt-auto">
                    {teacher._subjects.length > 0 && (
                      <>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-teal-600 font-bold">
                            <BookOpen className="w-4 h-4 text-teal-500" />
                            <span>{teacher._subjects.length}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">
                            Subjects
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="bg-gray-50/80 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                  
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function TeachersSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10 space-y-8">
      <div className="text-center space-y-3">
        <Skeleton className="mx-auto h-8 w-72 rounded-lg" />
        <Skeleton className="mx-auto h-4 w-96 rounded" />
      </div>
      <Skeleton className="mx-auto h-16 max-w-3xl rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}