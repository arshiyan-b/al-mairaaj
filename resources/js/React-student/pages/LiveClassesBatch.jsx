import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CalendarDays,
  Clock,
  BookOpen,
  GraduationCap,
  Video,
  X,
  Loader2,
} from "lucide-react";

const ENROLL_CUTOFF_MINUTES = 30;

function formatClassTime(raw) {
  if (!raw) return "";
  const [hourStr, minute] = raw.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

const LiveClassesBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);
  const [modalClass, setModalClass] = useState(null); // holds { ...class, reason: "early" | "ended" }

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/student/live-class-batch/${id}`, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Batch not found (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setBatch(data.batch);
        setLiveClasses(data.live_classes || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const getMinutesUntilStart = (classDate, startTime) => {
    const target = new Date(`${classDate}T${startTime}`);
    return (target.getTime() - Date.now()) / 60000;
  };

  const isClassEnded = (classDate, endTime) => {
    const end = new Date(`${classDate}T${endTime}`);
    return Date.now() > end.getTime();
  };

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";

  const handleEnroll = (classId) => {
    if (enrollingId) return; // guard against double submits
    setEnrollingId(classId);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/live-class-enroll/${classId}`;

    const token = document.createElement("input");
    token.type = "hidden";
    token.name = "_token";
    token.value = csrfToken;

    form.appendChild(token);
    document.body.appendChild(form);
    form.submit();
  };

  const handleJoin = async (liveClassId) => {
    if (joiningId) return;

    setJoiningId(liveClassId);

    try {
      const response = await fetch("/meeting/join", {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to join the meeting."
        );
      }

      window.open(
        data.meeting_url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("Meeting join error:", error);

      alert(
        error.message || "Unable to join the meeting."
      );
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) return <BatchSkeleton />;

  if (error || !batch) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] dark:bg-[#0F1120]">
        <p className="text-sm text-gray-500">{error || "Batch not found."}</p>
      </div>
    );
  }

  const subject = batch.curriculum_subject;
  const grade = subject?.grade;
  const board = grade?.board;

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 dark:bg-[#0F1120] md:px-8 md:py-10">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Batch summary card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start justify-between">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-indigo-100 text-lg text-indigo-600">
                    {batch.title?.charAt(0) ?? "B"}
                  </AvatarFallback>
                </Avatar>
                <Badge className="bg-emerald-50 capitalize text-emerald-600 hover:bg-emerald-50">
                  {batch.status}
                </Badge>
              </div>

              <h1 className="mt-4 text-2xl font-semibold text-gray-800">
                {batch.title}
              </h1>
              {batch.description && <p className="mt-2 text-sm text-gray-500">{batch.description}</p>}

              <Separator className="my-5" />

              <div className="grid grid-cols-2 gap-5 text-sm md:grid-cols-3">

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <BookOpen className="h-3.5 w-3.5" /> Subject
                  </p>
                  <p className="mt-1 font-medium text-gray-700">{subject?.name ?? "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Grade</p>
                  <p className="mt-1 font-medium text-gray-700">
                    {grade.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Examination Board</p>
                  <p className="mt-1 font-medium text-gray-700">
                    {board.name}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <GraduationCap className="h-3.5 w-3.5" /> Teacher
                  </p>

                  <Link
                    to={`/teacher/${batch.teacher?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {batch.teacher?.name ?? "—"}
                  </Link>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="h-3.5 w-3.5" /> Duration
                  </p>
                  <p className="mt-1 font-mono text-xs font-medium text-gray-700">
                    {batch.formatted_start_date} – {batch.formatted_end_date}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" /> Total Classes
                  </p>
                  <p className="mt-1 font-medium text-gray-700">{batch.total_classes ?? "—"}</p>
                </div>

              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* Live classes schedule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Class Schedule
          </h2>

          {liveClasses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 px-6 py-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-600">No classes scheduled yet</p>
              <p className="mt-1 text-xs text-gray-400">Sessions will appear here once they're added.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveClasses.map((c) => {
                const isLive = c.status?.toLowerCase() === "live";
                const minutesUntilStart = getMinutesUntilStart(c.class_date, c.start_time);
                const withinCutoff = minutesUntilStart <= ENROLL_CUTOFF_MINUTES;
                const ended = isClassEnded(c.class_date, c.end_time);
                const isEnrolling = enrollingId === c.id;
                const showEnrollButton = !c.is_enrolled && !withinCutoff;

                return (
                  <Card key={c.id} className={`rounded-xl shadow-sm ${isLive ? "border-l-4 border-amber-500" : ""}`}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>

                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {c.formatted_class_date ?? c.class_date}
                          </span>

                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5" />
                            {formatClassTime(c.start_time)} – {formatClassTime(c.end_time)}
                          </span>
                        </div>

                        {showEnrollButton && (
                          <div className="mt-2 font-semibold text-s text-purple-600">
                            Rs. {Number(c.price).toFixed(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            c.status?.toLowerCase() === "live"
                              ? "bg-amber-500 text-white hover:bg-amber-500"
                              : c.status?.toLowerCase() === "completed"
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                          }
                        >
                          {c.status}
                        </Badge>

                        {c.is_enrolled ? (
                          ended ? (
                            // Enrolled but class has already ended
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setModalClass({ ...c, reason: "ended" })}
                            >
                              <Video className="mr-2 h-3.5 w-3.5" /> Join
                            </Button>
                          ) : withinCutoff ? (
                            // Enrolled + within 30 min of start (or already started) -> active Join link
                            <Button size="sm" onClick={() => handleJoin(c.id)}>
                              <Video className="mr-2 h-3.5 w-3.5" /> Join
                            </Button>
                          ) : (
                            // Enrolled but more than 30 min out -> disabled-looking Join that opens an info modal
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setModalClass({ ...c, reason: "early" })}
                            >
                              <Video className="mr-2 h-3.5 w-3.5" /> Join
                            </Button>
                          )
                        ) : withinCutoff ? (
                          // Not enrolled + within 30 min of start -> can no longer enroll
                          <Button size="sm" variant="outline" disabled>
                            Enrollment Closed
                          </Button>
                        ) : (
                          // Not enrolled + more than 30 min out -> can enroll
                          <Button
                            size="sm"
                            disabled={isEnrolling}
                            onClick={() => handleEnroll(c.id)}
                          >
                            {isEnrolling ? (
                              <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Enrolling...
                              </>
                            ) : (
                              "Enroll"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Small modal shown when an enrolled student clicks Join too early or after the class has ended */}
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
              className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-[#171a2e]"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                  {modalClass.reason === "ended" ? "This class has ended" : "Meeting Link not available yet"}
                </h3>
                <button
                  onClick={() => setModalClass(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {modalClass.reason === "ended" ? (
                  <>
                    This session took place on {modalClass.formatted_class_date ?? modalClass.class_date} and is
                    no longer available to join.
                  </>
                ) : (
                  <>
                    The Join button activates {ENROLL_CUTOFF_MINUTES} minutes before the class starts,
                    at {formatClassTime(modalClass.start_time)} on{" "}
                    {modalClass.formatted_class_date ?? modalClass.class_date}.
                  </>
                )}
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

function BatchSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 dark:bg-[#0F1120] md:px-8 md:py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </div>
  );
}

export default LiveClassesBatch;