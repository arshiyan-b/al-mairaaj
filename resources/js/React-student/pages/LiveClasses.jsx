import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  Users,
  Video,
  Radio,
  Bell,
  ChevronRight,
  Search,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Dummy data — swap for real API data. Toggle HAS_ENROLLMENTS to preview
// the discovery (empty-state) scenario.
// ---------------------------------------------------------------------------
const HAS_ENROLLMENTS = true;

const stats = [
  { label: "Active Batches", value: 4, icon: BookOpen, tone: "indigo" },
  { label: "Live Today", value: 1, icon: Radio, tone: "amber" },
  { label: "Upcoming Classes", value: 7, icon: CalendarDays, tone: "indigo" },
  { label: "Attendance", value: 79, icon: TrendingUp, tone: "sage", suffix: "%" },
];

const enrolledBatches = [
  { id: 1, name: "Physics — A2 Mechanics", teacher: "Dr. Ahmed Khan", schedule: "Mon / Wed / Fri", duration: "12 weeks", status: "Active" },
  { id: 2, name: "Mathematics — Calculus I", teacher: "Sir Ali Raza", schedule: "Tue / Thu", duration: "10 weeks", status: "Active" },
  { id: 3, name: "Chemistry — Organic Basics", teacher: "Ms. Fatima Noor", schedule: "Mon / Thu", duration: "8 weeks", status: "Active" },
];

const todayClasses = [
  { id: 1, title: "Physics — Motion & Force", batch: "A2 Mechanics", teacher: "Dr. Ahmed Khan", time: "7:00 PM", duration: "60 min", live: true },
  { id: 2, title: "Calculus — Integration Basics", batch: "Calculus I", teacher: "Sir Ali Raza", time: "9:00 PM", duration: "45 min", live: false },
];

const upcomingClasses = [
  { id: 1, date: "Tomorrow", time: "6:00 PM", teacher: "Ms. Fatima Noor", batch: "Organic Basics" },
  { id: 2, date: "28 Jun", time: "4:00 PM", teacher: "Dr. Ahmed Khan", batch: "A2 Mechanics" },
  { id: 3, date: "29 Jun", time: "6:30 PM", teacher: "Sir Ali Raza", batch: "Calculus I" },
];

const scheduleWidget = [
  { day: "Today", time: "7:00 PM", title: "Motion & Force" },
  { day: "Today", time: "9:00 PM", title: "Integration Basics" },
  { day: "Tomorrow", time: "6:00 PM", title: "Organic Basics" },
];

const announcements = [
  { title: "Join 10 minutes early", desc: "Sessions open a bit before start time for setup.", time: "2h ago" },
  { title: "Recordings available", desc: "Every live session is recorded automatically.", time: "1d ago" },
  { title: "Live chat enabled", desc: "Ask questions in real time during class.", time: "2d ago" },
];

const availableBatches = [
  { id: 1, name: "Biology — Human Systems", teacher: "Dr. Sana Malik", duration: "10 weeks", start: "1 Jul", seats: 6, status: "Filling Fast" },
  { id: 2, name: "English — Comprehension", teacher: "Ms. Areeba Khan", duration: "6 weeks", start: "3 Jul", seats: 18, status: "Open" },
  { id: 3, name: "Computer Science — Basics", teacher: "Mr. Hamza Tariq", duration: "8 weeks", start: "5 Jul", seats: 11, status: "Open" },
];

const toneMap = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  sage: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
};

// ---------------------------------------------------------------------------

