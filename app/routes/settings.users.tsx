import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { hashPassword } from "../lib/auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { ArrowLeft, Plus, Users, Trash2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return { user, users };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = (formData.get("name") as string) || null;
    const role = formData.get("role") as string;

    if (!email || !password) return { error: "Email and password required." };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email already in use." };

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: { email, passwordHash, name, role },
    });
    return { success: true };
  }

  if (intent === "updateRole") {
    const targetUserId = formData.get("userId") as string;
    const newRole = formData.get("role") as string;
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });
    return { success: true };
  }

  if (intent === "delete") {
    const targetUserId = formData.get("userId") as string;
    // Prevent deleting yourself
    const currentUserId = formData.get("currentUserId") as string;
    if (targetUserId === currentUserId) {
      return { error: "You cannot delete your own account." };
    }
    await prisma.user.delete({ where: { id: targetUserId } });
    return { success: true };
  }

  return {};
}

export default function UserManagement() {
  const { user, users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Create accounts and manage roles for your team
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {actionData?.success && (
          <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Updated successfully.
          </div>
        )}
        {actionData?.error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {actionData.error}
          </div>
        )}

        {/* Create user dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="create" />
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Juan Dela Cruz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="user@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" required placeholder="Min. 8 characters" minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select id="role" name="role" defaultValue="AGENT">
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit">Create User</Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Users list */}
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold">
                    {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{u.name || u.email}</span>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Role switcher */}
                <Form method="post" className="flex items-center gap-2">
                  <input type="hidden" name="intent" value="updateRole" />
                  <input type="hidden" name="userId" value={u.id} />
                  <Select
                    name="role"
                    defaultValue={u.role}
                    className="w-24"
                    onChange={(e) => {
                      (e.target.closest("form") as HTMLFormElement).submit();
                    }}
                  >
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </Form>

                <Form method="post">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="userId" value={u.id} />
                  <input type="hidden" name="currentUserId" value={user!.email} />
                  <Button type="submit" variant="ghost" size="icon" title="Delete user">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Form>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
