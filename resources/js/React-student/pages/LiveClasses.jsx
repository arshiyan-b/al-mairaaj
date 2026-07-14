import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Video,
  Radio,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Sparkles,
  Inbox,
} from "lucide-react";

const toneMap = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  sage: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const LiveClasses = ({ user }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/student/live-classes-data", {
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load live classes data");
          return res.json();
        })
        .then(setData)
        .catch((err) => setError(err.message));
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] dark:bg-[#0F1120]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      </div>
    );
  }

  if (!data) return <LiveClassesSkeleton />;

  const { enrollments, live_today, upcoming_live_classes, stats } = data;
  const nextLive = live_today[0];

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#0F1120] px-4 py-6 md:px-8 md:py-10">
      <motion.div
        className="mx-auto max-w-7xl space-y-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <TicketHero student={data.student} nextLive={nextLive} />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <StatCard label="Active Batches" value={stats.active_batches} icon={BookOpen} tone="indigo" />
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <StatCard label="Live Today" value={stats.live_today_count} icon={Radio} tone="amber" />
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <StatCard label="Upcoming Classes" value={stats.upcoming_count} icon={CalendarDays} tone="indigo" />
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <StatCard label="Attendance" value={stats.attendance_percent ?? 0} suffix="%" icon={TrendingUp} tone="sage" />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <motion.div className="space-y-8" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <EnrolledBatches enrollments={enrollments} />
            <TodaysClasses classes={live_today} />
            <UpcomingClasses classes={upcoming_live_classes} />
          </motion.div>

          <motion.div
            className="space-y-6 lg:sticky lg:top-6 lg:self-start"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EnrollCard />
            <ScheduleWidget liveToday={live_today} upcoming={upcoming_live_classes} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------------
function EnrollCard() {
  return (
    <Card className="rounded-xl border-none bg-indigo-600 text-white shadow-sm transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-indigo-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-widest">Explore batches</span>
        </div>
        <h3 className="mt-2 text-base font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
          Want to add another subject?
        </h3>
        <p className="mt-1 text-xs text-indigo-100/90">
          Browse open batches across boards and grades, then enroll in a couple of clicks.
        </p>
        <Link to="/browse_live_classes">
          <Button className="group relative mt-4 w-full overflow-hidden bg-white text-indigo-700 hover:bg-indigo-50 transition-colors">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Enrolled
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-100/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function TicketHero({ student, nextLive }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-900/10 bg-[#14172B] p-8 shadow-lg md:p-10">
      <motion.div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-center gap-2 text-indigo-300">
        <Sparkles className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-widest">Learning pass</span>
      </div>
      <h1
        className="relative mt-3 text-3xl font-semibold text-white md:text-4xl"
      >
        Welcome back, {student?.full_name || "Student"}
      </h1>
      <p className="relative mt-2 max-w-md text-sm text-indigo-200/80">
        Your enrolled batches and live sessions are lined up below — pick up right where you left off.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
function StatCard({ label, value, icon: Icon, tone, suffix = "" }) {
  const t = toneMap[tone];
  return (
    <Card className="rounded-xl border-none shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.bg}`}>
          <Icon className={`h-5 w-5 ${t.text}`} />
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">{value}{suffix}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function EnrolledBatches({ enrollments }) {
  return (
    <section>
      <SectionHeader title="My Enrolled Batches" />
      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No batches yet"
          message="Once you enroll in a batch, it'll show up here."
        />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {enrollments.map((e) => {
            const batch = e.batch;
            const subject = batch?.curriculumSubject;
            return (
              <motion.div key={e.id} variants={fadeUp} transition={{ duration: 0.35 }}>
                <Card className="h-full rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {batch?.title?.charAt(0) ?? "B"}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 capitalize">
                        {batch?.status ?? "active"}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{batch?.title}</h3>
                    <p className="text-xs text-slate-500">{batch?.teacher?.name}</p>
                    {subject && (
                      <p className="text-xs text-slate-400">
                        {subject.name} · {subject.grade?.name} · {subject.grade?.board?.name}
                      </p>
                    )}
                    <Separator className="my-3" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{batch?.start_date} → {batch?.end_date}</span>
                      <span className="font-mono">{batch?.total_classes} classes</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Open Batch <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
function TodaysClasses({ classes }) {
  return (
    <section>
      <SectionHeader title="Today's Live Classes" />
      {classes.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No live classes today"
          message="Check the schedule for what's coming up next."
        />
      ) : (
        <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
          <AnimatePresence>
            {classes.map((c) => {
              const isLive = c.status === "live";
              return (
                <motion.div key={c.id} variants={fadeUp} transition={{ duration: 0.35 }} layout>
                  <Card className={`rounded-xl shadow-sm transition hover:shadow-md ${isLive ? "border-l-4 border-amber-500" : ""}`}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <h4 className="text-sm font-semibold">{c.title}</h4>
                        <p className="text-xs text-slate-500">{c.batch?.title}</p>
                        <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" /> {c.start_time} – {c.end_time}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            c.status === "live"
                              ? "bg-amber-500 text-white hover:bg-amber-500"
                              : c.status === "completed"
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                          }
                        >
                          {c.status === "live" && (
                            <motion.span
                              className="mr-1 inline-flex"
                              animate={{ opacity: [1, 0.4, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            >
                              <Radio className="h-3 w-3" />
                            </motion.span>
                          )}
                          {c.status}
                        </Badge>
                        {c.meeting_link ? (
                          <a href={c.meeting_link} target="_blank" rel="noreferrer">
                            <Button size="sm">Join Now</Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline">View Details</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
function UpcomingClasses({ classes }) {
  return (
    <section>
      <SectionHeader title="Upcoming Classes" />
      {classes.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nothing scheduled yet"
          message="New sessions will appear here once they're added to your batches."
        />
      ) : (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="divide-y p-0">
            {classes.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.batch?.title}</p>
                    <p className="text-xs text-slate-500">{c.title}</p>
                  </div>
                </div>
                <p className="font-mono text-xs text-slate-500">{c.class_date} · {c.start_time}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
function ScheduleWidget({ liveToday, upcoming }) {
  const items = [
    ...liveToday.map((c) => ({ ...c, day: "Today" })),
    ...upcoming.map((c) => ({ ...c, day: c.class_date })),
  ].slice(0, 6);

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Upcoming Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500">Nothing scheduled.</p>
        ) : (
          items.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="text-xs text-slate-500">{s.day}</p>
                <p className="font-medium">{s.title}</p>
              </div>
              <span className="font-mono text-xs text-indigo-600">{s.start_time}</span>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Shared empty-state block — used wherever a section has zero items
function EmptyState({ icon: Icon, title, message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{message}</p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
function SectionHeader({ title }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>
    </div>
  );
}

function LiveClassesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#0F1120] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default LiveClasses;