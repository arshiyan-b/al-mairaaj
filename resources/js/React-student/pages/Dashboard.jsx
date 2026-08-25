// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  BookOpen,
  Video,
  Sparkles,
  Calendar as CalendarIcon,
  Loader2,
  X,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const ENROLL_CUTOFF_MINUTES = 30;

// Sessions from this endpoint may come back either as class_date + start_time +
// end_time (like the live-classes pages) or as starts_at/ends_at timestamps.
// These helpers normalize both shapes.
function getSessionStart(session) {
  if (session.class_date && session.start_time) {
    return new Date(`${session.class_date}T${session.start_time}`);
  }
  return session.starts_at ? new Date(session.starts_at) : null;
}
function getSessionEnd(session) {
  if (session.class_date && session.end_time) {
    return new Date(`${session.class_date}T${session.end_time}`);
  }
  return session.ends_at ? new Date(session.ends_at) : null;
}
function formatSessionTime(session) {
  const start = getSessionStart(session);
  if (!start) return "Schedule TBA";
  return start.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

const Dashboard = ({ user }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [joiningId, setJoiningId] = useState(null);
  const [modalClass, setModalClass] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/dashboard-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";

  const handleJoin = async (liveClassId) => {
    if (joiningId) return; // guard against double clicks
    setJoiningId(liveClassId);
    try {
      const response = await fetch("/jitsi/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          live_class_id: liveClassId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Unable to join the class.");
      }

      const meetingUrl = `https://${responseData.domain}/${responseData.room}?jwt=${encodeURIComponent(responseData.token)}`;

      window.open(meetingUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Jitsi join error:", err);
      alert(err.message || "Unable to join the class.");
    } finally {
      setJoiningId(null);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) return <DashboardSkeleton />;

  const studentName = data.student?.name || user?.name || "Student";
  const completion = data.student?.profile_completion ?? 0;
  const walletBalance = data.wallet?.balance ?? 0;
  const walletCurrency = data.wallet?.currency || "PKR";
  const recentBooks = data.recent_books || [];

  // Drop any session whose end time has already passed.
  const upcomingClasses = (data.upcoming_classes || []).filter((session) => {
    const end = getSessionEnd(session);
    return !end || Date.now() <= end.getTime();
  });

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-r from-teal-950 to-teal-800 text-white rounded-xl shadow-md px-6 py-8">
              <div className="absolute top-0 right-0 opacity-10">
                <Sparkles className="w-40 h-40 transform translate-x-10 -translate-y-10" />
              </div>
              <div className="relative flex flex-col">
                <h2 className="text-xl font-semibold">Welcome back, {studentName}!</h2>
                <p className="text-sm opacity-90 mt-1">
                  Here's a quick look at your profile and activity.
                </p>

                {/* Profile completion */}
                <div className="mt-4 max-w-sm">
                  <div className="flex justify-between text-xs mb-1 opacity-90">
                    <span>Profile Completion</span>
                    <span className="font-bold">{completion}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 w-full relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-3 bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  {completion < 100 && (
                    <a
                      href="/profile"
                      className="inline-block text-xs mt-2 underline opacity-90 hover:opacity-100"
                    >
                      Complete your profile
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Books */}
          <section className="p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Recently Added Books
              </h2>
              <a href="/books" className="text-teal-600 hover:underline text-sm">
                View All
              </a>
            </div>

            {recentBooks.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                message="No books available yet — check back soon."
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {recentBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={fadeUp}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-gray-900 text-teal-600 grid place-items-center flex-shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {book.curriculum_subject?.name || "General"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>

          {/* Upcoming Live Classes */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-600" />
              Upcoming Live Classes
            </h3>
            <Card className="p-6 rounded-xl shadow-sm">
              <CardContent className="p-0">
                {upcomingClasses.length === 0 ? (
                  <EmptyState
                    icon={CalendarIcon}
                    message="No upcoming classes scheduled right now."
                  />
                ) : (
                  <div className="space-y-4">
                    {upcomingClasses.map((session) => {
                      const start = getSessionStart(session);
                      const minutesUntilStart = start ? (start.getTime() - Date.now()) / 60000 : Infinity;
                      const withinCutoff = minutesUntilStart <= ENROLL_CUTOFF_MINUTES;
                      const isJoining = joiningId === session.id;

                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 text-teal-600 flex-shrink-0">
                              <Video className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {session.subject?.name || session.title || "Live Session"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatSessionTime(session)}
                              </p>
                            </div>
                          </div>

                          {withinCutoff ? (
                            <Button
                              size="sm"
                              disabled={isJoining}
                              onClick={() => handleJoin(session.id)}
                              className="bg-teal-600 text-white hover:bg-teal-700 flex-shrink-0"
                            >
                              {isJoining ? (
                                <>
                                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Joining...
                                </>
                              ) : (
                                <>
                                  <Video className="mr-2 h-3.5 w-3.5" /> Join
                                </>
                              )}
                            </Button>
                          ) : (
                            <button
                              onClick={() => setModalClass(session)}
                              className="flex items-center gap-1 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Wallet */}
          <Card className="p-6 rounded-2xl shadow-sm border-0 bg-gradient-to-br from-teal-900 to-teal-700 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Wallet className="w-32 h-32 transform translate-x-8 -translate-y-8" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-2 relative">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
              <p className="text-3xl font-extrabold">
                {walletCurrency} {Number(walletBalance).toLocaleString()}
              </p>
              <p className="text-teal-100 text-xs mt-1">Available balance</p>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="p-6 rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
              <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-1">
              {[
                { label: "My Profile", href: "/profile" },
                { label: "My Wallet", href: "/wallet" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1.5 group"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal shown when clicking a session more than 30 min before its start */}
      <AnimatePresence>
        {modalClass && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalClass(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Meeting Link not available yet
                </h3>
                <button
                  onClick={() => setModalClass(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The Join button activates {ENROLL_CUTOFF_MINUTES} minutes before the class starts, at{" "}
                {formatSessionTime(modalClass)}.
              </p>
              <Button size="sm" className="mt-4 w-full" onClick={() => setModalClass(null)}>
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon className="h-8 w-8 text-gray-300 mb-2" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
        <div className="md:col-span-1 space-y-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;