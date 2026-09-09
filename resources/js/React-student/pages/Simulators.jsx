import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Simulators() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/simulators/subjects", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setSubjects(data.subjects || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Simulators</h1>
        <p className="text-gray-500 mt-1">
          Pick a subject to explore its interactive scientific simulators.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!subjects && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {subjects && subjects.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No simulators are available yet.
          </CardContent>
        </Card>
      )}

      {subjects && subjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-md hover:border-teal-600 transition-all cursor-pointer"
              onClick={() => navigate(`/simulators/${subject.id}`)}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div className="font-semibold text-gray-800">{subject.name}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}