const LiveClasses = ({ user, loading = false }) => {
  const [hasEnrollments] = useState(HAS_ENROLLMENTS);
  const nextLive = todayClasses.find((c) => c.live);

  if (loading) return <LiveClassesSkeleton />;

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#0F1120] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <TicketHero user={user} nextLive={nextLive} />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {hasEnrollments ? (
              <>
                <EnrolledBatches />
                <TodaysClasses />
                <UpcomingClasses />
              </>
            ) : (
              <DiscoverBatches />
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <ScheduleWidget />
            <AnnouncementsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Hero — torn-ticket motif: perforated divider, punch holes, stub CTA
// ---------------------------------------------------------------------------
function TicketHero({ user, nextLive }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-indigo-900/10 bg-[#14172B] shadow-lg md:flex-row">
      {/* Main panel */}
      <div className="relative flex-1 p-8 md:p-10">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-widest">Learning pass</span>
        </div>
        <h1
          className="mt-3 text-3xl font-semibold text-white md:text-4xl"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Welcome back, {user?.name || "Student"}
        </h1>
        <p className="mt-2 max-w-md text-sm text-indigo-200/80">
          Your enrolled batches and live sessions are lined up below — pick up right where you left off.
        </p>
      </div>

      {/* Punch holes + dashed perforation (desktop: vertical, mobile: horizontal) */}
      <div className="relative hidden md:flex md:items-stretch">
        <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[#F7F6F2] dark:bg-[#0F1120]" />
        <div className="absolute -left-2 bottom-0 h-4 w-4 rounded-full bg-[#F7F6F2] dark:bg-[#0F1120]" />
        <div className="mx-1 border-l-2 border-dashed border-white/20" />
      </div>
      <div className="relative md:hidden">
        <div className="absolute -top-2 left-0 h-4 w-4 rounded-full bg-[#F7F6F2] dark:bg-[#0F1120]" />
        <div className="absolute -top-2 right-0 h-4 w-4 rounded-full bg-[#F7F6F2] dark:bg-[#0F1120]" />
        <div className="my-1 border-t-2 border-dashed border-white/20" />
      </div>

      {/* Stub */}
      <div className="flex w-full flex-col justify-center gap-3 bg-white/5 p-8 md:w-64 md:p-10">
        {nextLive ? (
          <>
            <span className="text-xs font-medium uppercase tracking-widest text-amber-400">Live now</span>
            <p className="text-sm text-white">{nextLive.title}</p>
            <p className="font-mono text-xs text-indigo-200/70">{nextLive.time} · {nextLive.duration}</p>
            <Button className="mt-2 bg-amber-500 text-[#14172B] hover:bg-amber-400">
              <Video className="mr-2 h-4 w-4" />
              Join Next Live Class
            </Button>
          </>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-widest text-indigo-300">No class today</span>
            <p className="text-sm text-indigo-200/70">Check what's coming up this week.</p>
            <Button variant="outline" className="mt-2 border-white/20 text-white hover:bg-white/10">
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
function EnrolledBatches() {
  return (
    <section>
      <SectionHeader title="My Enrolled Batches" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledBatches.map((b) => (
          <Card key={b.id} className="rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <Avatar className="h-9 w-9 bg-indigo-100 text-indigo-600">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {b.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">{b.status}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{b.name}</h3>
              <p className="text-xs text-slate-500">{b.teacher}</p>
              <Separator className="my-3" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{b.schedule}</span>
                <span className="font-mono">{b.duration}</span>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Open Batch <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function TodaysClasses() {
  return (
    <section>
      <SectionHeader title="Today's Live Classes" />
      <div className="space-y-3">
        {todayClasses.map((c) => (
          <Card
            key={c.id}
            className={`rounded-xl shadow-sm ${c.live ? "border-l-4 border-amber-500" : ""}`}
          >
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <h4 className="text-sm font-semibold">{c.title}</h4>
                <p className="text-xs text-slate-500">{c.batch} · {c.teacher}</p>
                <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> {c.time} · {c.duration}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.live ? (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                    <Radio className="mr-1 h-3 w-3" /> LIVE
                  </Badge>
                ) : (
                  <Badge variant="secondary">Upcoming</Badge>
                )}
                <Button size="sm" className={c.live ? "bg-amber-500 hover:bg-amber-400 text-[#14172B]" : ""} variant={c.live ? "default" : "outline"}>
                  {c.live ? "Join Now" : "View Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function UpcomingClasses() {
  return (
    <section>
      <SectionHeader title="Upcoming Classes" />
      <Card className="rounded-xl shadow-sm">
        <CardContent className="divide-y p-0">
          {upcomingClasses.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{u.batch}</p>
                  <p className="text-xs text-slate-500">{u.teacher}</p>
                </div>
              </div>
              <p className="font-mono text-xs text-slate-500">{u.date} · {u.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
function ScheduleWidget() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Upcoming Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduleWidget.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-slate-500">{s.day}</p>
              <p className="font-medium">{s.title}</p>
            </div>
            <span className="font-mono text-xs text-indigo-600">{s.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AnnouncementsWidget() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Batch Announcements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
              <Bell className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-xs text-slate-500">{a.desc}</p>
              <p className="mt-1 text-[11px] text-slate-400">{a.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Scenario 2 — no enrollments: discovery mode
// ---------------------------------------------------------------------------
function DiscoverBatches() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center dark:border-indigo-500/20 dark:bg-indigo-500/5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <BookOpen className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="mt-4 text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
          You're not enrolled in any batch yet.
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Search available batches below and enroll to start attending live classes.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Search batches..." className="pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableBatches.map((b) => (
          <Card key={b.id} className="rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {b.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  className={
                    b.status === "Filling Fast"
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-50"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                  }
                >
                  {b.status}
                </Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{b.name}</h3>
              <p className="text-xs text-slate-500">{b.teacher}</p>
              <div className="mt-3 flex justify-between font-mono text-xs text-slate-500">
                <span>{b.duration}</span>
                <span>Starts {b.start}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{b.seats} seats left</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                <Button size="sm" className="flex-1">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
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

// ---------------------------------------------------------------------------
function LiveClassesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#0F1120] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default LiveClasses;