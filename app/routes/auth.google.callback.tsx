import { redirect } from "react-router";
import { requireAuth } from "../lib/auth.guard.server";
import { getOAuthClient } from "../lib/google-auth.server";
import { prisma } from "../lib/prisma.server";
import { getSession, sessionStorage } from "../sessions/session";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // User denied access
  if (error) {
    return redirect("/settings?gmail=denied");
  }

  if (!code || !state) {
    return redirect("/settings?gmail=error");
  }

  // Verify CSRF state from session
  const session = await getSession(request);
  const savedState = session.get("oauth_state");
  const sessionUserId = session.get("oauth_user_id");

  if (!savedState || savedState !== state) {
    throw new Response("Invalid OAuth state — possible CSRF attack", {
      status: 403,
    });
  }

  // Ensure the authenticated user matches the one who initiated
  const userId = await requireAuth(request);
  if (sessionUserId && sessionUserId !== userId) {
    throw new Response("User mismatch", { status: 403 });
  }

  // Exchange code for tokens
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    return redirect("/settings?gmail=error");
  }

  // Upsert GmailToken for this user
  await prisma.gmailToken.upsert({
    where: { userId },
    update: {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token || null,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
    create: {
      userId,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token || null,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
  });

  // Clean up session
  session.unset("oauth_state");
  session.unset("oauth_user_id");

  return redirect("/settings?gmail=connected", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
