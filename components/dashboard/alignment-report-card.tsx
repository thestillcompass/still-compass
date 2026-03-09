type AlignmentReport = {
  score: number;
  previousAverageScore: number | null;
  trendDelta: number | null;
  status: "steady" | "realigning" | "slight_drift" | "off_course";
  topPositiveSignal: string;
  topRisk: string;
  recommendedAction: string;
  summary: string;
  generatedAt: string;
};

function getStatusStyles(status: AlignmentReport["status"]) {
  switch (status) {
    case "steady":
      return {
        label: "Steady",
        pill: "bg-green-100 text-green-800 border-green-200",
      };
    case "realigning":
      return {
        label: "Realigning",
        pill: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "slight_drift":
      return {
        label: "Slight Drift",
        pill: "bg-amber-100 text-amber-800 border-amber-200",
      };
    case "off_course":
      return {
        label: "Off Course",
        pill: "bg-red-100 text-red-800 border-red-200",
      };
    default:
      return {
        label: "Unknown",
        pill: "bg-neutral-100 text-neutral-800 border-neutral-200",
      };
  }
}

export function AlignmentReportCard({
  report,
}: {
  report: AlignmentReport | null;
}) {
  if (!report) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-neutral-900">
            Alignment Report
          </h3>
          <p className="text-sm text-neutral-500">
            Your latest pattern-based summary
          </p>
        </div>
        <p className="text-sm text-neutral-600">
          Complete more check-ins to generate your first alignment report.
        </p>
      </div>
    );
  }

  const status = getStatusStyles(report.status);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Alignment Report
          </h3>
          <p className="text-sm text-neutral-500">
            Your latest pattern-based summary
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.pill}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-neutral-50 p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Compass Score
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            {report.score}
          </p>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Trend
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            {report.trendDelta === null
              ? "—"
              : report.trendDelta > 0
              ? `+${report.trendDelta}`
              : report.trendDelta}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            vs previous 7-day average
          </p>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Previous Avg
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            {report.previousAverageScore ?? "—"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">What’s helping</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {report.topPositiveSignal}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-900">Watch for</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {report.topRisk}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-900">
            Next best step
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {report.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
}