import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type ApplicationPlanRequestBody = {
  firstName?: string;
  email?: string;
  situationSlug?: string;
  situationTitle?: string;
  planTitle?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUrl?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApplicationPlanRequestBody;

    const firstName = body.firstName?.trim() || "";
const email = body.email?.trim().toLowerCase() || "";
const situationSlug = body.situationSlug?.trim() || "";
const situationTitle = body.situationTitle?.trim() || "";
const planTitle = body.planTitle?.trim() || "";
const utmSource = body.utmSource?.trim() || "";
const utmMedium = body.utmMedium?.trim() || "";
const utmCampaign = body.utmCampaign?.trim() || "";
const pageUrl = body.pageUrl?.trim() || "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!situationTitle || !planTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing application plan details.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
  .from("application_plan_leads")
  .insert({
    first_name: firstName || null,
    email,
    situation_slug: situationSlug || null,
    situation_title: situationTitle,
    plan_title: planTitle,
    source: "application_plan_form",
    utm_source: utmSource || null,
    utm_medium: utmMedium || null,
    utm_campaign: utmCampaign || null,
    page_url: pageUrl || null,
  });

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Could not save your request. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application plan request saved.",
    });
  } catch (error) {
    console.error("Application plan API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}