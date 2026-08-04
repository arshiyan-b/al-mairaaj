import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CalendarDays,
  Clock,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Video,
} from "lucide-react";

const LiveClassesBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [liveClasses, setLiveClasses] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setEnrolled(!!data.is_enrolled);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
                    <BookOpen className="h-3.5 w-3.5" /> Subject
                  </p>
                  <p className="mt-1 font-medium text-gray-700">{subject?.name ?? "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Grade / Board</p>
                  <p className="mt-1 font-medium text-gray-700">
                    {grade?.name ?? "—"} {board?.name ? `· ${board.name}` : ""}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" /> Total Classes
                  </p>
                  <p className="mt-1 font-medium text-gray-700">{batch.total_classes ?? "—"}</p>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="h-3.5 w-3.5" /> Duration
                  </p>
                  <p className="mt-1 font-mono text-xs font-medium text-gray-700">
                    {batch.formatted_start_date} – {batch.formatted_end_date}
                  </p>
                </div>

                {batch.price != null && (
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="mt-1 font-medium text-gray-700">Rs. {batch.price}</p>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <a href={`/live_class_batch_enroll/${id}`} className="block w-full">
                <Button
                  disabled={enrolled}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70"
                >
                  {enrolled ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Enrolled
                    </span>
                  ) : (
                    "Confirm Enrollment"
                  )}
                </Button>
              </a>
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
                const isLive = c.status === "live";
                return (
                  <Card key={c.id} className={`rounded-xl shadow-sm ${isLive ? "border-l-4 border-amber-500" : ""}`}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" /> {c.class_date}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5" /> {c.start_time} – {c.end_time}
                          </span>
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
                          {c.status}
                        </Badge>
                        {c.meeting_link && enrolled ? (
                          <a href={c.meeting_link} target="_blank" rel="noreferrer">
                            <Button size="sm">
                              <Video className="mr-2 h-3.5 w-3.5" /> Join
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Video className="mr-2 h-3.5 w-3.5" /> Join
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