"use client";

import { useState } from "react";

type ApplicationPlanFormProps = {
  situationSlug: string;
  situationTitle: string;
  planTitle: string;
  buttonText: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

function getTrackingData() {
  if (typeof window === "undefined") {
    return {
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      pageUrl: "",
    };
  }

  const searchParams = new URLSearchParams(window.location.search);

  return {
    utmSource: searchParams.get("utm_source") || "",
    utmMedium: searchParams.get("utm_medium") || "",
    utmCampaign: searchParams.get("utm_campaign") || "",
    pageUrl: window.location.href,
  };
}

export default function ApplicationPlanForm({
  situationSlug,
  situationTitle,
  planTitle,
  buttonText,
}: ApplicationPlanFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    const trackingData = getTrackingData();

    try {
      const response = await fetch("/api/application-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
          situationSlug,
          situationTitle,
          planTitle,
          ...trackingData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Thank you. Your printable application plan is ready.");

      setFirstName("");
      setEmail("");
    } catch (error) {
      console.error("Application plan form error:", error);

      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-semibold text-[#23303D]"
          >
            First name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Your first name"
            className="w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] px-4 py-3 text-[#23303D] outline-none transition placeholder:text-[#23303D]/40 focus:border-[#C89B3C]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#23303D]"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] px-4 py-3 text-[#23303D] outline-none transition placeholder:text-[#23303D]/40 focus:border-[#C89B3C]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[#C89B3C] px-6 py-3 text-sm font-semibold text-[#23303D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Preparing..." : buttonText}
      </button>

      <p className="text-sm leading-6 text-[#23303D]/60">
        We’ll send you the printable plan for{" "}
        <span className="font-semibold text-[#23303D]">{situationTitle}</span>.
        No noise, no spam.
      </p>

      {status === "success" && (
        <div className="rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-4 text-sm leading-6 text-[#23303D]">
          <p>{message}</p>

          <a
            href={`/application-plans/${situationSlug}`}
            className="mt-4 inline-flex rounded-full bg-[#2C3E50] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Open printable plan
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {message}
        </div>
      )}
    </form>
  );
}