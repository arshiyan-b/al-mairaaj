import React, { useEffect, useState } from "react";
import SpotlightCard from "../components/SpotlightCard";
import SearchableSelect from "../components/SearchableSelect";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  BookOpen,
  Atom,
  FlaskConical,
  Binary,
  Beaker,
  Search,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

// Subject name -> icon + spotlight color mapping, with a sensible fallback
// for any subject name that doesn't match a known keyword.
const SUBJECT_STYLE_MAP = [
  { match: /computer|programming|coding|ict/i, icon: Binary, color: "rgba(45, 212, 191, 0.25)" },
  { match: /physics/i, icon: Atom, color: "rgba(16, 185, 129, 0.25)" },
  { match: /chemistry/i, icon: FlaskConical, color: "rgba(5, 150, 105, 0.25)" },
  { match: /biology|science/i, icon: Beaker, color: "rgba(34, 197, 94, 0.25)" },
  { match: /math/i, icon: GraduationCap, color: "rgba(20, 184, 166, 0.25)" },
];

function getSubjectStyle(subjectName = "") {
  const found = SUBJECT_STYLE_MAP.find((s) => s.match.test(subjectName));
  return found || { icon: BookOpen, color: "rgba(20, 184, 166, 0.2)" };
}

const Books = () => {
  // API Data
  const [books, setBooks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [boards, setBoards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [boardId, setBoardId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/student/books-data", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch books (${response.status})`);
        }

        const data = await response.json();
        if (cancelled) return;

        setBooks(data.books || []);
        setSubjects(data.curriculum_subjects || []);
        setGrades(data.grades || []);
        setBoards(data.boards || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cascading dropdown data, same pattern as Subjects.jsx
  const filteredGrades = boardId
    ? grades.filter((g) => String(g.board_id) === String(boardId))
    : grades;

  const availableSubjectsForDropdown = subjects.filter((subject) => {
    const subjectBoardId = subject.grade?.board_id;
    const matchesBoard = !boardId || String(subjectBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(subject.grade_id) === String(gradeId);
    return matchesBoard && matchesGrade;
  });

  const filteredBooks = books.filter((book) => {
    const subject = book.curriculum_subject;
    const subjectBoardId = subject?.grade?.board_id;

    const matchesSearch = book.title?.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = !boardId || String(subjectBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(subject?.grade_id) === String(gradeId);
    const matchesSubject = !subjectId || String(subject?.id) === String(subjectId);

    return matchesSearch && matchesBoard && matchesGrade && matchesSubject;
  });

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <BooksSkeleton />;
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
          Explore Our Books
        </h1>
        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Find the perfect book across multiple subjects, enhance your
          knowledge, and build a strong academic foundation.  
        </p>
      </motion.div>

      {/* Search & Filter Box */}
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
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            onChange={setSubjectId}
            placeholder="All Subjects"
            searchPlaceholder="Search subjects..."
            options={availableSubjectsForDropdown.map((subject) => ({
              value: subject.id,
              label: `${subject.code ? subject.code + " - " : ""}${subject.name}`,
            }))}
          />
        </div>
      </motion.div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">No books found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-0"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredBooks.map((book) => {
              const subject = book.curriculum_subject;
              const subjectName = subject?.name || "General";
              const { icon: Icon, color } = getSubjectStyle(subjectName);
              const boardName = subject?.grade?.board?.name;

              return (
                <motion.div
                  key={book.id}
                  variants={fadeUp}
                  transition={{ duration: 0.3 }}
                  layout
                  className="h-full"
                >
                  <SpotlightCard
                    className="custom-spotlight-card relative overflow-hidden rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 p-4 h-full"
                    spotlightColor={color}
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div>
                        <div className="flex justify-between items-center mb-2 gap-2">
                          <h3 className="font-semibold flex items-center gap-2 text-base text-gray-800 min-w-0">
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{book.title}</span>
                          </h3>
                          <span className="text-xs bg-gradient-to-r from-green-700 to-teal-900 text-white px-2 py-0.5 rounded flex-shrink-0">
                            {subjectName}
                          </span>
                        </div>

                        {boardName && (
                          <span className="inline-block text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full mb-2">
                            {boardName}
                          </span>
                        )}

                        <p className="text-xs text-gray-600 mb-4">
                          {book.description || "No description available."}
                        </p>
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
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

function BooksSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10 space-y-8">
      <div className="text-center space-y-3">
        <Skeleton className="mx-auto h-8 w-72 rounded-lg" />
        <Skeleton className="mx-auto h-4 w-96 rounded" />
      </div>
      <Skeleton className="mx-auto h-24 max-w-4xl rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default Books;