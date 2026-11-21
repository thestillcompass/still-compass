
import { supabaseClient } from "@/lib/supabaseClient";

export async function startGoogleSignIn(
  returnPath: string
) {
  // Only allow local application paths after login.
  const safePath =
    returnPath.startsWith("/") &&
    !returnPath.startsWith("//") &&
    !returnPath.startsWith("/\\")
      ? returnPath
      : "/dashboard";

  const callbackUrl = new URL(
    "/auth/callback",
    window.location.origin
  );

  callbackUrl.searchParams.set("next", safePath);

  const { error } =
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

  if (error) {
    throw error;
  }
}
