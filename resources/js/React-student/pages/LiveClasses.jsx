import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  Video,
  Radio,
  Bell,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const toneMap = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  sage: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
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
    const interval = setInterval(fetchData, 30000); // keep LIVE status current
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] dark:bg-[#0F1120]">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) return <LiveClassesSkeleton />;

  const { enrollments, live_today, upcoming_live_classes, stats } = data;
  const hasEnrollments = enrollments.length > 0;
  const nextLive = live_today[0];

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#0F1120] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <TicketHero student={data.student} nextLive={nextLive} />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Active Batches" value={stats.active_batches} icon={BookOpen} tone="indigo" />
          <StatCard label="Live Today" value={stats.live_today_count} icon={Radio} tone="amber" />
          <StatCard label="Upcoming Classes" value={stats.upcoming_count} icon={CalendarDays} tone="indigo" />
          <StatCard label="Attendance" value={stats.attendance_percent} suffix="%" icon={TrendingUp} tone="sage" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {hasEnrollments ? (
              <>
                <EnrolledBatches enrollments={enrollments} />
                <TodaysClasses classes={live_today} />
                <UpcomingClasses classes={upcoming_live_classes} />
              </>
            ) : (
              <EmptyEnrollments />
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <ScheduleWidget liveToday={live_today} upcoming={upcoming_live_classes} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
function TicketHero({ student, nextLive }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-indigo-900/10 bg-[#14172B] shadow-lg md:flex-row">
      <div className="relative flex-1 p-8 md:p-10">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-widest">Learning pass</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl" style={{ fontFamily: "'Fraunces', serif" }}>
          Welcome back, {student.full_name}
        </h1>
        <p className="mt-2 max-w-md text-sm text-indigo-200/80">
          Your enrolled batches and live sessions are lined up below — pick up right where you left off.
        </p>
      </div>

      <div className="relative hidden md:flex md:items-stretch">
        <div className="mx-1 border-l-2 border-dashed border-white/20" />
      </div>
      <div className="relative md:hidden">
        <div className="absolute -top-2 left-0 h-4 w-4 rounded-full bg-[#F7F6F2] dark:bg-[#0F1120]" />
        <div className="absolute -top-2 right-0 h-4 w-4 rounded-full bg-[#F7F6F2] dark:bg-[#0F1120]" />
        <div className="my-1 border-t-2 border-dashed border-white/20" />
      </div>

      <div className="flex w-full flex-col justify-center gap-3 bg-white/5 p-8 md:w-64 md:p-10">
        {nextLive ? (
          <>
            <span className="text-xs font-medium uppercase tracking-widest text-amber-400">Live today</span>
            <p className="text-sm text-white">{nextLive.title}</p>
            <p className="font-mono text-xs text-indigo-200/70">
              {nextLive.start_time} – {nextLive.end_time}
            </p>
            <Button className="mt-2 bg-amber-500 text-[#14172B] hover:bg-amber-400">
              <Video className="mr-2 h-4 w-4" />
              Join Next Live Class
            </Button>
          </>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-widest text-indigo-300">No class today</span>
            <p className="text-sm text-indigo-200/70">Check what's coming up this week.</p>
            <Button variant="outline"
              className="mt-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-colors"
            >
              View Schedule
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function StatCard({ label, value, icon: Icon, tone, suffix = "" }) {
  const t = toneMap[tone];
  return (
    <Card className="rounded-xl border-none shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((e) => {
          const batch = e.batch;
          const subject = batch?.curriculum_subject;
          return (
            <Card key={e.id} className="rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
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
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function TodaysClasses({ classes }) {
  if (classes.length === 0) {
    return (
      <section>
        <SectionHeader title="Today's Live Classes" />
        <p className="text-sm text-slate-500">No live classes scheduled for today.</p>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader title="Today's Live Classes" />
      <div className="space-y-3">
        {classes.map((c) => {
          const isLive = c.status === "live" || c.status === "scheduled";
          return (
            <Card key={c.id} className={`rounded-xl shadow-sm ${isLive ? "border-l-4 border-amber-500" : ""}`}>
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
                    {c.status === "live" && <Radio className="mr-1 h-3 w-3" />}
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
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function UpcomingClasses({ classes }) {
  if (classes.length === 0) {
    return (
      <section>
        <SectionHeader title="Upcoming Classes" />
        <p className="text-sm text-slate-500">Nothing scheduled yet.</p>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader title="Upcoming Classes" />
      <Card className="rounded-xl shadow-sm">
        <CardContent className="divide-y p-0">
          {classes.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 p-4">
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
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
function ScheduleWidget({ liveToday, upcoming }) {
  const items = [...liveToday.map((c) => ({ ...c, day: "Today" })), ...upcoming.map((c) => ({ ...c, day: c.class_date }))].slice(0, 6);

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Upcoming Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && <p className="text-xs text-slate-500">Nothing scheduled.</p>}
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-slate-500">{s.day}</p>
              <p className="font-medium">{s.title}</p>
            </div>
            <span className="font-mono text-xs text-indigo-600">{s.start_time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function EmptyEnrollments() {
  return (
    <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center dark:border-indigo-500/20 dark:bg-indigo-500/5">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <BookOpen className="h-5 w-5 text-indigo-600" />
      </div>
      <h2 className="mt-4 text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
        You're not enrolled in any batch yet.
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
        Browse available batches and enroll to start attending live classes.
      </p>
      <Button className="mt-4">Browse Batches</Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
function SectionHeader({ title }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
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