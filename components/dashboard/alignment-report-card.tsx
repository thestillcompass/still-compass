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
        pill: "border-green-400/20 bg-green-400/10 text-green-300",
      };
    case "realigning":
      return {
        label: "Realigning",
        pill: "border-blue-400/20 bg-blue-400/10 text-blue-300",
      };
    case "slight_drift":
      return {
        label: "Slight Drift",
        pill: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };
    case "off_course":
      return {
        label: "Off Course",
        pill: "border-red-400/20 bg-red-400/10 text-red-300",
      };
    default:
      return {
        label: "Unknown",
        pill: "border-white/10 bg-white/5 text-white/70",
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
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white">Alignment Report</h3>
          <p className="text-sm text-white/50">Your latest pattern-based summary</p>
        </div>
        <p className="text-sm text-white/70">
          Complete more check-ins to generate your first alignment report.
        </p>
      </div>
    );
  }

  const status = getStatusStyles(report.status);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Alignment Report</h3>
          <p className="text-sm text-white/50">Your latest pattern-based summary</p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.pill}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-wide text-white/50">Compass Score</p>
          <p className="mt-2 text-3xl font-bold text-white">{report.score}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-wide text-white/50">Trend</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {report.trendDelta === null
              ? "—"
              : report.trendDelta > 0
              ? `+${report.trendDelta}`
              : report.trendDelta}
          </p>
          <p className="mt-1 text-sm text-white/50">vs previous 7-day average</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-wide text-white/50">Previous Avg</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {report.previousAverageScore ?? "—"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-white">What’s helping</p>
          <p className="mt-1 text-sm leading-6 text-white/70">
            {report.topPositiveSignal}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Watch for</p>
          <p className="mt-1 text-sm leading-6 text-white/70">
            {report.topRisk}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Next best step</p>
          <p className="mt-1 text-sm leading-6 text-white/70">
            {report.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
}