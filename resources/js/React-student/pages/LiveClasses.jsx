import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Radio,
  BookOpen,
  ArrowRight,
  Compass,
  GraduationCap,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

// class_date can come back as an ISO timestamp or an already-formatted date
// string depending on the cast — normalize for display.
function formatClassDate(raw) {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

const LiveClasses = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState(null);
  const [liveToday, setLiveToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/student/live-classes-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load live classes (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setEnrollments(data.enrollments || []);
        setLiveToday(data.live_today || []);
        setUpcoming(data.upcoming_live_classes || []);
        setStats(data.stats || null);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] dark:bg-[#0F1120]">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!enrollments) return <LiveClassesSkeleton />;

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 dark:bg-[#0F1120] md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <motion.div
          className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 p-6 shadow-md md:p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                My Live Classes
              </h1>
              <p className="mt-1 text-sm text-indigo-100">
                Your enrolled classes and upcoming live sessions, all in one place.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/browse-live-classes")}
              className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50"
            >
              <Compass className="h-4 w-4" /> Browse classes
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <StatCard icon={BookOpen} label="Enrolled classes" value={stats.enrolled_classes} />
            <StatCard icon={Radio} label="Live today" value={stats.live_today_count} accent pulse={stats.live_today_count > 0} />
            <StatCard icon={CalendarDays} label="Upcoming" value={stats.upcoming_count} />
          </motion.div>
        )}

        {/* Live today */}
        {liveToday.length > 0 && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
              Live Today
            </h2>
            <div className="space-y-3">
              {liveToday.map((c) => (
                <Card
                  key={c.id}
                  className="overflow-hidden rounded-xl border-l-4 border-amber-500 shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-50/60 to-transparent p-5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>
                      <p className="text-xs text-gray-500">
                        {c.teacher?.name}
                        {c.curriculum_subject?.name && <> · {c.curriculum_subject.name}</>}
                        {c.grade?.name && <> · {c.grade.name}</>}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5" /> {c.start_time} – {c.end_time}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/live-class/${c.id}`)}
                      className="bg-amber-500 text-white shadow-sm hover:bg-amber-600"
                    >
                      Join class
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enrolled classes */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              My Enrollments
            </h2>
            {enrollments.length > 0 && (
              <span className="text-xs font-medium text-gray-400">
                {enrollments.length} enrolled
              </span>
            )}
          </div>

          {enrollments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-600">You're not enrolled in any live class yet</p>
              <p className="mt-1 text-xs text-gray-400">Browse available classes to get started.</p>
              <Button
                onClick={() => navigate("/browse-live-classes")}
                className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Browse Live Classes
              </Button>
            </div>
          ) : (
            <motion.div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {enrollments.map((enrollment) => {
                  const liveClass = enrollment.live_class;
                  if (!liveClass) return null;
                  const subject = liveClass.curriculum_subject;

                  return (
                    <motion.div key={enrollment.id} variants={fadeUp} transition={{ duration: 0.3 }} layout>
                      <Card className="group h-full overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                        <CardContent className="flex h-full flex-col p-5">
                          <div className="flex items-start justify-between">
                            <Avatar className="h-9 w-9 ring-2 ring-indigo-50">
                              <AvatarFallback className="bg-indigo-100 font-semibold text-indigo-600">
                                {liveClass.title?.charAt(0) ?? "C"}
                              </AvatarFallback>
                            </Avatar>
                            <Badge className="bg-emerald-50 capitalize text-emerald-600 hover:bg-emerald-50">
                              {formatClassDate(liveClass.class_date)}
                            </Badge>
                          </div>

                          <h3 className="mt-3 text-sm font-semibold text-gray-800">{liveClass.title}</h3>
                          <p className="text-xs text-gray-500">{liveClass.teacher?.name}</p>
                          {subject && (
                            <p className="text-xs text-gray-400">
                              {subject.name}
                              {liveClass.grade?.name && <> · {liveClass.grade.name}</>}
                            </p>
                          )}

                          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{liveClass.start_time} – {liveClass.end_time}</span>
                          </div>

                          <Button
                            onClick={() => navigate(`/live-classes-batch/${liveClass.batch.id}`)}
                            className="mt-4 flex w-full items-center justify-center gap-2 bg-indigo-600 text-white transition group-hover:bg-indigo-700"
                          >
                            View Class
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Upcoming classes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Upcoming Classes
          </h2>

          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 px-6 py-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-600">No upcoming classes scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((c) => (
                <Card key={c.id} className="rounded-xl shadow-sm transition hover:shadow-md">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {c.teacher?.name}
                        {c.curriculum_subject?.name && <> · {c.curriculum_subject.name}</>}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatClassDate(c.class_date)}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5" /> {c.start_time} – {c.end_time}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/live-classes-batch/${c.batch.id}`)}
                    >
                      View Class
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, accent, pulse }) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-sm transition hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`relative flex h-11 w-11 items-center justify-center rounded-lg ${
            accent ? "bg-amber-50 text-amber-500" : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <Icon className="h-5 w-5" />
          {pulse && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
            </span>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-gray-800">{value ?? 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveClassesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 dark:bg-[#0F1120] md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveClasses;