import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/teacher/dashboard-data", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome{data?.teacher?.name ? `, ${data.teacher.name}` : ""}
        </h1>
        <p className="text-gray-500 mt-1">
          Select one of your assigned classes below to manage its batches and live classes.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!data && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {data && data.classes.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            You don't have any assigned classes yet. Once the academy assigns you a
            board and grade, they'll show up here.
          </CardContent>
        </Card>
      )}

      {data && data.classes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.classes.map((c) => (
            <Link
              key={`${c.board_slug}-${c.grade_slug}`}
              to={`/teacher/${c.board_slug}/${c.grade_slug}/batches`}
            >
              <Card className="hover:shadow-md hover:border-teal-600 transition-all cursor-pointer h-full">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{c.grade_name}</div>
                      <div className="text-sm text-gray-500">{c.board_name}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}