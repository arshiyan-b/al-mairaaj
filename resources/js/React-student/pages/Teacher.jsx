import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin, ArrowLeft, Briefcase, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Flattens allowed_classes into a de-duplicated list of subject names
function getSubjects(teacher) {
  const subjects = (teacher.allowed_classes || []).flatMap(
    (ac) => ac.curriculum_subjects || []
  );
  const seen = new Map();
  subjects.forEach((s) => seen.set(s.id, s.name));
  return Array.from(seen.values());
}

// Flattens allowed_classes into a de-duplicated list of "Board · Grade" labels
function getBoardGrades(teacher) {
  const labels = (teacher.allowed_classes || []).map((ac) => {
    const board = ac.grade?.board?.name || ac.board;
    const grade = ac.grade?.name;
    return [board, grade].filter(Boolean).join(" · ");
  });
  return Array.from(new Set(labels.filter(Boolean)));
}

function getInitials(name) {
  if (!name) return "T";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Teacher() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/student/teacher-profile-data/${id}`, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Teacher not found (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setTeacher(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <TeacherSkeleton />;

  if (error || !teacher) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-semibold">{error || "Teacher not found"}</p>
        <Link to="/teachers" className="text-indigo-600 mt-2">
          Go Back
        </Link>
      </div>
    );
  }

  const subjects = getSubjects(teacher);
  const boardGrades = getBoardGrades(teacher);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back Button */}
      <Link
        to="/teachers"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Teachers
      </Link>

      {/* Profile Card */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="h-40 bg-gradient-to-r from-indigo-50 to-teal-50 relative"></div>

        {/* Avatar */}
        <div className="flex justify-center -mt-16">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-4xl font-bold text-indigo-600 shadow-md">
            {getInitials(teacher.name)}
          </div>
        </div>

        {/* Content */}
        <div className="text-center px-6 pb-10">
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{teacher.name}</h1>

          {teacher.city && (
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3.5 w-3.5" /> {teacher.city}
            </p>
          )}

          {subjects.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {subjects.map((s) => (
                <span
                  key={s}
                  className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full uppercase tracking-wide"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 max-w-2xl mx-auto space-y-1 text-gray-500">
            {teacher.field_of_study && teacher.highest_degree && (
              <p className="flex items-center justify-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                {teacher.highest_degree.toUpperCase()} in {teacher.field_of_study}
                {teacher.university ? ` · ${teacher.university}` : ""}
              </p>
            )}
            {boardGrades.length > 0 && (
              <p className="text-xs text-gray-400">{boardGrades.join(", ")}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-8">
            {teacher.experience && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{teacher.experience}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Experience</p>
              </div>
            )}

            {subjects.length > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-teal-600 font-bold">
                  <BookOpen className="w-4 h-4" />
                  {subjects.length}
                </div>
                <p className="text-xs text-gray-400 mt-1">Subjects</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-10">
            {teacher.email && (
              <a
                href={`mailto:${teacher.email}`}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-600 border rounded-lg hover:text-indigo-600"
              >
                <Mail className="w-4 h-4" />
                Message
              </a>
            )}

            {teacher.phone_number && (
              <a
                href={`tel:${teacher.phone_number}`}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-600 border rounded-lg hover:text-indigo-600"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            )}

            <button className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <Skeleton className="h-40 w-full rounded-none" />
        <div className="flex justify-center -mt-16">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        <div className="px-6 pb-10 pt-4 flex flex-col items-center gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full max-w-xl" />
        </div>
      </div>
    </div>
  );
}