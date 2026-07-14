import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, Users, CheckCircle2 } from "lucide-react";

const PAGE_SIZE = 9;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const BrowseLiveClasses = () => {
  const [batches, setBatches] = useState(null);
  const [boards, setBoards] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);

  const [search, setSearch] = useState("");
  const [boardId, setBoardId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch("/api/student/browse-live-classes-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load available batches (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setBatches(data.batches || []);
        setBoards(data.boards || []);
        setGrades(data.grades || []);
        setSubjects(data.subjects || []);
        setEnrolledIds((data.enrollments || []).map((e) => e.batch_id));
      })
      .catch((err) => setError(err.message));
  }, []);

  const filteredGrades = boardId
    ? grades.filter((g) => String(g.board_id) === String(boardId))
    : grades;

  const availableSubjectsForDropdown = subjects.filter((subject) => {
    const matchesBoard = !boardId || String(subject.grade?.board_id) === String(boardId);
    const matchesGrade = !gradeId || String(subject.grade_id) === String(gradeId);
    return matchesBoard && matchesGrade;
  });

  const filteredBatches = (batches || []).filter((batch) => {
    const subject = batch.curriculumSubject;
    const batchBoardId = subject?.grade?.board_id;
    const batchGradeId = subject?.grade_id;
    const batchSubjectId = subject?.id;

    const matchesSearch =
      batch.title?.toLowerCase().includes(search.toLowerCase()) ||
      subject?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = !boardId || String(batchBoardId) === String(boardId);
    const matchesGrade = !gradeId || String(batchGradeId) === String(gradeId);
    const matchesSubject = !subjectId || String(batchSubjectId) === String(subjectId);

    return matchesSearch && matchesBoard && matchesGrade && matchesSubject;
  });

  const visibleBatches = filteredBatches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBatches.length;

  const handleEnroll = (batchId) => {
    setEnrollingId(batchId);
    fetch("/api/student/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content,
      },
      body: JSON.stringify({ batch_id: batchId }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Enrollment failed");
        setEnrolledIds((prev) => [...prev, batchId]);
      })
      .catch((err) => alert(err.message))
      .finally(() => setEnrollingId(null));
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] dark:bg-[#0F1120]">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!batches) return <BrowseSkeleton />;

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 dark:bg-[#0F1120] md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800">Browse Live Classes</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
            Find open batches across boards and grades, and enroll to start attending live sessions.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mx-auto mb-8 max-w-4xl rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-700">
            <Filter className="h-4 w-4 text-indigo-600" />
            Filters
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search batches or subjects..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={boardId}
              onChange={(e) => {
                setBoardId(e.target.value);
                setGradeId("");
                setSubjectId("");
                setVisibleCount(PAGE_SIZE);
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Boards</option>
              {boards.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={gradeId}
              onChange={(e) => {
                setGradeId(e.target.value);
                setSubjectId("");
                setVisibleCount(PAGE_SIZE);
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Grades</option>
              {filteredGrades.map((g) => (
                <option key={g.id} value={g.id}>
                  {boardId ? g.name : `${g.board?.name} - ${g.name}`}
                </option>
              ))}
            </select>

            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Subjects</option>
              {availableSubjectsForDropdown.map((s) => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Batches grid */}
        {filteredBatches.length === 0 ? (
          <div className="mx-auto max-w-md rounded-xl border border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-600">No batches match your filters</p>
            <p className="mt-1 text-xs text-gray-400">Try clearing a filter to see more options.</p>
          </div>
        ) : (
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {visibleBatches.map((batch) => {
                const subject = batch.curriculumSubject;
                const isEnrolled = enrolledIds.includes(batch.id);
                const isEnrolling = enrollingId === batch.id;

                return (
                  <motion.div key={batch.id} variants={fadeUp} transition={{ duration: 0.3 }} layout>
                    <Card className="h-full rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <CardContent className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              {batch.title?.charAt(0) ?? "B"}
                            </AvatarFallback>
                          </Avatar>
                          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">Open</Badge>
                        </div>

                        <h3 className="mt-3 text-sm font-semibold text-gray-800">{batch.title}</h3>
                        <p className="text-xs text-gray-500">{batch.teacher?.name}</p>
                        {subject && (
                          <p className="text-xs text-gray-400">
                            {subject.name} · {subject.grade?.name} · {subject.grade?.board?.name}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {batch.total_classes} classes
                          </span>
                          <span className="font-mono">{batch.start_date}</span>
                        </div>

                        <Button
                          onClick={() => handleEnroll(batch.id)}
                          disabled={isEnrolled || isEnrolling}
                          className="mt-4 w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70"
                        >
                          {isEnrolled ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" /> Enrolled
                            </span>
                          ) : isEnrolling ? (
                            "Enrolling..."
                          ) : (
                            "Enroll Now"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Show more batches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function BrowseSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 dark:bg-[#0F1120] md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Skeleton className="mx-auto h-10 w-72 rounded-lg" />
        <Skeleton className="mx-auto h-20 max-w-4xl rounded-xl" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowseLiveClasses;