import { redirect } from "react-router";
import { requireAuth } from "../lib/auth.guard.server";
import { getOAuthClient, getScopes } from "../lib/google-auth.server";
import { getSession, sessionStorage } from "../sessions/session";
import { randomBytes } from "crypto";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Response("Gmail integration is not configured", { status: 501 });
  }

  // Generate CSRF state and store in session
  const state = randomBytes(16).toString("hex");
  const session = await getSession(request);
  session.set("oauth_state", state);
  session.set("oauth_user_id", userId);

  const oauth2Client = getOAuthClient();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: getScopes(),
    state,
  });

  return redirect(authUrl, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
