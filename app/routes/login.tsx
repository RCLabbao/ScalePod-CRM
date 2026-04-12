import { Form, Link, useActionData, redirect } from "react-router";
import { authenticator } from "../lib/auth.server";
import { getSession } from "../sessions/session";
import { sessionStorage } from "../sessions/session";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request);
  if (session.get("userId")) {
    return redirect("/dashboard");
  }
  return {};
}

export async function action({ request }: { request: Request }) {
  const formData = await request.clone().formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    const session = await getSession(request);
    return redirect("/login", {
      headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
    });
  }

  try {
    const userId = await authenticator.authenticate("user-pass", request);
    const session = await getSession(request);
    session.set("userId", userId);
    return redirect("/dashboard", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return { error: (error as Error).message };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">S</span>
          </div>
          <CardTitle className="text-2xl">ScalePod CRM</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            {actionData?.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {actionData.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary underline-offset-4 hover:underline">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
