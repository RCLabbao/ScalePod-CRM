import { Link, useLocation, Form } from "react-router";
import { cn } from "~/lib/utils";
import {
  Inbox,
  Kanban,
  Mail,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserPlus,
  Users,
  Upload,
  BarChart3,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import type { User } from "@prisma/client";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads/new", label: "Add Lead", icon: UserPlus, adminOnly: true },
  { to: "/inbox", label: "Lead Inbox", icon: Inbox },
  { to: "/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/emails", label: "Email Hub", icon: Mail },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/imports", label: "Import", icon: Upload, adminOnly: true },
  { to: "/scraper", label: "Scraper", icon: Search, adminOnly: true },
  { to: "/users", label: "Users", icon: Users, adminOnly: true },
  { to: "/verification/criteria", label: "Criteria", icon: ShieldCheck, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ user, children }: { user: Pick<User, "name" | "email" | "role"> & { role: string }; children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar-background transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">S</span>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">ScalePod</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems
            .filter((item) => !("adminOnly" in item && item.adminOnly) || user.role === "ADMIN")
            .map((item) => {
            const isActive = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary/20">
              <span className="text-xs font-semibold text-sidebar-primary">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name || user.email}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">{user.role}</p>
            </div>
          </div>
          <Form method="post" action="/login" className="mt-2">
            <input type="hidden" name="intent" value="logout" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
              type="submit"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </Form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="flex h-16 items-center gap-4 border-b bg-background px-6 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-semibold">ScalePod CRM</span>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
