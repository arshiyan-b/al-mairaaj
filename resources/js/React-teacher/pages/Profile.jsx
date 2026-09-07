import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { withCsrfHeaders } from "@/lib/csrf";
import { CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";

const EDITABLE_KEYS = ["phone_number", "whatsapp_number", "city", "address"];

export default function Profile() {
  const [application, setApplication] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/teacher/profile-data", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setApplication(data.application || null);
        setForm({
          phone_number: data.application?.phone_number || "",
          whatsapp_number: data.application?.whatsapp_number || "",
          city: data.application?.city || "",
          address: data.application?.address || "",
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/teacher/profile-update", {
        method: "POST",
        headers: withCsrfHeaders(),
        credentials: "same-origin",
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status === "error") {
        const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
        throw new Error(firstError || data?.message || `Failed to save profile (${res.status})`);
      }

      if (data?.application) setApplication(data.application);
      setSaved(true);
    } catch (err) {
      setSaveError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!application || !form) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3 rounded" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Your academic and identity details are managed by the academy. You can update your
          contact details below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Academic Details
            </h2>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Full Name</dt>
                <dd className="font-medium text-gray-800">{application.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-800">{application.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Highest Degree</dt>
                <dd className="font-medium text-gray-800">{application.highest_degree || "-"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Field of Study</dt>
                <dd className="font-medium text-gray-800">{application.field_of_study || "-"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">University</dt>
                <dd className="font-medium text-gray-800">{application.university || "-"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Experience</dt>
                <dd className="font-medium text-gray-800">{application.experience || "-"}</dd>
              </div>
            </dl>

            <p className="text-xs text-gray-400 mt-4">
              Need to correct any of the details above? Contact the academy directly.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Contact Details
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={form.whatsapp_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {saveError && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> {saveError}
                </p>
              )}

              {saved && !saveError && (
                <p className="text-sm text-teal-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 hover:bg-teal-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}