import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Edit, ExternalLink, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { withCsrfHeaders } from "@/lib/csrf";

export default function LiveClass() {
  const { id } = useParams();

  const [liveClass, setLiveClass] = useState(null);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadLiveClass = () => {
    fetch(`/api/teacher/live-class-data/${id}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load live class (${res.status})`);
        return res.json();
      })
      .then((json) => setLiveClass(json.live_class))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadLiveClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if ((key === "start_time" || key === "end_time") && next.start_time && next.end_time) {
        const [sh, sm] = next.start_time.split(":").map(Number);
        const [eh, em] = next.end_time.split(":").map(Number);
        const diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff > 0) next.duration = diff;
      }

      return next;
    });
  };

  const openEditModal = () => {
    setForm({
      title: liveClass.title || "",
      description: liveClass.description || "",
      class_date: liveClass.class_date || "",
      start_time: (liveClass.start_time || "").slice(0, 5),
      end_time: (liveClass.end_time || "").slice(0, 5),
      duration: liveClass.duration || "",
      status: liveClass.status || "scheduled",
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (saving) return;
    setShowEditModal(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch(`/api/teacher/live-class-update/${id}`, {
        method: "PUT",
        headers: withCsrfHeaders(),
        credentials: "same-origin",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
        throw new Error(firstError || data.message || "Unable to save changes.");
      }

      setShowEditModal(false);
      loadLiveClass();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {liveClass?.batch?.id ? (
        <Link
          to={`/teacher/live-class-batch/${liveClass.batch.id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Batch
        </Link>
      ) : (
        <Link to="/teacher/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!liveClass && !error && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 rounded" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      )}

      {liveClass && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{liveClass.title}</h1>
              {liveClass.batch?.title && (
                <p className="text-gray-500 mt-1 text-sm">{liveClass.batch.title}</p>
              )}
            </div>

            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium px-3.5 py-2 hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Class Information
                </h2>

                {liveClass.description && (
                  <p className="text-gray-700 text-sm mb-4">{liveClass.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Date</div>
                    <div className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {liveClass.formatted_class_date || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500">Time</div>
                    <div className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {(liveClass.start_time || "").slice(0, 5)} - {(liveClass.end_time || "").slice(0, 5)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium text-gray-800 mt-0.5">
                      {liveClass.duration ? `${liveClass.duration} mins` : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500">Status</div>
                    <div className="mt-0.5">
                      <Badge variant={liveClass.status === "scheduled" ? "default" : "secondary"}>
                        {liveClass.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500">Board</div>
                    <div className="font-medium text-gray-800 mt-0.5">{liveClass.board?.name || "-"}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">Grade</div>
                    <div className="font-medium text-gray-800 mt-0.5">{liveClass.grade?.name || "-"}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">Subject</div>
                    <div className="font-medium text-gray-800 mt-0.5">
                      {liveClass.curriculum_subject?.complete_name || liveClass.curriculum_subject?.name || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500">Price</div>
                    <div className="font-medium text-gray-800 mt-0.5">
                      {liveClass.price != null ? Number(liveClass.price).toFixed(2) : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Meeting
                </h2>

                <div className="text-sm space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {liveClass.meeting_provider || "N/A"}
                    </span>
                  </div>

                  {liveClass.meeting_password && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Password</span>
                      <span className="font-medium text-gray-800">{liveClass.meeting_password}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`/teacher/jitsi/${liveClass.id}/join`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 hover:bg-teal-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Join Class
                </a>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <AnimatePresence>
        {showEditModal && form && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditModal}
          >
            <motion.div
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Edit Live Class</h3>
                <button onClick={closeEditModal} disabled={saving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Date</label>
                  <input
                    type="date"
                    value={form.class_date}
                    onChange={(e) => updateField("class_date", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={(e) => updateField("start_time", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={(e) => updateField("end_time", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      value={form.duration}
                      onChange={(e) => updateField("duration", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  Price is fixed to the batch's price and meeting provider/link can't be changed
                  here since a meeting has already been created for this class.
                </p>

                {formError && <p className="text-sm text-red-500">{formError}</p>}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={closeEditModal}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}