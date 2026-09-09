import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimulatorsBySubject() {
  const { subjectId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/simulators/by-subject/${subjectId}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load simulators (${res.status})`);
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
  }, [subjectId]);

  return (
    <div>
      <Link to="/simulators" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Subjects
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {data?.subject?.name ? `${data.subject.name} Simulators` : "Simulators"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!data && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}

      {data && data.simulators.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No simulators are available for this subject yet.
          </CardContent>
        </Card>
      )}

      {data && data.simulators.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.simulators.map((sim) => {
            const CardInner = (
              <Card className="hover:shadow-md hover:border-teal-600 transition-all h-full overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-indigo-50 to-teal-50 flex items-center justify-center">
                  <FlaskConical className="h-8 w-8 text-teal-700" />
                </div>
                <CardContent className="p-4">
                  <div className="font-semibold text-gray-800">{sim.title}</div>
                  {sim.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{sim.description}</p>
                  )}
                  {!sim.page_path && (
                    <p className="text-xs text-amber-600 mt-2">Coming soon</p>
                  )}
                </CardContent>
              </Card>
            );

            if (!sim.page_path) {
              return (
                <div key={sim.id} className="opacity-70 cursor-not-allowed">
                  {CardInner}
                </div>
              );
            }

            return (
              <a key={sim.id} href={sim.page_path} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                {CardInner}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}