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
  Users,
  Radio,
  BookOpen,
  ArrowRight,
  Compass,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

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
        <motion.div
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              My Live Class Batches
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your enrolled batches and upcoming live sessions.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/browse_live_classes")}
            className="flex items-center gap-2"
          >
            <Compass className="h-4 w-4" /> Browse batches
          </Button>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <StatCard icon={BookOpen} label="Active batches" value={stats.active_batches} />
            <StatCard icon={Radio} label="Live today" value={stats.live_today_count} accent />
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
              <Radio className="h-4 w-4 text-amber-500" /> Live Today
            </h2>
            <div className="space-y-3">
              {liveToday.map((c) => (
                <Card key={c.id} className="rounded-xl border-l-4 border-amber-500 shadow-sm">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>
                      <p className="text-xs text-gray-500">{c.batch?.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5" /> {c.start_time} – {c.end_time}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/live_class_batch/${c.batch_id}`)}
                      className="bg-amber-500 text-white hover:bg-amber-600"
                    >
                      Go to batch
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enrolled batches */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800" style={{ fontFamily: "'Fraunces', serif" }}>
            My Batches
          </h2>

          {enrollments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-600">You're not enrolled in any batch yet</p>
              <p className="mt-1 text-xs text-gray-400">Browse available batches to get started.</p>
              <Button
                onClick={() => navigate("/browse_live_classes")}
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
                  const batch = enrollment.batch;
                  if (!batch) return null;
                  const subject = batch.curriculum_subject;

                  return (
                    <motion.div key={enrollment.id} variants={fadeUp} transition={{ duration: 0.3 }} layout>
                      <Card className="h-full rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <CardContent className="flex h-full flex-col p-5">
                          <div className="flex items-start justify-between">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {batch.title?.charAt(0) ?? "B"}
                              </AvatarFallback>
                            </Avatar>
                            <Badge className="bg-emerald-50 capitalize text-emerald-600 hover:bg-emerald-50">
                              {batch.status}
                            </Badge>
                          </div>

                          <h3 className="mt-3 text-sm font-semibold text-gray-800">{batch.title}</h3>
                          <p className="text-xs text-gray-500">{batch.teacher?.name}</p>
                          {subject && (
                            <p className="text-xs text-gray-400">
                              {subject.name} · {subject.grade?.name} · {subject.grade?.board?.name}
                            </p>
                          )}

                          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                            <Users className="h-3.5 w-3.5" />
                            <span>{batch.total_classes} classes</span>
                          </div>

                          <Button
                            onClick={() => navigate(`/live_class_batch/${batch.id}`)}
                            className="mt-4 flex w-full items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            View Batch <ArrowRight className="h-3.5 w-3.5" />
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
          <h2 className="mb-4 text-lg font-semibold text-gray-800" style={{ fontFamily: "'Fraunces', serif" }}>
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
                <Card key={c.id} className="rounded-xl shadow-sm">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>
                      <p className="text-xs text-gray-500">{c.batch?.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {c.class_date}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5" /> {c.start_time} – {c.end_time}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/live_class_batch/${c.batch_id}`)}
                    >
                      View Batch
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

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            accent ? "bg-amber-50 text-amber-500" : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <Icon className="h-5 w-5" />
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
        <Skeleton className="h-10 w-72 rounded-lg" />
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