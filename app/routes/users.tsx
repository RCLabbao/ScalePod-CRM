import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Users, UserPlus, Trash2, ShieldCheck, ArrowLeft, User, Activity, Target, FileCheck } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  // Get users with activity counts
  const usersRaw = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          activityLogs: true,
          createdLeads: true,
          assignedLeads: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform for easier use
  const users = usersRaw.map((u) => ({
    ...u,
    activityCount: u._count.activityLogs,
    leadsCreated: u._count.createdLeads,
    leadsAssigned: u._count.assignedLeads,
  }));

  return { user, users };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

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
    const currentUserId = formData.get("currentUserId") as string;
    if (targetUserId === currentUserId) {
      return { error: "You cannot delete your own account." };
    }

    // Check if user has leads assigned before deleting
    const assignedLeads = await prisma.lead.count({
      where: { assignedToId: targetUserId },
    });

    if (assignedLeads > 0) {
      // Unassign leads first
      await prisma.lead.updateMany({
        where: { assignedToId: targetUserId },
        data: { assignedToId: null },
      });
    }

    await prisma.user.delete({ where: { id: targetUserId } });
    return { success: true, deleted: true };
  }

  return {};
}

export default function UserList() {
  const { user, users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Create accounts and manage roles for your team
            </p>
          </div>
          <Link to="/users/new">
            <Button className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>

        {actionData?.success && (
          <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
            {actionData.deleted ? "User deleted successfully." : "Updated successfully."}
          </div>
        )}
        {actionData?.error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {actionData.error}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "ADMIN").length}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
                <User className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "AGENT").length}</p>
                <p className="text-xs text-muted-foreground">Agents</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No users yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg font-semibold">
                      {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{u.name || u.email}</span>
                      <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                        {u.role === "ADMIN" ? "Admin" : "Agent"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {u.activityCount} actions
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCheck className="h-3 w-3" />
                        {u.leadsCreated} created
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {u.leadsAssigned} assigned
                      </span>
                    </div>
                  </div>

                  {/* Role switcher */}
                  <Form method="post" className="flex items-center gap-2">
                    <input type="hidden" name="intent" value="updateRole" />
                    <input type="hidden" name="userId" value={u.id} />
                    <Select
                      name="role"
                      defaultValue={u.role}
                      className="w-28"
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
                    <input type="hidden" name="currentUserId" value={user!.id} />
                    <Button type="submit" variant="ghost" size="icon" title="Delete user">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </Form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
