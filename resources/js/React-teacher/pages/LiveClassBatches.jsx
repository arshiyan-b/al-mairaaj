import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function LiveClassBatches() {
  const { board, grade } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/teacher/live-class-batches-data/${board}/${grade}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load batches (${res.status})`);
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
  }, [board, grade]);

  return (
    <div>
      <Link to="/teacher/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {data?.grade?.name ? `${data.grade.name} Batches` : "Batches"}
        </h1>
        {data?.board?.name && (
          <p className="text-gray-500 mt-1">{data.board.name}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!data && !error && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {data && data.batches.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No batches have been created for this class yet.
          </CardContent>
        </Card>
      )}

      {data && data.batches.length > 0 && (
        <div className="space-y-3">
          {data.batches.map((batch) => (
            <Link key={batch.id} to={`/teacher/live-class-batch/${batch.id}`}>
              <Card className="hover:shadow-md hover:border-teal-600 transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{batch.title}</div>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-x-3">
                        {batch.date_range && <span>{batch.date_range}</span>}
                        {batch.total_classes && <span>{batch.total_classes} classes</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={batch.status === "active" ? "default" : "secondary"}>
                      {batch.status}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}