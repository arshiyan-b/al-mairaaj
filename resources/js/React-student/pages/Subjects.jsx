import React, { useEffect, useState } from "react";
import SpotlightCard from "../components/SpotlightCard";
import SearchableSelect from "../components/SearchableSelect";
import { getSubjectDropdownLabel } from "../lib/subjectLabel";
import { GraduationCap, Search, Filter, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 9;

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

const Subjects = () => {
  const navigate = useNavigate();

  // API Data
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [boards, setBoards] = useState([]);

  // Loading / error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [boardId, setBoardId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Fetch Data
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/student/subjects-data", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch subjects (${response.status})`);
        }

        const data = await response.json();
        if (cancelled) return;

        setSubjects(data.curriculum_subjects || []);
        setGrades(data.grades || []);
        setBoards(data.boards || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const availableSubjectsForDropdown = subjects.filter((subject) => {
    const subjectBoardId = subject.grade?.board_id;

    const matchesBoard = !boardId || String(subjectBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(subject.grade_id) === String(gradeId);

    return matchesBoard && matchesGrade;
  });

  const filteredGrades = boardId
    ? grades.filter((g) => String(g.board_id) === String(boardId))
    : grades;

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

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <SubjectsSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10 min-h-[80vh]">
      {/* Heading */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Explore Our Subjects
        </h1>

        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Choose from a variety of subjects to start learning, enhance your
          knowledge, and build a strong academic foundation.
        </p>
      </motion.div>

      <motion.div
        className="bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl p-4 mb-8 max-w-4xl mx-auto relative z-30"
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
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
          />
        </div>

        {/* Row 2: Dropdowns */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <SearchableSelect
            className="md:w-1/3"
            value={boardId}
            onChange={(val) => {
              setBoardId(val);
              setGradeId("");
              setSubjectId("");
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="All Boards"
            searchPlaceholder="Search boards..."
            options={boards.map((board) => ({
              value: board.id,
              label: board.name,
            }))}
          />

          <SearchableSelect
            className="md:w-1/3"
            value={gradeId}
            onChange={(val) => {
              setGradeId(val);
              setSubjectId("");
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="All Grades"
            searchPlaceholder="Search grades..."
            options={filteredGrades.map((grade) => ({
              value: grade.id,
              label: boardId ? grade.name : `${grade.board?.name} - ${grade.name}`,
            }))}
          />

          <SearchableSelect
            className="md:w-1/3"
            value={subjectId}
            onChange={(val) => {
              setSubjectId(val);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="All Subjects"
            searchPlaceholder="Search subjects..."
            options={availableSubjectsForDropdown.map((subject) => ({
              value: subject.id,
              label: getSubjectDropdownLabel(subject, boardId, gradeId),
            }))}
          />
        </div>
      </motion.div>

      {/* Subject Cards */}
      {filteredSubjects.length === 0 ? (
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-600">No subjects found</p>
          <p className="mt-1 text-xs text-gray-400">Try clearing a filter to see more options.</p>
        </div>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {visibleSubjects.map((subject) => (
              <motion.div
                key={subject.id}
                variants={fadeUp}
                transition={{ duration: 0.3 }}
                layout
              >
                <SpotlightCard
                  spotlightColor="rgba(0,229,255,0.3)"
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-teal-50">
                      <GraduationCap className="h-6 w-6 text-gray-800" />
                    </div>

                    {/* Board & Grade */}
                    <div className="flex items-center gap-2">
                      {subject.grade?.board?.name && (
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                          {subject.grade.board.name}
                        </span>
                      )}

                      {subject.grade?.name && (
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                          {subject.grade.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {subject.complete_name || subject.name}
                  </h3>

                  <Button
                    onClick={() => navigate("/courses")}
                    className="mt-auto px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                  >
                    Explore
                  </Button>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Show More */}
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

function SubjectsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10 space-y-8">
      <div className="text-center space-y-3">
        <Skeleton className="mx-auto h-8 w-72 rounded-lg" />
        <Skeleton className="mx-auto h-4 w-96 rounded" />
      </div>
      <Skeleton className="mx-auto h-20 max-w-4xl rounded-xl" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default Subjects;