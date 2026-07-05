type AnalyticsParameters = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackEvent(
  eventName: string,
  parameters?: AnalyticsParameters
) {
  if (typeof window === "undefined") return;

  if (!window.gtag) return;

  window.gtag("event", eventName, {
    ...parameters,
  });
}

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      parameters?: AnalyticsParameters
    ) => void;
  }
}