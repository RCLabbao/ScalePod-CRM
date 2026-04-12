import { Form, Link, useLoaderData, useActionData, useNavigate } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../lib/auth.guard";
import { hashPassword } from "../lib/auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });
  return { user };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();

  const name = (formData.get("name") as string) || null;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with this email already exists." };

  const passwordHash = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: { email, passwordHash, name, role },
  });

  return { success: true, userName: name || email, role };
}

export default function NewUser() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [actionData]);

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
            <p className="text-sm text-muted-foreground">
              Create a login account for a team member
            </p>
          </div>
        </div>

        {actionData?.success && (
          <Card className="border-2 border-emerald-500/40 bg-emerald-500/5">
            <CardContent className="flex items-center gap-4 p-5">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-400" />
              <div className="flex-1">
                <p className="font-semibold">{actionData.userName} created!</p>
                <p className="text-sm text-muted-foreground">
                  Role: <strong>{actionData.role === "ADMIN" ? "Admin" : "Agent"}</strong> — they can now log in.
                </p>
              </div>
              <Button size="sm" onClick={() => navigate("/users/new", { replace: true })}>
                Add Another
              </Button>
            </CardContent>
          </Card>
        )}

        {actionData?.error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {actionData.error}
          </div>
        )}

        <Form method="post">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription>This person will use these credentials to log in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Juan Dela Cruz" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="user@company.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" required placeholder="Min. 8 characters" minLength={8} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select id="role" name="role" defaultValue="AGENT">
                  <option value="AGENT">Agent (View Only)</option>
                  <option value="ADMIN">Admin (Full Access)</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/users">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </div>
        </Form>
      </div>
    </AppShell>
  );
}
