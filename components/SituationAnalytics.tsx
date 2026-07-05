"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type SituationAnalyticsProps = {
  situationSlug: string;
  situationTitle: string;
};

export default function SituationAnalytics({
  situationSlug,
  situationTitle,
}: SituationAnalyticsProps) {
  useEffect(() => {
    trackEvent("situation_view", {
      situation_slug: situationSlug,
      situation_title: situationTitle,
    });
  }, [situationSlug, situationTitle]);

  return null;
}