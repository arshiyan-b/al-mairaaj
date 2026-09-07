import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Plus, Video, X, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { withCsrfHeaders } from "@/lib/csrf";

const emptyForm = {
  title: "",
  description: "",
  meeting_provider: "",
  class_date: "",
  start_time: "",
  end_time: "",
  duration: "",
  status: "scheduled",
};

export default function LiveClassesBatch() {
  const { id } = useParams();

  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadBatch = () => {
    fetch(`/api/teacher/live-class-batch-data/${id}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load batch (${res.status})`);
        return res.json();
      })
      .then((json) => setBatch(json.batch))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadBatch();
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

  const openAddModal = () => {
    setForm(emptyForm);
    setFormError(null);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (saving) return;
    setShowAddModal(false);
  };

  const handleCreate = async () => {
    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch("/api/teacher/live-class-store", {
        method: "POST",
        headers: withCsrfHeaders(),
        credentials: "same-origin",
        body: JSON.stringify({ ...form, batch_id: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
        throw new Error(firstError || data.message || "Unable to create the live class.");
      }

      setShowAddModal(false);
      loadBatch();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to="/teacher/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!batch && !error && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      )}

      {batch && (
        <>
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{batch.title}</h1>
                  {batch.description && (
                    <p className="text-gray-500 mt-1 text-sm">{batch.description}</p>
                  )}
                </div>
                <Badge variant={batch.status === "active" ? "default" : "secondary"}>
                  {batch.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                {batch.date_range && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" /> {batch.date_range}
                  </span>
                )}
                {batch.total_classes && <span>{batch.total_classes} total classes</span>}
                {batch.price != null && (
                  <span>Price per class: <strong>{Number(batch.price).toFixed(2)}</strong></span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Live Classes</h2>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 text-white text-sm font-medium px-3.5 py-2 hover:bg-teal-800 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Live Class
            </button>
          </div>

          {(!batch.live_classes || batch.live_classes.length === 0) && (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">
                No live classes have been added to this batch yet.
              </CardContent>
            </Card>
          )}

          {batch.live_classes && batch.live_classes.length > 0 && (
            <div className="space-y-3">
              {batch.live_classes.map((lc) => (
                <Link key={lc.id} to={`/teacher/live-class/${lc.id}`}>
                  <Card className="hover:shadow-md hover:border-teal-600 transition-all cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                          <Video className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 truncate">{lc.title}</div>
                          <div className="text-sm text-gray-500">
                            {lc.formatted_class_date} {lc.start_time && `\u00b7 ${lc.start_time}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant={lc.status === "scheduled" ? "default" : "secondary"}>
                          {lc.status}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAddModal}
          >
            <motion.div
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Add Live Class</h3>
                <button onClick={closeAddModal} disabled={saving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Provider</label>
                    <select
                      value={form.meeting_provider}
                      onChange={(e) => updateField("meeting_provider", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="" disabled>Select Provider</option>
                      <option value="zoom">Zoom</option>
                      <option value="jitsi">Jitsi</option>
                    </select>
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
                  Price is fixed to the batch's price
                  {batch?.price != null ? ` (${Number(batch.price).toFixed(2)})` : ""} and can't be
                  changed per class.
                </p>

                {formError && <p className="text-sm text-red-500">{formError}</p>}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={closeAddModal}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition-colors disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add Live Class"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}