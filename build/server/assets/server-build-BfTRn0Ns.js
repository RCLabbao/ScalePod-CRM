import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, createCookieSessionStorage, useActionData, Form, Link, useLocation, useLoaderData, useSearchParams, useNavigate, useFetcher, useNavigation, data, useRevalidator } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import pkg from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import * as React from "react";
import React__default, { useState, useEffect as useEffect$1, useMemo, useCallback, forwardRef, useRef, useImperativeHandle, Fragment as Fragment$1 } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { google } from "googleapis";
import { randomBytes, createHash } from "crypto";
import { X, LayoutDashboard, UserPlus, Inbox, Kanban, Mail, BarChart3, Upload, Search, Users, Workflow, ShieldCheck, Settings, FileJson, LogOut, Menu, TrendingUp, UserCheck, FileCheck, Trophy, Target, Zap, Thermometer, Clock, Layers, PieChart, Activity, Calendar, ChevronDown, Plus, ChevronRight, CheckCircle2, XCircle, ExternalLink, Snowflake, Sun, Flame, ArrowLeft, CheckCircle, User, Pencil, Save, Linkedin, Facebook, Instagram, Twitter, Send, AlertCircle, Building2, Globe, NotebookPen, ClipboardCheck, Loader2, ArrowUp, ArrowDown, Trash2, CheckSquare, Square, ThermometerSun, Link as Link$1, ArrowRight, LayoutGrid, Settings2, SlidersHorizontal, GripVertical, FileText, Sparkles, MessageSquare, Bold, Italic, Underline, List, ListOrdered, Pilcrow, Eye, LayoutTemplate, Reply, MessageCircle, Link2, PenLine, ChevronUp, Lock, Shield, Server, AlertTriangle, BookOpen, Copy, FileSpreadsheet, Moon, Database, Key, Columns3, Play, Table2, FilePlus, ToggleRight, ToggleLeft, RefreshCw, History, Filter, Rocket, PenSquare, StickyNote, Check } from "lucide-react";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";
import DOMPurify from "dompurify";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  const body = await renderToReadableStream(
    /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );
  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    className: "dark",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx("script", {
        dangerouslySetInnerHTML: {
          __html: `(function(){try{var t=localStorage.getItem("theme")||"dark";document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("dark")}})()`
        }
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      className: "min-h-screen bg-background font-sans antialiased",
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  var _a;
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  const isDev = typeof window !== "undefined" && ((_a = window.location) == null ? void 0 : _a.hostname) === "localhost";
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    if (isDev) {
      stack = error.stack;
    }
  } else if (error) {
    details = String(error);
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto max-w-3xl p-4 pt-16 text-center",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-4xl font-bold",
      children: message
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-4 text-lg text-red-400",
      children: details
    }), stack && /* @__PURE__ */ jsx("pre", {
      className: "mt-4 max-w-full mx-auto text-left text-xs text-red-400/80 bg-red-500/5 border border-red-500/20 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap",
      children: stack
    }), /* @__PURE__ */ jsx("a", {
      href: "/dashboard",
      className: "mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
      children: "Back to Dashboard"
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
async function loader$D() {
  return redirect("/dashboard");
}
const home = UNSAFE_withComponentProps(function Index() {
  return null;
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  loader: loader$D
}, Symbol.toStringTag, { value: "Module" }));
const STAGE_COLOR_PALETTE = {
  slate: { color: "border-t-slate-400", bg: "bg-slate-400/10", bar: "bg-slate-400/50", dot: "bg-slate-400", text: "text-slate-300", border: "border-slate-400/20" },
  blue: { color: "border-t-blue-400", bg: "bg-blue-400/10", bar: "bg-blue-400/60", dot: "bg-blue-400", text: "text-blue-400", border: "border-blue-400/20" },
  violet: { color: "border-t-violet-400", bg: "bg-violet-400/10", bar: "bg-violet-400/60", dot: "bg-violet-400", text: "text-violet-400", border: "border-violet-400/20" },
  amber: { color: "border-t-amber-400", bg: "bg-amber-400/10", bar: "bg-amber-400/60", dot: "bg-amber-400", text: "text-amber-400", border: "border-amber-400/20" },
  orange: { color: "border-t-orange-400", bg: "bg-orange-400/10", bar: "bg-orange-400/60", dot: "bg-orange-400", text: "text-orange-400", border: "border-orange-400/20" },
  emerald: { color: "border-t-emerald-400", bg: "bg-emerald-400/10", bar: "bg-emerald-400/60", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-400/20" },
  red: { color: "border-t-red-400", bg: "bg-red-400/10", bar: "bg-red-400/60", dot: "bg-red-400", text: "text-red-400", border: "border-red-400/20" },
  pink: { color: "border-t-pink-400", bg: "bg-pink-400/10", bar: "bg-pink-400/60", dot: "bg-pink-400", text: "text-pink-400", border: "border-pink-400/20" },
  cyan: { color: "border-t-cyan-400", bg: "bg-cyan-400/10", bar: "bg-cyan-400/60", dot: "bg-cyan-400", text: "text-cyan-400", border: "border-cyan-400/20" },
  indigo: { color: "border-t-indigo-400", bg: "bg-indigo-400/10", bar: "bg-indigo-400/60", dot: "bg-indigo-400", text: "text-indigo-400", border: "border-indigo-400/20" },
  lime: { color: "border-t-lime-400", bg: "bg-lime-400/10", bar: "bg-lime-400/60", dot: "bg-lime-400", text: "text-lime-400", border: "border-lime-400/20" },
  teal: { color: "border-t-teal-400", bg: "bg-teal-400/10", bar: "bg-teal-400/60", dot: "bg-teal-400", text: "text-teal-400", border: "border-teal-400/20" }
};
const DEFAULT_CLASSES = STAGE_COLOR_PALETTE.slate;
function getStageClasses(colorKey) {
  return STAGE_COLOR_PALETTE[colorKey] || DEFAULT_CLASSES;
}
function formatStage(stage) {
  return stage.replace(/_/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
const DEFAULT_STAGE_SEED = [
  { name: "SOURCED", label: "Sourced", colorKey: "slate", position: 0 },
  { name: "QUALIFIED", label: "Qualified", colorKey: "blue", position: 1 },
  { name: "FIRST_CONTACT", label: "First Contact", colorKey: "violet", position: 2 },
  { name: "MEETING_BOOKED", label: "Meeting Booked", colorKey: "amber", position: 3 },
  { name: "PROPOSAL_SENT", label: "Proposal Sent", colorKey: "orange", position: 4 },
  { name: "CLOSED_WON", label: "Closed Won", colorKey: "emerald", position: 5 },
  { name: "CLOSED_LOST", label: "Closed Lost", colorKey: "red", position: 6 }
];
const PALETTE_OPTIONS = Object.keys(STAGE_COLOR_PALETTE).map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1)
}));
let stagesCache = null;
let stagesCacheExpiry = 0;
const CACHE_TTL_MS = 6e4;
function invalidateStagesCache() {
  stagesCache = null;
  stagesCacheExpiry = 0;
}
async function getStages() {
  if (stagesCache && Date.now() < stagesCacheExpiry) {
    return stagesCache;
  }
  let stages = [];
  try {
    stages = await prisma.pipelineStage.findMany({
      orderBy: { position: "asc" }
    });
  } catch (err) {
    console.error("[stages] Failed to load pipeline stages — run pending migrations:", err);
  }
  if (stages.length === 0) {
    stages = DEFAULT_STAGE_SEED.map((s, i) => ({
      id: `default_${i}`,
      name: s.name,
      label: s.label,
      colorKey: s.colorKey,
      position: s.position
    }));
  }
  stagesCache = stages;
  stagesCacheExpiry = Date.now() + CACHE_TTL_MS;
  return stages;
}
async function getStagesWithMeta() {
  const stages = await getStages();
  return stages.map((s) => ({
    ...s,
    meta: getStageClasses(s.colorKey)
  }));
}
async function getValidStageNames() {
  const stages = await getStages();
  return stages.map((s) => s.name);
}
async function getFirstStageName() {
  const stages = await getStages();
  return stages.length > 0 ? stages[0].name : "SOURCED";
}
let seeded = false;
async function seedDefaultStages() {
  if (seeded) return;
  try {
    const count = await prisma.pipelineStage.count();
    if (count > 0) {
      seeded = true;
      return;
    }
    for (const s of DEFAULT_STAGE_SEED) {
      await prisma.pipelineStage.create({
        data: {
          name: s.name,
          label: s.label,
          colorKey: s.colorKey,
          position: s.position
        }
      });
    }
    console.log("[stages] Seeded default pipeline stages");
    invalidateStagesCache();
    seeded = true;
  } catch (err) {
    console.error("[stages] Failed to seed default stages:", err);
  }
}
const globalForPrisma = globalThis;
if (!process.env.DATABASE_URL && process.env.DB_USER) {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD;
  const name = process.env.DB_NAME;
  process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${name}`;
  console.log(`[DB] Built from separate vars: ${user}@${host}:${port}/${name}`);
}
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("connection_limit")) {
  const separator = process.env.DATABASE_URL.includes("?") ? "&" : "?";
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${separator}connection_limit=15&pool_timeout=30`;
}
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: [
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" }
  ]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
console.log("[DB] Prisma Client models:", Object.keys(prisma).filter((k) => typeof prisma[k] === "object").join(", "));
console.log("[DB] pipelineStage:", typeof prisma.pipelineStage);
console.log("[DB] workflowAction:", typeof prisma.workflowAction);
seedDefaultStages().catch((err) => console.error("[DB] Stage seed failed:", err));
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "scalepod_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    // 7 days
    httpOnly: true
  }
});
function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
const { compare, hash } = pkg;
const authenticator = new Authenticator(sessionStorage);
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
    return user.id;
  }),
  "user-pass"
);
async function hashPassword(password) {
  return hash(password, 12);
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "label",
  {
    ref,
    className: cn(
      "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    ),
    ...props
  }
));
Label.displayName = "Label";
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-lg border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("font-semibold leading-none tracking-tight", className), ...props })
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
async function loader$C({
  request
}) {
  const session = await getSession(request);
  if (session.get("userId")) {
    return redirect("/dashboard");
  }
  return {};
}
async function action$q({
  request
}) {
  const formData = await request.clone().formData();
  const intent = formData.get("intent");
  if (intent === "logout") {
    const session = await getSession(request);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session)
      }
    });
  }
  try {
    const userId = await authenticator.authenticate("user-pass", request);
    const session = await getSession(request);
    session.set("userId", userId);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error: error.message
    };
  }
}
const login = UNSAFE_withComponentProps(function Login() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background p-4",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-sm",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary",
          children: /* @__PURE__ */ jsx("span", {
            className: "text-xl font-bold text-primary-foreground",
            children: "S"
          })
        }), /* @__PURE__ */ jsx(CardTitle, {
          className: "text-2xl",
          children: "ScalePod CRM"
        }), /* @__PURE__ */ jsx(CardDescription, {
          children: "Sign in to your account to continue"
        })]
      }), /* @__PURE__ */ jsxs(CardContent, {
        children: [/* @__PURE__ */ jsxs(Form, {
          method: "post",
          className: "space-y-4",
          children: [(actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
            className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive",
            children: actionData.error
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "email",
              children: "Email"
            }), /* @__PURE__ */ jsx(Input, {
              id: "email",
              name: "email",
              type: "email",
              placeholder: "you@company.com",
              required: true
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex items-center justify-between",
              children: /* @__PURE__ */ jsx(Label, {
                htmlFor: "password",
                children: "Password"
              })
            }), /* @__PURE__ */ jsx(Input, {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "Enter your password",
              required: true
            })]
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            className: "w-full",
            children: "Sign in"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-4 text-center text-sm text-muted-foreground",
          children: ["Don't have an account?", " ", /* @__PURE__ */ jsx(Link, {
            to: "/register",
            className: "text-primary underline-offset-4 hover:underline",
            children: "Create one"
          })]
        })]
      })]
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$q,
  default: login,
  loader: loader$C
}, Symbol.toStringTag, { value: "Module" }));
async function loader$B({
  request
}) {
  const session = await getSession(request);
  if (session.get("userId")) {
    return redirect("/dashboard");
  }
  return {};
}
async function action$p({
  request
}) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const name = formData.get("name");
  const role = formData.get("role");
  if (!email || !password) {
    return {
      error: "Email and password are required."
    };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters."
    };
  }
  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match."
    };
  }
  const existing = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (existing) {
    return {
      error: "An account with this email already exists."
    };
  }
  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || null,
      role: role === "ADMIN" ? "AGENT" : "AGENT"
      // Registration always creates AGENT; admins are promoted via settings
    }
  });
  return {
    success: true
  };
}
const register = UNSAFE_withComponentProps(function Register() {
  const actionData = useActionData();
  if (actionData == null ? void 0 : actionData.success) {
    return /* @__PURE__ */ jsx("div", {
      className: "flex min-h-screen items-center justify-center bg-background p-4",
      children: /* @__PURE__ */ jsxs(Card, {
        className: "w-full max-w-sm",
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          className: "text-center",
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-2xl",
            children: "Account Created"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Your account has been created. An admin will review and activate your access."
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          className: "text-center",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/login",
            children: /* @__PURE__ */ jsx(Button, {
              className: "w-full",
              children: "Sign in now"
            })
          })
        })]
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background p-4",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-sm",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary",
          children: /* @__PURE__ */ jsx("span", {
            className: "text-xl font-bold text-primary-foreground",
            children: "S"
          })
        }), /* @__PURE__ */ jsx(CardTitle, {
          className: "text-2xl",
          children: "Create Account"
        }), /* @__PURE__ */ jsx(CardDescription, {
          children: "Register as a team member to access the CRM"
        })]
      }), /* @__PURE__ */ jsxs(CardContent, {
        children: [/* @__PURE__ */ jsxs(Form, {
          method: "post",
          className: "space-y-4",
          children: [(actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
            className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive",
            children: actionData.error
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "name",
              children: "Full Name"
            }), /* @__PURE__ */ jsx(Input, {
              id: "name",
              name: "name",
              type: "text",
              placeholder: "Juan Dela Cruz"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "email",
              children: "Email"
            }), /* @__PURE__ */ jsx(Input, {
              id: "email",
              name: "email",
              type: "email",
              placeholder: "you@company.com",
              required: true
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "password",
              children: "Password"
            }), /* @__PURE__ */ jsx(Input, {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "Min. 8 characters",
              required: true,
              minLength: 8
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "confirmPassword",
              children: "Confirm Password"
            }), /* @__PURE__ */ jsx(Input, {
              id: "confirmPassword",
              name: "confirmPassword",
              type: "password",
              placeholder: "Re-enter your password",
              required: true,
              minLength: 8
            })]
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            className: "w-full",
            children: "Create Account"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-4 text-center text-sm text-muted-foreground",
          children: ["Already have an account?", " ", /* @__PURE__ */ jsx(Link, {
            to: "/login",
            className: "text-primary underline-offset-4 hover:underline",
            children: "Sign in"
          })]
        })]
      })]
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$p,
  default: register,
  loader: loader$B
}, Symbol.toStringTag, { value: "Module" }));
const userExistenceCache = /* @__PURE__ */ new Map();
const USER_CACHE_TTL_MS = 6e4;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry2] of userExistenceCache) {
    if (now >= entry2.expiresAt) userExistenceCache.delete(key);
  }
}, 6e4).unref();
async function requireAuth(request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }
  const cached = userExistenceCache.get(userId);
  if (cached && Date.now() < cached.expiresAt && cached.exists) {
    return userId;
  }
  const exists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  if (!exists) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session)
      }
    });
  }
  userExistenceCache.set(userId, { exists: true, expiresAt: Date.now() + USER_CACHE_TTL_MS });
  return userId;
}
async function requireAdmin(request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  if (!user) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session)
      }
    });
  }
  if (user.role !== "ADMIN") {
    throw redirect("/dashboard");
  }
  return userId;
}
function plainTextToHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>\n");
}
function buildHtmlEmail(body, signature) {
  const bodyHtml = plainTextToHtml(body);
  if (!signature) {
    return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">${bodyHtml}</body></html>`;
  }
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">${bodyHtml}<br><br>${signature}</body></html>`;
}
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.settings.basic"
];
function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI must be set"
    );
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}
function getScopes() {
  return SCOPES;
}
async function getAuthenticatedClient(userId) {
  const token = await prisma.gmailToken.findUnique({
    where: { userId }
  });
  if (!token) {
    throw new Error("User has not connected Gmail");
  }
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    refresh_token: token.refreshToken,
    access_token: token.accessToken || void 0,
    expiry_date: token.expiryDate ? token.expiryDate.getTime() : void 0
  });
  const isExpired = !token.expiryDate || token.expiryDate.getTime() < Date.now() + 6e4;
  if (isExpired) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await prisma.gmailToken.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token || null,
          expiryDate: credentials.expiry_date ? new Date(credentials.expiry_date) : null
        }
      });
    } catch (refreshErr) {
      const errMsg = refreshErr instanceof Error ? refreshErr.message : String(refreshErr);
      console.error("[Gmail] Token refresh failed:", errMsg);
      if (errMsg.includes("invalid_grant")) {
        throw new Error(
          "Gmail token expired. Go to Settings → disconnect Gmail → reconnect it. Also check: Google Cloud Console → OAuth Consent Screen → set to 'Production' or add your email as a Test User."
        );
      }
      throw new Error(`Gmail auth failed: ${errMsg}`);
    }
  }
  return google.gmail({ version: "v1", auth: oauth2Client });
}
function parseHeaders(headers) {
  const get = (name) => {
    var _a;
    return ((_a = headers.find((h) => {
      var _a2;
      return ((_a2 = h.name) == null ? void 0 : _a2.toLowerCase()) === name;
    })) == null ? void 0 : _a.value) || "";
  };
  return {
    from: get("from"),
    to: get("to"),
    subject: get("subject"),
    date: get("date")
  };
}
function extractBody(payload) {
  var _a, _b;
  let plain = "";
  let html = "";
  if ((_a = payload.body) == null ? void 0 : _a.data) {
    const decoded = Buffer.from(payload.body.data, "base64url").toString("utf-8");
    if (payload.mimeType === "text/html") html = decoded;
    else plain = decoded;
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if ((_b = part.body) == null ? void 0 : _b.data) {
        const decoded = Buffer.from(part.body.data, "base64url").toString(
          "utf-8"
        );
        if (part.mimeType === "text/html") html = decoded;
        else if (part.mimeType === "text/plain") plain = decoded;
      }
      if (part.parts) {
        const nested = extractBody(part);
        if (!plain) plain = nested.plain;
        if (!html) html = nested.html;
      }
    }
  }
  return { plain, html };
}
async function listMessages(userId, opts = {}) {
  const gmail = await getAuthenticatedClient(userId);
  const res = await gmail.users.messages.list({
    userId: "me",
    labelIds: opts.labelIds,
    maxResults: opts.maxResults || 20,
    pageToken: opts.pageToken,
    q: opts.q
  });
  return {
    messages: res.data.messages || [],
    nextPageToken: res.data.nextPageToken || void 0,
    resultSizeEstimate: res.data.resultSizeEstimate || 0
  };
}
async function getMessage(userId, messageId) {
  var _a, _b;
  const gmail = await getAuthenticatedClient(userId);
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full"
  });
  const msg = res.data;
  const headers = ((_a = msg.payload) == null ? void 0 : _a.headers) || [];
  const { from, to, subject, date } = parseHeaders(headers);
  const { plain, html } = extractBody(msg.payload || {});
  return {
    id: msg.id,
    threadId: msg.threadId,
    from,
    to,
    subject,
    date,
    snippet: msg.snippet || "",
    bodyPlain: plain,
    bodyHtml: html,
    labelIds: msg.labelIds || [],
    historyId: ((_b = msg.historyId) == null ? void 0 : _b.toString()) || ""
  };
}
function buildRawMessage(opts) {
  const headers = [
    `To: ${opts.to}`,
    `From: ${opts.from}`,
    `Subject: =?utf-8?B?${Buffer.from(opts.subject).toString("base64")}?=`
  ];
  if (opts.cc) headers.push(`Cc: ${opts.cc}`);
  if (opts.replyToMessageId) {
    headers.push(`In-Reply-To: ${opts.replyToMessageId}`);
    headers.push(`References: ${opts.replyToMessageId}`);
  }
  headers.push("MIME-Version: 1.0");
  let raw;
  if (opts.htmlBody) {
    const boundary = `scalepod_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    const parts = [
      `--${boundary}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      opts.body,
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      opts.htmlBody,
      `--${boundary}--`
    ];
    raw = [...headers, "", ...parts].join("\r\n");
  } else {
    headers.push("Content-Type: text/plain; charset=utf-8");
    raw = [...headers, "", opts.body].join("\r\n");
  }
  return Buffer.from(raw).toString("base64url");
}
async function sendEmail(userId, opts) {
  const gmail = await getAuthenticatedClient(userId);
  const token = await prisma.gmailToken.findUnique({ where: { userId } });
  const fromAddress = (token == null ? void 0 : token.gmailAddress) || "me";
  const raw = buildRawMessage({
    to: opts.to,
    subject: opts.subject,
    body: opts.body,
    htmlBody: opts.htmlBody,
    from: fromAddress
  });
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      threadId: opts.threadId
    }
  });
  return {
    gmailMessageId: res.data.id,
    gmailThreadId: res.data.threadId
  };
}
async function getGmailSignature(userId) {
  var _a;
  try {
    const gmail = await getAuthenticatedClient(userId);
    const token = await prisma.gmailToken.findUnique({ where: { userId } });
    const address = token == null ? void 0 : token.gmailAddress;
    if (address) {
      const res2 = await gmail.users.settings.sendAs.get({
        userId: "me",
        sendAsEmail: address
      });
      return res2.data.signature || "";
    }
    const res = await gmail.users.settings.sendAs.list({ userId: "me" });
    const defaultAlias = (_a = res.data.sendAs) == null ? void 0 : _a.find((s) => s.isDefault);
    return (defaultAlias == null ? void 0 : defaultAlias.signature) || "";
  } catch {
    return "";
  }
}
async function loader$A({
  request
}) {
  const userId = await requireAuth(request);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Response("Gmail integration is not configured", {
      status: 501
    });
  }
  const state = randomBytes(16).toString("hex");
  const session = await getSession(request);
  session.set("oauth_state", state);
  session.set("oauth_user_id", userId);
  const oauth2Client = getOAuthClient();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: getScopes(),
    state
  });
  return redirect(authUrl, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    }
  });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$A
}, Symbol.toStringTag, { value: "Module" }));
async function loader$z({
  request
}) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (error) {
    return redirect("/settings?gmail=denied");
  }
  if (!code || !state) {
    return redirect("/settings?gmail=error");
  }
  const session = await getSession(request);
  const savedState = session.get("oauth_state");
  const sessionUserId = session.get("oauth_user_id");
  if (!savedState || savedState !== state) {
    throw new Response("Invalid OAuth state — possible CSRF attack", {
      status: 403
    });
  }
  const userId = await requireAuth(request);
  if (sessionUserId && sessionUserId !== userId) {
    throw new Response("User mismatch", {
      status: 403
    });
  }
  const oauth2Client = getOAuthClient();
  const {
    tokens
  } = await oauth2Client.getToken(code);
  if (!tokens.refresh_token) {
    return redirect("/settings?gmail=error");
  }
  await prisma.gmailToken.upsert({
    where: {
      userId
    },
    update: {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token || null,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null
    },
    create: {
      userId,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token || null,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null
    }
  });
  try {
    const oauth2Client2 = getOAuthClient();
    oauth2Client2.setCredentials(tokens);
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client2
    });
    const profile = await gmail.users.getProfile({
      userId: "me"
    });
    if (profile.data.emailAddress) {
      await prisma.gmailToken.update({
        where: {
          userId
        },
        data: {
          gmailAddress: profile.data.emailAddress
        }
      });
    }
  } catch (profileErr) {
    console.error("[Gmail] Failed to fetch profile after connect:", profileErr);
  }
  session.unset("oauth_state");
  session.unset("oauth_user_id");
  return redirect("/settings?gmail=connected", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    }
  });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$z
}, Symbol.toStringTag, { value: "Module" }));
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
  { to: "/workflows", label: "Workflows", icon: Workflow, adminOnly: true },
  { to: "/verification/criteria", label: "Criteria", icon: ShieldCheck, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/docs/api", label: "API Docs", icon: FileJson }
];
function AppShell({ user, children }) {
  var _a, _b;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userInitial = (((_a = user == null ? void 0 : user.name) == null ? void 0 : _a[0]) || ((_b = user == null ? void 0 : user.email) == null ? void 0 : _b[0]) || "?").toUpperCase();
  const userDisplay = (user == null ? void 0 : user.name) || (user == null ? void 0 : user.email) || "Unknown";
  const userRole = (user == null ? void 0 : user.role) || "";
  const isAdmin = userRole === "ADMIN";
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 lg:hidden",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar-background transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between border-b border-sidebar-border px-6", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-sidebar-primary-foreground", children: "S" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-sidebar-foreground", children: "ScalePod" })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "lg:hidden",
                onClick: () => setSidebarOpen(false),
                children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-1 p-4", children: navItems.filter((item) => !("adminOnly" in item && item.adminOnly) || isAdmin).map((item) => {
            const isActive = location.pathname === item.to || item.to !== "/dashboard" && location.pathname.startsWith(item.to);
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: item.to,
                onClick: () => setSidebarOpen(false),
                className: cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                ),
                children: [
                  /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }),
                  item.label
                ]
              },
              item.to
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary/20", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-sidebar-primary", children: userInitial }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 truncate", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-sidebar-foreground", children: userDisplay }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-sidebar-foreground/50", children: userRole })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Form, { method: "post", action: "/login", className: "mt-2", children: [
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "intent", value: "logout" }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground",
                  type: "submit",
                  children: [
                    /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                    "Sign out"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center gap-4 border-b bg-background px-6 lg:hidden", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => setSidebarOpen(true),
            children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "ScalePod CRM" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children })
    ] })
  ] });
}
async function loader$y({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const [inboxCount, activeCount, emailCount, wonCount, stages] = await Promise.all([prisma.lead.count({
    where: {
      status: "INBOX"
    }
  }), prisma.lead.count({
    where: {
      status: "ACTIVE"
    }
  }), prisma.emailThread.count(), prisma.lead.count({
    where: {
      stage: "CLOSED_WON"
    }
  }), getStagesWithMeta()]);
  return {
    user,
    stats: {
      inboxCount,
      activeCount,
      emailCount,
      wonCount
    },
    stages
  };
}
const dashboard = UNSAFE_withComponentProps(function Dashboard() {
  const {
    user,
    stats,
    stages
  } = useLoaderData();
  const statCards = [{
    label: "Leads in Inbox",
    value: stats.inboxCount,
    icon: Inbox,
    iconColor: "text-blue-400",
    bgAccent: "bg-blue-500/10"
  }, {
    label: "Active Pipeline",
    value: stats.activeCount,
    icon: Kanban,
    iconColor: "text-violet-400",
    bgAccent: "bg-violet-500/10"
  }, {
    label: "Email Threads",
    value: stats.emailCount,
    icon: Mail,
    iconColor: "text-amber-400",
    bgAccent: "bg-amber-500/10"
  }, {
    label: "Deals Won",
    value: stats.wonCount,
    icon: TrendingUp,
    iconColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10"
  }];
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold tracking-tight",
          children: "Dashboard"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-muted-foreground",
          children: ["Welcome back", (user == null ? void 0 : user.name) ? `, ${user.name}` : "", ". Here's your CRM overview."]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        children: statCards.map((stat) => /* @__PURE__ */ jsxs(Card, {
          className: "relative overflow-hidden",
          children: [/* @__PURE__ */ jsx("div", {
            className: `absolute top-0 right-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full ${stat.bgAccent}`
          }), /* @__PURE__ */ jsxs(CardHeader, {
            className: "flex flex-row items-center justify-between pb-2",
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-medium text-muted-foreground",
              children: stat.label
            }), /* @__PURE__ */ jsx(stat.icon, {
              className: `h-5 w-5 ${stat.iconColor}`
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx("div", {
              className: "text-3xl font-bold",
              children: stat.value
            })
          })]
        }, stat.label))
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsx(CardTitle, {
              children: "Quick Actions"
            })
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "grid gap-3",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/inbox",
              className: "flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-blue-500/5 hover:border-blue-500/30",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10",
                children: /* @__PURE__ */ jsx(Inbox, {
                  className: "h-5 w-5 text-blue-400"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium",
                  children: "Review Leads"
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: [stats.inboxCount, " leads waiting in inbox"]
                })]
              })]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "/pipeline",
              className: "flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-violet-500/5 hover:border-violet-500/30",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10",
                children: /* @__PURE__ */ jsx(Kanban, {
                  className: "h-5 w-5 text-violet-400"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium",
                  children: "Manage Pipeline"
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: [stats.activeCount, " active deals to track"]
                })]
              })]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "/emails",
              className: "flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-amber-500/5 hover:border-amber-500/30",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10",
                children: /* @__PURE__ */ jsx(Mail, {
                  className: "h-5 w-5 text-amber-400"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium",
                  children: "Email Hub"
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: [stats.emailCount, " conversations tracked"]
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsx(CardTitle, {
              children: "Pipeline Breakdown"
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(PipelineBreakdown, {
              stages
            })
          })]
        })]
      })]
    })
  });
});
function PipelineBreakdown({
  stages
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "space-y-3 text-sm",
    children: stages.map((stage) => /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-3",
      children: [/* @__PURE__ */ jsx("div", {
        className: `h-3 w-3 rounded-full ${stage.meta.dot}`
      }), /* @__PURE__ */ jsx("span", {
        className: "flex-1",
        children: stage.label
      }), /* @__PURE__ */ jsx("div", {
        className: `h-2 w-16 rounded-full ${stage.meta.bg}`,
        children: /* @__PURE__ */ jsx("div", {
          className: `h-2 w-1/3 rounded-full ${stage.meta.bar}`
        })
      })]
    }, stage.label))
  });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard,
  loader: loader$y
}, Symbol.toStringTag, { value: "Module" }));
function getActivityStyle(action2) {
  switch (action2) {
    case "LEAD_CREATED":
      return { icon: "+", bgColor: "bg-green-100", textColor: "text-green-700" };
    case "LEAD_APPROVED":
      return { icon: "✓", bgColor: "bg-green-100", textColor: "text-green-700" };
    case "LEAD_REJECTED":
      return { icon: "✕", bgColor: "bg-red-100", textColor: "text-red-700" };
    case "STAGE_CHANGED":
      return { icon: "→", bgColor: "bg-blue-100", textColor: "text-blue-700" };
    case "LEAD_ASSIGNED":
      return { icon: "@", bgColor: "bg-purple-100", textColor: "text-purple-700" };
    case "LEAD_UNASSIGNED":
      return { icon: "@", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    case "LEAD_SCORED":
      return { icon: "★", bgColor: "bg-yellow-100", textColor: "text-yellow-700" };
    case "LEAD_EDITED":
      return { icon: "✎", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    case "NOTE_ADDED":
      return { icon: "💬", bgColor: "bg-indigo-100", textColor: "text-indigo-700" };
    case "LEAD_SCRAPED":
      return { icon: "🔍", bgColor: "bg-cyan-100", textColor: "text-cyan-700" };
    case "TEMPERATURE_CHANGED":
      return { icon: "🌡", bgColor: "bg-orange-100", textColor: "text-orange-700" };
    default:
      return { icon: "•", bgColor: "bg-gray-100", textColor: "text-gray-700" };
  }
}
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-500/20 text-emerald-400",
        warning: "border-transparent bg-amber-500/20 text-amber-400"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function rangeToStartDate(range, from) {
  if (range === "all") return void 0;
  if (range === "custom" && from) return new Date(from);
  const now = /* @__PURE__ */ new Date();
  const d = new Date(now);
  switch (range) {
    case "7d":
      d.setDate(d.getDate() - 7);
      break;
    case "30d":
      d.setDate(d.getDate() - 30);
      break;
    case "90d":
      d.setDate(d.getDate() - 90);
      break;
    case "1y":
      d.setFullYear(d.getFullYear() - 1);
      break;
  }
  return d;
}
async function loader$x({
  request
}) {
  var _a;
  const userId = await requireAuth(request);
  const allStages = await getStagesWithMeta();
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "all";
  const customFrom = url.searchParams.get("from") || void 0;
  const customTo = url.searchParams.get("to") || void 0;
  const startDate = rangeToStartDate(range, customFrom);
  const endDate = customTo ? new Date(customTo) : void 0;
  let rawHistory = [];
  let leadsMap = /* @__PURE__ */ new Map();
  let usersMap = /* @__PURE__ */ new Map();
  try {
    rawHistory = await prisma.stageHistory.findMany({
      orderBy: {
        changedAt: "asc"
      }
    });
    if (rawHistory.length > 0) {
      const leadIds = [...new Set(rawHistory.map((h) => h.leadId))];
      const changedByIds = [...new Set(rawHistory.map((h) => h.changedById).filter(Boolean))];
      const [leads, changedByUsers] = await Promise.all([prisma.lead.findMany({
        where: {
          id: {
            in: leadIds
          }
        },
        select: {
          id: true,
          companyName: true,
          contactName: true,
          email: true,
          stage: true,
          leadSource: true
        }
      }), prisma.user.findMany({
        where: {
          id: {
            in: changedByIds
          }
        },
        select: {
          id: true,
          name: true
        }
      })]);
      leadsMap = new Map(leads.map((l) => [l.id, l]));
      usersMap = new Map(changedByUsers.map((u) => [u.id, u]));
    }
  } catch (err) {
    console.error("[analytics] Failed to load stage history:", err);
  }
  const enrichedHistory = rawHistory.map((h) => ({
    ...h,
    lead: leadsMap.get(h.leadId) || null,
    changedBy: h.changedById ? usersMap.get(h.changedById) || null : null
  }));
  const firstArrivalMap = /* @__PURE__ */ new Map();
  for (const h of enrichedHistory) {
    const key = `${h.leadId}::${h.toStage}`;
    if (!firstArrivalMap.has(key)) firstArrivalMap.set(key, h);
  }
  const dedupedHistory = Array.from(firstArrivalMap.values());
  const stageHistory = startDate || endDate ? dedupedHistory.filter((h) => {
    const t = new Date(h.changedAt).getTime();
    if (startDate && t < startDate.getTime()) return false;
    if (endDate && t > endDate.getTime()) return false;
    return true;
  }) : dedupedHistory;
  const stageCounts = {};
  for (const stage of allStages.map((s) => s.name)) {
    stageCounts[stage] = stageHistory.filter((h) => h.toStage === stage).length;
  }
  const won = stageCounts["CLOSED_WON"];
  const lost = stageCounts["CLOSED_LOST"];
  const winRate = won + lost > 0 ? Math.round(won / (won + lost) * 100) : 0;
  const now = /* @__PURE__ */ new Date();
  const monthsToShow = range === "7d" ? 1 : range === "30d" ? 2 : range === "90d" ? 4 : range === "1y" ? 12 : 6;
  const monthlyTrends = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = mStart.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit"
    });
    const inRange = (d) => d >= mStart && d < mEnd;
    monthlyTrends.push({
      month: label,
      contacted: stageHistory.filter((h) => h.toStage === "FIRST_CONTACT" && inRange(h.changedAt)).length,
      won: stageHistory.filter((h) => h.toStage === "CLOSED_WON" && inRange(h.changedAt)).length,
      lost: stageHistory.filter((h) => h.toStage === "CLOSED_LOST" && inRange(h.changedAt)).length
    });
  }
  let leadSources = [];
  try {
    const sources = await prisma.lead.groupBy({
      by: ["leadSource"],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      },
      ...startDate ? {
        where: {
          createdAt: {
            gte: startDate
          }
        }
      } : {}
    });
    leadSources = sources.map((s) => ({
      source: s.leadSource || "Unknown",
      count: s._count.id
    }));
  } catch (err) {
    console.error("[analytics] Failed to load lead sources:", err);
  }
  let allUsers = [];
  try {
    allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  } catch (err) {
    console.error("[analytics] Failed to load users:", err);
  }
  const teamStats = allUsers.map((u) => {
    const contacted = stageHistory.filter((h) => h.changedById === u.id && h.toStage === "FIRST_CONTACT").length;
    const dealsWon = stageHistory.filter((h) => h.changedById === u.id && h.toStage === "CLOSED_WON").length;
    const dealsLost = stageHistory.filter((h) => h.changedById === u.id && h.toStage === "CLOSED_LOST").length;
    return {
      ...u,
      contacted,
      dealsWon,
      dealsLost,
      winRate: dealsWon + dealsLost > 0 ? Math.round(dealsWon / (dealsWon + dealsLost) * 100) : 0
    };
  }).filter((u) => u.contacted > 0 || u.dealsWon > 0 || u.dealsLost > 0).sort((a, b) => b.dealsWon - a.dealsWon);
  const wonHistory = stageHistory.filter((h) => h.toStage === "CLOSED_WON");
  const lostHistory = stageHistory.filter((h) => h.toStage === "CLOSED_LOST");
  const proposalHistory = stageHistory.filter((h) => h.toStage === "PROPOSAL_SENT");
  const contactedHistory = stageHistory.filter((h) => h.toStage === "FIRST_CONTACT");
  let totalLeads = 0;
  try {
    totalLeads = await prisma.lead.count(startDate ? {
      where: {
        createdAt: {
          gte: startDate
        }
      }
    } : void 0);
  } catch (err) {
    console.error("[analytics] Failed to count leads:", err);
  }
  let totalEmailsSent = 0;
  try {
    totalEmailsSent = await prisma.emailMessage.count({
      where: {
        direction: "sent",
        ...startDate ? {
          createdAt: {
            gte: startDate
          }
        } : {}
      }
    });
  } catch (err) {
    console.error("[analytics] Failed to count emails:", err);
  }
  let temperatureDistribution = [];
  try {
    const tempGroups = await prisma.lead.groupBy({
      by: ["temperature"],
      _count: {
        id: true
      },
      _avg: {
        score: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      },
      ...startDate ? {
        where: {
          createdAt: {
            gte: startDate
          }
        }
      } : {}
    });
    temperatureDistribution = tempGroups.map((g) => ({
      temperature: g.temperature || "NONE",
      count: g._count.id,
      avgScore: Math.round((g._avg.score || 0) * 10) / 10
    }));
  } catch (err) {
    console.error("[analytics] Failed to load temperature distribution:", err);
  }
  let scoreBySource = [];
  try {
    const sourceGroups = await prisma.lead.groupBy({
      by: ["leadSource"],
      _count: {
        id: true
      },
      _avg: {
        score: true,
        maxScore: true
      },
      orderBy: {
        _avg: {
          score: "desc"
        }
      },
      ...startDate ? {
        where: {
          createdAt: {
            gte: startDate
          }
        }
      } : {}
    });
    scoreBySource = sourceGroups.filter((g) => g.leadSource).map((g) => ({
      source: g.leadSource || "Unknown",
      avgScore: Math.round((g._avg.score || 0) * 10) / 10,
      avgMaxScore: Math.round((g._avg.maxScore || 0) * 10) / 10,
      count: g._count.id
    }));
  } catch (err) {
    console.error("[analytics] Failed to load score by source:", err);
  }
  let scoreTrend = [];
  try {
    const leadsWithScores = await prisma.lead.findMany({
      where: {
        score: {
          not: null
        },
        ...startDate ? {
          createdAt: {
            gte: startDate
          }
        } : {}
      },
      select: {
        createdAt: true,
        score: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    const monthMap = /* @__PURE__ */ new Map();
    for (const lead of leadsWithScores) {
      const d = new Date(lead.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(key) || {
        total: 0,
        count: 0
      };
      existing.total += lead.score || 0;
      existing.count += 1;
      monthMap.set(key, existing);
    }
    scoreTrend = Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([key, {
      total,
      count
    }]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      });
      return {
        month: label,
        avgScore: Math.round(total / count * 10) / 10
      };
    });
  } catch (err) {
    console.error("[analytics] Failed to load score trend:", err);
  }
  let conversionByTemp = [];
  try {
    const tempStageGroups = await prisma.lead.groupBy({
      by: ["temperature", "stage"],
      _count: {
        id: true
      },
      ...startDate ? {
        where: {
          createdAt: {
            gte: startDate
          }
        }
      } : {}
    });
    const tempTotals = /* @__PURE__ */ new Map();
    const tempWon = /* @__PURE__ */ new Map();
    for (const g of tempStageGroups) {
      const temp = g.temperature || "NONE";
      tempTotals.set(temp, (tempTotals.get(temp) || 0) + g._count.id);
      if (g.stage === "CLOSED_WON") {
        tempWon.set(temp, (tempWon.get(temp) || 0) + g._count.id);
      }
    }
    for (const [temp, total] of Array.from(tempTotals.entries())) {
      const won2 = tempWon.get(temp) || 0;
      conversionByTemp.push({
        temperature: temp,
        total,
        won: won2,
        rate: total > 0 ? Math.round(won2 / total * 100) : 0
      });
    }
    conversionByTemp.sort((a, b) => b.rate - a.rate);
  } catch (err) {
    console.error("[analytics] Failed to load conversion by temperature:", err);
  }
  let pipelineVelocity = [];
  try {
    const leadStageMap = /* @__PURE__ */ new Map();
    for (const h of rawHistory) {
      if (!leadStageMap.has(h.leadId)) leadStageMap.set(h.leadId, []);
      leadStageMap.get(h.leadId).push({
        fromStage: h.fromStage,
        toStage: h.toStage,
        changedAt: new Date(h.changedAt)
      });
    }
    const stageDurations = {};
    for (const [, entries] of Array.from(leadStageMap.entries())) {
      const sorted = entries.sort((a, b) => a.changedAt.getTime() - b.changedAt.getTime());
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const days = (curr.changedAt.getTime() - prev.changedAt.getTime()) / (1e3 * 60 * 60 * 24);
        if (days >= 0 && days < 365) {
          const stage = prev.toStage;
          if (!stageDurations[stage]) stageDurations[stage] = [];
          stageDurations[stage].push(days);
        }
      }
    }
    for (const stage of allStages.map((s) => s.name)) {
      const durations = stageDurations[stage] || [];
      if (durations.length > 0) {
        pipelineVelocity.push({
          stage,
          avgDays: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length * 10) / 10
        });
      }
    }
  } catch (err) {
    console.error("[analytics] Failed to compute pipeline velocity:", err);
  }
  const avgScorePct = scoreBySource.length > 0 ? Math.round(scoreBySource.reduce((a, s) => a + s.avgScore, 0) / scoreBySource.length / (scoreBySource.reduce((a, s) => a + s.avgMaxScore, 0) / scoreBySource.length || 1) * 100) : 0;
  const hotCount = ((_a = temperatureDistribution.find((t) => t.temperature === "HOT")) == null ? void 0 : _a.count) || 0;
  const avgVelocityDays = pipelineVelocity.length > 0 ? Math.round(pipelineVelocity.reduce((a, v) => a + v.avgDays, 0) / pipelineVelocity.length * 10) / 10 : 0;
  return {
    user,
    stages: allStages,
    range,
    totalLeads,
    stageCounts,
    won,
    lost,
    winRate,
    monthlyTrends,
    leadSources,
    teamStats,
    wonHistory,
    lostHistory,
    proposalHistory,
    contactedHistory,
    totalEmailsSent,
    temperatureDistribution,
    scoreBySource,
    scoreTrend,
    conversionByTemp,
    pipelineVelocity,
    avgScorePct,
    hotCount,
    avgVelocityDays
  };
}
function RangePicker({
  range
}) {
  const isCustom = range === "custom";
  const ranges = [{
    key: "7d",
    label: "7D"
  }, {
    key: "30d",
    label: "30D"
  }, {
    key: "90d",
    label: "90D"
  }, {
    key: "1y",
    label: "1Y"
  }, {
    key: "all",
    label: "All Time"
  }];
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col gap-2",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/40",
      children: [ranges.map((r) => /* @__PURE__ */ jsx(Link, {
        to: `/analytics?range=${r.key}`,
        className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${range === r.key ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
        children: r.label
      }, r.key)), /* @__PURE__ */ jsx(Link, {
        to: `/analytics?range=custom`,
        className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${isCustom ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
        children: "Custom"
      })]
    }), isCustom && /* @__PURE__ */ jsxs("form", {
      method: "get",
      action: "/analytics",
      className: "flex items-center gap-2",
      children: [/* @__PURE__ */ jsx("input", {
        type: "hidden",
        name: "range",
        value: "custom"
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1.5",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-xs text-muted-foreground",
          children: "From"
        }), /* @__PURE__ */ jsx("input", {
          type: "date",
          name: "from",
          className: "h-8 rounded-lg border border-border/60 bg-background px-2 text-xs text-foreground shadow-sm"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1.5",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-xs text-muted-foreground",
          children: "To"
        }), /* @__PURE__ */ jsx("input", {
          type: "date",
          name: "to",
          className: "h-8 rounded-lg border border-border/60 bg-background px-2 text-xs text-foreground shadow-sm"
        })]
      }), /* @__PURE__ */ jsx(Button, {
        type: "submit",
        size: "sm",
        variant: "outline",
        className: "h-8 text-xs rounded-lg",
        children: "Apply"
      })]
    })]
  });
}
function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  accent
}) {
  const accents = {
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/15",
      glow: "shadow-violet-500/10"
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/15",
      glow: "shadow-blue-500/10"
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/15",
      glow: "shadow-amber-500/10"
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/15",
      glow: "shadow-emerald-500/10"
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/15",
      glow: "shadow-red-500/10"
    },
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/15",
      glow: "shadow-orange-500/10"
    },
    slate: {
      bg: "bg-slate-400/10",
      text: "text-slate-300",
      border: "border-slate-400/15",
      glow: "shadow-slate-400/10"
    }
  };
  const a = accents[accent] || accents.violet;
  return /* @__PURE__ */ jsx(Card, {
    className: `border ${a.border} hover:shadow-md hover:-translate-y-px transition-all duration-200`,
    children: /* @__PURE__ */ jsx(CardContent, {
      className: "p-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-start justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-2xl font-bold tracking-tight",
            children: value
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-muted-foreground mt-0.5",
            children: label
          }), sub && /* @__PURE__ */ jsx("p", {
            className: "text-[10px] text-muted-foreground/50 mt-0.5",
            children: sub
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: `flex h-9 w-9 items-center justify-center rounded-xl ${a.bg} ring-1 ${a.border}`,
          children: /* @__PURE__ */ jsx(Icon, {
            className: `h-4 w-4 ${a.text}`
          })
        })]
      })
    })
  });
}
function GroupedBarChart({
  data: data2
}) {
  const maxVal = Math.max(...data2.flatMap((d) => [d.contacted, d.won, d.lost]), 1);
  return /* @__PURE__ */ jsx("div", {
    className: "flex items-end gap-3",
    style: {
      height: 180
    },
    children: data2.map((d) => /* @__PURE__ */ jsxs("div", {
      className: "flex-1 flex flex-col items-center gap-1.5 group",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        children: [d.contacted > 0 && /* @__PURE__ */ jsx("span", {
          className: "text-violet-400 font-medium",
          children: d.contacted
        }), d.won > 0 && /* @__PURE__ */ jsx("span", {
          className: "text-emerald-400 font-medium",
          children: d.won
        }), d.lost > 0 && /* @__PURE__ */ jsx("span", {
          className: "text-red-400 font-medium",
          children: d.lost
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-end gap-[3px] w-full",
        style: {
          height: 140
        },
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex-1 flex flex-col justify-end",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full rounded-t-md bg-violet-500/40 min-h-[3px] transition-all duration-500 group-hover:bg-violet-500/55",
            style: {
              height: `${d.contacted / maxVal * 100}%`
            }
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1 flex flex-col justify-end",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full rounded-t-md bg-emerald-500/50 min-h-[3px] transition-all duration-500 group-hover:bg-emerald-500/65",
            style: {
              height: `${d.won / maxVal * 100}%`
            }
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1 flex flex-col justify-end",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full rounded-t-md bg-red-500/40 min-h-[3px] transition-all duration-500 group-hover:bg-red-500/55",
            style: {
              height: `${d.lost / maxVal * 100}%`
            }
          })
        })]
      }), /* @__PURE__ */ jsx("span", {
        className: "text-[10px] text-muted-foreground/60 whitespace-nowrap font-medium",
        children: d.month
      })]
    }, d.month))
  });
}
function FunnelBar({
  stage,
  count,
  maxCount,
  convRate,
  stages
}) {
  var _a;
  const width = maxCount > 0 ? Math.max(count / maxCount * 100, count > 0 ? 6 : 0) : 0;
  const meta2 = ((_a = stages.find((s) => s.name === stage)) == null ? void 0 : _a.meta) || getStageClasses("slate");
  return /* @__PURE__ */ jsxs("div", {
    className: "group",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-3",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2 w-28 shrink-0 justify-end",
        children: [/* @__PURE__ */ jsx("span", {
          className: `h-2 w-2 rounded-full ${meta2.dot}`
        }), /* @__PURE__ */ jsx("span", {
          className: "text-xs text-muted-foreground truncate",
          children: formatStage(stage)
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex-1 h-7 bg-muted/20 rounded-lg overflow-hidden relative ring-1 ring-border/20",
        children: count > 0 && /* @__PURE__ */ jsx("div", {
          className: `h-full rounded-lg flex items-center px-2.5 transition-all duration-500 ${meta2.bar}`,
          style: {
            width: `${Math.min(width, 100)}%`,
            minWidth: 40
          },
          children: /* @__PURE__ */ jsx("span", {
            className: "text-[11px] font-bold text-white/90 drop-shadow-sm",
            children: count
          })
        })
      }), /* @__PURE__ */ jsx("span", {
        className: "text-[11px] text-muted-foreground/60 w-10 shrink-0 text-right tabular-nums font-medium",
        children: count
      })]
    }), convRate !== null && /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-3 ml-[7.5rem] mt-0.5 mb-0.5",
      children: [/* @__PURE__ */ jsx("div", {
        className: "h-px flex-1 bg-border/20"
      }), /* @__PURE__ */ jsxs("span", {
        className: "text-[10px] text-muted-foreground/40 font-medium",
        children: [convRate, "% conversion"]
      }), /* @__PURE__ */ jsx(ChevronDown, {
        className: "h-3 w-3 text-muted-foreground/20"
      })]
    })]
  });
}
function DataTable({
  rows,
  stages
}) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-center py-12 text-center",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50",
        children: /* @__PURE__ */ jsx(BarChart3, {
          className: "h-5 w-5 text-muted-foreground/40"
        })
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-4 text-sm font-medium text-foreground/80",
        children: "No records found"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xs text-muted-foreground mt-0.5",
        children: "Try adjusting your date range."
      })]
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "overflow-x-auto",
    children: /* @__PURE__ */ jsxs("table", {
      className: "w-full text-sm",
      children: [/* @__PURE__ */ jsx("thead", {
        children: /* @__PURE__ */ jsxs("tr", {
          className: "border-b border-border/60 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold",
          children: [/* @__PURE__ */ jsx("th", {
            className: "pb-2.5 pr-4",
            children: "Company"
          }), /* @__PURE__ */ jsx("th", {
            className: "pb-2.5 pr-4",
            children: "Contact"
          }), /* @__PURE__ */ jsx("th", {
            className: "pb-2.5 pr-4",
            children: "Date"
          }), /* @__PURE__ */ jsx("th", {
            className: "pb-2.5 pr-4",
            children: "By"
          }), /* @__PURE__ */ jsx("th", {
            className: "pb-2.5",
            children: "Stage"
          })]
        })
      }), /* @__PURE__ */ jsx("tbody", {
        className: "divide-y divide-border/30",
        children: rows.map((r) => {
          var _a, _b, _c, _d;
          return /* @__PURE__ */ jsxs("tr", {
            className: "hover:bg-muted/15 transition-colors",
            children: [/* @__PURE__ */ jsx("td", {
              className: "py-2.5 pr-4",
              children: /* @__PURE__ */ jsx(Link, {
                to: `/inbox/${r.leadId}`,
                className: "font-medium text-foreground/90 hover:text-violet-400 hover:underline transition-colors",
                children: r.company
              })
            }), /* @__PURE__ */ jsx("td", {
              className: "py-2.5 pr-4 text-muted-foreground",
              children: r.contact || "—"
            }), /* @__PURE__ */ jsx("td", {
              className: "py-2.5 pr-4 text-muted-foreground whitespace-nowrap",
              children: new Date(r.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            }), /* @__PURE__ */ jsx("td", {
              className: "py-2.5 pr-4 text-muted-foreground",
              children: r.changedBy || "—"
            }), /* @__PURE__ */ jsx("td", {
              className: "py-2.5",
              children: /* @__PURE__ */ jsx(Badge, {
                className: `text-[10px] rounded-full ${((_b = (_a = stages.find((s) => s.name === r.currentStage)) == null ? void 0 : _a.meta) == null ? void 0 : _b.bg) || "bg-muted"} ${((_d = (_c = stages.find((s) => s.name === r.currentStage)) == null ? void 0 : _c.meta) == null ? void 0 : _d.text) || "text-muted-foreground"} border-0`,
                children: formatStage(r.currentStage)
              })
            })]
          }, r.id);
        })
      })]
    })
  });
}
function TabButton$1({
  active,
  label,
  count,
  onClick
}) {
  return /* @__PURE__ */ jsxs("button", {
    onClick,
    className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${active ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
    children: [label, /* @__PURE__ */ jsx("span", {
      className: `rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/60"}`,
      children: count
    })]
  });
}
function EmptyState$1({
  icon: Icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center py-12 text-center",
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50",
      children: /* @__PURE__ */ jsx(Icon, {
        className: "h-5 w-5 text-muted-foreground/40"
      })
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-4 text-sm font-medium text-foreground/80",
      children: title
    }), subtitle && /* @__PURE__ */ jsx("p", {
      className: "text-xs text-muted-foreground mt-0.5",
      children: subtitle
    })]
  });
}
const analytics = UNSAFE_withComponentProps(function Analytics() {
  var _a, _b, _c;
  const data2 = useLoaderData();
  const [activeTab, setActiveTab] = useState("won");
  const toRow = (h) => {
    var _a2, _b2, _c2, _d, _e;
    return {
      id: h.id,
      leadId: ((_a2 = h.lead) == null ? void 0 : _a2.id) || "",
      company: ((_b2 = h.lead) == null ? void 0 : _b2.companyName) || "—",
      contact: ((_c2 = h.lead) == null ? void 0 : _c2.contactName) || "",
      date: h.changedAt,
      changedBy: ((_d = h.changedBy) == null ? void 0 : _d.name) || "",
      currentStage: ((_e = h.lead) == null ? void 0 : _e.stage) || "UNKNOWN"
    };
  };
  const tabData = {
    won: data2.wonHistory.map(toRow),
    lost: data2.lostHistory.map(toRow),
    proposals: data2.proposalHistory.map(toRow),
    contacted: data2.contactedHistory.map(toRow)
  };
  const maxSource = Math.max(...data2.leadSources.map((s) => s.count), 1);
  Math.max(...data2.teamStats.map((t) => t.contacted + t.dealsWon), 1);
  const maxStageCount = data2.stageCounts[((_a = data2.stages[0]) == null ? void 0 : _a.name) ?? ""] || Math.max(...Object.values(data2.stageCounts), 1);
  return /* @__PURE__ */ jsx(AppShell, {
    user: data2.user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Analytics"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mt-1",
            children: "Pipeline performance, outreach metrics, and team activity"
          })]
        }), /* @__PURE__ */ jsx(RangePicker, {
          range: data2.range
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        children: [/* @__PURE__ */ jsx(KPICard, {
          icon: Users,
          label: "Total Leads",
          value: data2.totalLeads,
          accent: "slate"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Mail,
          label: "Emails Sent",
          value: data2.totalEmailsSent,
          accent: "blue"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: UserCheck,
          label: "Contacted",
          value: data2.stageCounts[((_b = data2.stages.find((s) => s.name === "FIRST_CONTACT")) == null ? void 0 : _b.name) ?? ""],
          sub: "Reached First Contact",
          accent: "violet"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: FileCheck,
          label: "Proposals Sent",
          value: data2.stageCounts[((_c = data2.stages.find((s) => s.name === "PROPOSAL_SENT")) == null ? void 0 : _c.name) ?? ""],
          accent: "orange"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Trophy,
          label: "Deals Won",
          value: data2.won,
          accent: "emerald"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Target,
          label: "Win Rate",
          value: `${data2.winRate}%`,
          sub: `${data2.won}W / ${data2.lost}L`,
          accent: "amber"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-3 grid-cols-2 lg:grid-cols-3",
        children: [/* @__PURE__ */ jsx(KPICard, {
          icon: Zap,
          label: "Avg Score %",
          value: data2.avgScorePct ? `${data2.avgScorePct}%` : "—",
          sub: "Across all scored leads",
          accent: "orange"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Thermometer,
          label: "HOT Leads",
          value: data2.hotCount,
          sub: "High-priority prospects",
          accent: "red"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Clock,
          label: "Avg Velocity",
          value: data2.avgVelocityDays ? `${data2.avgVelocityDays}d` : "—",
          sub: "Avg days per stage",
          accent: "blue"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-5",
        children: [/* @__PURE__ */ jsxs(Card, {
          className: "lg:col-span-3 hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Layers, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Conversion Funnel"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-1",
            children: data2.stages.map((s, i) => {
              const count = data2.stageCounts[s.name];
              const prevCount = i > 0 ? data2.stageCounts[data2.stages[i - 1].name] : 0;
              const convRate = i > 0 && prevCount > 0 && count > 0 ? Math.round(count / prevCount * 100) : null;
              return /* @__PURE__ */ jsx(FunnelBar, {
                stage: s.name,
                count,
                maxCount: maxStageCount,
                convRate,
                stages: data2.stages
              }, s.name);
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "lg:col-span-2 hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(PieChart, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Won vs Lost"
              })]
            })
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-5",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex gap-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex-1 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/15 p-4 text-center ring-1 ring-emerald-500/10",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-3xl font-bold text-emerald-400",
                  children: data2.won
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-emerald-400/60 mt-1 font-medium",
                  children: "Won"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/15 p-4 text-center ring-1 ring-red-500/10",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-3xl font-bold text-red-400",
                  children: data2.lost
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-red-400/60 mt-1 font-medium",
                  children: "Lost"
                })]
              })]
            }), data2.won + data2.lost > 0 && /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex h-2.5 rounded-full overflow-hidden bg-muted/30 ring-1 ring-border/20",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "bg-emerald-500/70 transition-all duration-700",
                  style: {
                    width: `${data2.won / (data2.won + data2.lost) * 100}%`
                  }
                }), /* @__PURE__ */ jsx("div", {
                  className: "bg-red-500/50 transition-all duration-700",
                  style: {
                    width: `${data2.lost / (data2.won + data2.lost) * 100}%`
                  }
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex justify-between text-[10px] text-muted-foreground font-medium",
                children: [/* @__PURE__ */ jsxs("span", {
                  children: [data2.winRate, "% won"]
                }), /* @__PURE__ */ jsxs("span", {
                  children: [100 - data2.winRate, "% lost"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5 pt-2 border-t border-border/30",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold",
                children: "Recent outcomes"
              }), [...data2.wonHistory.slice(0, 3).map((h) => ({
                ...h,
                outcome: "won"
              })), ...data2.lostHistory.slice(0, 3).map((h) => ({
                ...h,
                outcome: "lost"
              }))].sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()).slice(0, 5).map((h) => {
                var _a2, _b2;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2.5 text-xs group",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `h-2 w-2 rounded-full shrink-0 ring-2 ring-background ${h.outcome === "won" ? "bg-emerald-400" : "bg-red-400"}`
                  }), /* @__PURE__ */ jsx(Link, {
                    to: `/inbox/${(_a2 = h.lead) == null ? void 0 : _a2.id}`,
                    className: "truncate text-foreground/80 hover:text-violet-400 hover:underline transition-colors flex-1",
                    children: (_b2 = h.lead) == null ? void 0 : _b2.companyName
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-muted-foreground/50 shrink-0 tabular-nums",
                    children: new Date(h.changedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric"
                    })
                  })]
                }, h.id);
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-2",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(TrendingUp, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Monthly Trends"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-4",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-sm bg-violet-400/60"
                }), " Contacted"]
              }), /* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-sm bg-emerald-400/60"
                }), " Won"]
              }), /* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-sm bg-red-400/60"
                }), " Lost"]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: data2.monthlyTrends.every((m) => m.contacted === 0 && m.won === 0 && m.lost === 0) ? /* @__PURE__ */ jsx(EmptyState$1, {
            icon: TrendingUp,
            title: "No trend data",
            subtitle: "Try selecting a different date range."
          }) : /* @__PURE__ */ jsx(GroupedBarChart, {
            data: data2.monthlyTrends
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Activity, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Lead Sources"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.leadSources.length === 0 ? /* @__PURE__ */ jsx(EmptyState$1, {
              icon: Activity,
              title: "No lead source data"
            }) : /* @__PURE__ */ jsx("div", {
              className: "space-y-2.5",
              children: data2.leadSources.slice(0, 8).map((s) => /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3 group",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-xs text-muted-foreground w-28 shrink-0 truncate text-right",
                  children: s.source
                }), /* @__PURE__ */ jsx("div", {
                  className: "flex-1 h-6 bg-muted/20 rounded-lg overflow-hidden ring-1 ring-border/20",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "h-full rounded-lg bg-violet-400/40 flex items-center px-2 transition-all duration-500 group-hover:bg-violet-400/55",
                    style: {
                      width: `${Math.max(s.count / maxSource * 100, 6)}%`
                    },
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-[10px] font-bold text-white/90 drop-shadow-sm",
                      children: s.count
                    })
                  })
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-[10px] text-muted-foreground/40 w-8 shrink-0 text-right tabular-nums font-medium",
                  children: [Math.round(s.count / maxSource * 100), "%"]
                })]
              }, s.source))
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Users, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Team Performance"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.teamStats.length === 0 ? /* @__PURE__ */ jsx(EmptyState$1, {
              icon: Users,
              title: "No team activity yet"
            }) : /* @__PURE__ */ jsxs("div", {
              className: "space-y-1",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-[1fr_60px_60px_60px] text-[10px] text-muted-foreground/50 uppercase tracking-wider pb-1.5 border-b border-border/40 font-bold",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "Member"
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center",
                  children: "Contacted"
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center",
                  children: "Won"
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center",
                  children: "Rate"
                })]
              }), data2.teamStats.map((t) => /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-[1fr_60px_60px_60px] items-center text-xs py-1.5 hover:bg-muted/15 rounded-lg transition-colors px-1 -mx-1",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold ring-1 ring-violet-500/20",
                    children: (t.name || t.email)[0].toUpperCase()
                  }), /* @__PURE__ */ jsx("span", {
                    className: "truncate font-medium text-foreground/90",
                    children: t.name || t.email
                  })]
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center text-muted-foreground tabular-nums",
                  children: t.contacted
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center text-emerald-400 font-bold tabular-nums",
                  children: t.dealsWon
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-center text-muted-foreground tabular-nums",
                  children: [t.winRate, "%"]
                })]
              }, t.id))]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Thermometer, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Temperature Distribution"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.temperatureDistribution.length === 0 ? /* @__PURE__ */ jsx(EmptyState$1, {
              icon: Thermometer,
              title: "No temperature data",
              subtitle: "Score leads to see distribution"
            }) : /* @__PURE__ */ jsx("div", {
              className: "space-y-2.5",
              children: data2.temperatureDistribution.map((t) => {
                const tempMeta = {
                  HOT: {
                    color: "text-red-400",
                    bg: "bg-red-500/50"
                  },
                  WARM: {
                    color: "text-amber-400",
                    bg: "bg-amber-500/50"
                  },
                  COLD: {
                    color: "text-blue-400",
                    bg: "bg-blue-500/50"
                  },
                  NONE: {
                    color: "text-slate-400",
                    bg: "bg-slate-400/50"
                  }
                };
                const meta2 = tempMeta[t.temperature] || tempMeta.NONE;
                const maxCount = Math.max(...data2.temperatureDistribution.map((x) => x.count), 1);
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 group",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `text-xs font-medium w-12 shrink-0 text-right ${meta2.color}`,
                    children: t.temperature
                  }), /* @__PURE__ */ jsx("div", {
                    className: "flex-1 h-6 bg-muted/20 rounded-lg overflow-hidden ring-1 ring-border/20",
                    children: /* @__PURE__ */ jsx("div", {
                      className: `h-full rounded-lg ${meta2.bg} flex items-center px-2 transition-all duration-500 group-hover:opacity-75`,
                      style: {
                        width: `${Math.max(t.count / maxCount * 100, 6)}%`
                      },
                      children: /* @__PURE__ */ jsx("span", {
                        className: "text-[10px] font-bold text-white/90 drop-shadow-sm",
                        children: t.count
                      })
                    })
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "text-[10px] text-muted-foreground/60 w-16 shrink-0 tabular-nums",
                    children: ["avg ", t.avgScore, "pts"]
                  })]
                }, t.temperature);
              })
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Target, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Conversion by Temperature"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.conversionByTemp.length === 0 ? /* @__PURE__ */ jsx(EmptyState$1, {
              icon: Target,
              title: "No conversion data",
              subtitle: "Leads with temperature data needed"
            }) : /* @__PURE__ */ jsx("div", {
              className: "space-y-2.5",
              children: data2.conversionByTemp.map((c) => {
                const tempMeta = {
                  HOT: {
                    color: "text-red-400",
                    bg: "bg-red-500/50"
                  },
                  WARM: {
                    color: "text-amber-400",
                    bg: "bg-amber-500/50"
                  },
                  COLD: {
                    color: "text-blue-400",
                    bg: "bg-blue-500/50"
                  },
                  NONE: {
                    color: "text-slate-400",
                    bg: "bg-slate-400/50"
                  }
                };
                const meta2 = tempMeta[c.temperature] || tempMeta.NONE;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 group",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `text-xs font-medium w-12 shrink-0 text-right ${meta2.color}`,
                    children: c.temperature
                  }), /* @__PURE__ */ jsx("div", {
                    className: "flex-1 h-6 bg-muted/20 rounded-lg overflow-hidden ring-1 ring-border/20",
                    children: /* @__PURE__ */ jsx("div", {
                      className: `h-full rounded-lg bg-emerald-500/50 flex items-center px-2 transition-all duration-500`,
                      style: {
                        width: `${Math.max(c.rate, c.rate > 0 ? 4 : 0)}%`
                      },
                      children: c.rate > 5 && /* @__PURE__ */ jsxs("span", {
                        className: "text-[10px] font-bold text-white/90 drop-shadow-sm",
                        children: [c.rate, "%"]
                      })
                    })
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "text-[10px] text-muted-foreground/60 w-20 shrink-0 tabular-nums text-right",
                    children: [c.won, "/", c.total, " won"]
                  })]
                }, c.temperature);
              })
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Zap, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Score by Lead Source"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.scoreBySource.length === 0 ? /* @__PURE__ */ jsx(EmptyState$1, {
              icon: Zap,
              title: "No scoring data",
              subtitle: "Set up scoring rules to see scores by source"
            }) : /* @__PURE__ */ jsx("div", {
              className: "space-y-2.5",
              children: data2.scoreBySource.slice(0, 8).map((s) => {
                const pct = s.avgMaxScore > 0 ? Math.round(s.avgScore / s.avgMaxScore * 100) : 0;
                Math.max(...data2.scoreBySource.map((x) => x.avgMaxScore > 0 ? x.avgScore / x.avgMaxScore * 100 : 0), 1);
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 group",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-xs text-muted-foreground w-28 shrink-0 truncate text-right",
                    children: s.source
                  }), /* @__PURE__ */ jsx("div", {
                    className: "flex-1 h-6 bg-muted/20 rounded-lg overflow-hidden ring-1 ring-border/20",
                    children: /* @__PURE__ */ jsx("div", {
                      className: "h-full rounded-lg bg-orange-500/40 flex items-center px-2 transition-all duration-500 group-hover:bg-orange-500/55",
                      style: {
                        width: `${Math.max(pct, 4)}%`
                      },
                      children: /* @__PURE__ */ jsxs("span", {
                        className: "text-[10px] font-bold text-white/90 drop-shadow-sm",
                        children: [pct, "%"]
                      })
                    })
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "text-[10px] text-muted-foreground/60 w-12 shrink-0 tabular-nums text-right",
                    children: [s.avgScore, "/", s.avgMaxScore]
                  })]
                }, s.source);
              })
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            className: "pb-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Clock, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Pipeline Velocity"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Avg days spent in each stage before advancing"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.pipelineVelocity.length === 0 ? /* @__PURE__ */ jsx(EmptyState$1, {
              icon: Clock,
              title: "No velocity data",
              subtitle: "Stage transitions needed to calculate velocity"
            }) : /* @__PURE__ */ jsx("div", {
              className: "space-y-2.5",
              children: data2.pipelineVelocity.map((v) => {
                var _a2;
                const meta2 = ((_a2 = data2.stages.find((s) => s.name === v.stage)) == null ? void 0 : _a2.meta) || getStageClasses("slate");
                const maxDays = Math.max(...data2.pipelineVelocity.map((x) => x.avgDays), 1);
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 group",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-xs text-muted-foreground w-32 shrink-0 truncate text-right",
                    children: formatStage(v.stage)
                  }), /* @__PURE__ */ jsx("div", {
                    className: "flex-1 h-6 bg-muted/20 rounded-lg overflow-hidden ring-1 ring-border/20",
                    children: /* @__PURE__ */ jsx("div", {
                      className: `h-full rounded-lg ${meta2.bar} flex items-center px-2 transition-all duration-500`,
                      style: {
                        width: `${Math.max(v.avgDays / maxDays * 100, 4)}%`
                      },
                      children: /* @__PURE__ */ jsxs("span", {
                        className: "text-[10px] font-bold text-white/90 drop-shadow-sm",
                        children: [v.avgDays, "d"]
                      })
                    })
                  })]
                }, v.stage);
              })
            })
          })]
        })]
      }), data2.scoreTrend.length > 0 && /* @__PURE__ */ jsxs(Card, {
        className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(TrendingUp, {
              className: "h-4 w-4 text-muted-foreground/50"
            }), /* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Score Trend"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Average lead score over time"
            })]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "flex items-end gap-3",
            style: {
              height: 160
            },
            children: data2.scoreTrend.map((m) => {
              const maxScore = Math.max(...data2.scoreTrend.map((x) => x.avgScore), 1);
              const pct = maxScore > 0 ? m.avgScore / maxScore * 100 : 0;
              return /* @__PURE__ */ jsxs("div", {
                className: "flex-1 flex flex-col items-center gap-1 group",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  children: [m.avgScore, "pts"]
                }), /* @__PURE__ */ jsx("div", {
                  className: "flex items-end w-full",
                  style: {
                    height: 120
                  },
                  children: /* @__PURE__ */ jsx("div", {
                    className: "w-full rounded-t-md bg-orange-500/50 min-h-[3px] transition-all duration-500 group-hover:bg-orange-500/65",
                    style: {
                      height: `${Math.max(pct, 3)}%`
                    }
                  })
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-[10px] text-muted-foreground/60 whitespace-nowrap font-medium",
                  children: m.month
                })]
              }, m.month);
            })
          })
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        className: "hover:shadow-md hover:-translate-y-px transition-all duration-200",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between flex-wrap gap-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Calendar, {
                className: "h-4 w-4 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Activity Details"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-1 rounded-xl bg-muted/40 p-0.5 ring-1 ring-border/40",
              children: [/* @__PURE__ */ jsx(TabButton$1, {
                label: "Won",
                count: data2.wonHistory.length,
                active: activeTab === "won",
                onClick: () => setActiveTab("won")
              }), /* @__PURE__ */ jsx(TabButton$1, {
                label: "Lost",
                count: data2.lostHistory.length,
                active: activeTab === "lost",
                onClick: () => setActiveTab("lost")
              }), /* @__PURE__ */ jsx(TabButton$1, {
                label: "Proposals",
                count: data2.proposalHistory.length,
                active: activeTab === "proposals",
                onClick: () => setActiveTab("proposals")
              }), /* @__PURE__ */ jsx(TabButton$1, {
                label: "Contacted",
                count: data2.contactedHistory.length,
                active: activeTab === "contacted",
                onClick: () => setActiveTab("contacted")
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx(DataTable, {
            rows: tabData[activeTab],
            stages: data2.stages
          })
        })]
      })]
    })
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: analytics,
  loader: loader$x
}, Symbol.toStringTag, { value: "Module" }));
async function scoreLead(responses) {
  const criteria = await prisma.verificationCriteria.findMany({
    where: { active: true }
  });
  const criteriaMap = new Map(criteria.map((c) => [c.id, c]));
  const config = await getScoreConfig();
  const hotThreshold = (config == null ? void 0 : config.hotThreshold) ?? 80;
  const warmThreshold = (config == null ? void 0 : config.warmThreshold) ?? 50;
  let totalScore = 0;
  let totalMax = 0;
  const scored = [];
  for (const r of responses) {
    const c = criteriaMap.get(r.criteriaId);
    if (!c) continue;
    let points = 0;
    let maxForThis = 0;
    if (c.type === "YES_NO") {
      maxForThis = c.weight;
      points = r.response === "yes" ? c.weight : 0;
    } else if (c.type === "SCORE") {
      maxForThis = 5 * c.weight;
      const val = parseFloat(r.response);
      if (!isNaN(val) && val >= 1 && val <= 5) {
        points = val * c.weight;
      }
    }
    totalScore += points;
    totalMax += maxForThis;
    scored.push({ criteriaId: r.criteriaId, response: r.response, score: points });
  }
  const percentage = totalMax > 0 ? totalScore / totalMax * 100 : 0;
  let temperature;
  if (percentage >= hotThreshold) {
    temperature = "HOT";
  } else if (percentage >= warmThreshold) {
    temperature = "WARM";
  } else {
    temperature = "COLD";
  }
  return { score: totalScore, maxScore: totalMax, percentage, temperature, responses: scored };
}
async function getScoreConfig() {
  return prisma.scoreConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" }
  });
}
async function evaluateWorkflows(event, leadId, metadata) {
  try {
    const rules = await prisma.workflowRule.findMany({
      where: { triggerEvent: event, active: true },
      include: {
        actions: {
          where: { active: true },
          orderBy: { order: "asc" }
        }
      }
    });
    for (const rule of rules) {
      try {
        const conditionMatch = matchesCondition(rule.triggerCondition, metadata);
        if (!conditionMatch) continue;
        const ctx = { leadId, metadata };
        const actions = rule.actions && rule.actions.length > 0 ? rule.actions : (
          // Fallback: legacy single-action rules that haven't been migrated yet
          rule.action && rule.action !== "LEGACY" ? [{ id: `legacy_${rule.id}`, ruleId: rule.id, type: rule.action, config: rule.actionConfig, order: 0, active: true, createdAt: rule.createdAt, updatedAt: rule.updatedAt }] : []
        );
        for (const actionStep of actions) {
          try {
            await executeAction(actionStep.type, actionStep.config, ctx, rule.id);
          } catch (err) {
            await logWorkflowError(rule.id, leadId, err instanceof Error ? err.message : String(err));
          }
        }
      } catch (err) {
        await logWorkflowError(rule.id, leadId, err instanceof Error ? err.message : String(err));
      }
    }
  } catch {
  }
}
function matchesCondition(condition, metadata) {
  if (!condition || Object.keys(condition).length === 0) return true;
  for (const [key, expected] of Object.entries(condition)) {
    const actual = metadata[key];
    if (actual === void 0 || actual === null) return false;
    if (String(actual) !== String(expected)) return false;
  }
  return true;
}
async function executeAction(action2, config, ctx, ruleId) {
  switch (action2) {
    case "ASSIGN_TO_USER":
      await assignToUser(config, ctx, ruleId);
      break;
    case "SEND_NOTIFICATION":
      await sendNotification(config, ctx, ruleId);
      break;
    case "UPDATE_FIELD":
      await updateField(config, ctx, ruleId);
      break;
    case "ADD_NOTE":
      await addNote(config, ctx, ruleId);
      break;
    case "SEND_EMAIL":
      await sendWorkflowEmail(config, ctx, ruleId);
      break;
    default:
      await logWorkflowError(ruleId, ctx.leadId, `Unknown action: ${action2}`);
  }
}
async function assignToUser(config, ctx, ruleId) {
  const userId = config.userId;
  if (!userId) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing userId in actionConfig");
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true } });
  if (!user) {
    await logWorkflowError(ruleId, ctx.leadId, `User not found: ${userId}`);
    return;
  }
  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { assignedToId: userId }
  });
  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "ASSIGN_TO_USER", userId, userName: user.name }
    }
  });
}
async function sendNotification(config, ctx, ruleId) {
  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "SEND_NOTIFICATION", message: String(config.message || "Workflow notification triggered") }
    }
  });
}
async function updateField(config, ctx, ruleId) {
  const field = config.field;
  const value = config.value;
  if (!field || value === void 0) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing field or value in actionConfig");
    return;
  }
  const allowedFields = /* @__PURE__ */ new Set(["stage", "status", "temperature", "leadSource", "industry", "notes"]);
  if (!allowedFields.has(field)) {
    await logWorkflowError(ruleId, ctx.leadId, `Field not allowed for update: ${field}`);
    return;
  }
  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { [field]: value }
  });
  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "UPDATE_FIELD", field, value }
    }
  });
}
async function addNote(config, ctx, ruleId) {
  const noteText = config.note;
  if (!noteText) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing note text in actionConfig");
    return;
  }
  const lead = await prisma.lead.findUnique({
    where: { id: ctx.leadId },
    select: { notes: true }
  });
  if (!lead) {
    await logWorkflowError(ruleId, ctx.leadId, "Lead not found");
    return;
  }
  const separator = lead.notes ? "\n" : "";
  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { notes: `${lead.notes || ""}${separator}[Workflow]: ${noteText}` }
  });
  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "ADD_NOTE", note: noteText }
    }
  });
}
function interpolateTemplate(template, lead) {
  const vars = {
    companyName: lead.companyName || "",
    contactName: lead.contactName || "",
    email: lead.email || "",
    industry: lead.industry || "",
    leadSource: lead.leadSource || "",
    stage: lead.stage || "",
    website: lead.website || ""
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}
async function sendWorkflowEmail(config, ctx, ruleId) {
  const fromUserId = config.fromUserId;
  const subjectTemplate = config.subject;
  const bodyTemplate = config.body;
  if (!fromUserId) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing fromUserId in actionConfig");
    return;
  }
  if (!subjectTemplate || !bodyTemplate) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing subject or body in actionConfig");
    return;
  }
  const lead = await prisma.lead.findUnique({
    where: { id: ctx.leadId },
    select: { id: true, companyName: true, contactName: true, email: true, industry: true, leadSource: true, stage: true, website: true }
  });
  if (!lead) {
    await logWorkflowError(ruleId, ctx.leadId, "Lead not found");
    return;
  }
  if (!lead.email) {
    await logWorkflowError(ruleId, ctx.leadId, `SEND_EMAIL failed: Lead "${lead.companyName}" has no email address`);
    return;
  }
  const gmailToken = await prisma.gmailToken.findUnique({ where: { userId: fromUserId } });
  if (!gmailToken) {
    const user = await prisma.user.findUnique({ where: { id: fromUserId }, select: { name: true } });
    await logWorkflowError(ruleId, ctx.leadId, `SEND_EMAIL failed: User "${(user == null ? void 0 : user.name) || fromUserId}" does not have Gmail connected`);
    return;
  }
  const subject = interpolateTemplate(subjectTemplate, lead);
  const bodyPlain = interpolateTemplate(bodyTemplate, lead);
  const htmlBody = plainTextToHtml(bodyPlain);
  try {
    const result = await sendEmail(fromUserId, {
      to: lead.email,
      subject,
      body: bodyPlain,
      htmlBody
    });
    const now = /* @__PURE__ */ new Date();
    const thread = await prisma.emailThread.create({
      data: {
        leadId: lead.id,
        gmailThreadId: result.gmailThreadId,
        subject,
        snippet: bodyPlain.substring(0, 200),
        status: "SENT",
        lastMessage: now
      }
    });
    await prisma.emailMessage.create({
      data: {
        threadId: thread.id,
        gmailMessageId: result.gmailMessageId,
        fromAddress: gmailToken.gmailAddress || "me",
        toAddress: lead.email,
        subject,
        bodyPlain,
        bodyHtml: htmlBody,
        snippet: bodyPlain.substring(0, 200),
        direction: "sent",
        sentAt: now
      }
    });
    await prisma.workflowLog.create({
      data: {
        ruleId,
        leadId: ctx.leadId,
        success: true,
        result: {
          action: "SEND_EMAIL",
          fromUserId,
          fromAddress: gmailToken.gmailAddress,
          toAddress: lead.email,
          subject
        }
      }
    });
  } catch (sendErr) {
    const errMsg = sendErr instanceof Error ? sendErr.message : String(sendErr);
    await logWorkflowError(ruleId, ctx.leadId, `SEND_EMAIL failed: ${errMsg}`);
  }
}
async function logWorkflowError(ruleId, leadId, error) {
  try {
    await prisma.workflowLog.create({
      data: {
        ruleId,
        leadId,
        success: false,
        error: error.slice(0, 500)
      }
    });
  } catch {
  }
}
async function logActivity(input) {
  const log = await prisma.activityLog.create({
    data: {
      leadId: input.leadId,
      userId: input.userId,
      action: input.action,
      description: input.description,
      metadata: input.metadata
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  evaluateWorkflows(input.action, input.leadId, input.metadata ?? {}).catch(() => {
  });
  return log;
}
async function loader$w({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  const status = url.searchParams.get("status") || "INBOX";
  const tempFilter = url.searchParams.get("temp") || "";
  const leads = await prisma.lead.findMany({
    where: {
      status,
      ...tempFilter ? {
        temperature: tempFilter
      } : {},
      ...search ? {
        OR: [{
          companyName: {
            contains: search
          }
        }, {
          email: {
            contains: search
          }
        }, {
          contactName: {
            contains: search
          }
        }, {
          industry: {
            contains: search
          }
        }]
      } : {}
    },
    orderBy: {
      score: "desc"
    },
    include: {
      criteriaResponses: {
        include: {
          criteria: true
        }
      }
    }
  });
  const criteria = await prisma.verificationCriteria.findMany({
    where: {
      active: true
    },
    orderBy: {
      sortOrder: "asc"
    }
  });
  const stages = await getStagesWithMeta();
  return {
    user,
    leads,
    search,
    status,
    tempFilter,
    criteria,
    stages
  };
}
async function action$o({
  request
}) {
  const userId = await requireAuth(request);
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      role: true
    }
  });
  if ((currentUser == null ? void 0 : currentUser.role) !== "ADMIN") {
    throw new Response("Forbidden", {
      status: 403
    });
  }
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "create") {
    const email = formData.get("email");
    const existing = await prisma.lead.findUnique({
      where: {
        email
      }
    });
    if (existing) {
      return {
        error: "A lead with this email already exists."
      };
    }
    const criteriaIds = formData.getAll("criteriaId");
    const responses = [];
    for (const cid of criteriaIds) {
      const resp = formData.get(`response_${cid}`);
      if (resp) responses.push({
        criteriaId: cid,
        response: resp
      });
    }
    const result = await scoreLead(responses);
    const lead = await prisma.lead.create({
      data: {
        companyName: formData.get("companyName"),
        website: formData.get("website") || null,
        contactName: formData.get("contactName") || null,
        email,
        industry: formData.get("industry") || null,
        estimatedTraffic: formData.get("estimatedTraffic") || null,
        techStack: formData.get("techStack") || null,
        linkedin: formData.get("linkedin") || null,
        facebook: formData.get("facebook") || null,
        instagram: formData.get("instagram") || null,
        twitter: formData.get("twitter") || null,
        leadSource: formData.get("leadSource") || null,
        notes: formData.get("notes") || null,
        score: result.score,
        maxScore: result.maxScore,
        temperature: result.temperature,
        createdById: userId
      }
    });
    if (responses.length > 0) {
      await prisma.$transaction(result.responses.map((r) => prisma.leadVerification.create({
        data: {
          leadId: lead.id,
          criteriaId: r.criteriaId,
          response: r.response,
          score: r.score
        }
      })));
    }
    await logActivity({
      leadId: lead.id,
      userId,
      action: "LEAD_CREATED",
      description: `${currentUser.name || "Unknown"} added this lead`,
      metadata: {
        temperature: result.temperature,
        score: result.score,
        percentage: result.percentage
      }
    });
    return {
      success: true,
      temperature: result.temperature,
      score: result.score,
      maxScore: result.maxScore
    };
  }
  if (intent === "accept") {
    const leadId = formData.get("leadId");
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId
      },
      select: {
        companyName: true
      }
    });
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        status: "ACTIVE",
        approvedById: userId,
        rejectedById: null
      }
    });
    await logActivity({
      leadId,
      userId,
      action: "LEAD_APPROVED",
      description: `${currentUser.name || "Unknown"} approved this lead`
    });
    return {
      success: true,
      message: `${lead == null ? void 0 : lead.companyName} approved`
    };
  }
  if (intent === "reject") {
    const leadId = formData.get("leadId");
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId
      },
      select: {
        companyName: true
      }
    });
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        status: "REJECTED",
        rejectedById: userId,
        approvedById: null
      }
    });
    await logActivity({
      leadId,
      userId,
      action: "LEAD_REJECTED",
      description: `${currentUser.name || "Unknown"} rejected this lead`
    });
    return {
      success: true,
      message: `${lead == null ? void 0 : lead.companyName} rejected`
    };
  }
  return {};
}
const inbox = UNSAFE_withComponentProps(function Inbox2() {
  const {
    user,
    leads,
    search,
    status,
    tempFilter,
    criteria,
    stages
  } = useLoaderData();
  const actionData = useActionData();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdmin = (user == null ? void 0 : user.role) === "ADMIN";
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Lead Inbox"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: isAdmin ? "Manage and review scored leads" : "View scored leads"
          })]
        }), isAdmin && /* @__PURE__ */ jsx(Link, {
          to: "/leads/new",
          children: /* @__PURE__ */ jsxs(Button, {
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "mr-2 h-4 w-4"
            }), "Add Lead"]
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative flex-1",
          children: [/* @__PURE__ */ jsx(Search, {
            className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          }), /* @__PURE__ */ jsx(Input, {
            placeholder: "Search leads...",
            className: "pl-9",
            value: search,
            onChange: (e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value) params.set("q", e.target.value);
              else params.delete("q");
              setSearchParams(params);
            }
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-wrap gap-2",
          children: [{
            key: "INBOX",
            label: "Inbox",
            activeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30"
          }, {
            key: "ACTIVE",
            label: "Active",
            activeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          }, {
            key: "REJECTED",
            label: "Rejected",
            activeClass: "bg-red-500/20 text-red-400 border-red-500/30"
          }].map((s) => /* @__PURE__ */ jsx(Button, {
            variant: "outline",
            size: "sm",
            className: status === s.key ? s.activeClass : "",
            onClick: () => {
              const params = new URLSearchParams(searchParams);
              params.set("status", s.key);
              setSearchParams(params);
            },
            children: s.label
          }, s.key))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex gap-2",
        children: [/* @__PURE__ */ jsx("span", {
          className: "flex items-center text-sm text-muted-foreground",
          children: "Temperature:"
        }), [{
          key: "",
          label: "All",
          activeClass: "bg-violet-500/20 text-violet-400 border-violet-500/30"
        }, {
          key: "HOT",
          label: "Hot",
          activeClass: "bg-red-500/20 text-red-400 border-red-500/30"
        }, {
          key: "WARM",
          label: "Warm",
          activeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30"
        }, {
          key: "COLD",
          label: "Cold",
          activeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        }].map((v) => /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "sm",
          className: tempFilter === v.key ? v.activeClass : "",
          onClick: () => {
            const params = new URLSearchParams(searchParams);
            if (v.key) params.set("temp", v.key);
            else params.delete("temp");
            setSearchParams(params);
          },
          children: v.label
        }, v.key || "all"))]
      }), (actionData == null ? void 0 : actionData.success) && (actionData == null ? void 0 : actionData.temperature) && /* @__PURE__ */ jsxs("div", {
        className: `rounded-md p-3 text-sm border ${actionData.temperature === "HOT" ? "bg-red-500/10 text-red-400 border-red-500/20" : actionData.temperature === "WARM" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`,
        children: ["Lead added! Score: ", actionData.score, "/", actionData.maxScore, " — ", /* @__PURE__ */ jsx("strong", {
          children: actionData.temperature
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "rounded-lg border",
        children: /* @__PURE__ */ jsx("div", {
          className: "overflow-x-auto",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-sm",
            children: [/* @__PURE__ */ jsx("thead", {
              children: /* @__PURE__ */ jsxs("tr", {
                className: "border-b bg-muted/50",
                children: [/* @__PURE__ */ jsx("th", {
                  className: "px-4 py-3 text-left font-medium text-muted-foreground",
                  children: "Company"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-3 text-left font-medium text-muted-foreground",
                  children: "Contact"
                }), /* @__PURE__ */ jsx("th", {
                  className: "hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell",
                  children: "Email"
                }), /* @__PURE__ */ jsx("th", {
                  className: "hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell",
                  children: "Industry"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-3 text-left font-medium text-muted-foreground",
                  children: "Score"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-3 text-left font-medium text-muted-foreground",
                  children: "Temp"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-3 text-left font-medium text-muted-foreground",
                  children: "Stage"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-3 text-right font-medium text-muted-foreground",
                  children: "Actions"
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              children: leads.length === 0 ? /* @__PURE__ */ jsx("tr", {
                children: /* @__PURE__ */ jsx("td", {
                  colSpan: 8,
                  className: "px-4 py-12 text-center text-muted-foreground",
                  children: "No leads found. Add one to get started."
                })
              }) : leads.map((lead) => /* @__PURE__ */ jsx(LeadRow, {
                lead,
                isAdmin,
                stages
              }, lead.id))
            })]
          })
        })
      })]
    })
  });
});
function StageBadge$1({
  stage,
  stages
}) {
  var _a;
  const meta2 = (_a = stages.find((s) => s.name === stage)) == null ? void 0 : _a.meta;
  const bg = (meta2 == null ? void 0 : meta2.bg) ?? "bg-slate-400/10";
  const text = (meta2 == null ? void 0 : meta2.text) ?? "text-slate-300";
  const border = (meta2 == null ? void 0 : meta2.border) ?? "border-slate-400/20";
  return /* @__PURE__ */ jsx("span", {
    className: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${bg} ${text} ${border}`,
    children: stage.replace(/_/g, " ")
  });
}
function TemperatureBadge$2({
  temperature
}) {
  const config = {
    HOT: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20",
      icon: Flame
    },
    WARM: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: Sun
    },
    COLD: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      icon: Snowflake
    }
  };
  const c = config[temperature] || config.COLD;
  const Icon = c.icon;
  return /* @__PURE__ */ jsxs("span", {
    className: `inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: "h-3 w-3"
    }), temperature]
  });
}
function LeadRow({
  lead,
  isAdmin,
  stages
}) {
  const [expanded, setExpanded] = useState(false);
  const responses = lead.criteriaResponses || [];
  const hasScores = responses.length > 0;
  const pct = lead.maxScore > 0 ? Math.round(lead.score / lead.maxScore * 100) : 0;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("tr", {
      className: "border-b transition-colors hover:bg-muted/30",
      children: [/* @__PURE__ */ jsxs("td", {
        className: "px-4 py-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "font-medium",
          children: lead.companyName
        }), lead.website && /* @__PURE__ */ jsx("div", {
          className: "text-xs text-muted-foreground",
          children: lead.website
        })]
      }), /* @__PURE__ */ jsx("td", {
        className: "px-4 py-3",
        children: lead.contactName || "—"
      }), /* @__PURE__ */ jsx("td", {
        className: "hidden px-4 py-3 md:table-cell",
        children: lead.email
      }), /* @__PURE__ */ jsx("td", {
        className: "hidden px-4 py-3 lg:table-cell",
        children: lead.industry && /* @__PURE__ */ jsx("span", {
          className: "inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0 text-xs text-blue-400",
          children: lead.industry
        })
      }), /* @__PURE__ */ jsx("td", {
        className: "px-4 py-3",
        children: /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: () => hasScores && setExpanded(!expanded),
          className: `flex items-center gap-2 ${hasScores ? "cursor-pointer hover:opacity-80" : ""}`,
          children: [hasScores && (expanded ? /* @__PURE__ */ jsx(ChevronDown, {
            className: "h-3.5 w-3.5 text-muted-foreground"
          }) : /* @__PURE__ */ jsx(ChevronRight, {
            className: "h-3.5 w-3.5 text-muted-foreground"
          })), /* @__PURE__ */ jsxs("span", {
            className: "font-mono text-sm font-bold",
            children: [Math.round(lead.score), "/", Math.round(lead.maxScore)]
          }), /* @__PURE__ */ jsx("div", {
            className: "h-2 w-16 rounded-full bg-muted overflow-hidden",
            children: /* @__PURE__ */ jsx("div", {
              className: `h-full rounded-full ${pct >= 80 ? "bg-red-400" : pct >= 50 ? "bg-amber-400" : "bg-blue-400"}`,
              style: {
                width: `${pct}%`
              }
            })
          })]
        })
      }), /* @__PURE__ */ jsx("td", {
        className: "px-4 py-3",
        children: /* @__PURE__ */ jsx(TemperatureBadge$2, {
          temperature: lead.temperature
        })
      }), /* @__PURE__ */ jsx("td", {
        className: "px-4 py-3",
        children: /* @__PURE__ */ jsx(StageBadge$1, {
          stage: lead.stage,
          stages
        })
      }), /* @__PURE__ */ jsx("td", {
        className: "px-4 py-3",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-end gap-1",
          children: [isAdmin && lead.status === "INBOX" && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs(Form, {
              method: "post",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "accept"
              }), /* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "leadId",
                value: lead.id
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                size: "icon",
                variant: "ghost",
                title: "Accept lead",
                children: /* @__PURE__ */ jsx(CheckCircle2, {
                  className: "h-4 w-4 text-emerald-400"
                })
              })]
            }), /* @__PURE__ */ jsxs(Form, {
              method: "post",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "reject"
              }), /* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "leadId",
                value: lead.id
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                size: "icon",
                variant: "ghost",
                title: "Reject lead",
                children: /* @__PURE__ */ jsx(XCircle, {
                  className: "h-4 w-4 text-red-400"
                })
              })]
            })]
          }), isAdmin && /* @__PURE__ */ jsx(Link, {
            to: `/verification/${lead.id}`,
            children: /* @__PURE__ */ jsx(Button, {
              size: "icon",
              variant: "ghost",
              title: "Re-score lead",
              children: /* @__PURE__ */ jsx(ShieldCheck, {
                className: "h-4 w-4 text-violet-400"
              })
            })
          }), /* @__PURE__ */ jsx(Link, {
            to: `/leads/${lead.id}/emails`,
            children: /* @__PURE__ */ jsx(Button, {
              size: "icon",
              variant: "ghost",
              title: "Email lead",
              children: /* @__PURE__ */ jsx(ExternalLink, {
                className: "h-4 w-4"
              })
            })
          })]
        })
      })]
    }), expanded && hasScores && /* @__PURE__ */ jsx("tr", {
      className: "border-b bg-muted/20",
      children: /* @__PURE__ */ jsx("td", {
        colSpan: 8,
        className: "px-6 py-3",
        children: /* @__PURE__ */ jsxs("div", {
          className: "space-y-1.5",
          children: [/* @__PURE__ */ jsxs("p", {
            className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2",
            children: ["Score Breakdown — ", pct, "%"]
          }), responses.map((r) => {
            var _a;
            const isPositive = r.response === "yes" || Number(r.response) >= 4;
            const isNegative = r.response === "no" || Number(r.response) <= 2;
            return /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 text-xs",
              children: [/* @__PURE__ */ jsxs("span", {
                className: `shrink-0 font-mono font-bold w-10 text-right ${isPositive ? "text-emerald-400" : isNegative ? "text-red-400" : "text-amber-400"}`,
                children: ["+", r.score, "pt"]
              }), /* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground",
                children: ((_a = r.criteria) == null ? void 0 : _a.name) || "Criterion"
              }), /* @__PURE__ */ jsx("span", {
                className: `ml-auto rounded-md px-1.5 py-0.5 font-medium ${isPositive ? "bg-emerald-500/15 text-emerald-400" : isNegative ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`,
                children: r.response === "yes" ? "Yes" : r.response === "no" ? "No" : r.response
              })]
            }, r.id);
          })]
        })
      })
    })]
  });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$o,
  default: inbox,
  loader: loader$w
}, Symbol.toStringTag, { value: "Module" }));
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
function isSafeUrl(url) {
  return /^https?:\/\//i.test(url);
}
async function loader$v({
  request,
  params
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true,
      gmailTokens: true
    }
  });
  const lead = await prisma.lead.findUnique({
    where: {
      id: params.leadId
    },
    include: {
      emails: {
        orderBy: {
          lastMessage: "desc"
        },
        take: 3
      },
      stageHistory: {
        orderBy: {
          changedAt: "desc"
        },
        include: {
          changedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      activityLogs: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        take: 50
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      rejectedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!lead) {
    throw new Response("Lead not found", {
      status: 404
    });
  }
  const users2 = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
    orderBy: {
      name: "asc"
    }
  });
  const stages = await getStagesWithMeta();
  return {
    user,
    lead,
    users: users2,
    stages,
    gmailConnected: !!(user == null ? void 0 : user.gmailTokens)
  };
}
async function action$n({
  request
}) {
  var _a;
  const userId = await requireAuth(request);
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      role: true
    }
  });
  const formData = await request.formData();
  const intent = formData.get("intent");
  const leadId = formData.get("leadId");
  if (intent === "sendEmail") {
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId
      }
    });
    const subject = formData.get("subject");
    const body = formData.get("body");
    if (!(lead == null ? void 0 : lead.email)) {
      return {
        error: "This lead has no email address."
      };
    }
    if (!(subject == null ? void 0 : subject.trim()) || !(body == null ? void 0 : body.trim())) {
      return {
        error: "Subject and body are required."
      };
    }
    try {
      const signature = await getGmailSignature(userId);
      const htmlBody = buildHtmlEmail(body, signature);
      const result = await sendEmail(userId, {
        to: lead.email,
        subject,
        body,
        htmlBody
      });
      const now = /* @__PURE__ */ new Date();
      const gmailToken = await prisma.gmailToken.findUnique({
        where: {
          userId
        }
      });
      const thread = await prisma.emailThread.create({
        data: {
          leadId: lead.id,
          gmailThreadId: result.gmailThreadId,
          subject,
          snippet: body.substring(0, 200),
          status: "SENT",
          lastMessage: now
        }
      });
      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: (gmailToken == null ? void 0 : gmailToken.gmailAddress) || "me",
          toAddress: lead.email,
          subject,
          bodyPlain: body,
          bodyHtml: htmlBody,
          snippet: body.substring(0, 200),
          direction: "sent",
          sentAt: now
        }
      });
      await logActivity({
        leadId,
        userId,
        action: "NOTE_ADDED",
        description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} sent an email: "${subject}"`
      });
      return {
        success: true,
        sentSubject: subject
      };
    } catch (err) {
      const message = ((_a = err == null ? void 0 : err.message) == null ? void 0 : _a.includes("has not connected Gmail")) ? "Gmail is not connected. Go to Settings to connect your account." : (err == null ? void 0 : err.message) || "Failed to send email.";
      return {
        error: message
      };
    }
  }
  if (intent === "updateNotes") {
    const notes = formData.get("notes");
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        notes
      }
    });
    await logActivity({
      leadId,
      userId,
      action: "NOTE_ADDED",
      description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} updated notes`
    });
    return {
      success: true
    };
  }
  if (intent === "assignLead") {
    const assignedToId = formData.get("assignedToId") || null;
    const assignedUser = assignedToId ? await prisma.user.findUnique({
      where: {
        id: assignedToId
      },
      select: {
        name: true
      }
    }) : null;
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        assignedToId
      }
    });
    if (assignedToId && assignedUser) {
      await logActivity({
        leadId,
        userId,
        action: "LEAD_ASSIGNED",
        description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} assigned to ${assignedUser.name}`,
        metadata: {
          assignedToId,
          assignedToName: assignedUser.name
        }
      });
    } else {
      await logActivity({
        leadId,
        userId,
        action: "LEAD_UNASSIGNED",
        description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} removed assignment`
      });
    }
    return {
      success: true
    };
  }
  if (intent === "editLead") {
    if ((currentUser == null ? void 0 : currentUser.role) !== "ADMIN") {
      return {
        error: "Only admins can edit leads."
      };
    }
    const oldLead = await prisma.lead.findUnique({
      where: {
        id: leadId
      }
    });
    if (!oldLead) {
      return {
        error: "Lead not found."
      };
    }
    const data2 = {
      companyName: formData.get("companyName"),
      contactName: formData.get("contactName") || null,
      email: formData.get("email"),
      website: formData.get("website") || null,
      industry: formData.get("industry") || null,
      estimatedTraffic: formData.get("estimatedTraffic") || null,
      techStack: formData.get("techStack") || null,
      leadSource: formData.get("leadSource") || null,
      linkedin: formData.get("linkedin") || null,
      facebook: formData.get("facebook") || null,
      instagram: formData.get("instagram") || null,
      twitter: formData.get("twitter") || null,
      notes: formData.get("notes") || null,
      temperature: formData.get("temperature") || oldLead.temperature,
      stage: formData.get("stage") || oldLead.stage,
      status: formData.get("status") || oldLead.status
    };
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: data2
    });
    if (oldLead.stage !== data2.stage) {
      await prisma.stageHistory.create({
        data: {
          leadId,
          fromStage: oldLead.stage,
          toStage: data2.stage,
          changedById: userId
        }
      });
    }
    await logActivity({
      leadId,
      userId,
      action: "LEAD_EDITED",
      description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} edited lead details`
    });
    return {
      success: true
    };
  }
  return {};
}
const inbox_$leadId = UNSAFE_withComponentProps(function LeadDetail() {
  var _a;
  const {
    user,
    lead,
    users: users2,
    stages,
    gmailConnected
  } = useLoaderData();
  const actionData = useActionData();
  const isAdmin = (user == null ? void 0 : user.role) === "ADMIN";
  const [editing, setEditing] = useState(false);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/inbox",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold",
              children: lead.companyName
            }), /* @__PURE__ */ jsx(StatusBadge$2, {
              status: lead.status
            }), /* @__PURE__ */ jsx(StageBadge, {
              stage: lead.stage,
              stages
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: lead.email
          })]
        })]
      }), /* @__PURE__ */ jsx(Card, {
        className: "border-l-4 border-l-violet-500",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-4",
          children: /* @__PURE__ */ jsxs("div", {
            className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
            children: [lead.createdBy && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10",
                children: /* @__PURE__ */ jsx(UserPlus, {
                  className: "h-4 w-4 text-green-500"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "Added by"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium",
                  children: lead.createdBy.name || lead.createdBy.email
                })]
              })]
            }), lead.approvedBy && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10",
                children: /* @__PURE__ */ jsx(CheckCircle, {
                  className: "h-4 w-4 text-emerald-500"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "Approved by"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium",
                  children: lead.approvedBy.name || lead.approvedBy.email
                })]
              })]
            }), lead.rejectedBy && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10",
                children: /* @__PURE__ */ jsx(XCircle, {
                  className: "h-4 w-4 text-red-500"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "Rejected by"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium",
                  children: lead.rejectedBy.name || lead.rejectedBy.email
                })]
              })]
            }), lead.assignedTo && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10",
                children: /* @__PURE__ */ jsx(User, {
                  className: "h-4 w-4 text-purple-500"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "Assigned to"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium",
                  children: lead.assignedTo.name || lead.assignedTo.email
                })]
              })]
            })]
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-3",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-2 space-y-6",
          children: [/* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsx(CardTitle, {
                  children: "Lead Details"
                }), isAdmin && /* @__PURE__ */ jsx(Button, {
                  variant: editing ? "default" : "outline",
                  size: "sm",
                  onClick: () => setEditing(!editing),
                  className: "h-7 gap-1.5",
                  children: editing ? /* @__PURE__ */ jsxs(Fragment, {
                    children: [/* @__PURE__ */ jsx(XCircle, {
                      className: "h-3.5 w-3.5"
                    }), " Cancel"]
                  }) : /* @__PURE__ */ jsxs(Fragment, {
                    children: [/* @__PURE__ */ jsx(Pencil, {
                      className: "h-3.5 w-3.5"
                    }), " Edit"]
                  })
                })]
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              children: editing ? /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "space-y-4",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "editLead"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "leadId",
                  value: lead.id
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-3 sm:grid-cols-3",
                  children: [/* @__PURE__ */ jsx(Field$1, {
                    label: "Temperature",
                    name: "temperature",
                    type: "select",
                    defaultValue: lead.temperature,
                    options: [{
                      value: "HOT",
                      label: "Hot"
                    }, {
                      value: "WARM",
                      label: "Warm"
                    }, {
                      value: "COLD",
                      label: "Cold"
                    }]
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Stage",
                    name: "stage",
                    type: "select",
                    defaultValue: lead.stage,
                    options: stages.map((s) => ({
                      value: s.name,
                      label: s.label
                    }))
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Status",
                    name: "status",
                    type: "select",
                    defaultValue: lead.status,
                    options: [{
                      value: "INBOX",
                      label: "Inbox"
                    }, {
                      value: "ACTIVE",
                      label: "Active"
                    }, {
                      value: "REJECTED",
                      label: "Rejected"
                    }]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-3 sm:grid-cols-2",
                  children: [/* @__PURE__ */ jsx(Field$1, {
                    label: "Company Name",
                    name: "companyName",
                    defaultValue: lead.companyName,
                    required: true
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Contact Name",
                    name: "contactName",
                    defaultValue: lead.contactName || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Email",
                    name: "email",
                    type: "email",
                    defaultValue: lead.email,
                    required: true
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Website",
                    name: "website",
                    defaultValue: lead.website || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Industry",
                    name: "industry",
                    defaultValue: lead.industry || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Est. Traffic",
                    name: "estimatedTraffic",
                    defaultValue: lead.estimatedTraffic || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Tech Stack",
                    name: "techStack",
                    defaultValue: lead.techStack || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Lead Source",
                    name: "leadSource",
                    defaultValue: lead.leadSource || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "LinkedIn",
                    name: "linkedin",
                    defaultValue: lead.linkedin || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Facebook",
                    name: "facebook",
                    defaultValue: lead.facebook || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Instagram",
                    name: "instagram",
                    defaultValue: lead.instagram || ""
                  }), /* @__PURE__ */ jsx(Field$1, {
                    label: "Twitter / X",
                    name: "twitter",
                    defaultValue: lead.twitter || ""
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx(Label, {
                    className: "text-xs text-muted-foreground",
                    children: "Notes"
                  }), /* @__PURE__ */ jsx(Textarea, {
                    name: "notes",
                    rows: 4,
                    defaultValue: lead.notes || ""
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-end gap-2 pt-1",
                  children: [/* @__PURE__ */ jsx(Button, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => setEditing(false),
                    children: "Cancel"
                  }), /* @__PURE__ */ jsxs(Button, {
                    type: "submit",
                    size: "sm",
                    className: "gap-1.5",
                    children: [/* @__PURE__ */ jsx(Save, {
                      className: "h-3.5 w-3.5"
                    }), "Save Changes"]
                  })]
                })]
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "mb-4 flex items-center gap-3",
                  children: [/* @__PURE__ */ jsx(StatusBadge$2, {
                    status: lead.status
                  }), /* @__PURE__ */ jsx(StageBadge, {
                    stage: lead.stage,
                    stages
                  }), /* @__PURE__ */ jsx(TemperatureBadge$1, {
                    temperature: lead.temperature
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "text-sm text-muted-foreground",
                    children: ["Score: ", Math.round(lead.score), "/", Math.round(lead.maxScore)]
                  })]
                }), /* @__PURE__ */ jsx("dl", {
                  className: "grid gap-4 sm:grid-cols-2",
                  children: [["Company", lead.companyName], ["Website", lead.website], ["Contact", lead.contactName], ["Email", lead.email], ["Industry", lead.industry], ["Est. Traffic", lead.estimatedTraffic], ["Tech Stack", lead.techStack], ["Lead Source", lead.leadSource]].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("dt", {
                      className: "text-sm font-medium text-muted-foreground",
                      children: label
                    }), /* @__PURE__ */ jsx("dd", {
                      className: "mt-1 text-sm",
                      children: value || "—"
                    })]
                  }, label))
                }), (lead.linkedin || lead.facebook || lead.instagram || lead.twitter) && /* @__PURE__ */ jsxs("div", {
                  className: "mt-4 pt-4 border-t border-border",
                  children: [/* @__PURE__ */ jsx("dt", {
                    className: "text-sm font-medium text-muted-foreground mb-2",
                    children: "Social Profiles"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-wrap gap-2",
                    children: [lead.linkedin && isSafeUrl(lead.linkedin) && /* @__PURE__ */ jsxs("a", {
                      href: lead.linkedin,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors",
                      children: [/* @__PURE__ */ jsx(Linkedin, {
                        className: "h-3.5 w-3.5"
                      }), " LinkedIn"]
                    }), lead.facebook && isSafeUrl(lead.facebook) && /* @__PURE__ */ jsxs("a", {
                      href: lead.facebook,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors",
                      children: [/* @__PURE__ */ jsx(Facebook, {
                        className: "h-3.5 w-3.5"
                      }), " Facebook"]
                    }), lead.instagram && isSafeUrl(lead.instagram) && /* @__PURE__ */ jsxs("a", {
                      href: lead.instagram,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-1.5 rounded-md border border-pink-500/20 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 hover:bg-pink-500/20 transition-colors",
                      children: [/* @__PURE__ */ jsx(Instagram, {
                        className: "h-3.5 w-3.5"
                      }), " Instagram"]
                    }), lead.twitter && isSafeUrl(lead.twitter) && /* @__PURE__ */ jsxs("a", {
                      href: lead.twitter,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-1.5 rounded-md border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition-colors",
                      children: [/* @__PURE__ */ jsx(Twitter, {
                        className: "h-3.5 w-3.5"
                      }), " Twitter / X"]
                    })]
                  })]
                })]
              })
            })]
          }), /* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Activity, {
                  className: "h-4 w-4"
                }), "Activity Log"]
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              children: lead.activityLogs.length === 0 ? /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "No activity recorded yet."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-3",
                children: lead.activityLogs.map((log) => {
                  const style = getActivityStyle(log.action);
                  return /* @__PURE__ */ jsxs("div", {
                    className: "flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bgColor}`,
                      children: /* @__PURE__ */ jsx("span", {
                        className: `text-sm font-bold ${style.textColor}`,
                        children: style.icon
                      })
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex-1 min-w-0",
                      children: [/* @__PURE__ */ jsx("p", {
                        className: "text-sm",
                        children: log.description
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
                        children: [/* @__PURE__ */ jsx(Clock, {
                          className: "h-3 w-3"
                        }), new Date(log.createdAt).toLocaleString()]
                      })]
                    })]
                  }, log.id);
                })
              })
            })]
          }), /* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsx(CardTitle, {
                children: "Stage History"
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              children: lead.stageHistory.length === 0 ? /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "No stage changes recorded."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-3",
                children: lead.stageHistory.map((h) => {
                  var _a2;
                  return /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-3 text-sm",
                    children: [/* @__PURE__ */ jsx(Badge, {
                      variant: "outline",
                      className: "shrink-0",
                      children: ((_a2 = h.fromStage) == null ? void 0 : _a2.replace(/_/g, " ")) || "New"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-muted-foreground",
                      children: "→"
                    }), /* @__PURE__ */ jsx(Badge, {
                      children: h.toStage.replace(/_/g, " ")
                    }), h.changedBy && /* @__PURE__ */ jsxs("span", {
                      className: "text-xs text-muted-foreground",
                      children: ["by ", h.changedBy.name || h.changedBy.email]
                    }), /* @__PURE__ */ jsx("span", {
                      className: "ml-auto text-xs text-muted-foreground",
                      children: new Date(h.changedAt).toLocaleDateString()
                    })]
                  }, h.id);
                })
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-6",
          children: [isAdmin && /* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(User, {
                  className: "h-4 w-4"
                }), "Assignment"]
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              children: /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "assignLead"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "leadId",
                  value: lead.id
                }), /* @__PURE__ */ jsxs("select", {
                  name: "assignedToId",
                  className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  defaultValue: ((_a = lead.assignedTo) == null ? void 0 : _a.id) || "",
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "",
                    children: "Unassigned"
                  }), users2.map((u) => /* @__PURE__ */ jsxs("option", {
                    value: u.id,
                    children: [u.name || u.email, " (", u.role, ")"]
                  }, u.id))]
                }), /* @__PURE__ */ jsx(Button, {
                  type: "submit",
                  size: "sm",
                  className: "w-full",
                  children: "Update Assignment"
                })]
              })
            })]
          }), /* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Mail, {
                  className: "h-4 w-4"
                }), "Contact Lead"]
              })
            }), /* @__PURE__ */ jsxs(CardContent, {
              children: [!gmailConnected ? /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs text-amber-400",
                  children: "Connect Gmail in Settings to send emails directly."
                }), /* @__PURE__ */ jsx(Link, {
                  to: "/settings",
                  children: /* @__PURE__ */ jsx(Button, {
                    variant: "outline",
                    size: "sm",
                    className: "w-full",
                    children: "Go to Settings"
                  })
                })]
              }) : !lead.email ? /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "No email address on file for this lead."
              }) : /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "sendEmail"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "leadId",
                  value: lead.id
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    children: "To"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm rounded-md bg-muted/50 px-3 py-1.5 truncate",
                    children: lead.email
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx(Label, {
                    className: "text-xs",
                    children: "Subject"
                  }), /* @__PURE__ */ jsx(Input, {
                    name: "subject",
                    placeholder: "Email subject...",
                    required: true,
                    className: "text-sm"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx(Label, {
                    className: "text-xs",
                    children: "Message"
                  }), /* @__PURE__ */ jsx(Textarea, {
                    name: "body",
                    placeholder: "Write your message...",
                    rows: 5,
                    required: true,
                    className: "text-sm"
                  })]
                }), (actionData == null ? void 0 : actionData.sentSubject) && /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-emerald-400",
                  children: ['Sent: "', actionData.sentSubject, '"']
                }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-destructive",
                  children: actionData.error
                }), /* @__PURE__ */ jsxs(Button, {
                  type: "submit",
                  size: "sm",
                  className: "w-full",
                  children: [/* @__PURE__ */ jsx(Send, {
                    className: "mr-2 h-3 w-3"
                  }), "Send Email"]
                })]
              }), lead.emails.length > 0 && /* @__PURE__ */ jsx("div", {
                className: "mt-3 pt-3 border-t border-border/50",
                children: /* @__PURE__ */ jsxs(Link, {
                  to: `/leads/${lead.id}/emails`,
                  className: "text-xs text-violet-400 hover:underline flex items-center gap-1",
                  children: ["View all email history (", lead.emails.length, ")", /* @__PURE__ */ jsx(ArrowLeft, {
                    className: "h-3 w-3 rotate-180"
                  })]
                })
              })]
            })]
          }), !editing && /* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsx(CardTitle, {
                children: "Notes"
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              children: isAdmin ? /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "updateNotes"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "leadId",
                  value: lead.id
                }), /* @__PURE__ */ jsx(Textarea, {
                  name: "notes",
                  rows: 6,
                  defaultValue: lead.notes || "",
                  placeholder: "Add notes about this lead..."
                }), /* @__PURE__ */ jsx(Button, {
                  type: "submit",
                  size: "sm",
                  className: "w-full",
                  children: "Save Notes"
                })]
              }) : /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground whitespace-pre-wrap",
                children: lead.notes || "No notes."
              })
            })]
          })]
        })]
      })]
    })
  });
});
function StatusBadge$2({
  status
}) {
  const config = {
    INBOX: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20"
    },
    ACTIVE: {
      classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
    },
    REJECTED: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20"
    }
  };
  const c = config[status] || config.INBOX;
  return /* @__PURE__ */ jsx("span", {
    className: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
    children: status
  });
}
function StageBadge({
  stage,
  stages
}) {
  var _a;
  const meta2 = (_a = stages.find((s) => s.name === stage)) == null ? void 0 : _a.meta;
  const classes = meta2 ? `${meta2.bg} ${meta2.text}` : "bg-muted text-muted-foreground";
  return /* @__PURE__ */ jsx("span", {
    className: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${classes}`,
    children: formatStage(stage)
  });
}
function TemperatureBadge$1({
  temperature
}) {
  const config = {
    HOT: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20",
      icon: "🔥"
    },
    WARM: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: "☀️"
    },
    COLD: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      icon: "❄️"
    }
  };
  const c = config[temperature] || config.COLD;
  return /* @__PURE__ */ jsxs("span", {
    className: `inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
    children: [c.icon, " ", temperature]
  });
}
function Field$1({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  options
}) {
  if (type === "select" && options) {
    return /* @__PURE__ */ jsxs("div", {
      className: "space-y-1.5",
      children: [/* @__PURE__ */ jsx(Label, {
        className: "text-xs text-muted-foreground",
        children: label
      }), /* @__PURE__ */ jsx("select", {
        name,
        defaultValue,
        className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        children: options.map((o) => /* @__PURE__ */ jsx("option", {
          value: o.value,
          children: o.label
        }, o.value))
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-1.5",
    children: [/* @__PURE__ */ jsx(Label, {
      className: "text-xs text-muted-foreground",
      children: label
    }), /* @__PURE__ */ jsx(Input, {
      name,
      type,
      defaultValue,
      required,
      className: "h-9 text-sm"
    })]
  });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$n,
  default: inbox_$leadId,
  loader: loader$v
}, Symbol.toStringTag, { value: "Module" }));
async function loader$u({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  let criteria = [];
  try {
    criteria = await prisma.verificationCriteria.findMany({
      where: {
        active: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    });
  } catch (err) {
    console.error("[leads/new] Failed to load criteria:", err);
  }
  return {
    user,
    criteria
  };
}
async function action$m({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true
    }
  });
  const formData = await request.formData();
  const email = formData.get("email");
  const existing = await prisma.lead.findUnique({
    where: {
      email
    }
  });
  if (existing) {
    return {
      error: `A lead with this email already exists. (${existing.companyName})`
    };
  }
  const criteriaIds = formData.getAll("criteriaId");
  const responses = [];
  for (const cid of criteriaIds) {
    const resp = formData.get(`response_${cid}`);
    if (resp) responses.push({
      criteriaId: cid,
      response: resp
    });
  }
  let result;
  try {
    result = await scoreLead(responses);
  } catch (err) {
    console.error("[leads/new] Scoring failed:", err);
    return {
      error: "Failed to score lead. Please try again."
    };
  }
  const lead = await prisma.lead.create({
    data: {
      companyName: formData.get("companyName"),
      website: formData.get("website") || null,
      contactName: formData.get("contactName") || null,
      email,
      industry: formData.get("industry") || null,
      estimatedTraffic: formData.get("estimatedTraffic") || null,
      techStack: formData.get("techStack") || null,
      linkedin: formData.get("linkedin") || null,
      facebook: formData.get("facebook") || null,
      instagram: formData.get("instagram") || null,
      twitter: formData.get("twitter") || null,
      leadSource: formData.get("leadSource") || null,
      notes: formData.get("notes") || null,
      score: result.score,
      maxScore: result.maxScore,
      temperature: result.temperature,
      createdById: userId
    }
  });
  if (responses.length > 0) {
    await prisma.$transaction(result.responses.map((r) => prisma.leadVerification.create({
      data: {
        leadId: lead.id,
        criteriaId: r.criteriaId,
        response: r.response,
        score: r.score
      }
    })));
  }
  await logActivity({
    leadId: lead.id,
    userId,
    action: "LEAD_CREATED",
    description: `${(user == null ? void 0 : user.name) || "Unknown"} added this lead`,
    metadata: {
      temperature: result.temperature,
      score: result.score,
      percentage: result.percentage
    }
  });
  const params = new URLSearchParams({
    success: "true",
    leadId: lead.id,
    companyName: lead.companyName,
    temperature: result.temperature,
    score: String(Math.round(result.score)),
    maxScore: String(Math.round(result.maxScore)),
    percentage: String(Math.round(result.percentage))
  });
  return redirect(`/leads/new?${params.toString()}`);
}
const leads_new = UNSAFE_withComponentProps(function NewLead() {
  var _a, _b, _c, _d, _e, _f;
  const {
    user,
    criteria
  } = useLoaderData();
  const actionData = useActionData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const successData = searchParams.get("success") === "true" ? {
    leadId: searchParams.get("leadId") || "",
    companyName: searchParams.get("companyName") || "",
    temperature: searchParams.get("temperature") || "COLD",
    score: Number(searchParams.get("score")) || 0,
    maxScore: Number(searchParams.get("maxScore")) || 0,
    percentage: Number(searchParams.get("percentage")) || 0
  } : null;
  useEffect$1(() => {
    if (successData) {
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    }
  }, [successData]);
  const tempConfig = {
    HOT: {
      bg: "bg-red-500/10",
      border: "border-red-500/25",
      ring: "ring-red-500/15",
      text: "text-red-400",
      icon: Flame
    },
    WARM: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
      ring: "ring-amber-500/15",
      text: "text-amber-400",
      icon: Sun
    },
    COLD: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/25",
      ring: "ring-blue-500/15",
      text: "text-blue-400",
      icon: Snowflake
    }
  };
  const handleSubmit = () => {
    setSubmitting(true);
  };
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-start gap-3",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/inbox",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            className: "rounded-full hover:bg-muted mt-1",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Add New Lead"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mt-1",
            children: "Fill out the details and qualification scorecard"
          })]
        })]
      }), successData && /* @__PURE__ */ jsxs(Card, {
        className: `border ${((_a = tempConfig[successData.temperature]) == null ? void 0 : _a.border) || tempConfig.COLD.border} ${((_b = tempConfig[successData.temperature]) == null ? void 0 : _b.bg) || tempConfig.COLD.bg} overflow-hidden`,
        children: [/* @__PURE__ */ jsx("div", {
          className: `h-1 w-full ${((_c = tempConfig[successData.temperature]) == null ? void 0 : _c.text.replace("text-", "bg-")) || "bg-blue-400"}`
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center gap-4 p-5",
          children: [/* @__PURE__ */ jsx("div", {
            className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${((_d = tempConfig[successData.temperature]) == null ? void 0 : _d.bg) || tempConfig.COLD.bg} ring-1 ${((_e = tempConfig[successData.temperature]) == null ? void 0 : _e.ring) || tempConfig.COLD.ring}`,
            children: /* @__PURE__ */ jsx(CheckCircle2, {
              className: `h-5 w-5 ${((_f = tempConfig[successData.temperature]) == null ? void 0 : _f.text) || tempConfig.COLD.text}`
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex-1 min-w-0",
            children: [/* @__PURE__ */ jsxs("p", {
              className: "font-semibold text-foreground",
              children: [successData.companyName, " added successfully"]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 mt-1 flex-wrap",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "text-sm text-muted-foreground",
                children: [successData.score, "/", successData.maxScore, " (", successData.percentage, "%)"]
              }), /* @__PURE__ */ jsx(TemperatureBadge, {
                temperature: successData.temperature
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2 shrink-0",
            children: [/* @__PURE__ */ jsx(Link, {
              to: `/inbox/${successData.leadId}`,
              children: /* @__PURE__ */ jsx(Button, {
                variant: "outline",
                size: "sm",
                className: "rounded-lg",
                children: "View Lead"
              })
            }), /* @__PURE__ */ jsx(Button, {
              size: "sm",
              className: "rounded-lg",
              onClick: () => {
                setSearchParams({}, {
                  replace: true
                });
              },
              children: "Add Another"
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-6",
        onSubmit: handleSubmit,
        children: [(actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive",
          children: [/* @__PURE__ */ jsx(AlertCircle, {
            className: "h-4 w-4 shrink-0"
          }), actionData.error]
        }), /* @__PURE__ */ jsx(SectionCard, {
          icon: /* @__PURE__ */ jsx(User, {
            className: "h-4 w-4 text-violet-400"
          }),
          title: "Point of Contact",
          description: "Who are we reaching out to?",
          children: /* @__PURE__ */ jsxs("div", {
            className: "grid gap-4 sm:grid-cols-2",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "contactName",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Contact Name *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "contactName",
                name: "contactName",
                placeholder: "John Smith",
                required: true,
                className: "bg-background border-border/60 shadow-sm"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "email",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Email *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "email",
                name: "email",
                type: "email",
                placeholder: "john@company.com",
                required: true,
                className: "bg-background border-border/60 shadow-sm"
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(SectionCard, {
          icon: /* @__PURE__ */ jsx(Building2, {
            className: "h-4 w-4 text-blue-400"
          }),
          title: "Company Info",
          description: "Business details and background",
          children: /* @__PURE__ */ jsxs("div", {
            className: "grid gap-4 sm:grid-cols-2",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "companyName",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Company Name *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "companyName",
                name: "companyName",
                placeholder: "Acme Corp",
                required: true,
                className: "bg-background border-border/60 shadow-sm"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "industry",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Industry"
              }), /* @__PURE__ */ jsx(Input, {
                id: "industry",
                name: "industry",
                placeholder: "e.g. SaaS, E-commerce",
                className: "bg-background border-border/60 shadow-sm"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "website",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Website"
              }), /* @__PURE__ */ jsx(Input, {
                id: "website",
                name: "website",
                placeholder: "https://example.com",
                className: "bg-background border-border/60 shadow-sm"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "estimatedTraffic",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Est. Monthly Traffic"
              }), /* @__PURE__ */ jsx(Input, {
                id: "estimatedTraffic",
                name: "estimatedTraffic",
                placeholder: "e.g. 10K–50K",
                className: "bg-background border-border/60 shadow-sm"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "techStack",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Tech Stack"
              }), /* @__PURE__ */ jsx(Input, {
                id: "techStack",
                name: "techStack",
                placeholder: "e.g. WordPress, Shopify",
                className: "bg-background border-border/60 shadow-sm"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "leadSource",
                className: "text-xs text-muted-foreground uppercase tracking-wider font-medium",
                children: "Lead Source"
              }), /* @__PURE__ */ jsx(Input, {
                id: "leadSource",
                name: "leadSource",
                placeholder: "e.g. LinkedIn, Referral",
                className: "bg-background border-border/60 shadow-sm"
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(SectionCard, {
          icon: /* @__PURE__ */ jsx(Globe, {
            className: "h-4 w-4 text-emerald-400"
          }),
          title: "Social Links",
          description: "Where to find them online",
          children: /* @__PURE__ */ jsxs("div", {
            className: "grid gap-4 sm:grid-cols-2",
            children: [/* @__PURE__ */ jsx(SocialField, {
              name: "linkedin",
              label: "LinkedIn",
              placeholder: "https://linkedin.com/in/...",
              icon: /* @__PURE__ */ jsx(Linkedin, {
                className: "h-3.5 w-3.5 text-blue-400"
              })
            }), /* @__PURE__ */ jsx(SocialField, {
              name: "facebook",
              label: "Facebook",
              placeholder: "https://facebook.com/...",
              icon: /* @__PURE__ */ jsx(Facebook, {
                className: "h-3.5 w-3.5 text-blue-500"
              })
            }), /* @__PURE__ */ jsx(SocialField, {
              name: "instagram",
              label: "Instagram",
              placeholder: "https://instagram.com/...",
              icon: /* @__PURE__ */ jsx(Instagram, {
                className: "h-3.5 w-3.5 text-pink-400"
              })
            }), /* @__PURE__ */ jsx(SocialField, {
              name: "twitter",
              label: "Twitter / X",
              placeholder: "https://x.com/...",
              icon: /* @__PURE__ */ jsx(Twitter, {
                className: "h-3.5 w-3.5 text-sky-400"
              })
            })]
          })
        }), /* @__PURE__ */ jsx(SectionCard, {
          icon: /* @__PURE__ */ jsx(NotebookPen, {
            className: "h-4 w-4 text-amber-400"
          }),
          title: "Notes",
          description: "Any additional context about this lead",
          children: /* @__PURE__ */ jsx(Textarea, {
            id: "notes",
            name: "notes",
            rows: 3,
            placeholder: "Add notes about this lead...",
            className: "bg-background border-border/60 shadow-sm resize-none"
          })
        }), criteria.length > 0 && /* @__PURE__ */ jsx(SectionCard, {
          icon: /* @__PURE__ */ jsx(ClipboardCheck, {
            className: "h-4 w-4 text-orange-400"
          }),
          title: "Lead Qualification Scorecard",
          description: "Answer each criterion to calculate the lead score. Higher scores = hotter leads.",
          children: /* @__PURE__ */ jsx("div", {
            className: "space-y-3",
            children: criteria.map((c, idx) => /* @__PURE__ */ jsxs("div", {
              className: "rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3 transition-all hover:border-border/60 hover:bg-muted/30",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "criteriaId",
                value: c.id
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-start justify-between gap-2",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "min-w-0",
                  children: [/* @__PURE__ */ jsxs("p", {
                    className: "text-sm font-semibold",
                    children: [/* @__PURE__ */ jsxs("span", {
                      className: "text-muted-foreground/50 font-bold mr-1",
                      children: [idx + 1, "."]
                    }), c.name, c.required && /* @__PURE__ */ jsx("span", {
                      className: "ml-1 text-red-400",
                      children: "*"
                    })]
                  }), c.description && /* @__PURE__ */ jsx("p", {
                    className: "text-xs text-muted-foreground mt-0.5",
                    children: c.description
                  })]
                }), /* @__PURE__ */ jsxs(Badge, {
                  variant: "secondary",
                  className: "shrink-0 text-[10px] font-bold uppercase tracking-wider rounded-md",
                  children: [c.weight, "pt", c.weight > 1 ? "s" : ""]
                })]
              }), c.type === "YES_NO" && /* @__PURE__ */ jsxs("div", {
                className: "flex gap-3",
                children: [/* @__PURE__ */ jsx(ScoreOption, {
                  name: `response_${c.id}`,
                  value: "yes",
                  color: "emerald",
                  required: c.required,
                  children: "Yes"
                }), /* @__PURE__ */ jsx(ScoreOption, {
                  name: `response_${c.id}`,
                  value: "no",
                  color: "red",
                  required: c.required,
                  children: "No"
                })]
              }), c.type === "SCORE" && /* @__PURE__ */ jsx("div", {
                className: "flex gap-2",
                children: [1, 2, 3, 4, 5].map((score) => /* @__PURE__ */ jsx(ScoreButton, {
                  name: `response_${c.id}`,
                  value: String(score),
                  required: c.required,
                  score
                }, score))
              }), c.type === "TEXT" && /* @__PURE__ */ jsx(Textarea, {
                name: `response_${c.id}`,
                rows: 2,
                placeholder: "Enter your evaluation...",
                required: c.required,
                className: "bg-background border-border/60 shadow-sm resize-none"
              })]
            }, c.id))
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 p-4 ring-1 ring-border/20",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/inbox",
            children: /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              className: "text-muted-foreground hover:text-foreground",
              children: "Cancel"
            })
          }), /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            disabled: submitting,
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 rounded-lg shadow-sm",
            children: [submitting ? /* @__PURE__ */ jsx(Loader2, {
              className: "mr-2 h-4 w-4 animate-spin"
            }) : /* @__PURE__ */ jsx(UserPlus, {
              className: "mr-2 h-4 w-4"
            }), submitting ? "Scoring..." : "Score & Add Lead"]
          })]
        })]
      })]
    })
  });
});
function SectionCard({
  icon,
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxs(Card, {
    className: "hover:shadow-md hover:-translate-y-px transition-all duration-200 border-border/40",
    children: [/* @__PURE__ */ jsx(CardHeader, {
      className: "pb-3",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2.5",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 ring-1 ring-border/30",
          children: icon
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-sm font-semibold",
            children: title
          }), /* @__PURE__ */ jsx(CardDescription, {
            className: "text-xs",
            children: description
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(CardContent, {
      className: "pt-0",
      children
    })]
  });
}
function SocialField({
  name,
  label,
  placeholder,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-1.5",
    children: [/* @__PURE__ */ jsxs(Label, {
      htmlFor: name,
      className: "text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5",
      children: [icon, " ", label]
    }), /* @__PURE__ */ jsx(Input, {
      id: name,
      name,
      placeholder,
      className: "bg-background border-border/60 shadow-sm"
    })]
  });
}
function ScoreOption({
  name,
  value,
  color,
  required,
  children
}) {
  const styles = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 has-[:checked]:bg-emerald-500/15 has-[:checked]:border-emerald-500/40 has-[:checked]:text-emerald-400",
    red: "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 has-[:checked]:bg-red-500/15 has-[:checked]:border-red-500/40 has-[:checked]:text-red-400",
    amber: "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 has-[:checked]:bg-amber-500/15 has-[:checked]:border-amber-500/40 has-[:checked]:text-amber-400"
  };
  return /* @__PURE__ */ jsxs("label", {
    className: `flex items-center gap-2 rounded-lg border px-4 py-2.5 cursor-pointer transition-all duration-200 text-sm font-medium ${styles[color]}`,
    children: [/* @__PURE__ */ jsx("input", {
      type: "radio",
      name,
      value,
      required,
      className: "h-4 w-4 accent-current"
    }), /* @__PURE__ */ jsx("span", {
      children
    })]
  });
}
function ScoreButton({
  name,
  value,
  required,
  score
}) {
  const cls = score <= 2 ? "border-red-500/20 text-red-400 hover:bg-red-500/10 has-[:checked]:bg-red-500/15 has-[:checked]:border-red-500/40" : score === 3 ? "border-amber-500/20 text-amber-400 hover:bg-amber-500/10 has-[:checked]:bg-amber-500/15 has-[:checked]:border-amber-500/40" : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 has-[:checked]:bg-emerald-500/15 has-[:checked]:border-emerald-500/40";
  return /* @__PURE__ */ jsxs("label", {
    className: `flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-bold transition-all duration-200 ${cls}`,
    children: [/* @__PURE__ */ jsx("input", {
      type: "radio",
      name,
      value,
      required,
      className: "fixed opacity-0 pointer-events-none"
    }), score]
  });
}
function TemperatureBadge({
  temperature
}) {
  const config = {
    HOT: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20",
      icon: Flame
    },
    WARM: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: Sun
    },
    COLD: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      icon: Snowflake
    }
  };
  const c = config[temperature] || config.COLD;
  const Icon = c.icon;
  return /* @__PURE__ */ jsxs("strong", {
    className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${c.classes}`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: "h-3 w-3"
    }), temperature]
  });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$m,
  default: leads_new,
  loader: loader$u
}, Symbol.toStringTag, { value: "Module" }));
const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
    "select",
    {
      ref,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children
    }
  )
);
Select.displayName = "Select";
async function loader$t({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const criteria = await prisma.verificationCriteria.findMany({
    orderBy: {
      sortOrder: "asc"
    }
  });
  const scoreConfig = await getScoreConfig();
  return {
    user,
    criteria,
    scoreConfig
  };
}
async function action$l({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "create") {
    const name = formData.get("name");
    const description = formData.get("description") || null;
    const type = formData.get("type");
    const weight = parseInt(formData.get("weight")) || 1;
    const required = formData.get("required") === "on";
    if (!name) return {
      error: "Criterion name is required."
    };
    const maxOrder = await prisma.verificationCriteria.aggregate({
      _max: {
        sortOrder: true
      }
    });
    await prisma.verificationCriteria.create({
      data: {
        name,
        description,
        type,
        weight,
        required,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1
      }
    });
    return {
      success: true
    };
  }
  if (intent === "update") {
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description") || null;
    const type = formData.get("type");
    const weight = parseInt(formData.get("weight")) || 1;
    const required = formData.get("required") === "on";
    const active = formData.get("active") === "on";
    await prisma.verificationCriteria.update({
      where: {
        id
      },
      data: {
        name,
        description,
        type,
        weight,
        required,
        active
      }
    });
    return {
      success: true
    };
  }
  if (intent === "delete") {
    await prisma.verificationCriteria.delete({
      where: {
        id: formData.get("id")
      }
    });
    return {
      success: true
    };
  }
  if (intent === "reorder") {
    const id = formData.get("id");
    const direction = formData.get("direction");
    const criteria = await prisma.verificationCriteria.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    });
    const idx = criteria.findIndex((c) => c.id === id);
    if (idx < 0) return {};
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= criteria.length) return {};
    const [a, b] = [criteria[idx], criteria[swapIdx]];
    await prisma.$transaction([prisma.verificationCriteria.update({
      where: {
        id: a.id
      },
      data: {
        sortOrder: b.sortOrder
      }
    }), prisma.verificationCriteria.update({
      where: {
        id: b.id
      },
      data: {
        sortOrder: a.sortOrder
      }
    })]);
    return {
      success: true
    };
  }
  if (intent === "updateScoreConfig") {
    const hotThreshold = parseFloat(formData.get("hotThreshold"));
    const warmThreshold = parseFloat(formData.get("warmThreshold"));
    if (isNaN(hotThreshold) || isNaN(warmThreshold)) {
      return {
        error: "Thresholds must be valid numbers."
      };
    }
    if (hotThreshold <= warmThreshold) {
      return {
        error: "Hot threshold must be higher than warm threshold."
      };
    }
    await prisma.scoreConfig.upsert({
      where: {
        id: "default"
      },
      update: {
        hotThreshold,
        warmThreshold
      },
      create: {
        id: "default",
        hotThreshold,
        warmThreshold
      }
    });
    return {
      success: true
    };
  }
  return {};
}
const verification_criteria = UNSAFE_withComponentProps(function VerificationCriteria() {
  const {
    user,
    criteria,
    scoreConfig
  } = useLoaderData();
  const actionData = useActionData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const isAdmin = (user == null ? void 0 : user.role) === "ADMIN";
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Verification Criteria"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Define the criteria admins use to evaluate and verify leads"
          })]
        }), isAdmin && /* @__PURE__ */ jsxs(Button, {
          onClick: () => {
            setShowForm(true);
            setEditingId(null);
          },
          children: [/* @__PURE__ */ jsx(Plus, {
            className: "mr-2 h-4 w-4"
          }), "Add Criterion"]
        })]
      }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20",
        children: "Saved successfully."
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20",
        children: actionData.error
      }), isAdmin && scoreConfig && /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          className: "pb-3",
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "Score Thresholds"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Leads scoring at or above the hot threshold are marked HOT. Below warm threshold = COLD. In between = WARM."
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "flex items-end gap-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "updateScoreConfig"
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "hotThreshold",
                className: "text-xs text-red-400",
                children: "Hot Threshold (%)"
              }), /* @__PURE__ */ jsx(Input, {
                id: "hotThreshold",
                name: "hotThreshold",
                type: "number",
                min: 1,
                max: 100,
                defaultValue: scoreConfig.hotThreshold,
                className: "w-24"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "warmThreshold",
                className: "text-xs text-amber-400",
                children: "Warm Threshold (%)"
              }), /* @__PURE__ */ jsx(Input, {
                id: "warmThreshold",
                name: "warmThreshold",
                type: "number",
                min: 0,
                max: 99,
                defaultValue: scoreConfig.warmThreshold,
                className: "w-24"
              })]
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              size: "sm",
              children: "Update Thresholds"
            })]
          })
        })]
      }), showForm && /* @__PURE__ */ jsx(CriteriaForm, {
        onSubmit: () => {
          setShowForm(false);
          setEditingId(null);
        },
        existing: editingId ? criteria.find((c) => c.id === editingId) : void 0
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: criteria.length === 0 ? /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex flex-col items-center justify-center py-16",
            children: [/* @__PURE__ */ jsx(ShieldCheck, {
              className: "h-12 w-12 text-muted-foreground/50"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-4 text-lg font-medium text-muted-foreground",
              children: "No criteria defined yet"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Create verification criteria to standardize how leads are evaluated."
            })]
          })
        }) : criteria.map((c, idx) => /* @__PURE__ */ jsx(Card, {
          className: !c.active ? "opacity-50" : "",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex items-center gap-4 p-4",
            children: [isAdmin && /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-0.5",
              children: [/* @__PURE__ */ jsxs(Form, {
                method: "post",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "reorder"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "id",
                  value: c.id
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "direction",
                  value: "up"
                }), /* @__PURE__ */ jsx("button", {
                  type: "submit",
                  className: "text-muted-foreground hover:text-foreground",
                  disabled: idx === 0,
                  children: /* @__PURE__ */ jsx(ArrowUp, {
                    className: "h-3.5 w-3.5"
                  })
                })]
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "reorder"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "id",
                  value: c.id
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "direction",
                  value: "down"
                }), /* @__PURE__ */ jsx("button", {
                  type: "submit",
                  className: "text-muted-foreground hover:text-foreground",
                  disabled: idx === criteria.length - 1,
                  children: /* @__PURE__ */ jsx(ArrowDown, {
                    className: "h-3.5 w-3.5"
                  })
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-1",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "font-medium",
                  children: c.name
                }), /* @__PURE__ */ jsx(Badge, {
                  className: `text-[10px] ${c.type === "YES_NO" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" : c.type === "SCORE" ? "bg-violet-500/15 text-violet-400 border-violet-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20"}`,
                  children: c.type === "YES_NO" ? "Yes / No" : c.type === "SCORE" ? "Score (1-5)" : "Text"
                }), c.required && /* @__PURE__ */ jsx("span", {
                  className: "inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/15 px-1.5 py-0 text-[10px] font-semibold text-emerald-400",
                  children: "Required"
                }), !c.active && /* @__PURE__ */ jsx("span", {
                  className: "inline-flex items-center rounded-md border border-red-500/20 bg-red-500/15 px-1.5 py-0 text-[10px] font-semibold text-red-400",
                  children: "Inactive"
                })]
              }), c.description && /* @__PURE__ */ jsx("p", {
                className: "mt-1 text-sm text-muted-foreground",
                children: c.description
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "text-sm text-muted-foreground",
              children: ["Weight: ", c.weight]
            }), isAdmin && /* @__PURE__ */ jsxs("div", {
              className: "flex gap-1",
              children: [/* @__PURE__ */ jsx(Button, {
                variant: "ghost",
                size: "sm",
                onClick: () => {
                  setEditingId(c.id);
                  setShowForm(true);
                },
                children: "Edit"
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "delete"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "id",
                  value: c.id
                }), /* @__PURE__ */ jsx(Button, {
                  type: "submit",
                  variant: "ghost",
                  size: "sm",
                  children: /* @__PURE__ */ jsx(Trash2, {
                    className: "h-4 w-4 text-destructive"
                  })
                })]
              })]
            })]
          })
        }, c.id))
      })]
    })
  });
});
function CriteriaForm({
  onSubmit,
  existing
}) {
  return /* @__PURE__ */ jsxs(Card, {
    children: [/* @__PURE__ */ jsxs(CardHeader, {
      children: [/* @__PURE__ */ jsx(CardTitle, {
        children: existing ? "Edit Criterion" : "New Criterion"
      }), /* @__PURE__ */ jsx(CardDescription, {
        children: "Define how this criterion evaluates a lead"
      })]
    }), /* @__PURE__ */ jsx(CardContent, {
      children: /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-4",
        onSubmit,
        children: [/* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "intent",
          value: existing ? "update" : "create"
        }), existing && /* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "id",
          value: existing.id
        }), /* @__PURE__ */ jsxs("div", {
          className: "grid gap-4 sm:grid-cols-2",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "name",
              children: "Criterion Name *"
            }), /* @__PURE__ */ jsx(Input, {
              id: "name",
              name: "name",
              placeholder: "e.g. Has valid website",
              required: true,
              defaultValue: existing == null ? void 0 : existing.name
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "type",
              children: "Response Type"
            }), /* @__PURE__ */ jsxs(Select, {
              name: "type",
              defaultValue: (existing == null ? void 0 : existing.type) || "YES_NO",
              children: [/* @__PURE__ */ jsx("option", {
                value: "YES_NO",
                children: "Yes / No"
              }), /* @__PURE__ */ jsx("option", {
                value: "SCORE",
                children: "Score (1-5)"
              }), /* @__PURE__ */ jsx("option", {
                value: "TEXT",
                children: "Free Text"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "weight",
              children: "Weight (importance)"
            }), /* @__PURE__ */ jsx(Input, {
              id: "weight",
              name: "weight",
              type: "number",
              min: 1,
              max: 10,
              defaultValue: (existing == null ? void 0 : existing.weight) || 1
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-end gap-4",
            children: [/* @__PURE__ */ jsxs("label", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                name: "required",
                defaultChecked: (existing == null ? void 0 : existing.required) ?? true,
                className: "h-4 w-4 rounded"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm",
                children: "Required"
              })]
            }), existing && /* @__PURE__ */ jsxs("label", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                name: "active",
                defaultChecked: existing.active,
                className: "h-4 w-4 rounded"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm",
                children: "Active"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "description",
            children: "Description / Instructions"
          }), /* @__PURE__ */ jsx(Textarea, {
            id: "description",
            name: "description",
            rows: 2,
            placeholder: "What the verifier should look for...",
            defaultValue: (existing == null ? void 0 : existing.description) || ""
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-end gap-2",
          children: [/* @__PURE__ */ jsx(Button, {
            type: "button",
            variant: "outline",
            onClick: onSubmit,
            children: "Cancel"
          }), /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            children: [existing ? "Update" : "Create", " Criterion"]
          })]
        })]
      })
    })]
  });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$l,
  default: verification_criteria,
  loader: loader$t
}, Symbol.toStringTag, { value: "Module" }));
async function loader$s({
  request,
  params
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const lead = await prisma.lead.findUnique({
    where: {
      id: params.leadId
    },
    include: {
      criteriaResponses: {
        include: {
          criteria: true,
          verifier: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!lead) {
    throw new Response("Lead not found", {
      status: 404
    });
  }
  const criteria = await prisma.verificationCriteria.findMany({
    where: {
      active: true
    },
    orderBy: {
      sortOrder: "asc"
    }
  });
  const existingResponses = new Map(lead.criteriaResponses.map((v) => [v.criteriaId, v]));
  return {
    user,
    lead,
    criteria,
    existingResponses
  };
}
async function action$k({
  request,
  params
}) {
  const userId = await requireAdmin(request);
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true
    }
  });
  const leadId = params.leadId;
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "rescore") {
    const criteriaIds = formData.getAll("criteriaId");
    const responses = [];
    for (const cid of criteriaIds) {
      const response = formData.get(`response_${cid}`);
      const notes = formData.get(`notes_${cid}`) || "";
      if (response) responses.push({
        criteriaId: cid,
        response,
        notes
      });
    }
    if (responses.length === 0) {
      return {
        error: "Please respond to at least one criterion."
      };
    }
    const previousLead = await prisma.lead.findUnique({
      where: {
        id: leadId
      },
      select: {
        temperature: true,
        score: true,
        maxScore: true
      }
    });
    await prisma.$transaction(responses.map((r) => prisma.leadVerification.upsert({
      where: {
        leadId_criteriaId: {
          leadId,
          criteriaId: r.criteriaId
        }
      },
      create: {
        leadId,
        criteriaId: r.criteriaId,
        verifiedBy: userId,
        response: r.response,
        notes: r.notes,
        score: 0
        // will be recalculated by scoreLead
      },
      update: {
        verifiedBy: userId,
        response: r.response,
        notes: r.notes
      }
    })));
    const scoredResponses = responses.map((r) => ({
      criteriaId: r.criteriaId,
      response: r.response
    }));
    const result = await scoreLead(scoredResponses);
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        score: result.score,
        maxScore: result.maxScore,
        temperature: result.temperature
      }
    });
    for (const sr of result.responses) {
      await prisma.leadVerification.updateMany({
        where: {
          leadId,
          criteriaId: sr.criteriaId
        },
        data: {
          score: sr.score
        }
      });
    }
    await logActivity({
      leadId,
      userId,
      action: "LEAD_SCORED",
      description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} re-scored this lead (${result.temperature})`,
      metadata: {
        score: result.score,
        maxScore: result.maxScore,
        temperature: result.temperature,
        previousTemperature: previousLead == null ? void 0 : previousLead.temperature,
        percentage: result.percentage
      }
    });
    return {
      success: true,
      temperature: result.temperature,
      score: result.score,
      maxScore: result.maxScore
    };
  }
  return {};
}
const verification_$leadId = UNSAFE_withComponentProps(function VerifyLead() {
  const {
    user,
    lead,
    criteria,
    existingResponses
  } = useLoaderData();
  const actionData = useActionData();
  const tempConfig = {
    HOT: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20",
      icon: Flame
    },
    WARM: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: Sun
    },
    COLD: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      icon: Snowflake
    }
  };
  const temp = tempConfig[lead.temperature] || tempConfig.COLD;
  const TempIcon = temp.icon;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/inbox",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold tracking-tight",
              children: "Re-Score Lead"
            }), /* @__PURE__ */ jsxs("span", {
              className: `inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${temp.classes}`,
              children: [/* @__PURE__ */ jsx(TempIcon, {
                className: "h-3 w-3"
              }), lead.temperature]
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-muted-foreground",
            children: [lead.companyName, " · ", lead.email, " · Score: ", Math.round(lead.score), "/", Math.round(lead.maxScore)]
          })]
        })]
      }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("div", {
        className: `rounded-md p-4 text-sm border ${actionData.temperature === "HOT" ? "bg-red-500/10 text-red-400 border-red-500/20" : actionData.temperature === "WARM" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`,
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: "h-5 w-5"
          }), /* @__PURE__ */ jsxs("span", {
            className: "font-medium",
            children: ["Re-scored: ", actionData.score, "/", actionData.maxScore, " — ", actionData.temperature]
          })]
        })
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20",
        children: actionData.error
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "Lead Summary"
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("dl", {
            className: "grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3",
            children: [["Company", lead.companyName], ["Contact", lead.contactName], ["Email", lead.email], ["Website", lead.website], ["Industry", lead.industry], ["Est. Traffic", lead.estimatedTraffic]].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("dt", {
                className: "text-muted-foreground",
                children: label
              }), /* @__PURE__ */ jsx("dd", {
                className: "font-medium",
                children: value || "—"
              })]
            }, label))
          })
        })]
      }), criteria.length === 0 ? /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center py-12",
          children: [/* @__PURE__ */ jsx(ShieldCheck, {
            className: "h-10 w-10 text-muted-foreground/50"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-3 text-muted-foreground",
            children: "No active criteria defined."
          }), /* @__PURE__ */ jsx(Link, {
            to: "/verification/criteria",
            children: /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              className: "mt-3",
              children: "Define Criteria"
            })
          })]
        })
      }) : /* @__PURE__ */ jsxs(Form, {
        method: "post",
        children: [/* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "intent",
          value: "rescore"
        }), /* @__PURE__ */ jsx("div", {
          className: "space-y-4",
          children: criteria.map((c) => {
            const existing = existingResponses.get(c.id);
            return /* @__PURE__ */ jsx(Card, {
              children: /* @__PURE__ */ jsxs(CardContent, {
                className: "p-5 space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "criteriaId",
                  value: c.id
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start justify-between gap-2",
                  children: [/* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-sm font-medium",
                      children: c.name
                    }), c.description && /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-muted-foreground mt-0.5",
                      children: c.description
                    })]
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/20",
                    children: [c.weight, "pt", c.weight > 1 ? "s" : ""]
                  })]
                }), c.type === "YES_NO" && /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-3",
                  children: [/* @__PURE__ */ jsxs("label", {
                    className: "flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 cursor-pointer has-[:checked]:bg-emerald-500/20 has-[:checked]:border-emerald-500/40 transition-colors",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "radio",
                      name: `response_${c.id}`,
                      value: "yes",
                      defaultChecked: (existing == null ? void 0 : existing.response) === "yes",
                      className: "h-4 w-4 accent-emerald-500"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-sm font-medium text-emerald-400",
                      children: "Yes"
                    })]
                  }), /* @__PURE__ */ jsxs("label", {
                    className: "flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-2 cursor-pointer has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500/40 transition-colors",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "radio",
                      name: `response_${c.id}`,
                      value: "no",
                      defaultChecked: (existing == null ? void 0 : existing.response) === "no",
                      className: "h-4 w-4 accent-red-500"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-sm font-medium text-red-400",
                      children: "No"
                    })]
                  })]
                }), c.type === "SCORE" && /* @__PURE__ */ jsx("div", {
                  className: "flex gap-2",
                  children: [1, 2, 3, 4, 5].map((score) => {
                    const cls = score <= 2 ? "border-red-500/20 text-red-400 hover:bg-red-500/10 has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500/40" : score === 3 ? "border-amber-500/20 text-amber-400 hover:bg-amber-500/10 has-[:checked]:bg-amber-500/20 has-[:checked]:border-amber-500/40" : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 has-[:checked]:bg-emerald-500/20 has-[:checked]:border-emerald-500/40";
                    return /* @__PURE__ */ jsxs("label", {
                      className: `flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors ${cls}`,
                      children: [/* @__PURE__ */ jsx("input", {
                        type: "radio",
                        name: `response_${c.id}`,
                        value: String(score),
                        defaultChecked: (existing == null ? void 0 : existing.response) === String(score),
                        className: "sr-only"
                      }), score]
                    }, score);
                  })
                }), c.type === "TEXT" && /* @__PURE__ */ jsx(Textarea, {
                  name: `response_${c.id}`,
                  rows: 2,
                  placeholder: "Enter your evaluation...",
                  defaultValue: (existing == null ? void 0 : existing.response) || ""
                }), /* @__PURE__ */ jsx(Textarea, {
                  name: `notes_${c.id}`,
                  rows: 1,
                  placeholder: "Optional notes...",
                  defaultValue: (existing == null ? void 0 : existing.notes) || "",
                  className: "text-xs"
                })]
              })
            }, c.id);
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-6 flex gap-3",
          children: /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            size: "lg",
            className: "bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/25",
            children: [/* @__PURE__ */ jsx(ShieldCheck, {
              className: "mr-2 h-4 w-4"
            }), "Re-Score Lead"]
          })
        })]
      }), lead.criteriaResponses.length > 0 && /* @__PURE__ */ jsxs("div", {
        className: "space-y-3",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-lg font-semibold",
          children: "Scoring History"
        }), lead.criteriaResponses.map((v) => /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "p-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("span", {
                  className: "font-medium",
                  children: v.criteria.name
                }), v.verifier && /* @__PURE__ */ jsxs("span", {
                  className: "ml-2 text-sm text-muted-foreground",
                  children: ["by ", v.verifier.name || v.verifier.email]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-sm font-mono",
                  children: v.response
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-xs text-muted-foreground",
                  children: [v.score, "pts"]
                })]
              })]
            }), v.notes && /* @__PURE__ */ jsx("p", {
              className: "mt-1 text-sm text-muted-foreground",
              children: v.notes
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 text-xs text-muted-foreground",
              children: new Date(v.createdAt).toLocaleString()
            })]
          })
        }, v.id))]
      })]
    })
  });
});
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$k,
  default: verification_$leadId,
  loader: loader$s
}, Symbol.toStringTag, { value: "Module" }));
const ALLOWED_ROLES$1 = ["AGENT", "ADMIN"];
async function loader$r({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
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
          assignedLeads: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const users2 = usersRaw.map((u) => ({
    ...u,
    activityCount: u._count.activityLogs,
    leadsCreated: u._count.createdLeads,
    leadsAssigned: u._count.assignedLeads
  }));
  return {
    user,
    users: users2
  };
}
async function action$j({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "updateRole") {
    const targetUserId = formData.get("userId");
    const newRole = formData.get("role");
    if (!ALLOWED_ROLES$1.includes(newRole)) return {
      error: "Invalid role."
    };
    await prisma.user.update({
      where: {
        id: targetUserId
      },
      data: {
        role: newRole
      }
    });
    return {
      success: true
    };
  }
  if (intent === "delete") {
    const targetUserId = formData.get("userId");
    const sessionUserId = await requireAdmin(request);
    if (targetUserId === sessionUserId) {
      return {
        error: "You cannot delete your own account."
      };
    }
    const assignedLeads = await prisma.lead.count({
      where: {
        assignedToId: targetUserId
      }
    });
    if (assignedLeads > 0) {
      await prisma.lead.updateMany({
        where: {
          assignedToId: targetUserId
        },
        data: {
          assignedToId: null
        }
      });
    }
    await prisma.user.delete({
      where: {
        id: targetUserId
      }
    });
    return {
      success: true,
      deleted: true
    };
  }
  return {};
}
const users = UNSAFE_withComponentProps(function UserList() {
  const {
    user,
    users: users2
  } = useLoaderData();
  const actionData = useActionData();
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "User Management"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Create accounts and manage roles for your team"
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/users/new",
          children: /* @__PURE__ */ jsxs(Button, {
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(UserPlus, {
              className: "mr-2 h-4 w-4"
            }), "Add User"]
          })
        })]
      }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20",
        children: actionData.deleted ? "User deleted successfully." : "Updated successfully."
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20",
        children: actionData.error
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-3 gap-4",
        children: [/* @__PURE__ */ jsx(Card, {
          className: "bg-muted/30",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex items-center gap-3 p-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10",
              children: /* @__PURE__ */ jsx(Users, {
                className: "h-5 w-5 text-blue-500"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: users2.length
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Total Users"
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(Card, {
          className: "bg-muted/30",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex items-center gap-3 p-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10",
              children: /* @__PURE__ */ jsx(ShieldCheck, {
                className: "h-5 w-5 text-emerald-500"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: users2.filter((u) => u.role === "ADMIN").length
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Admins"
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(Card, {
          className: "bg-muted/30",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex items-center gap-3 p-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10",
              children: /* @__PURE__ */ jsx(User, {
                className: "h-5 w-5 text-violet-500"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: users2.filter((u) => u.role === "AGENT").length
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Agents"
              })]
            })]
          })
        })]
      }), users2.length === 0 ? /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center justify-center py-16",
          children: [/* @__PURE__ */ jsx(Users, {
            className: "h-12 w-12 text-muted-foreground/50"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-4 text-lg font-medium text-muted-foreground",
            children: "No users yet"
          })]
        })
      }) : /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: users2.map((u) => {
          var _a, _b;
          return /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex items-center gap-4 p-4",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10",
                children: /* @__PURE__ */ jsx("span", {
                  className: "text-lg font-semibold",
                  children: ((_b = (_a = u.name) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) || u.email[0].toUpperCase()
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "font-medium truncate",
                    children: u.name || u.email
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: u.role === "ADMIN" ? "default" : "secondary",
                    children: u.role === "ADMIN" ? "Admin" : "Agent"
                  })]
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground truncate",
                  children: u.email
                }), /* @__PURE__ */ jsxs("div", {
                  className: "mt-1 flex items-center gap-4 text-xs text-muted-foreground",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/* @__PURE__ */ jsx(Activity, {
                      className: "h-3 w-3"
                    }), u.activityCount, " actions"]
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/* @__PURE__ */ jsx(FileCheck, {
                      className: "h-3 w-3"
                    }), u.leadsCreated, " created"]
                  }), /* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/* @__PURE__ */ jsx(Target, {
                      className: "h-3 w-3"
                    }), u.leadsAssigned, " assigned"]
                  })]
                })]
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "updateRole"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "userId",
                  value: u.id
                }), /* @__PURE__ */ jsxs(Select, {
                  name: "role",
                  defaultValue: u.role,
                  className: "w-28",
                  onChange: (e) => {
                    e.target.closest("form").submit();
                  },
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "AGENT",
                    children: "Agent"
                  }), /* @__PURE__ */ jsx("option", {
                    value: "ADMIN",
                    children: "Admin"
                  })]
                })]
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "delete"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "userId",
                  value: u.id
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "currentUserId",
                  value: user.id
                }), /* @__PURE__ */ jsx(Button, {
                  type: "submit",
                  variant: "ghost",
                  size: "icon",
                  title: "Delete user",
                  children: /* @__PURE__ */ jsx(Trash2, {
                    className: "h-4 w-4 text-destructive"
                  })
                })]
              })]
            })
          }, u.id);
        })
      })]
    })
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$j,
  default: users,
  loader: loader$r
}, Symbol.toStringTag, { value: "Module" }));
async function loader$q({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  return {
    user
  };
}
async function action$i({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const name = formData.get("name") || null;
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  if (!email || !password) return {
    error: "Email and password are required."
  };
  if (password.length < 8) return {
    error: "Password must be at least 8 characters."
  };
  const existing = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (existing) return {
    error: "A user with this email already exists."
  };
  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role
    }
  });
  return {
    success: true,
    userName: name || email,
    role
  };
}
const users_new = UNSAFE_withComponentProps(function NewUser() {
  const {
    user
  } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  useEffect$1(() => {
    if (actionData == null ? void 0 : actionData.success) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [actionData]);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/users",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "Add New User"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Create a login account for a team member"
          })]
        })]
      }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx(Card, {
        className: "border-2 border-emerald-500/40 bg-emerald-500/5",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center gap-4 p-5",
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: "h-8 w-8 shrink-0 text-emerald-400"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex-1",
            children: [/* @__PURE__ */ jsxs("p", {
              className: "font-semibold",
              children: [actionData.userName, " created!"]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Role: ", /* @__PURE__ */ jsx("strong", {
                children: actionData.role === "ADMIN" ? "Admin" : "Agent"
              }), " — they can now log in."]
            })]
          }), /* @__PURE__ */ jsx(Button, {
            size: "sm",
            onClick: () => navigate("/users/new", {
              replace: true
            }),
            children: "Add Another"
          })]
        })
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20",
        children: actionData.error
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Account Details"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "This person will use these credentials to log in"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "name",
                children: "Full Name"
              }), /* @__PURE__ */ jsx(Input, {
                id: "name",
                name: "name",
                placeholder: "Juan Dela Cruz"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "email",
                children: "Email *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "email",
                name: "email",
                type: "email",
                required: true,
                placeholder: "user@company.com"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "password",
                children: "Password *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "password",
                name: "password",
                type: "password",
                required: true,
                placeholder: "Min. 8 characters",
                minLength: 8
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "role",
                children: "Role"
              }), /* @__PURE__ */ jsxs(Select, {
                id: "role",
                name: "role",
                defaultValue: "AGENT",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "AGENT",
                  children: "Agent (View Only)"
                }), /* @__PURE__ */ jsx("option", {
                  value: "ADMIN",
                  children: "Admin (Full Access)"
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6 flex items-center justify-between",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/users",
            children: /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              children: "Cancel"
            })
          }), /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(UserPlus, {
              className: "mr-2 h-4 w-4"
            }), "Create User"]
          })]
        })]
      })]
    })
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$i,
  default: users_new,
  loader: loader$q
}, Symbol.toStringTag, { value: "Module" }));
function TemperatureIcon({ temp }) {
  if (temp === "HOT") return /* @__PURE__ */ jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10", children: /* @__PURE__ */ jsx(Flame, { className: "h-3 w-3 text-amber-400" }) });
  if (temp === "WARM") return /* @__PURE__ */ jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded-md bg-orange-500/10", children: /* @__PURE__ */ jsx(ThermometerSun, { className: "h-3 w-3 text-orange-400" }) });
  if (temp === "COLD") return /* @__PURE__ */ jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10", children: /* @__PURE__ */ jsx(Snowflake, { className: "h-3 w-3 text-blue-400" }) });
  return null;
}
function areEqual(prev, next) {
  var _a, _b;
  return prev.lead.id === next.lead.id && prev.lead.companyName === next.lead.companyName && prev.lead.contactName === next.lead.contactName && prev.lead.industry === next.lead.industry && prev.lead.temperature === next.lead.temperature && ((_a = prev.lead.assignedTo) == null ? void 0 : _a.name) === ((_b = next.lead.assignedTo) == null ? void 0 : _b.name) && prev.selected === next.selected && prev.draggable === next.draggable && prev.index === next.index;
}
const LeadCard = React__default.memo(function LeadCard2({
  lead,
  index,
  draggable = true,
  onClick,
  selected = false,
  onSelect
}) {
  var _a;
  const assignedToName = (_a = lead.assignedTo) == null ? void 0 : _a.name;
  return /* @__PURE__ */ jsx(Draggable, { draggableId: lead.id, index, isDragDisabled: !draggable, children: (provided, snapshot) => /* @__PURE__ */ jsx(
    "div",
    {
      ref: provided.innerRef,
      ...provided.draggableProps,
      className: `transition-all duration-200 ${snapshot.isDragging ? "opacity-95" : ""}`,
      style: provided.draggableProps.style,
      children: /* @__PURE__ */ jsx(
        Card,
        {
          className: `cursor-default p-3.5 transition-all duration-200 border-border/40 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm ${selected ? "ring-1 ring-primary/30 bg-primary/[0.04] shadow-md" : "hover:shadow-lg hover:-translate-y-0.5 hover:border-border/70 hover:from-card hover:to-card/80"} ${snapshot.isDragging ? "shadow-2xl ring-1 ring-primary/30 rotate-1 scale-[1.02]" : ""}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
            draggable && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onSelect == null ? void 0 : onSelect(lead.id),
                onMouseDown: (e) => e.stopPropagation(),
                className: "mt-0.5 text-muted-foreground/50 hover:text-primary shrink-0 transition-colors duration-150",
                title: selected ? "Deselect" : "Select for bulk move",
                children: selected ? /* @__PURE__ */ jsx(CheckSquare, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsx(Square, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                ...provided.dragHandleProps,
                className: "mt-1 cursor-grab text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-150",
                children: /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "h-4 w-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "9", cy: "12", r: "1" }),
                      /* @__PURE__ */ jsx("circle", { cx: "9", cy: "5", r: "1" }),
                      /* @__PURE__ */ jsx("circle", { cx: "9", cy: "19", r: "1" }),
                      /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "1" }),
                      /* @__PURE__ */ jsx("circle", { cx: "15", cy: "5", r: "1" }),
                      /* @__PURE__ */ jsx("circle", { cx: "15", cy: "19", r: "1" })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onClick == null ? void 0 : onClick(lead.id),
                    onMouseDown: (e) => e.stopPropagation(),
                    className: "truncate text-sm font-semibold text-foreground/90 hover:text-foreground text-left transition-colors duration-150",
                    children: lead.companyName
                  }
                ),
                /* @__PURE__ */ jsx(TemperatureIcon, { temp: lead.temperature })
              ] }),
              lead.contactName && /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-xs text-muted-foreground/60", children: lead.contactName }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex items-center gap-2", children: [
                lead.industry && /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] px-1.5 py-0 font-medium rounded-md bg-muted/60",
                    children: lead.industry
                  }
                ),
                assignedToName && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground/50 truncate", children: assignedToName }),
                /* @__PURE__ */ jsx("div", { className: "ml-auto flex gap-0.5", children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: `/leads/${lead.id}/emails`,
                    onClick: (e) => e.stopPropagation(),
                    onMouseDown: (e) => e.stopPropagation(),
                    children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-6 w-6 rounded-lg hover:bg-muted/80 text-muted-foreground/40 hover:text-muted-foreground transition-colors",
                        children: /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" })
                      }
                    )
                  }
                ) })
              ] })
            ] })
          ] })
        }
      )
    }
  ) });
}, areEqual);
function Dialog({ open, onOpenChange, children, className }) {
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (c) => React.isValidElement(c) && c.type === DialogTrigger
  );
  const content = childArray.filter(
    (c) => !(React.isValidElement(c) && c.type === DialogTrigger)
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    trigger,
    open && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/90",
          onClick: () => onOpenChange == null ? void 0 : onOpenChange(false)
        }
      ),
      /* @__PURE__ */ jsx("div", { className: cn("fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2", className), children: content })
    ] })
  ] });
}
const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg animate-in",
        className
      ),
      ...props,
      children
    }
  )
);
DialogContent.displayName = "DialogContent";
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "h2",
    {
      className: cn("text-lg font-semibold leading-none tracking-tight", className),
      ...props
    }
  );
}
function DialogTrigger({ children, asChild, ...props }) {
  return /* @__PURE__ */ jsx("button", { ...props, children });
}
function formatDate$1(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
const TEMP_COLORS = {
  HOT: "bg-red-500/20 text-red-400 border-red-500/30",
  WARM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  COLD: "bg-blue-500/20 text-blue-400 border-blue-500/30"
};
function LeadDetailModal({
  lead,
  stages,
  open,
  onOpenChange,
  onSave,
  saving
}) {
  var _a;
  const [editing, setEditing] = useState(false);
  useEffect$1(() => {
    setEditing(false);
  }, [lead == null ? void 0 : lead.id]);
  if (!lead) return null;
  const stageMeta = (_a = stages.find((s) => s.name === lead.stage)) == null ? void 0 : _a.meta;
  const stageClasses = stageMeta ? `${stageMeta.bg} ${stageMeta.text}` : "bg-muted text-muted-foreground";
  const mergedTimeline = [
    ...lead.stageHistory.map((s) => ({
      type: "stage",
      id: s.id,
      date: new Date(s.changedAt),
      entry: s
    })),
    ...lead.activityLogs.map((a) => ({
      type: "activity",
      id: a.id,
      date: new Date(a.createdAt),
      entry: a
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
  const scorePercent = lead.maxScore > 0 ? Math.round(lead.score / lead.maxScore * 100) : 0;
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("intent", "editLead");
    fd.set("leadId", lead.id);
    onSave == null ? void 0 : onSave(fd);
    setEditing(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, className: "max-w-2xl", children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[85vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-muted-foreground" }),
        editing ? "Edit Lead" : lead.companyName,
        !editing && /* @__PURE__ */ jsx(
          Badge,
          {
            className: `${TEMP_COLORS[lead.temperature] || ""} text-[10px]`,
            children: lead.temperature
          }
        )
      ] }),
      onSave && /* @__PURE__ */ jsx(
        Button,
        {
          variant: editing ? "default" : "outline",
          size: "sm",
          onClick: () => setEditing(!editing),
          className: "h-7 gap-1.5",
          children: editing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }),
            " Cancel"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " Edit"
          ] })
        }
      )
    ] }) }),
    editing ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "leadId", value: lead.id }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "Company Name", name: "companyName", defaultValue: lead.companyName, required: true }),
        /* @__PURE__ */ jsx(Field, { label: "Contact Name", name: "contactName", defaultValue: lead.contactName || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Email", name: "email", type: "email", defaultValue: lead.email, required: true }),
        /* @__PURE__ */ jsx(Field, { label: "Website", name: "website", defaultValue: lead.website || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Industry", name: "industry", defaultValue: lead.industry || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Est. Traffic", name: "estimatedTraffic", defaultValue: lead.estimatedTraffic || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Tech Stack", name: "techStack", defaultValue: lead.techStack || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Lead Source", name: "leadSource", defaultValue: lead.leadSource || "" }),
        /* @__PURE__ */ jsx(Field, { label: "LinkedIn", name: "linkedin", defaultValue: lead.linkedin || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Facebook", name: "facebook", defaultValue: lead.facebook || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Instagram", name: "instagram", defaultValue: lead.instagram || "" }),
        /* @__PURE__ */ jsx(Field, { label: "Twitter / X", name: "twitter", defaultValue: lead.twitter || "" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Notes" }),
        /* @__PURE__ */ jsx(Textarea, { name: "notes", rows: 3, defaultValue: lead.notes || "" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => setEditing(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "submit",
            size: "sm",
            disabled: saving,
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }),
              saving ? "Saving..." : "Save Changes"
            ]
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
        lead.contactName && /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }),
            label: "Contact",
            value: lead.contactName
          }
        ),
        /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }),
            label: "Email",
            value: lead.email
          }
        ),
        lead.website && /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(Globe, { className: "h-3.5 w-3.5" }),
            label: "Website",
            value: lead.website
          }
        ),
        lead.industry && /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5" }),
            label: "Industry",
            value: lead.industry
          }
        ),
        lead.estimatedTraffic && /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(BarChart3, { className: "h-3.5 w-3.5" }),
            label: "Est. Traffic",
            value: lead.estimatedTraffic
          }
        ),
        lead.leadSource && /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(Link$1, { className: "h-3.5 w-3.5" }),
            label: "Source",
            value: lead.leadSource
          }
        ),
        lead.techStack && /* @__PURE__ */ jsx(
          DetailRow,
          {
            icon: /* @__PURE__ */ jsx(BarChart3, { className: "h-3.5 w-3.5" }),
            label: "Tech Stack",
            value: lead.techStack
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-md border p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Current Stage" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              className: `mt-1 ${stageClasses}`,
              children: formatStage(lead.stage)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Score (",
            lead.score,
            "/",
            lead.maxScore,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 h-2 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-all",
              style: { width: `${scorePercent}%` }
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3 space-y-2", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Accountability" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
          lead.createdBy && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Created by: " }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: lead.createdBy.name || lead.createdBy.email })
          ] }),
          lead.approvedBy && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Approved by: " }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-emerald-400", children: lead.approvedBy.name || lead.approvedBy.email })
          ] }),
          lead.assignedTo && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Assigned to: " }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: lead.assignedTo.name || lead.assignedTo.email })
          ] }),
          lead.rejectedBy && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Rejected by: " }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-red-400", children: lead.rejectedBy.name || lead.rejectedBy.email })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Activity Timeline" }),
        /* @__PURE__ */ jsxs("div", { className: "relative space-y-0", children: [
          mergedTimeline.map((item) => {
            var _a2, _b;
            if (item.type === "stage") {
              const s = item.entry;
              return /* @__PURE__ */ jsxs(
                TimelineItem,
                {
                  icon: /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" }),
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-700",
                  date: s.changedAt,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: ((_a2 = s.changedBy) == null ? void 0 : _a2.name) || ((_b = s.changedBy) == null ? void 0 : _b.email) || "Unknown" }),
                    " ",
                    "moved from",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: s.fromStage ? formatStage(s.fromStage) : "—" }),
                    " ",
                    "to",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatStage(s.toStage) })
                  ]
                },
                `stage-${s.id}`
              );
            }
            const a = item.entry;
            const style = getActivityStyle(a.action);
            return /* @__PURE__ */ jsx(
              TimelineItem,
              {
                icon: /* @__PURE__ */ jsx("span", { className: "text-xs", children: style.icon }),
                bgColor: style.bgColor,
                textColor: style.textColor,
                date: a.createdAt,
                children: a.description
              },
              `activity-${a.id}`
            );
          }),
          mergedTimeline.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground py-2", children: "No activity recorded yet." })
        ] })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx(
      Input,
      {
        name,
        type,
        defaultValue,
        required,
        className: "h-8 text-sm"
      }
    )
  ] });
}
function DetailRow({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: "mt-0.5 text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsx("p", { className: "truncate text-foreground", children: value })
    ] })
  ] });
}
function TimelineItem({
  icon,
  bgColor,
  textColor,
  date,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 py-1.5 text-xs", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${bgColor} ${textColor}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed", children }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Clock, { className: "h-2.5 w-2.5" }),
        formatDate$1(date)
      ] })
    ] })
  ] });
}
const TEMPERATURES$2 = [{
  key: "ALL",
  label: "All",
  icon: SlidersHorizontal
}, {
  key: "HOT",
  label: "Hot",
  icon: Flame
}, {
  key: "WARM",
  label: "Warm",
  icon: ThermometerSun
}, {
  key: "COLD",
  label: "Cold",
  icon: Snowflake
}];
async function loader$p({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const [leads, pipelineStages] = await Promise.all([prisma.lead.findMany({
    where: {
      status: "ACTIVE"
    },
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      assignedTo: {
        select: {
          name: true
        }
      }
    }
  }), getStagesWithMeta()]);
  const grouped = pipelineStages.map((stage) => ({
    id: stage.name,
    label: stage.label,
    color: stage.meta.color,
    bg: stage.meta.bg,
    dot: stage.meta.dot,
    leads: leads.filter((l) => l.stage === stage.name)
  }));
  return {
    user,
    stages: grouped,
    pipelineStages
  };
}
async function action$h({
  request
}) {
  const userId = await requireAuth(request);
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      role: true
    }
  });
  if ((currentUser == null ? void 0 : currentUser.role) !== "ADMIN") {
    throw new Response("Forbidden", {
      status: 403
    });
  }
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "getLeadDetail") {
    const leadId = formData.get("leadId");
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        rejectedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        stageHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            changedAt: "desc"
          }
        },
        activityLogs: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
    return {
      lead
    };
  }
  if (intent === "editLead") {
    const leadId = formData.get("leadId");
    await prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        companyName: formData.get("companyName"),
        contactName: formData.get("contactName") || null,
        email: formData.get("email"),
        website: formData.get("website") || null,
        industry: formData.get("industry") || null,
        estimatedTraffic: formData.get("estimatedTraffic") || null,
        techStack: formData.get("techStack") || null,
        leadSource: formData.get("leadSource") || null,
        linkedin: formData.get("linkedin") || null,
        facebook: formData.get("facebook") || null,
        instagram: formData.get("instagram") || null,
        twitter: formData.get("twitter") || null,
        notes: formData.get("notes") || null
      }
    });
    await logActivity({
      leadId,
      userId,
      action: "LEAD_EDITED",
      description: `${(currentUser == null ? void 0 : currentUser.name) || "Unknown"} edited lead details`
    });
    const updated = await prisma.lead.findUnique({
      where: {
        id: leadId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        rejectedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        stageHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            changedAt: "desc"
          }
        },
        activityLogs: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
    return {
      lead: updated,
      edited: true
    };
  }
  if ((currentUser == null ? void 0 : currentUser.role) !== "ADMIN") {
    throw new Response("Forbidden", {
      status: 403
    });
  }
  if (intent === "moveStage") {
    const leadId = formData.get("leadId");
    const newStage = formData.get("newStage");
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId
      }
    });
    if (!lead) return {
      success: false
    };
    if (lead.stage === newStage) {
      return {
        success: true
      };
    }
    await prisma.$transaction([prisma.lead.update({
      where: {
        id: leadId
      },
      data: {
        stage: newStage
      }
    }), prisma.stageHistory.create({
      data: {
        leadId,
        fromStage: lead.stage,
        toStage: newStage,
        changedById: userId
      }
    })]);
    await logActivity({
      leadId,
      userId,
      action: "STAGE_CHANGED",
      description: `${currentUser.name || "Unknown"} moved from ${formatStage(lead.stage)} to ${formatStage(newStage)}`,
      metadata: {
        fromStage: lead.stage,
        toStage: newStage
      }
    });
    return {
      success: true
    };
  }
  if (intent === "bulkMoveStage") {
    const leadIdsJson = formData.get("leadIds");
    const newStage = formData.get("newStage");
    const leadIds = JSON.parse(leadIdsJson);
    const leads = await prisma.lead.findMany({
      where: {
        id: {
          in: leadIds
        }
      }
    });
    const txOps = [];
    for (const lead of leads) {
      if (lead.stage === newStage) continue;
      txOps.push(prisma.lead.update({
        where: {
          id: lead.id
        },
        data: {
          stage: newStage
        }
      }), prisma.stageHistory.create({
        data: {
          leadId: lead.id,
          fromStage: lead.stage,
          toStage: newStage,
          changedById: userId
        }
      }));
      logActivity({
        leadId: lead.id,
        userId,
        action: "STAGE_CHANGED",
        description: `${currentUser.name || "Unknown"} moved from ${formatStage(lead.stage)} to ${formatStage(newStage)}`,
        metadata: {
          fromStage: lead.stage,
          toStage: newStage
        }
      }).catch(() => {
      });
    }
    if (txOps.length > 0) {
      await prisma.$transaction(txOps);
    }
    return {
      success: true
    };
  }
  if (intent === "reorderStages") {
    const orderJson = formData.get("order");
    if (!orderJson) return {
      success: false
    };
    try {
      const order = JSON.parse(orderJson);
      const txOps = order.map((name, index) => prisma.pipelineStage.update({
        where: {
          name
        },
        data: {
          position: index
        }
      }));
      await prisma.$transaction(txOps);
      invalidateStagesCache();
    } catch (err) {
      console.error("[pipeline] Failed to reorder stages:", err);
      return {
        success: false
      };
    }
    return {
      success: true
    };
  }
  return {};
}
function filterLeads(leads, search, tempFilter) {
  const q = search.trim().toLowerCase();
  return leads.filter((l) => {
    var _a, _b;
    const matchesSearch = !q || l.companyName.toLowerCase().includes(q) || (((_a = l.contactName) == null ? void 0 : _a.toLowerCase()) ?? "").includes(q) || l.email.toLowerCase().includes(q) || (((_b = l.industry) == null ? void 0 : _b.toLowerCase()) ?? "").includes(q);
    const matchesTemp = tempFilter === "ALL" || l.temperature === tempFilter;
    return matchesSearch && matchesTemp;
  });
}
const pipeline = UNSAFE_withComponentProps(function Pipeline() {
  const {
    user,
    stages: serverStages,
    pipelineStages
  } = useLoaderData();
  const [localStages, setLocalStages] = useState(serverStages);
  const [search, setSearch] = useState("");
  const [tempFilter, setTempFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState(/* @__PURE__ */ new Set());
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [moveError, setMoveError] = useState(null);
  const detailFetcher = useFetcher();
  const moveFetcher = useFetcher();
  const reorderFetcher = useFetcher();
  useEffect$1(() => {
    setLocalStages(serverStages);
  }, [serverStages]);
  const displayStages = useMemo(() => {
    return localStages.map((stage) => ({
      ...stage,
      leads: filterLeads(stage.leads, search, tempFilter)
    }));
  }, [localStages, search, tempFilter]);
  const totalVisible = useMemo(() => displayStages.reduce((sum, s) => sum + s.leads.length, 0), [displayStages]);
  const totalAll = useMemo(() => serverStages.reduce((sum, s) => sum + s.leads.length, 0), [serverStages]);
  useEffect$1(() => {
    var _a;
    if ((_a = detailFetcher.data) == null ? void 0 : _a.lead) {
      setSelectedLead(detailFetcher.data.lead);
      if (!detailFetcher.data.edited) {
        setModalOpen(true);
      }
    }
  }, [detailFetcher.data]);
  useEffect$1(() => {
    if (moveFetcher.data) {
      if (!moveFetcher.data.success) {
        setMoveError("Failed to move lead. Please try again.");
      } else {
        setMoveError(null);
      }
    }
  }, [moveFetcher.data]);
  const handleLeadClick = useCallback((leadId) => {
    detailFetcher.submit({
      intent: "getLeadDetail",
      leadId
    }, {
      method: "POST",
      action: "/pipeline"
    });
  }, [detailFetcher]);
  const handleSaveLead = useCallback((formData) => {
    detailFetcher.submit(formData, {
      method: "POST",
      action: "/pipeline"
    });
  }, [detailFetcher]);
  const handleSelect = useCallback((leadId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => {
    setSelectedIds(/* @__PURE__ */ new Set());
  }, []);
  const onDragEnd = useCallback((result) => {
    if (result.type === "STAGE_COLUMNS") {
      if (!result.destination) return;
      setLocalStages((prev) => {
        const items = Array.from(prev);
        const [moved2] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved2);
        return items;
      });
      const currentStages = [...localStages];
      const [moved] = currentStages.splice(result.source.index, 1);
      currentStages.splice(result.destination.index, 0, moved);
      reorderFetcher.submit({
        intent: "reorderStages",
        order: JSON.stringify(currentStages.map((s) => s.id))
      }, {
        method: "POST",
        action: "/pipeline"
      });
      return;
    }
    if ((user == null ? void 0 : user.role) !== "ADMIN") return;
    if (!result.destination) return;
    const draggedId = result.draggableId;
    const newStage = result.destination.droppableId;
    const idsToMove = selectedIds.has(draggedId) ? Array.from(selectedIds) : [draggedId];
    setLocalStages((prev) => {
      const movingLeads = prev.flatMap((s) => s.leads).filter((l) => idsToMove.includes(l.id));
      return prev.map((stage) => ({
        ...stage,
        leads: [...stage.leads.filter((l) => !idsToMove.includes(l.id)), ...stage.id === newStage ? movingLeads.map((l) => ({
          ...l,
          stage: newStage
        })) : []]
      }));
    });
    clearSelection();
    setMoveError(null);
    if (idsToMove.length === 1) {
      moveFetcher.submit({
        intent: "moveStage",
        leadId: idsToMove[0],
        newStage
      }, {
        method: "POST",
        action: "/pipeline"
      });
    } else {
      moveFetcher.submit({
        intent: "bulkMoveStage",
        leadIds: JSON.stringify(idsToMove),
        newStage
      }, {
        method: "POST",
        action: "/pipeline"
      });
    }
  }, [user == null ? void 0 : user.role, selectedIds, moveFetcher, reorderFetcher, localStages]);
  const activeFilters = (search ? 1 : 0) + (tempFilter !== "ALL" ? 1 : 0);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 mb-1",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50",
              children: /* @__PURE__ */ jsx(LayoutGrid, {
                className: "h-5 w-5 text-primary/80"
              })
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold tracking-tight",
              children: "Pipeline"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-sm pl-[52px]",
            children: totalVisible === totalAll ? `${totalAll} active leads across ${serverStages.length} stages` : `Showing ${totalVisible} of ${totalAll} leads`
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [(user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsx(Link, {
            to: "/settings/stages",
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              size: "sm",
              className: "h-8 rounded-lg gap-1.5",
              children: [/* @__PURE__ */ jsx(Settings2, {
                className: "h-3.5 w-3.5"
              }), "Manage Stages"]
            })
          }), selectedIds.size > 0 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs(Badge, {
              variant: "secondary",
              className: "text-sm px-3 py-1 rounded-full gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200",
              children: [selectedIds.size, " selected"]
            }), /* @__PURE__ */ jsxs(Button, {
              variant: "ghost",
              size: "sm",
              onClick: clearSelection,
              className: "h-7 px-2 rounded-lg",
              children: [/* @__PURE__ */ jsx(X, {
                className: "h-3.5 w-3.5 mr-1"
              }), "Clear"]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative flex-1 max-w-md",
          children: [/* @__PURE__ */ jsx("div", {
            className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40",
            children: /* @__PURE__ */ jsx(Search, {
              className: "h-4 w-4"
            })
          }), /* @__PURE__ */ jsx(Input, {
            placeholder: "Search leads by company, contact, email, industry...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-10 pr-9 bg-background/50 border-border/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
          }), search && /* @__PURE__ */ jsx("button", {
            type: "button",
            onClick: () => setSearch(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground transition-colors rounded-full hover:bg-muted/50 p-0.5",
            children: /* @__PURE__ */ jsx(X, {
              className: "h-3.5 w-3.5"
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex items-center gap-1 rounded-2xl bg-muted/30 p-1 ring-1 ring-border/40",
          children: TEMPERATURES$2.map((t) => {
            const Icon = t.icon;
            const active = tempFilter === t.key;
            return /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => setTempFilter(t.key),
              className: `inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${active ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
              children: [/* @__PURE__ */ jsx(Icon, {
                className: `h-3.5 w-3.5 ${active ? "" : "opacity-50"}`
              }), t.label]
            }, t.key);
          })
        })]
      }), activeFilters > 0 && /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200",
        children: [/* @__PURE__ */ jsx(SlidersHorizontal, {
          className: "h-3.5 w-3.5"
        }), /* @__PURE__ */ jsxs("span", {
          children: [activeFilters, " filter", activeFilters > 1 ? "s" : "", " active"]
        }), /* @__PURE__ */ jsx(Button, {
          variant: "ghost",
          size: "sm",
          className: "h-6 text-xs px-2 rounded-lg",
          onClick: () => {
            setSearch("");
            setTempFilter("ALL");
          },
          children: "Reset all"
        })]
      }), moveError && /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200",
        children: [/* @__PURE__ */ jsx(AlertCircle, {
          className: "h-4 w-4 shrink-0"
        }), moveError]
      }), /* @__PURE__ */ jsx(DragDropContext, {
        onDragEnd,
        children: /* @__PURE__ */ jsx(Droppable, {
          droppableId: "STAGE_COLUMNS",
          type: "STAGE_COLUMNS",
          direction: "horizontal",
          children: (colProvided) => /* @__PURE__ */ jsxs("div", {
            ref: colProvided.innerRef,
            ...colProvided.droppableProps,
            className: "flex gap-4 overflow-x-auto pb-4 px-0.5",
            children: [displayStages.map((stage, colIndex) => /* @__PURE__ */ jsx(Draggable, {
              draggableId: `column-${stage.id}`,
              index: colIndex,
              children: (colDragProvided, colDragSnapshot) => /* @__PURE__ */ jsxs("div", {
                ref: colDragProvided.innerRef,
                ...colDragProvided.draggableProps,
                className: `flex w-72 shrink-0 flex-col transition-all duration-200 ${colDragSnapshot.isDragging ? "shadow-2xl opacity-95 rotate-1" : ""}`,
                children: [/* @__PURE__ */ jsx("div", {
                  ...colDragProvided.dragHandleProps,
                  className: `rounded-t-2xl border border-b-0 px-4 py-3 ${stage.color} ${stage.bg} cursor-grab active:cursor-grabbing backdrop-blur-sm transition-all duration-200`,
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2.5",
                      children: [(user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsx(GripVertical, {
                        className: "h-3.5 w-3.5 text-muted-foreground/30"
                      }), /* @__PURE__ */ jsx("div", {
                        className: `h-2.5 w-2.5 rounded-full ${stage.dot} ring-2 ring-white/20`
                      }), /* @__PURE__ */ jsx("h3", {
                        className: "text-sm font-semibold text-card-foreground",
                        children: stage.label
                      })]
                    }), /* @__PURE__ */ jsx(Badge, {
                      variant: "secondary",
                      className: "text-[11px] text-secondary-foreground tabular-nums rounded-lg px-2 py-0.5",
                      children: stage.leads.length
                    })]
                  })
                }), /* @__PURE__ */ jsx(Droppable, {
                  droppableId: stage.id,
                  children: (provided, snapshot) => /* @__PURE__ */ jsxs("div", {
                    ref: provided.innerRef,
                    ...provided.droppableProps,
                    className: `flex-1 space-y-2 rounded-b-2xl border border-t-0 bg-muted/20 p-2.5 transition-colors duration-200 overflow-y-auto ${snapshot.isDraggingOver ? "bg-muted/50 ring-1 ring-primary/20" : ""}`,
                    style: {
                      maxHeight: "calc(100vh - 320px)",
                      minHeight: "200px"
                    },
                    children: [stage.leads.length === 0 ? /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-col items-center justify-center py-10 px-2 text-center",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/40",
                        children: /* @__PURE__ */ jsx(Inbox, {
                          className: "h-5 w-5 text-muted-foreground/30"
                        })
                      }), /* @__PURE__ */ jsx("p", {
                        className: "mt-3 text-xs text-muted-foreground/50 font-medium",
                        children: "No leads"
                      })]
                    }) : stage.leads.map((lead, index) => /* @__PURE__ */ jsx(LeadCard, {
                      lead,
                      index,
                      draggable: (user == null ? void 0 : user.role) === "ADMIN",
                      onClick: handleLeadClick,
                      selected: selectedIds.has(lead.id),
                      onSelect: handleSelect
                    }, lead.id)), provided.placeholder]
                  })
                })]
              })
            }, stage.id)), colProvided.placeholder]
          })
        })
      }), /* @__PURE__ */ jsx(LeadDetailModal, {
        lead: selectedLead,
        stages: pipelineStages,
        open: modalOpen,
        onOpenChange: setModalOpen,
        onSave: (user == null ? void 0 : user.role) === "ADMIN" ? handleSaveLead : void 0,
        saving: detailFetcher.state === "submitting"
      })]
    })
  });
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h,
  default: pipeline,
  loader: loader$p
}, Symbol.toStringTag, { value: "Module" }));
async function loader$o({
  request
}) {
  var _a, _b, _c, _d, _e;
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true,
      gmailTokens: true
    }
  });
  const gmailConnected = !!(user == null ? void 0 : user.gmailTokens);
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "all";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const search = url.searchParams.get("q") || "";
  const pageSize = 20;
  let dbThreads = [];
  let sentCount = 0;
  try {
    dbThreads = await prisma.emailThread.findMany({
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
            email: true
          }
        },
        messages: {
          orderBy: {
            sentAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        lastMessage: "desc"
      },
      ...search ? {
        where: {
          OR: [{
            subject: {
              contains: search
            }
          }, {
            snippet: {
              contains: search
            }
          }, {
            lead: {
              companyName: {
                contains: search
              }
            }
          }, {
            lead: {
              contactName: {
                contains: search
              }
            }
          }]
        }
      } : {}
    });
    sentCount = await prisma.emailThread.count({
      where: {
        status: "SENT"
      }
    });
  } catch (err) {
    console.error("[EmailHub] DB query failed:", err);
  }
  let gmailMessages = [];
  let inboxError = null;
  if (gmailConnected && (tab === "inbox" || tab === "all")) {
    try {
      const listResult = await listMessages(userId, {
        labelIds: ["INBOX"],
        maxResults: pageSize,
        pageToken: page > 1 ? url.searchParams.get("pageToken") || void 0 : void 0,
        q: search || void 0
      });
      const results = await Promise.allSettled(listResult.messages.map((m) => getMessage(userId, m.id)));
      gmailMessages = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount > 0) {
        inboxError = `Loaded ${gmailMessages.length} messages, but ${failedCount} failed to load.`;
      }
    } catch (err) {
      const gaxiosErr = err;
      const status = (_a = gaxiosErr == null ? void 0 : gaxiosErr.response) == null ? void 0 : _a.status;
      const errorData = (_c = (_b = gaxiosErr == null ? void 0 : gaxiosErr.response) == null ? void 0 : _b.data) == null ? void 0 : _c.error;
      let errorCode = errorData;
      let errorDesc = (_e = (_d = gaxiosErr == null ? void 0 : gaxiosErr.response) == null ? void 0 : _d.data) == null ? void 0 : _e.error_description;
      if (typeof errorData === "object" && errorData !== null) {
        errorCode = errorData.status || errorData.code;
        errorDesc = errorData.message;
      }
      const msg = (gaxiosErr == null ? void 0 : gaxiosErr.message) || String(err);
      if (status === 401 || msg.includes("Invalid Credentials") || errorCode === "invalid_grant" || errorCode === "UNAUTHENTICATED") {
        inboxError = `Gmail auth failed (HTTP ${status || 401}): Your Gmail token is invalid or expired.`;
      } else {
        inboxError = `Gmail error (HTTP ${status || "?"}, ${errorCode || "unknown"}): ${errorDesc || msg}`;
      }
      console.error("[EmailHub] Gmail error:", JSON.stringify({
        status,
        errorCode,
        errorDesc,
        msg
      }));
    }
  }
  return {
    user,
    gmailConnected,
    tab,
    page,
    search,
    dbThreads,
    sentCount,
    gmailMessages,
    inboxError
  };
}
function StatusBadge$1({
  status
}) {
  const config = {
    SENT: {
      classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Send
    },
    REPLIED: {
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: MessageSquare
    },
    WAITING: {
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: Clock
    }
  };
  const c = config[status] || config.SENT;
  const Icon = c.icon;
  return /* @__PURE__ */ jsxs("span", {
    className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${c.classes}`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: "h-3 w-3"
    }), status]
  });
}
function TabButton({
  active,
  count,
  icon: Icon,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxs("button", {
    type: "button",
    onClick,
    className: `relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${active ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: "h-4 w-4"
    }), label, count !== void 0 && count > 0 && /* @__PURE__ */ jsx("span", {
      className: `rounded-full px-1.5 py-0 text-[10px] font-bold leading-none ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
      children: count
    })]
  });
}
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
function GmailInboxRow({
  msg
}) {
  const isUnread = msg.labelIds.includes("UNREAD");
  const senderName = msg.from.split("<")[0].trim();
  const initials = getInitials(senderName);
  return /* @__PURE__ */ jsxs(Link, {
    to: `/emails/inbox/${msg.id}`,
    className: "group flex items-start gap-4 p-4 transition-all duration-200 hover:bg-muted/40 cursor-pointer",
    children: [/* @__PURE__ */ jsx("div", {
      className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isUnread ? "bg-violet-500/15 text-violet-300" : "bg-muted text-muted-foreground"}`,
      children: initials
    }), /* @__PURE__ */ jsxs("div", {
      className: "min-w-0 flex-1",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */ jsx("span", {
          className: `text-sm truncate ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`,
          children: senderName
        }), isUnread && /* @__PURE__ */ jsx("span", {
          className: "h-2 w-2 rounded-full bg-blue-400 shrink-0 ring-2 ring-blue-400/20"
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: `text-sm truncate mt-0.5 ${isUnread ? "font-medium text-foreground" : "text-foreground/70"}`,
        children: msg.subject
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-1 truncate text-xs text-muted-foreground/80 leading-relaxed",
        children: msg.snippet
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "shrink-0 text-right pt-1",
      children: /* @__PURE__ */ jsx("span", {
        className: "text-[11px] tabular-nums text-muted-foreground/70 font-medium",
        children: formatDate(msg.date)
      })
    })]
  });
}
function ThreadRow({
  thread
}) {
  var _a;
  const messageCount = ((_a = thread.messages) == null ? void 0 : _a.length) || 0;
  return /* @__PURE__ */ jsx(Link, {
    to: `/emails/threads/${thread.id}`,
    className: "block cursor-pointer group",
    children: /* @__PURE__ */ jsx(Card, {
      className: "transition-all duration-200 hover:shadow-md hover:border-border/80 hover:-translate-y-px",
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "flex items-start gap-4 p-4",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 mt-0.5",
          children: /* @__PURE__ */ jsx(Send, {
            className: "h-4 w-4 text-blue-400"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 flex-wrap",
            children: [thread.lead && /* @__PURE__ */ jsx("span", {
              className: "text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors",
              children: thread.lead.companyName
            }), /* @__PURE__ */ jsx(StatusBadge$1, {
              status: thread.status
            }), messageCount > 1 && /* @__PURE__ */ jsxs("span", {
              className: "text-[11px] text-muted-foreground/60 font-medium",
              children: [messageCount, " messages"]
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm font-medium text-foreground/90 truncate mt-1",
            children: thread.subject
          }), thread.snippet && /* @__PURE__ */ jsx("p", {
            className: "mt-1 truncate text-xs text-muted-foreground/70 leading-relaxed",
            children: thread.snippet
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "shrink-0 text-right pt-1",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-[11px] tabular-nums text-muted-foreground/60 font-medium",
            children: new Date(thread.lastMessage).toLocaleDateString()
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-1.5 flex justify-end",
            children: /* @__PURE__ */ jsx(ArrowRight, {
              className: "h-4 w-4 text-muted-foreground/30 transition-all duration-200 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5"
            })
          })]
        })]
      })
    })
  });
}
function LoadingSpinner() {
  return /* @__PURE__ */ jsx(Card, {
    className: "border-dashed",
    children: /* @__PURE__ */ jsxs(CardContent, {
      className: "flex flex-col items-center justify-center py-16",
      children: [/* @__PURE__ */ jsx(Loader2, {
        className: "h-8 w-8 animate-spin text-muted-foreground/60"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-3 text-sm text-muted-foreground",
        children: "Loading emails..."
      })]
    })
  });
}
function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action: action2
}) {
  return /* @__PURE__ */ jsx(Card, {
    className: "border-dashed",
    children: /* @__PURE__ */ jsxs(CardContent, {
      className: "flex flex-col items-center justify-center py-14",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50",
        children: /* @__PURE__ */ jsx(Icon, {
          className: "h-7 w-7 text-muted-foreground/60"
        })
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-5 font-semibold text-foreground/90",
        children: title
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-1 text-sm text-muted-foreground max-w-xs text-center leading-relaxed",
        children: subtitle
      }), action2 && /* @__PURE__ */ jsx("div", {
        className: "mt-5",
        children: action2
      })]
    })
  });
}
function SectionHeader$1({
  children,
  count
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-center gap-3 px-1 pb-1",
    children: [/* @__PURE__ */ jsx("span", {
      className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60",
      children
    }), /* @__PURE__ */ jsx("div", {
      className: "flex-1 h-px bg-border/40"
    }), count !== void 0 && /* @__PURE__ */ jsx("span", {
      className: "text-[11px] font-semibold text-muted-foreground/50 tabular-nums",
      children: count
    })]
  });
}
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1e3 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    if (diffDays < 7) return d.toLocaleDateString([], {
      weekday: "short"
    });
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}
const emails = UNSAFE_withComponentProps(function EmailHub() {
  const {
    user,
    gmailConnected,
    tab,
    search,
    dbThreads,
    sentCount,
    gmailMessages,
    inboxError
  } = useLoaderData();
  const navigation = useNavigation();
  const [, setSearchParams] = useSearchParams();
  const isLoading = navigation.state === "loading";
  const isTokenExpired = !!inboxError && inboxError.includes("auth failed");
  const isActivelyConnected = gmailConnected && !isTokenExpired;
  const setTab = (t) => {
    setSearchParams((prev) => {
      prev.set("tab", t);
      prev.delete("page");
      return prev;
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q");
    setSearchParams((prev) => {
      if (q) prev.set("q", q);
      else prev.delete("q");
      prev.delete("page");
      return prev;
    });
  };
  const clearSearch = () => {
    setSearchParams((prev) => {
      prev.delete("q");
      prev.delete("page");
      return prev;
    });
  };
  const filteredThreads = (() => {
    switch (tab) {
      case "sent":
        return dbThreads.filter((t) => t.status === "SENT");
      case "drafts":
        return [];
      default:
        return dbThreads;
    }
  })();
  const tabs = [{
    key: "all",
    label: "All",
    icon: Mail
  }, {
    key: "inbox",
    label: "Gmail Inbox",
    icon: Inbox
  }, {
    key: "sent",
    label: "Sent",
    icon: Send,
    count: sentCount
  }, {
    key: "drafts",
    label: "Drafts",
    icon: FileText
  }];
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Email Hub"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mt-1",
            children: "Track conversations, manage outreach, and stay on top of replies"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex gap-2",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/emails/templates",
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              className: "bg-background hover:bg-muted/60 border-border/60 shadow-sm",
              children: [/* @__PURE__ */ jsx(FileText, {
                className: "mr-2 h-4 w-4 text-muted-foreground"
              }), "Templates"]
            })
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: `flex items-center justify-between rounded-xl border px-4 py-3 ${isActivelyConnected ? "bg-emerald-500/5 border-emerald-500/20" : isTokenExpired ? "bg-destructive/5 border-destructive/20" : "bg-amber-500/5 border-amber-500/20"}`,
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx("span", {
            className: `relative flex h-2.5 w-2.5 rounded-full ${isActivelyConnected ? "bg-emerald-400" : isTokenExpired ? "bg-destructive" : "bg-amber-400"}`,
            children: /* @__PURE__ */ jsx("span", {
              className: `absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${isActivelyConnected ? "bg-emerald-400" : isTokenExpired ? "bg-destructive" : "bg-amber-400"}`
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx("span", {
              className: "text-sm font-medium",
              children: isActivelyConnected ? "Gmail connected" : isTokenExpired ? "Gmail connection expired" : "Gmail not connected"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-sm text-muted-foreground hidden sm:inline",
              children: isActivelyConnected ? "Ready to send and receive emails" : isTokenExpired ? "Please reconnect your account to resume" : "Connect in Settings to unlock email features"
            })]
          })]
        }), !isActivelyConnected && /* @__PURE__ */ jsx(Link, {
          to: "/settings",
          children: /* @__PURE__ */ jsx(Button, {
            size: "sm",
            variant: isTokenExpired ? "destructive" : "outline",
            className: "h-8 text-xs",
            children: isTokenExpired ? "Reconnect" : "Connect"
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/40",
          children: tabs.map((t) => /* @__PURE__ */ jsx(TabButton, {
            active: tab === t.key,
            icon: t.icon,
            label: t.label,
            count: t.count,
            onClick: () => setTab(t.key)
          }, t.key))
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSearch,
          className: "flex gap-2",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "relative",
            children: [/* @__PURE__ */ jsx(Search, {
              className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50"
            }), /* @__PURE__ */ jsx(Input, {
              name: "q",
              placeholder: "Search emails...",
              defaultValue: search,
              className: "pl-9 w-64 bg-background border-border/60 shadow-sm focus-visible:ring-primary/20"
            })]
          }), search && /* @__PURE__ */ jsx(Button, {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: clearSearch,
            className: "text-muted-foreground",
            children: "Clear"
          })]
        })]
      }), isLoading ? /* @__PURE__ */ jsx(LoadingSpinner, {}) : tab === "all" ? (
        /* All tab: combine Gmail inbox + DB threads */
        /* @__PURE__ */ jsxs("div", {
          className: "space-y-5",
          children: [gmailConnected && gmailMessages.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(SectionHeader$1, {
              count: gmailMessages.length,
              children: "Gmail Inbox"
            }), /* @__PURE__ */ jsx(Card, {
              className: "overflow-hidden ring-1 ring-border/50 shadow-sm",
              children: /* @__PURE__ */ jsx("div", {
                className: "divide-y divide-border/40",
                children: gmailMessages.map((msg) => /* @__PURE__ */ jsx(GmailInboxRow, {
                  msg
                }, msg.id))
              })
            })]
          }), gmailConnected && inboxError && /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3",
            children: [/* @__PURE__ */ jsx(AlertCircle, {
              className: "h-4 w-4 text-destructive shrink-0"
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Could not load Gmail inbox: ", inboxError]
            })]
          }), filteredThreads.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(SectionHeader$1, {
              count: filteredThreads.length,
              children: "Sent from CRM"
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-3",
              children: filteredThreads.map((thread) => /* @__PURE__ */ jsx(ThreadRow, {
                thread
              }, thread.id))
            })]
          }), !gmailConnected && filteredThreads.length === 0 && /* @__PURE__ */ jsx(EmptyState, {
            icon: Mail,
            title: "No emails yet",
            subtitle: "Connect Gmail to see your inbox, or send an email from a lead's profile to get started.",
            action: /* @__PURE__ */ jsx(Link, {
              to: "/settings",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                size: "sm",
                className: "shadow-sm",
                children: [/* @__PURE__ */ jsx(Sparkles, {
                  className: "mr-2 h-3.5 w-3.5"
                }), "Connect Gmail"]
              })
            })
          }), gmailConnected && gmailMessages.length === 0 && filteredThreads.length === 0 && !inboxError && /* @__PURE__ */ jsx(EmptyState, {
            icon: Inbox,
            title: "All caught up",
            subtitle: "No emails in your inbox or sent threads yet. Send an email from a lead's profile to get started."
          })]
        })
      ) : tab === "inbox" ? (
        // Gmail Inbox tab (dedicated)
        /* @__PURE__ */ jsx("div", {
          className: "space-y-3",
          children: !gmailConnected ? /* @__PURE__ */ jsx(EmptyState, {
            icon: AlertCircle,
            title: "Gmail not connected",
            subtitle: "Connect your Gmail account to view and manage your inbox here.",
            action: /* @__PURE__ */ jsx(Link, {
              to: "/settings",
              children: /* @__PURE__ */ jsx(Button, {
                variant: "outline",
                size: "sm",
                className: "shadow-sm",
                children: "Go to Settings"
              })
            })
          }) : inboxError ? /* @__PURE__ */ jsx(Card, {
            className: "border-destructive/20",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-14",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/5 ring-1 ring-destructive/20",
                children: /* @__PURE__ */ jsx(AlertCircle, {
                  className: "h-7 w-7 text-destructive/70"
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-5 font-semibold text-destructive/90",
                children: "Failed to load inbox"
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-1 text-sm text-muted-foreground max-w-sm text-center",
                children: inboxError
              })]
            })
          }) : gmailMessages.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
            icon: Inbox,
            title: "Inbox is empty",
            subtitle: search ? "No messages match your search." : "No messages in your Gmail inbox."
          }) : /* @__PURE__ */ jsx(Card, {
            className: "overflow-hidden ring-1 ring-border/50 shadow-sm",
            children: /* @__PURE__ */ jsx("div", {
              className: "divide-y divide-border/40",
              children: gmailMessages.map((msg) => /* @__PURE__ */ jsx(GmailInboxRow, {
                msg
              }, msg.id))
            })
          })
        })
      ) : (
        // DB thread tabs (Sent / Drafts)
        /* @__PURE__ */ jsx("div", {
          className: "space-y-5",
          children: filteredThreads.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
            icon: tab === "drafts" ? FileText : Mail,
            title: tab === "drafts" ? "No drafts yet" : search ? "No threads match your search" : "No sent emails yet",
            subtitle: tab === "drafts" ? "Draft emails will appear here." : "Send an email from a lead's profile to get started."
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(SectionHeader$1, {
              count: filteredThreads.length,
              children: tab === "drafts" ? "Drafts" : "Sent"
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-3",
              children: filteredThreads.map((thread) => /* @__PURE__ */ jsx(ThreadRow, {
                thread
              }, thread.id))
            })]
          })
        })
      )]
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: emails,
  loader: loader$o
}, Symbol.toStringTag, { value: "Module" }));
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "b",
    "i",
    "u",
    "strong",
    "em",
    "s",
    "a",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "div",
    "blockquote"
  ],
  ALLOWED_ATTR: ["href", "target", "style", "class"],
  ALLOW_DATA_ATTR: false
};
function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}
const ToolbarButton = ({
  icon: Icon,
  label,
  onClick
}) => /* @__PURE__ */ jsx(
  "button",
  {
    type: "button",
    onMouseDown: (e) => {
      e.preventDefault();
      onClick();
    },
    title: label,
    className: cn(
      "flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    ),
    children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" })
  }
);
function exec(command, value) {
  document.execCommand(command, false, value);
}
function htmlToFragment(html) {
  const template = document.createElement("template");
  template.innerHTML = sanitizeHTML(html);
  return template.content;
}
const RichEditor = forwardRef(
  ({ value, onChange, placeholder, className, minHeight = 180 }, ref) => {
    const editorRef = useRef(null);
    const isInternalChange = useRef(false);
    const syncChange = useCallback(() => {
      if (editorRef.current) {
        isInternalChange.current = true;
        onChange(editorRef.current.innerHTML);
      }
    }, [onChange]);
    useImperativeHandle(ref, () => ({
      getHTML: () => {
        var _a;
        return ((_a = editorRef.current) == null ? void 0 : _a.innerHTML) || "";
      },
      getPlainText: () => {
        var _a, _b;
        return ((_a = editorRef.current) == null ? void 0 : _a.textContent) || ((_b = editorRef.current) == null ? void 0 : _b.innerText) || "";
      },
      setHTML: (html) => {
        if (editorRef.current) {
          const clean = sanitizeHTML(html);
          isInternalChange.current = true;
          editorRef.current.innerHTML = clean;
          onChange(clean);
        }
      },
      insertHTML: (html) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const fragment = htmlToFragment(html);
          range.insertNode(fragment);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editor.appendChild(htmlToFragment(html));
        }
        syncChange();
      },
      appendHTML: (html) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.appendChild(htmlToFragment(html));
        syncChange();
      }
    }));
    useEffect$1(() => {
      if (editorRef.current && !isInternalChange.current) {
        const clean = sanitizeHTML(value);
        if (editorRef.current.innerHTML !== clean) {
          editorRef.current.innerHTML = clean;
        }
      }
      isInternalChange.current = false;
    }, [value]);
    const handleInput = useCallback(() => {
      syncChange();
    }, [syncChange]);
    const handleLinkInsert = () => {
      const url = window.prompt("Enter URL:");
      if (url) {
        exec("createLink", url);
        handleInput();
      }
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "rounded-md border border-input bg-background overflow-hidden",
          "focus-within:ring-1 focus-within:ring-ring",
          className
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 border-b border-border/50 px-2 py-1 bg-muted/30", children: [
            /* @__PURE__ */ jsx(ToolbarButton, { icon: Bold, label: "Bold (Ctrl+B)", onClick: () => {
              exec("bold");
              handleInput();
            } }),
            /* @__PURE__ */ jsx(ToolbarButton, { icon: Italic, label: "Italic (Ctrl+I)", onClick: () => {
              exec("italic");
              handleInput();
            } }),
            /* @__PURE__ */ jsx(ToolbarButton, { icon: Underline, label: "Underline (Ctrl+U)", onClick: () => {
              exec("underline");
              handleInput();
            } }),
            /* @__PURE__ */ jsx("div", { className: "mx-1 h-4 w-px bg-border" }),
            /* @__PURE__ */ jsx(ToolbarButton, { icon: List, label: "Bullet list", onClick: () => {
              exec("insertUnorderedList");
              handleInput();
            } }),
            /* @__PURE__ */ jsx(ToolbarButton, { icon: ListOrdered, label: "Numbered list", onClick: () => {
              exec("insertOrderedList");
              handleInput();
            } }),
            /* @__PURE__ */ jsx(ToolbarButton, { icon: Pilcrow, label: "Paragraph", onClick: () => {
              exec("formatBlock", "p");
              handleInput();
            } }),
            /* @__PURE__ */ jsx("div", { className: "mx-1 h-4 w-px bg-border" }),
            /* @__PURE__ */ jsx(ToolbarButton, { icon: Link$1, label: "Insert link", onClick: handleLinkInsert })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: editorRef,
              contentEditable: true,
              suppressContentEditableWarning: true,
              onInput: handleInput,
              "data-placeholder": placeholder,
              className: cn(
                "prose prose-sm prose-invert max-w-none px-3 py-2 outline-none text-sm text-foreground",
                "min-h-[180px] max-h-[400px] overflow-y-auto",
                "[&_a]:text-blue-400 [&_a]:underline",
                "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
                "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
              ),
              style: { minHeight: `${minHeight}px` }
            }
          )
        ]
      }
    );
  }
);
RichEditor.displayName = "RichEditor";
async function loader$n({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const templates = await prisma.emailTemplate.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  });
  return {
    user,
    templates
  };
}
async function action$g({
  request
}) {
  await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "create") {
    await prisma.emailTemplate.create({
      data: {
        name: formData.get("name"),
        subject: formData.get("subject"),
        body: formData.get("body")
      }
    });
    return {
      success: true
    };
  }
  if (intent === "update") {
    await prisma.emailTemplate.update({
      where: {
        id: formData.get("templateId")
      },
      data: {
        name: formData.get("name"),
        subject: formData.get("subject"),
        body: formData.get("body")
      }
    });
    return {
      success: true
    };
  }
  if (intent === "delete") {
    await prisma.emailTemplate.delete({
      where: {
        id: formData.get("templateId")
      }
    });
    return {
      success: true
    };
  }
  return {};
}
const SAMPLE_DATA = {
  company_name: "Acme Corp",
  contact_name: "Jane Smith",
  email: "jane@acme.com",
  industry: "SaaS",
  website: "https://acme.com"
};
function parseTemplate(text) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = SAMPLE_DATA[key];
    if (val) return val;
    return `{{${key}}}`;
  });
}
function highlightVariables(text) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (match) {
      return /* @__PURE__ */ jsx("span", {
        className: "inline-flex items-center rounded px-1 py-0 text-[11px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/20 mx-0.5",
        children: match[1]
      }, i);
    }
    return /* @__PURE__ */ jsx("span", {
      children: part
    }, i);
  });
}
function TemplatePreview({
  html
}) {
  const iframeRef = useRef(null);
  useEffect$1(() => {
    function onMessage(e) {
      var _a;
      if (((_a = e.data) == null ? void 0 : _a.type) === "iframe-resize" && iframeRef.current) {
        iframeRef.current.style.height = e.data.height + 16 + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px; line-height: 1.6; color: #1a1a1a;
        background: #ffffff; margin: 0; padding: 16px;
        word-wrap: break-word;
      }
      a { color: #2563eb; }
      img { max-width: 100%; height: auto; }
      ul, ol { padding-left: 20px; }
    </style>
    </head>
    <body>${html}</body>
    <script>
      function reportHeight() {
        parent.postMessage({ type: 'iframe-resize', height: document.body.scrollHeight }, '*');
      }
      reportHeight();
    <\/script>
    </html>
  `;
  return /* @__PURE__ */ jsx("iframe", {
    ref: iframeRef,
    srcDoc,
    sandbox: "allow-scripts",
    title: "Template preview",
    className: "w-full border-0 bg-white rounded-lg",
    style: {
      minHeight: "160px"
    }
  });
}
const emails_templates = UNSAFE_withComponentProps(function EmailTemplates() {
  const {
    user,
    templates
  } = useLoaderData();
  const actionData = useActionData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createName, setCreateName] = useState("");
  const [createSubject, setCreateSubject] = useState("");
  const [createBody, setCreateBody] = useState("");
  const createEditorRef = useRef(null);
  const [editName, setEditName] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const editEditorRef = useRef(null);
  useEffect$1(() => {
    if (actionData == null ? void 0 : actionData.success) {
      setShowForm(false);
      setEditingId(null);
      setCreateName("");
      setCreateSubject("");
      setCreateBody("");
      setEditName("");
      setEditSubject("");
      setEditBody("");
    }
  }, [actionData]);
  const startEditing = useCallback((template) => {
    setEditingId(template.id);
    setEditName(template.name);
    setEditSubject(template.subject);
    const bodyHtml = template.body.includes("<") ? template.body : template.body.replace(/\n/g, "<br>");
    setEditBody(bodyHtml);
    setTimeout(() => {
      var _a;
      (_a = editEditorRef.current) == null ? void 0 : _a.setHTML(bodyHtml);
    }, 50);
  }, []);
  const handleCreateSubmit = (e) => {
    const form = e.currentTarget;
    const bodyInput = form.querySelector('[name="body"]');
    if (bodyInput && createEditorRef.current) {
      bodyInput.value = createEditorRef.current.getHTML();
    }
  };
  const handleEditSubmit = (e) => {
    const form = e.currentTarget;
    const bodyInput = form.querySelector('[name="body"]');
    if (bodyInput && editEditorRef.current) {
      bodyInput.value = editEditorRef.current.getHTML();
    }
  };
  const isCreating = showForm;
  const editingTemplate = templates.find((t) => t.id === editingId);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/emails",
            children: /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              className: "rounded-full hover:bg-muted",
              children: /* @__PURE__ */ jsx(ArrowLeft, {
                className: "h-4 w-4"
              })
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold tracking-tight",
              children: "Email Templates"
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-muted-foreground mt-1 max-w-xl",
              children: ["Create reusable templates with dynamic placeholders like", " ", /* @__PURE__ */ jsx("code", {
                className: "text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded-md font-bold",
                children: "{{company_name}}"
              }), " ", "and", " ", /* @__PURE__ */ jsx("code", {
                className: "text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded-md font-bold",
                children: "{{contact_name}}"
              }), ". Preview updates live as you type."]
            })]
          })]
        }), /* @__PURE__ */ jsx(Button, {
          onClick: () => {
            setShowForm(!showForm);
            setEditingId(null);
          },
          variant: showForm ? "secondary" : "default",
          className: "shrink-0 shadow-sm",
          children: showForm ? /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(X, {
              className: "mr-2 h-4 w-4"
            }), "Cancel"]
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "mr-2 h-4 w-4"
            }), "New Template"]
          })
        })]
      }), isCreating && /* @__PURE__ */ jsx(Card, {
        className: "overflow-hidden ring-1 ring-border/50 shadow-sm border-border/60",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "p-0",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "border-b border-border/40 bg-muted/20 px-5 py-3 flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Sparkles, {
              className: "h-4 w-4 text-violet-400"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-sm font-semibold",
              children: "Create New Template"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "p-5",
            children: /* @__PURE__ */ jsxs(Form, {
              method: "post",
              className: "space-y-5",
              onSubmit: handleCreateSubmit,
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "create"
              }), /* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "body",
                value: createBody
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid gap-5 lg:grid-cols-2",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-4",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsx(Label, {
                      htmlFor: "name",
                      children: "Template Name"
                    }), /* @__PURE__ */ jsx(Input, {
                      id: "name",
                      name: "name",
                      placeholder: "e.g. Cold Outreach",
                      value: createName,
                      onChange: (e) => setCreateName(e.target.value),
                      required: true,
                      className: "bg-background border-border/60 shadow-sm"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsx(Label, {
                      htmlFor: "subject",
                      children: "Subject Line"
                    }), /* @__PURE__ */ jsx(Input, {
                      id: "subject",
                      name: "subject",
                      placeholder: "e.g. Helping {{company_name}} grow",
                      value: createSubject,
                      onChange: (e) => setCreateSubject(e.target.value),
                      required: true,
                      className: "bg-background border-border/60 shadow-sm"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsx(Label, {
                      htmlFor: "create-body",
                      children: "Email Body"
                    }), /* @__PURE__ */ jsx(RichEditor, {
                      ref: createEditorRef,
                      value: createBody,
                      onChange: setCreateBody,
                      placeholder: "Write your template... Use {{variable}} for dynamic content.",
                      minHeight: 200
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx(Eye, {
                      className: "h-3.5 w-3.5 text-muted-foreground/60"
                    }), /* @__PURE__ */ jsx(Label, {
                      className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground/60",
                      children: "Live Preview"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "rounded-lg border border-border/50 bg-background overflow-hidden",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "border-b border-border/40 px-4 py-2 bg-muted/30",
                      children: /* @__PURE__ */ jsxs("p", {
                        className: "text-xs text-muted-foreground truncate",
                        children: ["Subject: ", parseTemplate(createSubject) || "(No subject)"]
                      })
                    }), /* @__PURE__ */ jsx("div", {
                      className: "p-1",
                      children: createBody ? /* @__PURE__ */ jsx(TemplatePreview, {
                        html: parseTemplate(createBody)
                      }) : /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-col items-center justify-center py-12 text-muted-foreground/50",
                        children: [/* @__PURE__ */ jsx(LayoutTemplate, {
                          className: "h-8 w-8 mb-2 opacity-40"
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-sm",
                          children: "Start typing to see a preview"
                        })]
                      })
                    })]
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex justify-end gap-2 pt-2",
                children: [/* @__PURE__ */ jsx(Button, {
                  type: "button",
                  variant: "ghost",
                  onClick: () => setShowForm(false),
                  children: "Cancel"
                }), /* @__PURE__ */ jsxs(Button, {
                  type: "submit",
                  children: [/* @__PURE__ */ jsx(Save, {
                    className: "mr-2 h-4 w-4"
                  }), "Create Template"]
                })]
              })]
            })
          })]
        })
      }), templates.length === 0 ? /* @__PURE__ */ jsx(Card, {
        className: "border-dashed",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center justify-center py-16",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50",
            children: /* @__PURE__ */ jsx(LayoutTemplate, {
              className: "h-7 w-7 text-muted-foreground/60"
            })
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-5 font-semibold text-foreground/90",
            children: "No templates yet"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-1 text-sm text-muted-foreground max-w-xs text-center leading-relaxed",
            children: "Create your first template to speed up email outreach."
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-5",
            children: /* @__PURE__ */ jsxs(Button, {
              onClick: () => setShowForm(true),
              variant: "outline",
              size: "sm",
              className: "shadow-sm",
              children: [/* @__PURE__ */ jsx(Plus, {
                className: "mr-2 h-3.5 w-3.5"
              }), "Create Template"]
            })
          })]
        })
      }) : /* @__PURE__ */ jsx("div", {
        className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        children: templates.map((template) => {
          const isEditing = editingId === template.id;
          if (isEditing && editingTemplate) {
            return /* @__PURE__ */ jsx("div", {
              className: "sm:col-span-2 xl:col-span-3",
              children: /* @__PURE__ */ jsx(Card, {
                className: "overflow-hidden ring-1 ring-border/50 shadow-sm border-border/60",
                children: /* @__PURE__ */ jsxs(CardContent, {
                  className: "p-0",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "border-b border-border/40 bg-muted/20 px-5 py-3 flex items-center justify-between",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [/* @__PURE__ */ jsx(Pencil, {
                        className: "h-4 w-4 text-violet-400"
                      }), /* @__PURE__ */ jsx("span", {
                        className: "text-sm font-semibold",
                        children: "Edit Template"
                      })]
                    }), /* @__PURE__ */ jsx(Button, {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      onClick: () => setEditingId(null),
                      className: "h-8 w-8 rounded-full",
                      children: /* @__PURE__ */ jsx(X, {
                        className: "h-4 w-4"
                      })
                    })]
                  }), /* @__PURE__ */ jsx("div", {
                    className: "p-5",
                    children: /* @__PURE__ */ jsxs(Form, {
                      method: "post",
                      className: "space-y-5",
                      onSubmit: handleEditSubmit,
                      children: [/* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "intent",
                        value: "update"
                      }), /* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "templateId",
                        value: template.id
                      }), /* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "body",
                        value: editBody
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "grid gap-5 lg:grid-cols-2",
                        children: [/* @__PURE__ */ jsxs("div", {
                          className: "space-y-4",
                          children: [/* @__PURE__ */ jsxs("div", {
                            className: "space-y-2",
                            children: [/* @__PURE__ */ jsx(Label, {
                              htmlFor: `edit-name-${template.id}`,
                              children: "Template Name"
                            }), /* @__PURE__ */ jsx(Input, {
                              id: `edit-name-${template.id}`,
                              name: "name",
                              value: editName,
                              onChange: (e) => setEditName(e.target.value),
                              required: true,
                              className: "bg-background border-border/60 shadow-sm"
                            })]
                          }), /* @__PURE__ */ jsxs("div", {
                            className: "space-y-2",
                            children: [/* @__PURE__ */ jsx(Label, {
                              htmlFor: `edit-subject-${template.id}`,
                              children: "Subject Line"
                            }), /* @__PURE__ */ jsx(Input, {
                              id: `edit-subject-${template.id}`,
                              name: "subject",
                              value: editSubject,
                              onChange: (e) => setEditSubject(e.target.value),
                              required: true,
                              className: "bg-background border-border/60 shadow-sm"
                            })]
                          }), /* @__PURE__ */ jsxs("div", {
                            className: "space-y-2",
                            children: [/* @__PURE__ */ jsx(Label, {
                              htmlFor: `edit-body-${template.id}`,
                              children: "Email Body"
                            }), /* @__PURE__ */ jsx(RichEditor, {
                              ref: editEditorRef,
                              value: editBody,
                              onChange: setEditBody,
                              placeholder: "Write your template...",
                              minHeight: 200
                            })]
                          })]
                        }), /* @__PURE__ */ jsxs("div", {
                          className: "space-y-2",
                          children: [/* @__PURE__ */ jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [/* @__PURE__ */ jsx(Eye, {
                              className: "h-3.5 w-3.5 text-muted-foreground/60"
                            }), /* @__PURE__ */ jsx(Label, {
                              className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground/60",
                              children: "Live Preview"
                            })]
                          }), /* @__PURE__ */ jsxs("div", {
                            className: "rounded-lg border border-border/50 bg-background overflow-hidden",
                            children: [/* @__PURE__ */ jsx("div", {
                              className: "border-b border-border/40 px-4 py-2 bg-muted/30",
                              children: /* @__PURE__ */ jsxs("p", {
                                className: "text-xs text-muted-foreground truncate",
                                children: ["Subject: ", parseTemplate(editSubject) || "(No subject)"]
                              })
                            }), /* @__PURE__ */ jsx("div", {
                              className: "p-1",
                              children: editBody ? /* @__PURE__ */ jsx(TemplatePreview, {
                                html: parseTemplate(editBody)
                              }) : /* @__PURE__ */ jsxs("div", {
                                className: "flex flex-col items-center justify-center py-12 text-muted-foreground/50",
                                children: [/* @__PURE__ */ jsx(LayoutTemplate, {
                                  className: "h-8 w-8 mb-2 opacity-40"
                                }), /* @__PURE__ */ jsx("p", {
                                  className: "text-sm",
                                  children: "Start typing to see a preview"
                                })]
                              })
                            })]
                          })]
                        })]
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "flex justify-end gap-2 pt-2",
                        children: [/* @__PURE__ */ jsx(Button, {
                          type: "button",
                          variant: "ghost",
                          onClick: () => setEditingId(null),
                          children: "Cancel"
                        }), /* @__PURE__ */ jsxs(Button, {
                          type: "submit",
                          children: [/* @__PURE__ */ jsx(Save, {
                            className: "mr-2 h-4 w-4"
                          }), "Save Changes"]
                        })]
                      })]
                    })
                  })]
                })
              })
            }, template.id);
          }
          return /* @__PURE__ */ jsx(Card, {
            className: "group transition-all duration-200 hover:shadow-md hover:border-border/80 hover:-translate-y-px flex flex-col",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col flex-1 p-5",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-start justify-between gap-3",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "min-w-0 flex-1",
                  children: [/* @__PURE__ */ jsx("h3", {
                    className: "font-semibold text-foreground/90 truncate group-hover:text-foreground transition-colors",
                    children: template.name
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-muted-foreground mt-1 truncate",
                    children: template.subject
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  children: [/* @__PURE__ */ jsx(Button, {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 rounded-full hover:bg-muted",
                    onClick: () => startEditing(template),
                    children: /* @__PURE__ */ jsx(Pencil, {
                      className: "h-3.5 w-3.5 text-muted-foreground"
                    })
                  }), /* @__PURE__ */ jsxs(Form, {
                    method: "post",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "intent",
                      value: "delete"
                    }), /* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "templateId",
                      value: template.id
                    }), /* @__PURE__ */ jsx(Button, {
                      type: "submit",
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 rounded-full hover:bg-destructive/10",
                      children: /* @__PURE__ */ jsx(Trash2, {
                        className: "h-3.5 w-3.5 text-destructive/70 hover:text-destructive"
                      })
                    })]
                  })]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "mt-4 flex-1",
                children: /* @__PURE__ */ jsx("div", {
                  className: "rounded-lg bg-muted/30 border border-border/40 px-3 py-2.5 min-h-[80px]",
                  children: /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-muted-foreground/80 line-clamp-4 leading-relaxed",
                    children: highlightVariables(template.body)
                  })
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground/50",
                children: [/* @__PURE__ */ jsx(Clock, {
                  className: "h-3 w-3"
                }), "Updated ", new Date(template.updatedAt).toLocaleDateString()]
              })]
            })
          }, template.id);
        })
      })]
    })
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g,
  default: emails_templates,
  loader: loader$n
}, Symbol.toStringTag, { value: "Module" }));
async function loader$m({
  request,
  params
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true,
      gmailTokens: true
    }
  });
  const thread = await prisma.emailThread.findUnique({
    where: {
      id: params.threadId
    },
    include: {
      lead: {
        select: {
          id: true,
          companyName: true,
          contactName: true,
          email: true
        }
      },
      messages: {
        orderBy: {
          sentAt: "asc"
        }
      }
    }
  });
  if (!thread) {
    throw new Response("Thread not found", {
      status: 404
    });
  }
  return {
    user,
    thread,
    gmailConnected: !!(user == null ? void 0 : user.gmailTokens)
  };
}
async function action$f({
  request,
  params
}) {
  var _a;
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "reply") {
    const body = formData.get("body");
    const threadId = params.threadId;
    if (!(body == null ? void 0 : body.trim())) {
      return {
        error: "Reply body cannot be empty."
      };
    }
    const thread = await prisma.emailThread.findUnique({
      where: {
        id: threadId
      },
      include: {
        lead: true
      }
    });
    if (!thread || !((_a = thread.lead) == null ? void 0 : _a.email)) {
      return {
        error: "Thread or lead email not found."
      };
    }
    try {
      const signature = await getGmailSignature(userId);
      const htmlBody = buildHtmlEmail(body, signature);
      const result = await sendEmail(userId, {
        to: thread.lead.email,
        subject: thread.subject || "(No Subject)",
        body,
        htmlBody,
        threadId: thread.gmailThreadId
      });
      const now = /* @__PURE__ */ new Date();
      const gmailToken = await prisma.gmailToken.findUnique({
        where: {
          userId
        }
      });
      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: (gmailToken == null ? void 0 : gmailToken.gmailAddress) || "me",
          toAddress: thread.lead.email,
          subject: thread.subject,
          bodyPlain: body,
          bodyHtml: htmlBody,
          snippet: body.substring(0, 200),
          direction: "sent",
          sentAt: now
        }
      });
      await prisma.emailThread.update({
        where: {
          id: thread.id
        },
        data: {
          snippet: body.substring(0, 200),
          lastMessage: now,
          status: "REPLIED"
        }
      });
      return {
        success: true
      };
    } catch (err) {
      return {
        error: (err == null ? void 0 : err.message) || "Failed to send reply."
      };
    }
  }
  return {};
}
function MessageAvatar$1({
  direction,
  from
}) {
  const initial = (direction === "sent" ? "You" : from || "?")[0].toUpperCase();
  const isSent = direction === "sent";
  return /* @__PURE__ */ jsx("div", {
    className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSent ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"}`,
    children: isSent ? /* @__PURE__ */ jsx(User, {
      className: "h-3.5 w-3.5"
    }) : initial
  });
}
function formatMessageTime$1(date) {
  const d = new Date(date);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const emails_threads_$threadId = UNSAFE_withComponentProps(function ThreadDetail() {
  var _a, _b, _c;
  const {
    user,
    thread,
    gmailConnected
  } = useLoaderData();
  const actionData = useActionData();
  const [replyOpen, setReplyOpen] = useState(false);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8 max-w-4xl",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-start gap-3",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/emails",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            className: "rounded-full hover:bg-muted mt-1",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight truncate",
            children: thread.subject || "(No Subject)"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 mt-2 flex-wrap",
            children: [thread.lead && /* @__PURE__ */ jsxs(Link, {
              to: `/leads/${thread.lead.id}/emails`,
              className: "inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-sm font-medium text-violet-400 hover:bg-violet-500/15 transition-colors",
              children: [/* @__PURE__ */ jsx(User, {
                className: "h-3 w-3"
              }), thread.lead.companyName]
            }), /* @__PURE__ */ jsx(Badge, {
              variant: thread.status === "REPLIED" ? "success" : thread.status === "WAITING" ? "warning" : "secondary",
              className: "rounded-full text-[11px] uppercase tracking-wider",
              children: thread.status
            })]
          })]
        }), gmailConnected && ((_a = thread.lead) == null ? void 0 : _a.email) && /* @__PURE__ */ jsxs(Button, {
          onClick: () => setReplyOpen(!replyOpen),
          variant: replyOpen ? "secondary" : "default",
          className: "shadow-sm shrink-0",
          children: [/* @__PURE__ */ jsx(Reply, {
            className: "mr-2 h-4 w-4"
          }), replyOpen ? "Close" : "Reply"]
        })]
      }), replyOpen && /* @__PURE__ */ jsxs(Card, {
        className: "overflow-hidden border-border/60 shadow-sm",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-3 border-b border-border/40 bg-muted/20",
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "text-sm flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(MessageCircle, {
              className: "h-4 w-4 text-blue-400"
            }), "Reply to ", ((_b = thread.lead) == null ? void 0 : _b.contactName) || ((_c = thread.lead) == null ? void 0 : _c.email) || "lead"]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          className: "pt-4",
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-3",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "reply"
            }), /* @__PURE__ */ jsx(Textarea, {
              name: "body",
              placeholder: "Type your reply...",
              rows: 5,
              required: true,
              autoFocus: true,
              className: "bg-background border-border/60 shadow-sm resize-none"
            }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", {
              className: "text-sm text-destructive",
              children: actionData.error
            }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", {
              className: "text-sm text-emerald-400 font-medium",
              children: "Reply sent successfully!"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-2",
              children: [/* @__PURE__ */ jsxs(Button, {
                type: "submit",
                size: "sm",
                className: "shadow-sm",
                children: [/* @__PURE__ */ jsx(Send, {
                  className: "mr-2 h-3 w-3"
                }), "Send Reply"]
              }), /* @__PURE__ */ jsx(Button, {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => setReplyOpen(false),
                children: "Cancel"
              })]
            })]
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-6",
        children: thread.messages.length === 0 ? /* @__PURE__ */ jsx(Card, {
          className: "border-dashed",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex flex-col items-center py-14",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50",
              children: /* @__PURE__ */ jsx(Mail, {
                className: "h-7 w-7 text-muted-foreground/60"
              })
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-5 font-semibold text-foreground/90",
              children: "No messages yet"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 text-sm text-muted-foreground",
              children: "This thread is empty. Send a reply to start the conversation."
            })]
          })
        }) : /* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx("div", {
            className: "absolute left-[15px] top-0 bottom-0 w-px bg-border/50"
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6",
            children: thread.messages.map((msg) => /* @__PURE__ */ jsxs("div", {
              className: "relative pl-10",
              children: [/* @__PURE__ */ jsx("div", {
                className: `absolute left-[10px] top-3 h-2.5 w-2.5 rounded-full ring-4 ${msg.direction === "sent" ? "bg-blue-400 ring-background" : "bg-violet-400 ring-background"}`
              }), /* @__PURE__ */ jsxs("div", {
                className: `rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-sm ${msg.direction === "sent" ? "border-blue-500/15 bg-gradient-to-br from-blue-500/[0.03] to-transparent" : "border-border/60 bg-card"}`,
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center justify-between px-4 py-3 border-b border-border/30",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2.5",
                    children: [/* @__PURE__ */ jsx(MessageAvatar$1, {
                      direction: msg.direction,
                      from: msg.fromAddress
                    }), /* @__PURE__ */ jsxs("div", {
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "text-sm font-semibold",
                        children: msg.direction === "sent" ? "You" : msg.fromAddress
                      }), msg.direction === "sent" && /* @__PURE__ */ jsx("span", {
                        className: "ml-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded",
                        children: "Sent"
                      })]
                    })]
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-[11px] tabular-nums text-muted-foreground/60 font-medium",
                    children: formatMessageTime$1(msg.sentAt || msg.createdAt)
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "px-4 py-3",
                  children: /* @__PURE__ */ jsx("p", {
                    className: "text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed",
                    children: msg.bodyPlain || msg.snippet || "(No content)"
                  })
                })]
              })]
            }, msg.id))
          })]
        })
      })]
    })
  });
});
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$f,
  default: emails_threads_$threadId,
  loader: loader$m
}, Symbol.toStringTag, { value: "Module" }));
async function loader$l({
  request,
  params
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true,
      gmailTokens: true
    }
  });
  const gmailConnected = !!(user == null ? void 0 : user.gmailTokens);
  if (!gmailConnected) {
    throw new Response("Gmail not connected", {
      status: 403
    });
  }
  const msg = await getMessage(userId, params.messageId);
  const existingThread = await prisma.emailThread.findFirst({
    where: {
      gmailThreadId: msg.threadId
    },
    include: {
      lead: {
        select: {
          id: true,
          companyName: true,
          contactName: true,
          email: true
        }
      },
      messages: {
        orderBy: {
          sentAt: "asc"
        }
      }
    }
  });
  const senderEmail = extractEmailAddress(msg.from);
  const matchedLead = await prisma.lead.findFirst({
    where: {
      email: senderEmail
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true
    }
  });
  return {
    user,
    msg,
    existingThread,
    matchedLead
  };
}
async function action$e({
  request,
  params
}) {
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "reply") {
    const body = formData.get("body");
    const toAddress = formData.get("toAddress");
    const subject = formData.get("subject");
    const gmailThreadId = formData.get("gmailThreadId");
    if (!(body == null ? void 0 : body.trim())) {
      return {
        error: "Reply body cannot be empty."
      };
    }
    try {
      const signature = await getGmailSignature(userId);
      const htmlBody = buildHtmlEmail(body, signature);
      const result = await sendEmail(userId, {
        to: toAddress,
        subject,
        body,
        htmlBody,
        threadId: gmailThreadId
      });
      const now = /* @__PURE__ */ new Date();
      const gmailToken = await prisma.gmailToken.findUnique({
        where: {
          userId
        }
      });
      let thread = await prisma.emailThread.findFirst({
        where: {
          gmailThreadId: result.gmailThreadId
        }
      });
      if (!thread) {
        const senderEmail = extractEmailAddress(toAddress);
        const lead = await prisma.lead.findFirst({
          where: {
            email: senderEmail
          }
        });
        thread = await prisma.emailThread.create({
          data: {
            leadId: (lead == null ? void 0 : lead.id) || null,
            gmailThreadId: result.gmailThreadId,
            subject,
            snippet: body.substring(0, 200),
            status: "REPLIED",
            lastMessage: now
          }
        });
      }
      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: (gmailToken == null ? void 0 : gmailToken.gmailAddress) || "me",
          toAddress,
          subject,
          bodyPlain: body,
          bodyHtml: htmlBody,
          snippet: body.substring(0, 200),
          direction: "sent",
          sentAt: now
        }
      });
      await prisma.emailThread.update({
        where: {
          id: thread.id
        },
        data: {
          snippet: body.substring(0, 200),
          lastMessage: now,
          status: "REPLIED"
        }
      });
      return {
        success: true
      };
    } catch (err) {
      return {
        error: (err == null ? void 0 : err.message) || "Failed to send reply."
      };
    }
  }
  return {};
}
function extractEmailAddress(from) {
  const match = from.match(/<(.+?)>/);
  return match ? match[1] : from.trim();
}
function EmailBody({
  html,
  plain
}) {
  const iframeRef = useRef(null);
  useEffect(() => {
    function onMessage(e) {
      var _a;
      if (((_a = e.data) == null ? void 0 : _a.type) === "iframe-resize" && iframeRef.current) {
        iframeRef.current.style.height = e.data.height + 32 + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  if (html) {
    const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px; line-height: 1.6; color: #1a1a1a;
    margin: 0; padding: 16px; background: #fff;
    word-wrap: break-word;
  }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  table { max-width: 100%; }
</style>
</head>
<body>${html}</body>
<script>
  function reportHeight() {
    parent.postMessage({ type: 'iframe-resize', height: document.body.scrollHeight }, '*');
  }
  reportHeight();
  new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true });
<\/script>
</html>`;
    return /* @__PURE__ */ jsx("iframe", {
      ref: iframeRef,
      srcDoc: srcdoc,
      sandbox: "allow-scripts",
      title: "Email content",
      className: "w-full border-0 rounded-lg",
      style: {
        minHeight: "200px"
      }
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed px-2",
    children: plain || "(No content)"
  });
}
function MessageAvatar({
  direction,
  from
}) {
  const initial = (direction === "sent" ? "You" : from || "?")[0].toUpperCase();
  const isSent = direction === "sent";
  return /* @__PURE__ */ jsx("div", {
    className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSent ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"}`,
    children: isSent ? /* @__PURE__ */ jsx(User, {
      className: "h-3.5 w-3.5"
    }) : initial
  });
}
function formatMessageTime(date) {
  const d = new Date(date);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const emails_inbox_$messageId = UNSAFE_withComponentProps(function GmailMessageDetail() {
  const {
    user,
    msg,
    existingThread,
    matchedLead
  } = useLoaderData();
  const actionData = useActionData();
  const [replyOpen, setReplyOpen] = useState(false);
  const senderEmail = extractEmailAddress(msg.from);
  const replySubject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8 max-w-4xl",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-start gap-3",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/emails?tab=inbox",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            className: "rounded-full hover:bg-muted mt-1",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight truncate",
            children: msg.subject || "(No Subject)"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 mt-2 flex-wrap",
            children: [/* @__PURE__ */ jsxs("span", {
              className: "text-sm text-muted-foreground",
              children: ["From: ", msg.from]
            }), matchedLead && /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground hidden sm:inline",
                children: "·"
              }), /* @__PURE__ */ jsxs(Link, {
                to: `/leads/${matchedLead.id}/emails`,
                className: "inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-sm font-medium text-violet-400 hover:bg-violet-500/15 transition-colors",
                children: [/* @__PURE__ */ jsx(Link2, {
                  className: "h-3 w-3"
                }), matchedLead.companyName]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(Button, {
          onClick: () => setReplyOpen(!replyOpen),
          variant: replyOpen ? "secondary" : "default",
          className: "shadow-sm shrink-0",
          children: [/* @__PURE__ */ jsx(Reply, {
            className: "mr-2 h-4 w-4"
          }), replyOpen ? "Close" : "Reply"]
        })]
      }), matchedLead && !existingThread && /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15",
          children: /* @__PURE__ */ jsx(Mail, {
            className: "h-4 w-4 text-violet-400"
          })
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-muted-foreground",
          children: ["This email matches lead", " ", /* @__PURE__ */ jsx(Link, {
            to: `/leads/${matchedLead.id}/emails`,
            className: "font-medium text-violet-400 hover:underline",
            children: matchedLead.companyName
          }), ". Replying will auto-associate this thread."]
        })]
      }), replyOpen && /* @__PURE__ */ jsx(Card, {
        className: "overflow-hidden border-border/60 shadow-sm",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "p-0",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "border-b border-border/40 bg-muted/20 px-5 py-3 flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(MessageCircle, {
              className: "h-4 w-4 text-blue-400"
            }), /* @__PURE__ */ jsx("span", {
              className: "text-sm font-semibold",
              children: "Compose Reply"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "p-5 space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "grid gap-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-[auto_1fr] gap-3 items-center text-sm",
                children: [/* @__PURE__ */ jsx(Label, {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-12",
                  children: "To"
                }), /* @__PURE__ */ jsx("span", {
                  className: "truncate text-foreground/80",
                  children: senderEmail
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-[auto_1fr] gap-3 items-center text-sm",
                children: [/* @__PURE__ */ jsx(Label, {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-12",
                  children: "Subject"
                }), /* @__PURE__ */ jsx("span", {
                  className: "truncate text-foreground/80",
                  children: replySubject
                })]
              })]
            }), /* @__PURE__ */ jsxs(Form, {
              method: "post",
              className: "space-y-3",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "reply"
              }), /* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "toAddress",
                value: senderEmail
              }), /* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "subject",
                value: replySubject
              }), /* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "gmailThreadId",
                value: msg.threadId
              }), /* @__PURE__ */ jsx(Textarea, {
                name: "body",
                placeholder: "Type your reply...",
                rows: 6,
                required: true,
                autoFocus: true,
                className: "bg-background border-border/60 shadow-sm resize-none"
              }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", {
                className: "text-sm text-destructive",
                children: actionData.error
              }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", {
                className: "text-sm text-emerald-400 font-medium",
                children: "Reply sent successfully!"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex gap-2",
                children: [/* @__PURE__ */ jsxs(Button, {
                  type: "submit",
                  size: "sm",
                  className: "shadow-sm",
                  children: [/* @__PURE__ */ jsx(Send, {
                    className: "mr-2 h-3 w-3"
                  }), "Send Reply"]
                }), /* @__PURE__ */ jsx(Button, {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setReplyOpen(false),
                  children: "Cancel"
                })]
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsxs(Card, {
        className: "overflow-hidden border-border/60 shadow-sm",
        children: [/* @__PURE__ */ jsx("div", {
          className: "border-b border-border/40 bg-muted/20 px-5 py-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between gap-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-sm font-bold",
                children: (msg.from[0] || "?").toUpperCase()
              }), /* @__PURE__ */ jsxs("div", {
                className: "min-w-0",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm font-semibold truncate",
                  children: msg.from
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-muted-foreground truncate",
                  children: ["To: ", msg.to]
                })]
              })]
            }), /* @__PURE__ */ jsx("span", {
              className: "text-[11px] tabular-nums text-muted-foreground/60 font-medium shrink-0",
              children: new Date(msg.date).toLocaleString()
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "p-4",
          children: /* @__PURE__ */ jsx(EmailBody, {
            html: msg.bodyHtml,
            plain: msg.bodyPlain || msg.snippet
          })
        })]
      }), existingThread && existingThread.messages.length > 0 && /* @__PURE__ */ jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3 px-1",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50",
            children: "Thread History"
          }), /* @__PURE__ */ jsx("div", {
            className: "flex-1 h-px bg-border/40"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-[11px] font-semibold text-muted-foreground/40 tabular-nums",
            children: [existingThread.messages.length, " messages"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx("div", {
            className: "absolute left-[15px] top-0 bottom-0 w-px bg-border/50"
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6",
            children: existingThread.messages.map((m) => /* @__PURE__ */ jsxs("div", {
              className: "relative pl-10",
              children: [/* @__PURE__ */ jsx("div", {
                className: `absolute left-[10px] top-3 h-2.5 w-2.5 rounded-full ring-4 ${m.direction === "sent" ? "bg-blue-400 ring-background" : "bg-violet-400 ring-background"}`
              }), /* @__PURE__ */ jsxs("div", {
                className: `rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-sm ${m.direction === "sent" ? "border-blue-500/15 bg-gradient-to-br from-blue-500/[0.03] to-transparent" : "border-border/60 bg-card"}`,
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center justify-between px-4 py-3 border-b border-border/30",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2.5",
                    children: [/* @__PURE__ */ jsx(MessageAvatar, {
                      direction: m.direction,
                      from: m.fromAddress
                    }), /* @__PURE__ */ jsxs("div", {
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "text-sm font-semibold",
                        children: m.direction === "sent" ? "You" : m.fromAddress
                      }), m.direction === "sent" && /* @__PURE__ */ jsx("span", {
                        className: "ml-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded",
                        children: "Sent"
                      })]
                    })]
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-[11px] tabular-nums text-muted-foreground/60 font-medium",
                    children: formatMessageTime(m.sentAt || m.createdAt)
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "px-4 py-3",
                  children: /* @__PURE__ */ jsx("p", {
                    className: "text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed",
                    children: m.bodyPlain || m.snippet || "(No content)"
                  })
                })]
              })]
            }, m.id))
          })]
        })]
      })]
    })
  });
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$e,
  default: emails_inbox_$messageId,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
async function loader$k({
  request,
  params
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true,
      gmailTokens: true
    }
  });
  const lead = await prisma.lead.findUnique({
    where: {
      id: params.leadId
    }
  });
  if (!lead) {
    throw new Response("Lead not found", {
      status: 404
    });
  }
  let emailThreads = [];
  try {
    emailThreads = await prisma.emailThread.findMany({
      where: {
        leadId: lead.id
      },
      orderBy: {
        lastMessage: "desc"
      },
      include: {
        messages: {
          orderBy: {
            sentAt: "desc"
          }
        }
      }
    });
  } catch (err) {
    console.error("[leads/emails] Failed to load email threads:", err);
  }
  let templates = [];
  try {
    templates = await prisma.emailTemplate.findMany({
      orderBy: {
        name: "asc"
      }
    });
  } catch (err) {
    console.error("[leads/emails] Failed to load templates:", err);
  }
  let gmailSignature = "";
  const gmailConnected = !!(user == null ? void 0 : user.gmailTokens);
  if (gmailConnected) {
    try {
      gmailSignature = await getGmailSignature(userId);
    } catch (err) {
      console.error("[leads/emails] Failed to load Gmail signature:", err);
    }
  }
  return {
    user,
    lead,
    emails: emailThreads,
    templates,
    gmailConnected,
    gmailSignature
  };
}
async function action$d({
  request,
  params
}) {
  var _a;
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "sendEmail") {
    const lead = await prisma.lead.findUnique({
      where: {
        id: params.leadId
      }
    });
    const subject = formData.get("subject");
    const bodyHtml = formData.get("bodyHtml");
    const bodyPlain = formData.get("bodyPlain");
    if (!(lead == null ? void 0 : lead.email)) {
      return {
        error: "This lead has no email address."
      };
    }
    if (!(subject == null ? void 0 : subject.trim()) || !(bodyPlain == null ? void 0 : bodyPlain.trim())) {
      return {
        error: "Subject and body are required."
      };
    }
    try {
      const signature = await getGmailSignature(userId);
      const finalHtml = signature && !bodyHtml.includes(signature) ? `${bodyHtml}<br><br>${signature}` : bodyHtml;
      const result = await sendEmail(userId, {
        to: lead.email,
        subject,
        body: bodyPlain,
        htmlBody: finalHtml
      });
      const now = /* @__PURE__ */ new Date();
      const thread = await prisma.emailThread.create({
        data: {
          leadId: lead.id,
          gmailThreadId: result.gmailThreadId,
          subject,
          snippet: bodyPlain.substring(0, 200),
          status: "SENT",
          lastMessage: now
        }
      });
      const gmailToken = await prisma.gmailToken.findUnique({
        where: {
          userId
        }
      });
      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: (gmailToken == null ? void 0 : gmailToken.gmailAddress) || "me",
          toAddress: lead.email,
          subject,
          bodyPlain,
          bodyHtml: finalHtml,
          snippet: bodyPlain.substring(0, 200),
          direction: "sent",
          sentAt: now
        }
      });
      return {
        success: true,
        sent: {
          subject
        }
      };
    } catch (err) {
      const message = ((_a = err == null ? void 0 : err.message) == null ? void 0 : _a.includes("has not connected Gmail")) ? "Gmail is not connected. Go to Settings to connect your account." : (err == null ? void 0 : err.message) || "Failed to send email. Please try again.";
      return {
        error: message
      };
    }
  }
  return {};
}
const leads_$leadId_emails = UNSAFE_withComponentProps(function LeadEmails() {
  var _a, _b;
  const {
    user,
    lead,
    emails: emails2,
    templates,
    gmailConnected,
    gmailSignature
  } = useLoaderData();
  const actionData = useActionData();
  const [expandedThread, setExpandedThread] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  useEffect$1(() => {
    function onMessage(e) {
      var _a2;
      if (((_a2 = e.data) == null ? void 0 : _a2.type) === "iframe-resize" && previewRef.current) {
        previewRef.current.style.height = e.data.height + 24 + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  const parsePreview = useCallback((text) => {
    const replacements = {
      company_name: lead.companyName,
      contact_name: lead.contactName || "",
      email: lead.email || "",
      industry: lead.industry || "",
      website: lead.website || ""
    };
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] || `{{${key}}}`);
  }, [lead]);
  const handleTemplateChange = (templateId) => {
    var _a2, _b2;
    setSelectedTemplate(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setSubject(parsePreview(tmpl.subject));
      let htmlBody;
      if (tmpl.body.includes("<") && tmpl.body.includes(">")) {
        htmlBody = parsePreview(tmpl.body);
      } else {
        htmlBody = parsePreview(tmpl.body).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
      }
      setBodyHtml(htmlBody);
      (_a2 = editorRef.current) == null ? void 0 : _a2.setHTML(htmlBody);
    } else {
      setSubject("");
      setBodyHtml("");
      (_b2 = editorRef.current) == null ? void 0 : _b2.setHTML("");
    }
  };
  const handleInsertSignature = () => {
    if (gmailSignature && editorRef.current) {
      editorRef.current.appendHTML(`<br><br>${gmailSignature}`);
    }
  };
  const previewSrcDoc = bodyHtml ? buildPreviewHtml(gmailSignature && !bodyHtml.includes(gmailSignature) ? `${bodyHtml}<br><br>${gmailSignature}` : bodyHtml) : "";
  const leadInitial = (((_a = lead.companyName) == null ? void 0 : _a[0]) || ((_b = lead.contactName) == null ? void 0 : _b[0]) || "?").toUpperCase();
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-start gap-3",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/inbox",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            className: "rounded-full hover:bg-muted mt-1",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 text-sm font-bold ring-1 ring-violet-500/20",
            children: leadInitial
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold tracking-tight",
              children: lead.companyName
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 mt-1 flex-wrap",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-sm text-muted-foreground",
                children: lead.contactName
              }), lead.email && /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-muted-foreground/40",
                  children: "·"
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-sm text-muted-foreground/70",
                  children: lead.email
                })]
              })]
            })]
          })]
        })]
      }), !gmailConnected && /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15",
            children: /* @__PURE__ */ jsx(AlertCircle, {
              className: "h-4 w-4 text-amber-400"
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("span", {
              className: "text-sm font-medium",
              children: "Gmail not connected"
            }), /* @__PURE__ */ jsxs("span", {
              className: "text-sm text-muted-foreground hidden sm:inline",
              children: [" ", "— Connect your account in", " ", /* @__PURE__ */ jsx(Link, {
                to: "/settings",
                className: "underline hover:text-foreground transition-colors",
                children: "Settings"
              }), " ", "to send emails."]
            })]
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/settings",
          className: "shrink-0",
          children: /* @__PURE__ */ jsx(Button, {
            size: "sm",
            variant: "outline",
            className: "h-8 text-xs",
            children: "Connect"
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsx("div", {
          className: "space-y-4",
          children: /* @__PURE__ */ jsxs(Card, {
            className: "overflow-hidden border-border/60 shadow-sm",
            children: [/* @__PURE__ */ jsx(CardHeader, {
              className: "border-b border-border/40 bg-muted/20 pb-3",
              children: /* @__PURE__ */ jsxs(CardTitle, {
                className: "text-base flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Mail, {
                  className: "h-4 w-4 text-blue-400"
                }), "Compose"]
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              className: "pt-5",
              children: /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "space-y-4",
                onSubmit: (e) => {
                  const form = e.currentTarget;
                  const plain = form.querySelector('[name="bodyPlain"]');
                  if (plain && editorRef.current) {
                    plain.value = editorRef.current.getPlainText();
                  }
                  const html = form.querySelector('[name="bodyHtml"]');
                  if (html && editorRef.current) {
                    html.value = editorRef.current.getHTML();
                  }
                },
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "sendEmail"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "bodyHtml",
                  defaultValue: bodyHtml
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "bodyPlain",
                  defaultValue: ""
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx(Label, {
                    className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                    children: "To"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5",
                    children: [/* @__PURE__ */ jsx(User, {
                      className: "h-3.5 w-3.5 text-muted-foreground/40"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-sm truncate text-foreground/80",
                      children: lead.email || "No email address"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx(Label, {
                    className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                    children: "Load Template"
                  }), /* @__PURE__ */ jsxs(Select, {
                    value: selectedTemplate,
                    onChange: (e) => handleTemplateChange(e.target.value),
                    className: "bg-background border-border/60 shadow-sm",
                    children: [/* @__PURE__ */ jsx("option", {
                      value: "",
                      children: "Choose a template..."
                    }), templates.map((t) => /* @__PURE__ */ jsx("option", {
                      value: t.id,
                      children: t.name
                    }, t.id))]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsx(Label, {
                    className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                    children: "Subject"
                  }), /* @__PURE__ */ jsx(Input, {
                    name: "subject",
                    value: subject,
                    onChange: (e) => setSubject(e.target.value),
                    placeholder: "Email subject...",
                    required: true,
                    className: "bg-background border-border/60 shadow-sm"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [/* @__PURE__ */ jsx(Label, {
                      className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                      children: "Message"
                    }), gmailSignature && /* @__PURE__ */ jsxs("button", {
                      type: "button",
                      onClick: handleInsertSignature,
                      className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
                      children: [/* @__PURE__ */ jsx(PenLine, {
                        className: "h-3 w-3"
                      }), "Insert Signature"]
                    })]
                  }), /* @__PURE__ */ jsx(RichEditor, {
                    ref: editorRef,
                    value: bodyHtml,
                    onChange: setBodyHtml,
                    placeholder: "Write your message...",
                    minHeight: 200
                  })]
                }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsxs("div", {
                  className: "rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 font-medium flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx(Sparkles, {
                    className: "h-4 w-4"
                  }), "Email sent successfully!"]
                }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
                  className: "rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive",
                  children: actionData.error
                }), /* @__PURE__ */ jsxs(Button, {
                  type: "submit",
                  className: "w-full shadow-sm",
                  disabled: !gmailConnected || !subject.trim() || !bodyHtml.replace(/<[^>]*>/g, "").trim(),
                  children: [/* @__PURE__ */ jsx(Send, {
                    className: "mr-2 h-4 w-4"
                  }), "Send Email"]
                })]
              })
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-6",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                children: "Live Preview"
              }), gmailSignature && /* @__PURE__ */ jsx("span", {
                className: "text-[11px] text-muted-foreground/50",
                children: "with signature"
              })]
            }), /* @__PURE__ */ jsx(Card, {
              className: "overflow-hidden border-border/60 shadow-sm",
              children: previewSrcDoc ? /* @__PURE__ */ jsx("iframe", {
                ref: previewRef,
                srcDoc: previewSrcDoc,
                sandbox: "allow-scripts",
                title: "Email preview",
                className: "w-full border-0 bg-white",
                style: {
                  minHeight: "200px"
                }
              }) : /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col items-center justify-center py-16",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50",
                  children: /* @__PURE__ */ jsx(Send, {
                    className: "h-5 w-5 text-muted-foreground/30"
                  })
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-3 text-muted-foreground text-sm",
                  children: "Start typing to see a preview"
                })]
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 mb-3",
              children: [/* @__PURE__ */ jsx(Clock, {
                className: "h-3.5 w-3.5 text-muted-foreground/50"
              }), /* @__PURE__ */ jsx("h3", {
                className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                children: "Email History"
              }), /* @__PURE__ */ jsx("div", {
                className: "flex-1 h-px bg-border/40"
              }), emails2.length > 0 && /* @__PURE__ */ jsx("span", {
                className: "text-[11px] font-semibold text-muted-foreground/40 tabular-nums",
                children: emails2.length
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-3",
              children: emails2.length === 0 ? /* @__PURE__ */ jsx(Card, {
                className: "border-dashed",
                children: /* @__PURE__ */ jsxs(CardContent, {
                  className: "flex flex-col items-center justify-center py-10",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50",
                    children: /* @__PURE__ */ jsx(Mail, {
                      className: "h-5 w-5 text-muted-foreground/30"
                    })
                  }), /* @__PURE__ */ jsx("p", {
                    className: "mt-3 text-muted-foreground text-sm",
                    children: "No emails sent yet."
                  })]
                })
              }) : emails2.map((thread) => {
                const isExpanded = expandedThread === thread.id;
                return /* @__PURE__ */ jsxs(Card, {
                  className: "overflow-hidden border-border/60 shadow-sm transition-all duration-200",
                  children: [/* @__PURE__ */ jsx("button", {
                    type: "button",
                    className: "w-full text-left p-4 hover:bg-muted/30 transition-colors",
                    onClick: () => setExpandedThread(isExpanded ? null : thread.id),
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center justify-between gap-3",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "min-w-0 flex-1",
                        children: [/* @__PURE__ */ jsx("p", {
                          className: "text-sm font-semibold truncate text-foreground/90",
                          children: thread.subject
                        }), /* @__PURE__ */ jsx("div", {
                          className: "flex items-center gap-2 mt-1",
                          children: /* @__PURE__ */ jsx(Badge, {
                            variant: thread.status === "REPLIED" ? "success" : thread.status === "WAITING" ? "warning" : "secondary",
                            className: "rounded-full text-[10px] uppercase tracking-wider",
                            children: thread.status
                          })
                        })]
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "shrink-0 flex items-center gap-2",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "text-[11px] tabular-nums text-muted-foreground/50 font-medium",
                          children: new Date(thread.lastMessage).toLocaleDateString()
                        }), isExpanded ? /* @__PURE__ */ jsx(ChevronUp, {
                          className: "h-4 w-4 text-muted-foreground/40"
                        }) : /* @__PURE__ */ jsx(ChevronDown, {
                          className: "h-4 w-4 text-muted-foreground/40"
                        })]
                      })]
                    })
                  }), isExpanded && thread.messages.length > 0 && /* @__PURE__ */ jsx("div", {
                    className: "border-t border-border/50 px-4 py-3 space-y-3",
                    children: thread.messages.map((msg, i) => /* @__PURE__ */ jsxs("div", {
                      className: `rounded-lg border px-3 py-2.5 ${msg.direction === "sent" ? "border-blue-500/15 bg-blue-500/[0.03]" : "border-border/40 bg-muted/20"}`,
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center justify-between mb-1.5",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50",
                          children: msg.direction === "sent" ? "You" : msg.fromAddress
                        }), /* @__PURE__ */ jsx("span", {
                          className: "text-[11px] tabular-nums text-muted-foreground/50",
                          children: msg.sentAt ? new Date(msg.sentAt).toLocaleString() : new Date(msg.createdAt).toLocaleString()
                        })]
                      }), /* @__PURE__ */ jsx("p", {
                        className: "text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed",
                        children: msg.bodyPlain || msg.snippet
                      })]
                    }, msg.id))
                  })]
                }, thread.id);
              })
            })]
          })]
        })]
      })]
    })
  });
});
function buildPreviewHtml(bodyContent) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1a1a1a;
    background: #ffffff;
    margin: 0;
    padding: 16px 20px;
    word-wrap: break-word;
  }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  ul, ol { padding-left: 20px; }
</style>
</head>
<body>${bodyContent}</body>
<script>
  function reportHeight() {
    parent.postMessage({ type: 'iframe-resize', height: document.body.scrollHeight }, '*');
  }
  reportHeight();
  new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true });
<\/script>
</html>`;
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d,
  default: leads_$leadId_emails,
  loader: loader$k
}, Symbol.toStringTag, { value: "Module" }));
const TIER_LIMITS$1 = {
  FREE: { perMinute: 20, perDay: 1e3 },
  BASIC: { perMinute: 60, perDay: 1e4 },
  PRO: { perMinute: 300, perDay: 1e5 },
  ENTERPRISE: { perMinute: 1e3, perDay: 1e6 }
};
const KEY_BYTES = 32;
const KEY_PREFIX = "sk_live_";
const KEY_PREFIX_TEST = "sk_test_";
function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}
function generateApiKey(test = false) {
  const raw = randomBytes(KEY_BYTES).toString("hex");
  const prefix = test ? KEY_PREFIX_TEST : KEY_PREFIX;
  const rawKey = `${prefix}${raw}`;
  const displayPrefix = rawKey.slice(0, 12);
  const hash2 = sha256(rawKey);
  return { rawKey, prefix: displayPrefix, hash: hash2 };
}
function hashApiKey(key) {
  return sha256(key);
}
const keyCache = /* @__PURE__ */ new Map();
const KEY_CACHE_TTL_MS = 6e4;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry2] of keyCache) {
    if (now >= entry2.expiresAt) keyCache.delete(key);
  }
}, 6e4).unref();
function invalidateApiKeyCache(hash2) {
  keyCache.delete(hash2);
}
async function validateApiKey(key) {
  if (!key || key.length < 40) {
    return { valid: false };
  }
  const hash2 = hashApiKey(key);
  const cached = keyCache.get(hash2);
  if (cached && Date.now() < cached.expiresAt) {
    return { valid: true, apiKey: cached.apiKey };
  }
  const apiKey = await prisma.apiKey.findUnique({
    where: { hash: hash2 },
    select: { id: true, tier: true, scopes: true, userId: true, active: true }
  });
  if (!apiKey || !apiKey.active) {
    return { valid: false };
  }
  const result = {
    id: apiKey.id,
    tier: apiKey.tier,
    scopes: apiKey.scopes || [],
    userId: apiKey.userId
  };
  keyCache.set(hash2, { apiKey: result, expiresAt: Date.now() + KEY_CACHE_TTL_MS });
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: /* @__PURE__ */ new Date() }
  }).catch(() => {
  });
  return { valid: true, apiKey: result };
}
function hasScope(scopes, required) {
  if (scopes.includes("*")) return true;
  if (scopes.includes(required)) return true;
  const [resource, action2] = required.split(":");
  if (action2 === "read" && scopes.includes(`${resource}:write`)) return true;
  return false;
}
function matchRule(rule, leadData) {
  const fieldValue = getFieldValue(rule.fieldType, leadData);
  if (fieldValue === null || fieldValue === void 0) return false;
  const ruleValue = rule.value;
  const fieldLower = fieldValue.toLowerCase();
  const ruleLower = ruleValue.toLowerCase();
  switch (rule.operator) {
    case "CONTAINS":
      return fieldLower.includes(ruleLower);
    case "EQUALS":
      return fieldLower === ruleLower;
    case "STARTS_WITH":
      return fieldLower.startsWith(ruleLower);
    case "REGEX":
      try {
        return new RegExp(ruleValue, "i").test(fieldValue);
      } catch {
        return false;
      }
    default:
      return false;
  }
}
function getFieldValue(fieldType, leadData) {
  switch (fieldType) {
    case "INDUSTRY":
      return leadData.industry ?? null;
    case "ESTIMATED_TRAFFIC":
      return leadData.estimatedTraffic ?? null;
    case "TECH_STACK":
      return leadData.techStack ?? null;
    case "LEAD_SOURCE":
      return leadData.leadSource ?? null;
    case "WEBSITE":
      return leadData.website ?? null;
    default:
      return null;
  }
}
async function evaluateRules(leadData) {
  const rules = await prisma.scoringRule.findMany({
    where: { active: true },
    orderBy: { priority: "asc" }
  });
  let bonusPoints = 0;
  const matchedRules = [];
  for (const rule of rules) {
    if (matchRule(rule, leadData)) {
      bonusPoints += rule.points;
      matchedRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        points: rule.points
      });
    }
  }
  return { bonusPoints, matchedRules };
}
async function scoreLeadWithRules(criteriaResponses, leadData) {
  const config = await getScoreConfig();
  const hotThreshold = (config == null ? void 0 : config.hotThreshold) ?? 80;
  const warmThreshold = (config == null ? void 0 : config.warmThreshold) ?? 50;
  const { bonusPoints, matchedRules } = await evaluateRules(leadData);
  let criteriaScore = 0;
  let criteriaMaxScore = 0;
  if (criteriaResponses && criteriaResponses.length > 0) {
    const criteriaResult = await scoreLead(criteriaResponses);
    criteriaScore = criteriaResult.score;
    criteriaMaxScore = criteriaResult.maxScore;
    criteriaResult.responses;
  }
  const totalScore = criteriaScore + bonusPoints;
  const totalMax = criteriaMaxScore + bonusPoints;
  const percentage = totalMax > 0 ? totalScore / totalMax * 100 : bonusPoints > 0 ? totalScore / bonusPoints * 100 : 0;
  let temperature;
  if (percentage >= hotThreshold) {
    temperature = "HOT";
  } else if (percentage >= warmThreshold) {
    temperature = "WARM";
  } else {
    temperature = "COLD";
  }
  return {
    score: totalScore,
    maxScore: totalMax,
    percentage,
    temperature,
    bonusPoints,
    matchedRules,
    criteriaScore,
    criteriaMaxScore
  };
}
async function recalculateAllLeadScores() {
  const config = await getScoreConfig();
  if (!config.autoScore) {
    return { updated: 0, errors: 0 };
  }
  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      industry: true,
      estimatedTraffic: true,
      techStack: true,
      leadSource: true,
      website: true
    }
  });
  let updated = 0;
  let errors = 0;
  for (const lead of leads) {
    try {
      const verifications = await prisma.leadVerification.findMany({
        where: { leadId: lead.id },
        select: { criteriaId: true, response: true, score: true }
      });
      const criteriaResponses = verifications.map((v) => ({
        criteriaId: v.criteriaId,
        response: v.response,
        score: v.score
      }));
      const result = await scoreLeadWithRules(criteriaResponses, {
        industry: lead.industry,
        estimatedTraffic: lead.estimatedTraffic,
        techStack: lead.techStack,
        leadSource: lead.leadSource,
        website: lead.website
      });
      const currentLead = await prisma.lead.findUnique({
        where: { id: lead.id },
        select: { temperature: true }
      });
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: result.score,
          maxScore: result.maxScore,
          temperature: result.temperature
        }
      });
      if (currentLead && currentLead.temperature !== result.temperature) {
        await logActivity({
          leadId: lead.id,
          action: "TEMPERATURE_CHANGED",
          description: `Temperature changed from ${currentLead.temperature} to ${result.temperature}`,
          metadata: {
            previousTemperature: currentLead.temperature,
            newTemperature: result.temperature,
            temperature: result.temperature,
            score: result.score,
            maxScore: result.maxScore,
            percentage: Math.round(result.percentage)
          }
        });
      }
      updated++;
    } catch {
      errors++;
    }
  }
  return { updated, errors };
}
async function authenticate$2(request) {
  const key = request.headers.get("X-API-Key");
  if (!key) {
    throw data({
      error: "Unauthorized. Provide X-API-Key header."
    }, {
      status: 401
    });
  }
  const result = await validateApiKey(key);
  if (!result.valid || !result.apiKey) {
    throw data({
      error: "Invalid API key."
    }, {
      status: 401
    });
  }
  return result.apiKey;
}
function requireScope(scopes, scope) {
  if (!hasScope(scopes, scope)) {
    throw data({
      error: `Insufficient scope. Required: ${scope}`
    }, {
      status: 403
    });
  }
}
const LEAD_STATUSES = ["INBOX", "ACTIVE", "REJECTED"];
const LeadPayloadSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  industry: z.string().optional(),
  estimatedTraffic: z.string().optional(),
  techStack: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  leadSource: z.string().optional().default("API"),
  notes: z.string().optional()
});
const LeadsQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  stage: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});
const LEAD_PUBLIC_FIELDS = {
  id: true,
  companyName: true,
  website: true,
  contactName: true,
  email: true,
  industry: true,
  estimatedTraffic: true,
  techStack: true,
  linkedin: true,
  facebook: true,
  instagram: true,
  twitter: true,
  status: true,
  stage: true,
  leadSource: true,
  createdAt: true
};
const MAX_RATE_LIMIT_ENTRIES = 1e4;
const rateLimitStore = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry2] of rateLimitStore) {
    if (now >= entry2.resetAt) rateLimitStore.delete(key);
  }
}, 6e4).unref();
function checkRateLimit(keyId, tier) {
  const limits = TIER_LIMITS$1[tier];
  const now = Date.now();
  let entry2 = rateLimitStore.get(keyId);
  if (!entry2 || now >= entry2.resetAt) {
    entry2 = {
      count: 0,
      resetAt: now + 6e4
    };
    if (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
      let oldestKey = null;
      let oldestReset = Infinity;
      for (const [k, v] of rateLimitStore) {
        if (v.resetAt < oldestReset) {
          oldestReset = v.resetAt;
          oldestKey = k;
        }
      }
      if (oldestKey) rateLimitStore.delete(oldestKey);
    }
    rateLimitStore.set(keyId, entry2);
  }
  entry2.count++;
  const remaining = Math.max(0, limits.perMinute - entry2.count);
  const allowed = entry2.count <= limits.perMinute;
  return {
    allowed,
    remaining,
    resetAt: entry2.resetAt
  };
}
function rateLimitHeaders(tier, remaining, resetAt) {
  const limits = TIER_LIMITS$1[tier];
  return {
    "X-RateLimit-Limit": String(limits.perMinute),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1e3))
  };
}
async function loader$j({
  request
}) {
  const apiKey = await authenticate$2(request);
  requireScope(apiKey.scopes, "leads:read");
  const rl = checkRateLimit(apiKey.id, apiKey.tier);
  if (!rl.allowed) {
    throw data({
      error: "Rate limit exceeded. Retry after the time shown in X-RateLimit-Reset."
    }, {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1e3)),
        ...rateLimitHeaders(apiKey.tier, 0, rl.resetAt)
      }
    });
  }
  const url = new URL(request.url);
  const queryResult = LeadsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!queryResult.success) {
    throw data({
      error: "Invalid query parameters",
      issues: queryResult.error.issues
    }, {
      status: 400
    });
  }
  const {
    status,
    stage,
    limit,
    offset
  } = queryResult.data;
  if (stage) {
    const validStages = await getValidStageNames();
    if (!validStages.includes(stage)) {
      throw data({
        error: `Invalid stage. Valid stages: ${validStages.join(", ")}`
      }, {
        status: 400
      });
    }
  }
  const where = {
    ...status ? {
      status
    } : {},
    ...stage ? {
      stage
    } : {}
  };
  const leads = await prisma.lead.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: "desc"
    },
    select: LEAD_PUBLIC_FIELDS
  });
  const total = await prisma.lead.count({
    where
  });
  return data({
    leads,
    total,
    limit,
    offset
  }, {
    headers: rateLimitHeaders(apiKey.tier, rl.remaining, rl.resetAt)
  });
}
async function action$c({
  request
}) {
  const apiKey = await authenticate$2(request);
  requireScope(apiKey.scopes, "leads:write");
  const rl = checkRateLimit(apiKey.id, apiKey.tier);
  if (!rl.allowed) {
    throw data({
      error: "Rate limit exceeded. Retry after the time shown in X-RateLimit-Reset."
    }, {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1e3)),
        ...rateLimitHeaders(apiKey.tier, 0, rl.resetAt)
      }
    });
  }
  if (request.method !== "POST") {
    throw data({
      error: "Method not allowed"
    }, {
      status: 405
    });
  }
  try {
    const body = await request.json();
    const payload = LeadPayloadSchema.parse(body);
    const existing = await prisma.lead.findUnique({
      where: {
        email: payload.email
      },
      select: {
        id: true,
        notes: true
      }
    });
    if (existing) {
      const updated = await prisma.lead.update({
        where: {
          id: existing.id
        },
        data: {
          companyName: payload.companyName,
          website: payload.website ?? void 0,
          contactName: payload.contactName ?? void 0,
          industry: payload.industry ?? void 0,
          estimatedTraffic: payload.estimatedTraffic ?? void 0,
          techStack: payload.techStack ?? void 0,
          linkedin: payload.linkedin ?? void 0,
          facebook: payload.facebook ?? void 0,
          instagram: payload.instagram ?? void 0,
          twitter: payload.twitter ?? void 0,
          leadSource: payload.leadSource,
          notes: payload.notes ? `${existing.notes || ""}
[Updated]: ${payload.notes}`.trim() : void 0
        }
      });
      logActivity({
        leadId: existing.id,
        userId: apiKey.userId,
        action: "LEAD_EDITED",
        description: `External API updated lead data (${payload.leadSource})`,
        metadata: {
          source: payload.leadSource,
          merged: true
        }
      }).catch(() => {
      });
      return data({
        lead: updated,
        merged: true
      }, {
        status: 200
      });
    }
    const lead = await prisma.lead.create({
      data: {
        companyName: payload.companyName,
        website: payload.website,
        contactName: payload.contactName,
        email: payload.email,
        industry: payload.industry,
        estimatedTraffic: payload.estimatedTraffic,
        techStack: payload.techStack,
        linkedin: payload.linkedin,
        facebook: payload.facebook,
        instagram: payload.instagram,
        twitter: payload.twitter,
        leadSource: payload.leadSource,
        notes: payload.notes,
        status: "INBOX",
        stage: await getFirstStageName()
      }
    });
    const scoreConfig = await getScoreConfig();
    if (scoreConfig.autoScore) {
      try {
        const scoreResult = await scoreLeadWithRules(void 0, {
          industry: payload.industry,
          estimatedTraffic: payload.estimatedTraffic,
          techStack: payload.techStack,
          leadSource: payload.leadSource,
          website: payload.website
        });
        await prisma.lead.update({
          where: {
            id: lead.id
          },
          data: {
            score: scoreResult.score,
            maxScore: scoreResult.maxScore,
            temperature: scoreResult.temperature
          }
        });
      } catch {
      }
    }
    logActivity({
      leadId: lead.id,
      userId: apiKey.userId,
      action: "LEAD_CREATED",
      description: `Added via external API (${payload.leadSource})`,
      metadata: {
        source: payload.leadSource
      }
    }).catch(() => {
    });
    return data({
      lead,
      merged: false
    }, {
      status: 201
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw data({
        error: "Validation failed",
        issues: error.issues
      }, {
        status: 400
      });
    }
    if ((error == null ? void 0 : error.code) === "P2002") {
      throw data({
        error: "Lead with this email already exists"
      }, {
        status: 409
      });
    }
    throw data({
      error: "Internal server error"
    }, {
      status: 500
    });
  }
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
async function authenticate$1(request) {
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (!result.valid || !result.apiKey) {
      throw data({
        error: "Invalid API key."
      }, {
        status: 401
      });
    }
    if (!hasScope(result.apiKey.scopes, "leads:read")) {
      throw data({
        error: "Insufficient scope. Required: leads:read"
      }, {
        status: 403
      });
    }
    return result.apiKey.userId;
  }
  return await requireAuth(request);
}
const LeadDetailQuerySchema = z.object({
  leadId: z.string().min(1, "leadId is required").max(50)
});
async function loader$i({
  request
}) {
  await authenticate$1(request);
  const url = new URL(request.url);
  const result = LeadDetailQuerySchema.safeParse({
    leadId: url.searchParams.get("leadId") || ""
  });
  if (!result.success) {
    throw data({
      error: "Invalid query parameters",
      issues: result.error.issues
    }, {
      status: 400
    });
  }
  const lead = await prisma.lead.findUnique({
    where: {
      id: result.data.leadId
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      rejectedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      stageHistory: {
        include: {
          changedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          changedAt: "desc"
        },
        take: 50
      },
      activityLogs: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 100
      }
    }
  });
  if (!lead) {
    throw data({
      error: "Lead not found"
    }, {
      status: 404
    });
  }
  return data({
    lead
  });
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
async function authenticate(request) {
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (!result.valid || !result.apiKey) {
      throw data({
        error: "Invalid API key."
      }, {
        status: 401
      });
    }
    if (!hasScope(result.apiKey.scopes, "scraper:read")) {
      throw data({
        error: "Insufficient scope. Required: scraper:read"
      }, {
        status: 403
      });
    }
    return result.apiKey.userId;
  }
  return await requireAuth(request);
}
const ScraperQuerySchema = z.object({
  jobId: z.string().min(1, "jobId is required").max(50)
});
async function loader$h({
  request
}) {
  await authenticate(request);
  const url = new URL(request.url);
  const result = ScraperQuerySchema.safeParse({
    jobId: url.searchParams.get("jobId") || ""
  });
  if (!result.success) {
    throw data({
      error: "Invalid query parameters",
      issues: result.error.issues
    }, {
      status: 400
    });
  }
  const job = await prisma.scraperJob.findUnique({
    where: {
      id: result.data.jobId
    },
    select: {
      status: true,
      totalDiscovered: true,
      totalValid: true,
      totalEnriched: true,
      totalImported: true,
      totalSkipped: true,
      totalFailed: true
    }
  });
  if (!job) {
    throw data({
      error: "Job not found"
    }, {
      status: 404
    });
  }
  return data(job);
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
async function loader$g({
  request
}) {
  await requireAdmin(request);
  const results = {};
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.dbConnection = "OK";
  } catch (err) {
    results.dbConnection = {
      error: err.message,
      code: err.code
    };
  }
  try {
    const count = await prisma.apiKey.count();
    results.apiKeyModel = {
      exists: true,
      count
    };
  } catch (err) {
    results.apiKeyModel = {
      exists: false,
      error: err.message,
      code: err.code
    };
  }
  try {
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME as tableName FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ApiKey'
    `;
    results.apiKeyTable = tables.length > 0 ? "EXISTS" : "MISSING";
  } catch (err) {
    results.apiKeyTable = {
      error: err.message
    };
  }
  try {
    results.prismaModels = Object.keys(prisma).filter((k) => !k.startsWith("$") && !k.startsWith("_"));
  } catch (err) {
    results.prismaModels = {
      error: err.message
    };
  }
  try {
    const pkg2 = await import("./package-U76op0mj.js");
    results.prismaClientVersion = pkg2.version;
  } catch {
    results.prismaClientVersion = "unknown";
  }
  try {
    const {
      rawKey,
      prefix,
      hash: hash2
    } = generateApiKey();
    results.generateApiKey = {
      ok: true,
      keyLength: rawKey.length,
      prefix,
      hashLength: hash2.length
    };
  } catch (err) {
    results.generateApiKey = {
      ok: false,
      error: err.message,
      stack: err.stack
    };
  }
  try {
    const cols = await prisma.$queryRaw`
      SELECT COLUMN_NAME as columnName, DATA_TYPE as dataType, IS_NULLABLE as isNullable
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ApiKey'
      ORDER BY ORDINAL_POSITION
    `;
    results.apiKeyColumns = cols;
  } catch (err) {
    results.apiKeyColumns = {
      error: err.message
    };
  }
  return data(results);
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
async function loader$f({
  request
}) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  return {
    user
  };
}
const meta = () => [{
  title: "API Reference — ScalePod CRM"
}];
const TIER_LIMITS = {
  FREE: {
    perMinute: 20,
    perDay: 1e3
  },
  BASIC: {
    perMinute: 60,
    perDay: 1e4
  },
  PRO: {
    perMinute: 300,
    perDay: 1e5
  },
  ENTERPRISE: {
    perMinute: 1e3,
    perDay: 1e6
  }
};
const SECTIONS = [{
  id: "getting-started",
  label: "Getting Started",
  icon: Zap
}, {
  id: "authentication",
  label: "Authentication",
  icon: Lock
}, {
  id: "rate-limits",
  label: "Rate Limits",
  icon: Clock
}, {
  id: "scopes",
  label: "Scopes",
  icon: Shield
}, {
  id: "leads-get",
  label: "GET /api/leads",
  icon: Server
}, {
  id: "leads-post",
  label: "POST /api/leads",
  icon: Server
}, {
  id: "lead-detail-get",
  label: "GET /api/lead-detail",
  icon: Server
}, {
  id: "scraper-get",
  label: "GET /api/scraper",
  icon: Server
}, {
  id: "errors",
  label: "Error Reference",
  icon: AlertTriangle
}];
function CodeBlock({
  code,
  lang = "bash"
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);
  return /* @__PURE__ */ jsxs("div", {
    className: "rounded-xl border border-border/40 overflow-hidden bg-[#0d1117] shadow-sm group",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center gap-2",
        children: /* @__PURE__ */ jsx("span", {
          className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40",
          children: lang
        })
      }), /* @__PURE__ */ jsx("button", {
        type: "button",
        onClick: handleCopy,
        className: "flex items-center gap-1.5 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded-md px-2 py-1 hover:bg-white/5",
        children: copied ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: "h-3 w-3 text-emerald-400"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-emerald-400",
            children: "Copied"
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(Copy, {
            className: "h-3 w-3"
          }), "Copy"]
        })
      })]
    }), /* @__PURE__ */ jsx("pre", {
      className: "px-4 py-3.5 text-[13px] leading-relaxed overflow-x-auto",
      style: {
        fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"
      },
      children: /* @__PURE__ */ jsx("code", {
        className: "text-blue-50/90 whitespace-pre",
        children: code
      })
    })]
  });
}
function SectionHeader({
  icon: Icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-start gap-3 mb-5",
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/40 shrink-0 mt-0.5 shadow-sm",
      children: /* @__PURE__ */ jsx(Icon, {
        className: "h-4 w-4 text-muted-foreground"
      })
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-xl font-bold tracking-tight",
        children: title
      }), subtitle && /* @__PURE__ */ jsx("p", {
        className: "text-sm text-muted-foreground mt-0.5",
        children: subtitle
      })]
    })]
  });
}
function EndpointBadge({
  method
}) {
  const colors = {
    GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    POST: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    PUT: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    DELETE: "bg-red-500/15 text-red-400 border-red-500/25",
    PATCH: "bg-violet-500/15 text-violet-400 border-violet-500/25"
  };
  return /* @__PURE__ */ jsx(Badge, {
    className: `rounded-md text-[10px] font-bold border px-2 py-0.5 ${colors[method] || colors.GET}`,
    children: method
  });
}
function EndpointBar({
  method,
  path: path2,
  scope
}) {
  const borderColors = {
    GET: "border-l-emerald-400",
    POST: "border-l-blue-400",
    PUT: "border-l-amber-400",
    DELETE: "border-l-red-400",
    PATCH: "border-l-violet-400"
  };
  return /* @__PURE__ */ jsxs("div", {
    className: `flex items-center gap-3 flex-wrap rounded-xl border border-border/40 bg-muted/20 pl-3 pr-4 py-2.5 border-l-[3px] ${borderColors[method] || borderColors.GET}`,
    children: [/* @__PURE__ */ jsx(EndpointBadge, {
      method
    }), /* @__PURE__ */ jsx("code", {
      className: "text-sm font-mono text-foreground/80",
      children: path2
    }), /* @__PURE__ */ jsx(Badge, {
      variant: "secondary",
      className: "rounded-full text-[10px] border-border/30 ml-auto",
      children: scope
    })]
  });
}
function ParamRow({
  name,
  type,
  required,
  desc
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-start gap-3 py-2.5 border-b border-border/20 last:border-0",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "min-w-[180px] shrink-0",
      children: [/* @__PURE__ */ jsx("code", {
        className: "text-[13px] font-mono text-violet-400 font-medium",
        children: name
      }), required && /* @__PURE__ */ jsx("span", {
        className: "ml-1.5 text-red-400 text-[10px] font-bold",
        children: "required"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex-1 min-w-0",
      children: [/* @__PURE__ */ jsx(Badge, {
        variant: "secondary",
        className: "rounded text-[10px] font-mono mb-0.5 border-border/30",
        children: type
      }), /* @__PURE__ */ jsx("p", {
        className: "text-sm text-muted-foreground mt-0.5",
        children: desc
      })]
    })]
  });
}
function ResponseField({
  name,
  type,
  desc,
  nullable
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-start gap-3 py-1.5 border-b border-border/10 last:border-0",
    children: [/* @__PURE__ */ jsx("code", {
      className: "text-[12px] font-mono text-blue-400/80 min-w-[140px] shrink-0",
      children: name
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex-1 min-w-0",
      children: [/* @__PURE__ */ jsx("span", {
        className: "text-[10px] font-mono text-amber-400/70",
        children: type
      }), nullable && /* @__PURE__ */ jsx("span", {
        className: "ml-1 text-[10px] text-muted-foreground/40",
        children: "nullable"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[12px] text-muted-foreground/70",
        children: desc
      })]
    })]
  });
}
function Callout({
  icon: Icon,
  title,
  children,
  variant = "info"
}) {
  const styles = {
    info: {
      bg: "bg-blue-500/5",
      border: "border-blue-500/15",
      text: "text-blue-400",
      title: "text-blue-400/90"
    },
    warning: {
      bg: "bg-amber-500/5",
      border: "border-amber-500/15",
      text: "text-amber-400",
      title: "text-amber-400/90"
    },
    error: {
      bg: "bg-red-500/5",
      border: "border-red-500/15",
      text: "text-red-400",
      title: "text-red-400/90"
    },
    tip: {
      bg: "bg-violet-500/5",
      border: "border-violet-500/15",
      text: "text-violet-400",
      title: "text-violet-400/90"
    }
  };
  const s = styles[variant];
  return /* @__PURE__ */ jsxs("div", {
    className: `rounded-xl border ${s.border} ${s.bg} p-4 flex items-start gap-3`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: `h-4 w-4 ${s.text} shrink-0 mt-0.5`
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("p", {
        className: `text-sm font-semibold ${s.title}`,
        children: title
      }), /* @__PURE__ */ jsx("div", {
        className: "text-xs text-muted-foreground/70 mt-1 leading-relaxed",
        children
      })]
    })]
  });
}
const docs_api = UNSAFE_withComponentProps(function ApiDocs() {
  var _a;
  const {
    user
  } = useLoaderData();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainRef = useRef(null);
  const scrollContainerRef = useRef(null);
  useEffect$1(() => {
    if (mainRef.current) {
      scrollContainerRef.current = mainRef.current.closest("main");
    }
  }, []);
  useEffect$1(() => {
    const root2 = scrollContainerRef.current;
    if (!root2) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry2) => {
        if (entry2.isIntersecting) {
          setActiveSection(entry2.target.id);
        }
      });
    }, {
      root: root2,
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0
    });
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  useEffect$1(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => setShowBackToTop(el.scrollTop > 600);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    const scroller = scrollContainerRef.current;
    if (el && scroller) {
      const top = el.getBoundingClientRect().top + scroller.scrollTop - 120;
      scroller.scrollTo({
        top,
        behavior: "smooth"
      });
    }
  };
  const scrollToTop = () => {
    var _a2;
    (_a2 = scrollContainerRef.current) == null ? void 0 : _a2.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex gap-6 max-w-[1400px] mx-auto relative",
      children: [/* @__PURE__ */ jsxs("aside", {
        className: "hidden lg:block w-64 shrink-0 sticky top-[72px] self-start max-h-[calc(100vh-120px)] overflow-y-auto px-2 py-1 z-10",
        children: [/* @__PURE__ */ jsx("div", {
          className: "space-y-0.5",
          children: SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => scrollTo(s.id),
              className: `w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 text-left ${active ? "bg-background text-foreground font-medium shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
              children: [/* @__PURE__ */ jsx(Icon, {
                className: `h-3.5 w-3.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground/50"}`
              }), /* @__PURE__ */ jsx("span", {
                className: "truncate",
                children: s.label
              })]
            }, s.id);
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6 rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50",
            children: "Base URL"
          }), /* @__PURE__ */ jsx("code", {
            className: "block text-xs font-mono text-violet-400 break-all",
            children: "https://yourdomain.com/api"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-3 rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50",
            children: "Content-Type"
          }), /* @__PURE__ */ jsx("code", {
            className: "block text-xs font-mono text-blue-400",
            children: "application/json"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        ref: mainRef,
        className: "flex-1 min-w-0 space-y-14 pb-20 scroll-smooth relative",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-muted/60 via-muted/30 to-background p-6 sm:p-8 shadow-sm ring-1 ring-border/20",
          children: [/* @__PURE__ */ jsx("div", {
            className: "absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"
          }), /* @__PURE__ */ jsx("div", {
            className: "absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
          }), /* @__PURE__ */ jsxs("div", {
            className: "relative flex items-start gap-3 sm:gap-4",
            children: [/* @__PURE__ */ jsx(Link, {
              to: "/settings/api-keys",
              children: /* @__PURE__ */ jsx(Button, {
                variant: "ghost",
                size: "icon",
                className: "rounded-full hover:bg-muted mt-1 shrink-0",
                children: /* @__PURE__ */ jsx(ArrowLeft, {
                  className: "h-4 w-4"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex items-center gap-2 mb-2",
                children: /* @__PURE__ */ jsx(Badge, {
                  variant: "secondary",
                  className: "rounded-full text-[10px] font-bold uppercase tracking-wider border-border/40 bg-background/80 backdrop-blur-sm",
                  children: "REST API v1"
                })
              }), /* @__PURE__ */ jsx("h1", {
                className: "text-3xl sm:text-4xl font-bold tracking-tight",
                children: "API Reference"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground mt-2 max-w-xl text-sm sm:text-base leading-relaxed",
                children: "Comprehensive documentation for the ScalePod CRM REST API. Manage leads, monitor scraper jobs, and integrate with your external systems."
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:hidden",
          children: [/* @__PURE__ */ jsxs("button", {
            type: "button",
            onClick: () => setMobileNavOpen(!mobileNavOpen),
            className: "w-full flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 text-sm font-medium",
            children: [/* @__PURE__ */ jsxs("span", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Menu, {
                className: "h-4 w-4 text-muted-foreground"
              }), ((_a = SECTIONS.find((s) => s.id === activeSection)) == null ? void 0 : _a.label) || "Jump to section"]
            }), mobileNavOpen ? /* @__PURE__ */ jsx(X, {
              className: "h-4 w-4"
            }) : /* @__PURE__ */ jsx(ChevronUp, {
              className: "h-4 w-4 rotate-180"
            })]
          }), mobileNavOpen && /* @__PURE__ */ jsx("div", {
            className: "mt-1 rounded-xl border border-border/40 bg-background shadow-lg overflow-hidden",
            children: SECTIONS.map((s) => /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => scrollTo(s.id),
              className: `w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${activeSection === s.id ? "bg-muted/40 font-medium" : "text-muted-foreground hover:bg-muted/20"}`,
              children: [/* @__PURE__ */ jsx(s.icon, {
                className: "h-3.5 w-3.5 shrink-0"
              }), s.label]
            }, s.id))
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "getting-started",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Zap,
            title: "Getting Started",
            subtitle: "Everything you need to make your first API call"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-5",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["The ScalePod API is organized around REST. All requests return JSON responses and use standard HTTP verbs. Authentication is handled via API keys passed in the ", /* @__PURE__ */ jsx("code", {
                  className: "text-violet-400 font-mono text-xs",
                  children: "X-API-Key"
                }), " header."]
              }), /* @__PURE__ */ jsx("div", {
                className: "grid sm:grid-cols-3 gap-3",
                children: [{
                  label: "Format",
                  value: "JSON",
                  desc: "Request/response bodies",
                  icon: BookOpen
                }, {
                  label: "Auth",
                  value: "API Key",
                  desc: "Header-based",
                  icon: Lock
                }, {
                  label: "HTTPS",
                  value: "Required",
                  desc: "TLS 1.2+",
                  icon: Globe
                }].map((item) => /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-gradient-to-br from-muted/40 to-muted/10 p-4 text-center hover:border-border/50 transition-colors",
                  children: [/* @__PURE__ */ jsx(item.icon, {
                    className: "h-4 w-4 text-muted-foreground/50 mx-auto mb-2"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold",
                    children: item.label
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm font-bold mt-0.5",
                    children: item.value
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-[10px] text-muted-foreground/60",
                    children: item.desc
                  })]
                }, item.label))
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Quick test"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "bash",
                  code: `curl -X GET \\
  https://yourdomain.com/api/leads \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json"`
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "authentication",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Lock,
            title: "Authentication",
            subtitle: "API keys and security best practices"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-5",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["Every request must include a valid API key in the", " ", /* @__PURE__ */ jsx("code", {
                  className: "text-violet-400 font-mono text-xs",
                  children: "X-API-Key"
                }), " header. Keys are generated from the", " ", /* @__PURE__ */ jsx(Link, {
                  to: "/settings/api-keys",
                  className: "text-violet-400 hover:underline",
                  children: "API Keys"
                }), " ", "settings page and are scoped to specific operations."]
              }), /* @__PURE__ */ jsx(Callout, {
                icon: AlertTriangle,
                title: "Security Notice",
                variant: "warning",
                children: "Store API keys in environment variables, never commit them to version control. The full key is shown only once at creation time — after that, only the prefix is visible."
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Example request with auth"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "bash",
                  code: `curl -X POST \\
  https://yourdomain.com/api/leads \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "leadSource": "External CRM"
  }'`
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "rate-limits",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Clock,
            title: "Rate Limits",
            subtitle: "Tier-based request throttling"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-5",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: "Rate limits are enforced per API key tier. Every response includes rate limit headers so you can track remaining quota client-side."
              }), /* @__PURE__ */ jsx("div", {
                className: "overflow-x-auto rounded-xl border border-border/30 bg-muted/10",
                children: /* @__PURE__ */ jsxs("table", {
                  className: "w-full text-sm",
                  children: [/* @__PURE__ */ jsx("thead", {
                    children: /* @__PURE__ */ jsxs("tr", {
                      className: "border-b border-border/60 text-left text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold",
                      children: [/* @__PURE__ */ jsx("th", {
                        className: "pb-2.5 pr-4 px-4 pt-3",
                        children: "Tier"
                      }), /* @__PURE__ */ jsx("th", {
                        className: "pb-2.5 pr-4 text-right px-4 pt-3",
                        children: "Requests / Minute"
                      }), /* @__PURE__ */ jsx("th", {
                        className: "pb-2.5 pr-4 text-right px-4 pt-3",
                        children: "Requests / Day"
                      }), /* @__PURE__ */ jsx("th", {
                        className: "pb-2.5 px-4 pt-3",
                        children: "Burst Behavior"
                      })]
                    })
                  }), /* @__PURE__ */ jsx("tbody", {
                    className: "divide-y divide-border/20",
                    children: Object.entries(TIER_LIMITS).map(([tier, limits]) => /* @__PURE__ */ jsxs("tr", {
                      className: "hover:bg-muted/10 transition-colors",
                      children: [/* @__PURE__ */ jsx("td", {
                        className: "py-2.5 pr-4 px-4",
                        children: /* @__PURE__ */ jsx(Badge, {
                          variant: "secondary",
                          className: "rounded-md text-[10px] font-bold border-border/30",
                          children: tier
                        })
                      }), /* @__PURE__ */ jsx("td", {
                        className: "py-2.5 pr-4 text-right tabular-nums font-medium px-4",
                        children: limits.perMinute
                      }), /* @__PURE__ */ jsx("td", {
                        className: "py-2.5 pr-4 text-right tabular-nums font-medium px-4",
                        children: limits.perDay.toLocaleString()
                      }), /* @__PURE__ */ jsx("td", {
                        className: "py-2.5 text-muted-foreground text-xs px-4",
                        children: tier === "FREE" ? "Strict — no burst" : tier === "ENTERPRISE" ? "High burst tolerance" : "Standard token bucket"
                      })]
                    }, tier))
                  })]
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response headers"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "http",
                  code: `X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1714329600`
                })]
              }), /* @__PURE__ */ jsxs(Callout, {
                icon: AlertTriangle,
                title: "429 Too Many Requests",
                variant: "error",
                children: ["Exceeding your rate limit returns a 429 error. Retry after the timestamp specified in ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono",
                  children: "X-RateLimit-Reset"
                }), "."]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "scopes",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Shield,
            title: "Scopes",
            subtitle: "Fine-grained access control"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-5",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: "API keys are scoped to specific resources and actions. Write access implicitly grants read access for the same resource. Use the minimum scope needed for your integration."
              }), /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: [{
                  scope: "leads:read",
                  desc: "List leads and read lead details",
                  example: "Dashboard widgets, reporting"
                }, {
                  scope: "leads:write",
                  desc: "Create and update leads",
                  example: "CRM sync, form submissions",
                  note: "includes leads:read"
                }, {
                  scope: "scraper:read",
                  desc: "Monitor scraper job status",
                  example: "Progress dashboards, alerts"
                }].map((s) => /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 p-3.5 hover:border-border/50 transition-colors",
                  children: [/* @__PURE__ */ jsx("code", {
                    className: "text-[12px] font-mono text-violet-400 font-medium min-w-[120px] shrink-0",
                    children: s.scope
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-sm font-medium",
                      children: s.desc
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: s.example
                    }), s.note && /* @__PURE__ */ jsx(Badge, {
                      className: "mt-1 rounded text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20 border",
                      children: s.note
                    })]
                  })]
                }, s.scope))
              }), /* @__PURE__ */ jsxs(Callout, {
                icon: Shield,
                title: "Scope Inheritance",
                variant: "tip",
                children: ["A key with ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono",
                  children: "leads:write"
                }), " can perform both GET and POST on ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono",
                  children: "/api/leads"
                }), ". The wildcard scope ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono",
                  children: "*"
                }), " grants full access to all endpoints."]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "leads-get",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Server,
            title: "List Leads",
            subtitle: "Retrieve paginated lead data"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-6",
              children: [/* @__PURE__ */ jsx(EndpointBar, {
                method: "GET",
                path: "/api/leads",
                scope: "Requires leads:read"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["Returns a paginated list of leads with optional status filtering. Results are ordered by ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono text-xs",
                  children: "createdAt"
                }), " descending."]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Query Parameters"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ParamRow, {
                    name: "status",
                    type: "string",
                    desc: "Filter by lead status: INBOX, ACTIVE, REJECTED"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "stage",
                    type: "string",
                    desc: "Filter by any active pipeline stage (e.g. SOURCED, QUALIFIED, etc.)"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "limit",
                    type: "integer",
                    desc: "Number of results per page (max 100, default 50)"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "offset",
                    type: "integer",
                    desc: "Number of results to skip (default 0)"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Request Headers"
                }), /* @__PURE__ */ jsx("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: /* @__PURE__ */ jsx(ParamRow, {
                    name: "X-API-Key",
                    type: "string",
                    required: true,
                    desc: "Your API key"
                  })
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response — 200 OK"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "json",
                  code: `{
  "leads": [
    {
      "id": "clv...abc",
      "companyName": "Acme Corp",
      "website": "https://acme.com",
      "contactName": "John Smith",
      "email": "john@acme.com",
      "industry": "SaaS",
      "estimatedTraffic": "50K-100K",
      "techStack": "Shopify, React",
      "linkedin": "https://linkedin.com/in/john",
      "facebook": null,
      "instagram": null,
      "twitter": "https://x.com/acme",
      "status": "ACTIVE",
      "stage": "QUALIFIED",
      "leadSource": "API",
      "createdAt": "2024-04-28T10:00:00.000Z"
    }
  ],
  "total": 1247,
  "limit": 50,
  "offset": 0
}`
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response Fields"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ResponseField, {
                    name: "id",
                    type: "string",
                    desc: "Unique lead identifier (CUID)"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "companyName",
                    type: "string",
                    desc: "Company or organization name"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "website",
                    type: "string",
                    desc: "Company website URL",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "contactName",
                    type: "string",
                    desc: "Primary contact person",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "email",
                    type: "string",
                    desc: "Contact email address"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "industry",
                    type: "string",
                    desc: "Industry category",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "estimatedTraffic",
                    type: "string",
                    desc: "Estimated monthly traffic range",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "techStack",
                    type: "string",
                    desc: "Technology stack in use",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "linkedin",
                    type: "string",
                    desc: "LinkedIn profile URL",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "facebook",
                    type: "string",
                    desc: "Facebook page URL",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "instagram",
                    type: "string",
                    desc: "Instagram profile URL",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "twitter",
                    type: "string",
                    desc: "Twitter/X profile URL",
                    nullable: true
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "status",
                    type: "string",
                    desc: "Lead status: INBOX, ACTIVE, REJECTED"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "stage",
                    type: "string",
                    desc: "Pipeline stage — any active stage configured in Settings > Pipeline Stages"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "leadSource",
                    type: "string",
                    desc: "Origin of the lead"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "createdAt",
                    type: "string (ISO 8601)",
                    desc: "Record creation timestamp"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Example"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "bash",
                  code: `curl -X GET \\
  "https://yourdomain.com/api/leads?status=ACTIVE&limit=10&offset=0" \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "leads-post",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Server,
            title: "Create or Update Lead",
            subtitle: "Upsert lead data from external systems"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-6",
              children: [/* @__PURE__ */ jsx(EndpointBar, {
                method: "POST",
                path: "/api/leads",
                scope: "Requires leads:write"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["Creates a new lead or updates an existing one if the email already exists. The ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono text-xs",
                  children: "email"
                }), " field is used as the unique key. On update, only provided fields are merged; existing notes are preserved with an append."]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Request Headers"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ParamRow, {
                    name: "X-API-Key",
                    type: "string",
                    required: true,
                    desc: "Your API key"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "Content-Type",
                    type: "string",
                    required: true,
                    desc: "Must be application/json"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Request Body"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ParamRow, {
                    name: "companyName",
                    type: "string",
                    required: true,
                    desc: "Company or organization name"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "email",
                    type: "string",
                    required: true,
                    desc: "Contact email address (unique key)"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "website",
                    type: "string",
                    desc: "Company website URL"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "contactName",
                    type: "string",
                    desc: "Primary contact person"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "industry",
                    type: "string",
                    desc: "Industry category"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "estimatedTraffic",
                    type: "string",
                    desc: "Estimated monthly traffic range"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "techStack",
                    type: "string",
                    desc: "Technology stack in use"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "linkedin",
                    type: "string",
                    desc: "LinkedIn profile URL"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "facebook",
                    type: "string",
                    desc: "Facebook page URL"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "instagram",
                    type: "string",
                    desc: "Instagram profile URL"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "twitter",
                    type: "string",
                    desc: "Twitter/X profile URL"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "leadSource",
                    type: "string",
                    desc: 'Origin identifier. Defaults to "API"'
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "notes",
                    type: "string",
                    desc: "Additional notes. On update, appended to existing notes."
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response — 201 Created (new lead)"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "json",
                  code: `{
  "lead": {
    "id": "clv...abc",
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "status": "INBOX",
    "stage": "SOURCED",
    "leadSource": "External CRM",
    "createdAt": "2024-04-28T10:00:00.000Z"
  },
  "merged": false
}`
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response — 200 OK (existing lead updated)"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "json",
                  code: `{
  "lead": {
    "id": "clv...abc",
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "status": "ACTIVE",
    "stage": "QUALIFIED",
    "leadSource": "External CRM",
    "createdAt": "2024-04-28T10:00:00.000Z",
    "updatedAt": "2024-04-29T14:30:00.000Z"
  },
  "merged": true
}`
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Example"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "bash",
                  code: `curl -X POST \\
  https://yourdomain.com/api/leads \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "website": "https://acme.com",
    "industry": "SaaS",
    "leadSource": "External CRM",
    "notes": "Referred by existing customer"
  }'`
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "lead-detail-get",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Server,
            title: "Get Lead Detail",
            subtitle: "Full lead record with history and activity"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-6",
              children: [/* @__PURE__ */ jsx(EndpointBar, {
                method: "GET",
                path: "/api/lead-detail?leadId={'{leadId}'}",
                scope: "Requires leads:read or session auth"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["Returns a single lead with full relational data including creator, approver, assignee, stage history, and activity logs. Use this when you need the complete picture of a lead beyond the list view. Supports dual authentication: API key with ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono text-xs",
                  children: "leads:read"
                }), " scope, or active browser session."]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Query Parameters"
                }), /* @__PURE__ */ jsx("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: /* @__PURE__ */ jsx(ParamRow, {
                    name: "leadId",
                    type: "string",
                    required: true,
                    desc: "Lead identifier (CUID)"
                  })
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Request Headers"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ParamRow, {
                    name: "X-API-Key",
                    type: "string",
                    desc: "Your API key (if using API key auth)"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "Cookie",
                    type: "string",
                    desc: "Session cookie (if using browser auth)"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response — 200 OK"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "json",
                  code: `{
  "lead": {
    "id": "clv...abc",
    "companyName": "Acme Corp",
    "website": "https://acme.com",
    "contactName": "John Smith",
    "email": "john@acme.com",
    "industry": "SaaS",
    "estimatedTraffic": "50K-100K",
    "techStack": "Shopify, React",
    "linkedin": "https://linkedin.com/in/john",
    "facebook": null,
    "instagram": null,
    "twitter": "https://x.com/acme",
    "status": "ACTIVE",
    "stage": "QUALIFIED",
    "leadSource": "API",
    "notes": "Referred by existing customer",
    "createdAt": "2024-04-28T10:00:00.000Z",
    "updatedAt": "2024-04-29T14:30:00.000Z",
    "createdBy": { "id": "usr...", "name": "Jane Admin", "email": "jane@scalepod.io" },
    "approvedBy": null,
    "rejectedBy": null,
    "assignedTo": { "id": "usr...", "name": "Mike SDR", "email": "mike@scalepod.io" },
    "stageHistory": [
      {
        "id": "sh...",
        "fromStage": "SOURCED",
        "toStage": "QUALIFIED",
        "changedAt": "2024-04-29T10:00:00.000Z",
        "changedBy": { "id": "usr...", "name": "Jane Admin", "email": "jane@scalepod.io" }
      }
    ],
    "activityLogs": [
      {
        "id": "al...",
        "action": "STAGE_CHANGE",
        "details": "Moved to QUALIFIED",
        "createdAt": "2024-04-29T10:00:00.000Z",
        "user": { "id": "usr...", "name": "Jane Admin", "email": "jane@scalepod.io" }
      }
    ]
  }
}`
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Example"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "bash",
                  code: `curl -X GET \\
  "https://yourdomain.com/api/lead-detail?leadId=clv...abc" \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "scraper-get",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: Server,
            title: "Get Scraper Job Status",
            subtitle: "Monitor discovery and enrichment progress"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-6",
              children: [/* @__PURE__ */ jsx(EndpointBar, {
                method: "GET",
                path: "/api/scraper?jobId={'{jobId}'}",
                scope: "Requires scraper:read or session auth"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["Returns the current status and progress counters for a scraper job. This endpoint supports dual authentication: API key with ", /* @__PURE__ */ jsx("code", {
                  className: "font-mono text-xs",
                  children: "scraper:read"
                }), " ", "scope, or active browser session."]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Query Parameters"
                }), /* @__PURE__ */ jsx("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: /* @__PURE__ */ jsx(ParamRow, {
                    name: "jobId",
                    type: "string",
                    required: true,
                    desc: "Scraper job identifier"
                  })
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Request Headers"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ParamRow, {
                    name: "X-API-Key",
                    type: "string",
                    desc: "Your API key (if using API key auth)"
                  }), /* @__PURE__ */ jsx(ParamRow, {
                    name: "Cookie",
                    type: "string",
                    desc: "Session cookie (if using browser auth)"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response — 200 OK"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "json",
                  code: `{
  "status": "COMPLETED",
  "totalDiscovered": 452,
  "totalValid": 389,
  "totalEnriched": 312,
  "totalImported": 298,
  "totalSkipped": 91,
  "totalFailed": 3
}`
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Response Fields"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "rounded-xl border border-border/30 bg-muted/10 px-4",
                  children: [/* @__PURE__ */ jsx(ResponseField, {
                    name: "status",
                    type: "string",
                    desc: "Job state: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "totalDiscovered",
                    type: "integer",
                    desc: "Total URLs discovered"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "totalValid",
                    type: "integer",
                    desc: "URLs passing basic validation"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "totalEnriched",
                    type: "integer",
                    desc: "URLs successfully enriched with contact data"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "totalImported",
                    type: "integer",
                    desc: "Leads created in the CRM"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "totalSkipped",
                    type: "integer",
                    desc: "URLs skipped (duplicates, blacklisted, etc.)"
                  }), /* @__PURE__ */ jsx(ResponseField, {
                    name: "totalFailed",
                    type: "integer",
                    desc: "URLs that failed processing"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Example"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "bash",
                  code: `curl -X GET \\
  "https://yourdomain.com/api/scraper?jobId=cm1...xyz" \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "errors",
          className: "scroll-mt-28",
          children: [/* @__PURE__ */ jsx(SectionHeader, {
            icon: AlertTriangle,
            title: "Error Reference",
            subtitle: "HTTP status codes and error payloads"
          }), /* @__PURE__ */ jsx(Card, {
            className: "border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-5 space-y-5",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground leading-relaxed",
                children: ["All errors follow a consistent JSON structure. Check the HTTP status code and the", /* @__PURE__ */ jsx("code", {
                  className: "font-mono text-xs",
                  children: "error"
                }), " field for details."]
              }), /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: [{
                  code: "400",
                  label: "Bad Request",
                  desc: "Validation failed or malformed payload. Check the issues array for field-level errors.",
                  color: "amber"
                }, {
                  code: "401",
                  label: "Unauthorized",
                  desc: "Missing or invalid X-API-Key header. Ensure your key is active and correctly formatted.",
                  color: "red"
                }, {
                  code: "403",
                  label: "Forbidden",
                  desc: "Valid key, but insufficient scope for the requested operation.",
                  color: "red"
                }, {
                  code: "404",
                  label: "Not Found",
                  desc: "The requested resource (lead, job, etc.) does not exist.",
                  color: "slate"
                }, {
                  code: "405",
                  label: "Method Not Allowed",
                  desc: "HTTP verb not supported on this endpoint.",
                  color: "slate"
                }, {
                  code: "429",
                  label: "Too Many Requests",
                  desc: "Rate limit exceeded. Wait until the X-RateLimit-Reset timestamp before retrying.",
                  color: "orange"
                }, {
                  code: "500",
                  label: "Internal Server Error",
                  desc: "Unexpected server failure. Contact support if this persists.",
                  color: "red"
                }].map((e) => /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 p-3.5 hover:border-border/50 transition-colors",
                  children: [/* @__PURE__ */ jsx(Badge, {
                    className: `shrink-0 rounded text-[10px] font-bold border ${e.color === "amber" ? "bg-amber-500/15 text-amber-400 border-amber-500/25" : e.color === "orange" ? "bg-orange-500/15 text-orange-400 border-orange-500/25" : e.color === "red" ? "bg-red-500/15 text-red-400 border-red-500/25" : "bg-slate-500/15 text-slate-300 border-slate-500/25"}`,
                    children: e.code
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-sm font-semibold",
                      children: e.label
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-muted-foreground mt-0.5",
                      children: e.desc
                    })]
                  })]
                }, e.code))
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                  children: "Validation error example (400)"
                }), /* @__PURE__ */ jsx(CodeBlock, {
                  lang: "json",
                  code: `{
  "error": "Validation failed",
  "issues": [
    {
      "code": "invalid_string",
      "path": ["email"],
      "message": "Invalid email format"
    },
    {
      "code": "too_small",
      "path": ["companyName"],
      "message": "Company name is required"
    }
  ]
}`
                })]
              })]
            })
          })]
        })]
      }), showBackToTop && /* @__PURE__ */ jsx("button", {
        type: "button",
        onClick: scrollToTop,
        className: "fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border/40 hover:shadow-xl hover:-translate-y-px transition-all duration-200",
        "aria-label": "Back to top",
        children: /* @__PURE__ */ jsx(ChevronUp, {
          className: "h-5 w-5 text-muted-foreground"
        })
      })]
    })
  });
});
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: docs_api,
  loader: loader$f,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader$e({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const imports2 = await prisma.leadImport.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  return {
    user,
    imports: imports2
  };
}
const imports = UNSAFE_withComponentProps(function ImportList() {
  const {
    user,
    imports: imports2
  } = useLoaderData();
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "Lead Imports"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Import leads from CSV files"
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/imports/new",
          children: /* @__PURE__ */ jsxs(Button, {
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(Upload, {
              className: "mr-2 h-4 w-4"
            }), "New Import"]
          })
        })]
      }), imports2.length === 0 ? /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center justify-center py-16",
          children: [/* @__PURE__ */ jsx(FileSpreadsheet, {
            className: "h-12 w-12 text-muted-foreground/50"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-4 text-lg font-medium text-muted-foreground",
            children: "No imports yet"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Upload a CSV file to bulk import leads"
          })]
        })
      }) : /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: imports2.map((imp) => /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex items-center gap-4 p-4",
            children: [/* @__PURE__ */ jsx(FileSpreadsheet, {
              className: "h-8 w-8 text-muted-foreground shrink-0"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium truncate",
                children: imp.fileName
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: ["by ", imp.user.name || imp.user.email, " — ", new Date(imp.createdAt).toLocaleDateString()]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx(StatusBadge, {
                status: imp.status
              }), /* @__PURE__ */ jsxs("span", {
                className: "text-sm text-muted-foreground",
                children: [imp.importedRows, "/", imp.totalRows, " imported"]
              }), imp.skippedRows > 0 && /* @__PURE__ */ jsxs(Badge, {
                variant: "outline",
                className: "text-amber-400",
                children: [imp.skippedRows, " skipped"]
              })]
            })]
          })
        }, imp.id))
      })]
    })
  });
});
function StatusBadge({
  status
}) {
  const config = {
    PENDING: "bg-slate-500/15 text-slate-400",
    MAPPING: "bg-blue-500/15 text-blue-400",
    IMPORTING: "bg-amber-500/15 text-amber-400",
    COMPLETED: "bg-emerald-500/15 text-emerald-400",
    FAILED: "bg-red-500/15 text-red-400"
  };
  return /* @__PURE__ */ jsx(Badge, {
    className: config[status] || config.PENDING,
    children: status
  });
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imports,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    const row = {};
    headers.forEach((h, idx) => {
      var _a;
      row[h] = ((_a = values[idx]) == null ? void 0 : _a.trim()) || "";
    });
    rows.push(row);
  }
  return { headers, rows };
}
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}
const LEAD_FIELDS = [
  { value: "companyName", label: "Company Name", required: true },
  { value: "contactName", label: "Contact Name" },
  { value: "email", label: "Email", required: true },
  { value: "industry", label: "Industry" },
  { value: "website", label: "Website" },
  { value: "estimatedTraffic", label: "Est. Traffic" },
  { value: "techStack", label: "Tech Stack" },
  { value: "leadSource", label: "Lead Source" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "notes", label: "Notes" }
];
function mapRowToLead(row, mapping) {
  const lead = {};
  for (const [csvCol, leadField] of Object.entries(mapping)) {
    const value = row[csvCol];
    if (value) lead[leadField] = sanitizeCSVCell(value);
  }
  return lead;
}
function sanitizeCSVCell(value) {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
}
async function processImport(importId) {
  var _a;
  const importJob = await prisma.leadImport.findUnique({
    where: { id: importId },
    include: { user: { select: { name: true } } }
  });
  if (!importJob || !importJob.csvData || !importJob.columnMapping) {
    throw new Error("Import job not found or missing data");
  }
  await prisma.leadImport.update({
    where: { id: importId },
    data: { status: "IMPORTING" }
  });
  const { rows } = parseCSV(importJob.csvData);
  const mapping = importJob.columnMapping;
  let imported = 0;
  let skipped = 0;
  const errors = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const leadData = mapRowToLead(row, mapping);
    if (!leadData.email) {
      skipped++;
      errors.push({ row: i + 1, error: "Missing email" });
      continue;
    }
    if (!leadData.companyName) {
      skipped++;
      errors.push({ row: i + 1, error: "Missing company name" });
      continue;
    }
    try {
      const existing = await prisma.lead.findUnique({
        where: { email: leadData.email }
      });
      if (existing) {
        skipped++;
        errors.push({ row: i + 1, error: `Duplicate email (${existing.companyName})` });
        continue;
      }
      const lead = await prisma.lead.create({
        data: {
          companyName: leadData.companyName,
          contactName: leadData.contactName || null,
          email: leadData.email,
          industry: leadData.industry || null,
          website: leadData.website || null,
          estimatedTraffic: leadData.estimatedTraffic || null,
          techStack: leadData.techStack || null,
          leadSource: leadData.leadSource || "CSV Import",
          linkedin: leadData.linkedin || null,
          facebook: leadData.facebook || null,
          instagram: leadData.instagram || null,
          twitter: leadData.twitter || null,
          notes: leadData.notes || null,
          importId,
          createdById: importJob.userId
        }
      });
      await logActivity({
        leadId: lead.id,
        userId: importJob.userId,
        action: "LEAD_CREATED",
        description: `${((_a = importJob.user) == null ? void 0 : _a.name) || "Unknown"} imported this lead`,
        metadata: { source: "CSV Import", fileName: importJob.fileName }
      });
      const scoreConfig = await getScoreConfig();
      if (scoreConfig.autoScore) {
        try {
          const scoreResult = await scoreLeadWithRules(void 0, {
            industry: lead.industry,
            estimatedTraffic: lead.estimatedTraffic,
            techStack: lead.techStack,
            leadSource: lead.leadSource,
            website: lead.website
          });
          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              score: scoreResult.score,
              maxScore: scoreResult.maxScore,
              temperature: scoreResult.temperature
            }
          });
        } catch {
        }
      }
      imported++;
    } catch (err) {
      skipped++;
      errors.push({ row: i + 1, error: String(err) });
    }
  }
  await prisma.leadImport.update({
    where: { id: importId },
    data: {
      status: "COMPLETED",
      totalRows: rows.length,
      importedRows: imported,
      skippedRows: skipped,
      errors: errors.length > 0 ? errors : null
    }
  });
  return { imported, skipped, errors };
}
async function loader$d({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  return {
    user
  };
}
async function action$b({
  request
}) {
  const userId = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "upload") {
    const file = formData.get("file");
    if (!file) return {
      error: "Please select a CSV file."
    };
    const text = await file.text();
    const {
      headers,
      rows
    } = parseCSV(text);
    if (headers.length === 0) return {
      error: "CSV file appears to be empty."
    };
    if (rows.length === 0) return {
      error: "CSV has headers but no data rows."
    };
    const importJob = await prisma.leadImport.create({
      data: {
        fileName: file.name,
        totalRows: rows.length,
        status: "MAPPING",
        csvData: text,
        userId
      }
    });
    return {
      uploaded: true,
      importId: importJob.id,
      headers,
      previewRows: rows.slice(0, 5),
      totalRows: rows.length
    };
  }
  if (intent === "import") {
    const importId = formData.get("importId");
    const mappingStr = formData.get("mapping");
    if (!importId || !mappingStr) return {
      error: "Missing import data."
    };
    const mapping = JSON.parse(mappingStr);
    await prisma.leadImport.update({
      where: {
        id: importId
      },
      data: {
        columnMapping: mapping
      }
    });
    const result = await processImport(importId);
    return {
      done: true,
      ...result
    };
  }
  return {};
}
const imports_new = UNSAFE_withComponentProps(function NewImport() {
  const {
    user
  } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [mapping, setMapping] = useState({});
  const isUploaded = actionData == null ? void 0 : actionData.uploaded;
  const isDone = actionData == null ? void 0 : actionData.done;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/imports",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "Import Leads"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Upload a CSV file to bulk import leads"
          })]
        })]
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20",
        children: actionData.error
      }), isDone && /* @__PURE__ */ jsx(Card, {
        className: "border-2 border-emerald-500/40 bg-emerald-500/5",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center gap-4 p-5",
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: "h-8 w-8 shrink-0 text-emerald-400"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex-1",
            children: [/* @__PURE__ */ jsx("p", {
              className: "font-semibold",
              children: "Import complete!"
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: [actionData.imported, " imported, ", actionData.skipped, " skipped"]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2",
            children: [/* @__PURE__ */ jsx(Link, {
              to: "/inbox",
              children: /* @__PURE__ */ jsx(Button, {
                variant: "outline",
                size: "sm",
                children: "View Inbox"
              })
            }), /* @__PURE__ */ jsx(Button, {
              size: "sm",
              onClick: () => navigate("/imports/new", {
                replace: true
              }),
              children: "Import More"
            })]
          })]
        })
      }), !isUploaded && !isDone && /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "Step 1: Upload CSV"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "CSV must have a header row. Required fields: Company Name and Email."
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            encType: "multipart/form-data",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "upload"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex items-center justify-center w-full",
              children: /* @__PURE__ */ jsxs("label", {
                className: "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-border hover:bg-muted/30 transition-colors",
                children: [/* @__PURE__ */ jsx(Upload, {
                  className: "h-10 w-10 text-muted-foreground mb-2"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Click to select a CSV file"
                }), /* @__PURE__ */ jsx("input", {
                  type: "file",
                  name: "file",
                  accept: ".csv",
                  className: "hidden",
                  required: true
                })]
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "flex justify-end",
              children: /* @__PURE__ */ jsx(Button, {
                type: "submit",
                children: "Upload & Preview"
              })
            })]
          })
        })]
      }), isUploaded && !isDone && actionData.headers && /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Step 2: Map Columns"
            }), /* @__PURE__ */ jsxs(CardDescription, {
              children: ["Match your CSV columns to lead fields. ", actionData.totalRows, " rows found."]
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx("div", {
              className: "space-y-3",
              children: actionData.headers.map((header) => /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-4",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "w-48 shrink-0",
                  children: /* @__PURE__ */ jsx("code", {
                    className: "text-sm bg-muted px-2 py-1 rounded",
                    children: header
                  })
                }), /* @__PURE__ */ jsxs(Select, {
                  className: "flex-1",
                  defaultValue: autoMap(header),
                  onChange: (e) => {
                    setMapping((prev) => ({
                      ...prev,
                      [header]: e.target.value
                    }));
                  },
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "",
                    children: "— Skip this column —"
                  }), LEAD_FIELDS.map((f) => /* @__PURE__ */ jsxs("option", {
                    value: f.value,
                    children: [f.label, " ", f.required ? "*" : ""]
                  }, f.value))]
                })]
              }, header))
            })
          })]
        }), actionData.previewRows && actionData.previewRows.length > 0 && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Step 3: Preview (first 5 rows)"
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx("div", {
              className: "overflow-x-auto",
              children: /* @__PURE__ */ jsxs("table", {
                className: "w-full text-xs",
                children: [/* @__PURE__ */ jsx("thead", {
                  children: /* @__PURE__ */ jsx("tr", {
                    className: "border-b bg-muted/50",
                    children: actionData.headers.map((h) => /* @__PURE__ */ jsx("th", {
                      className: "px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap",
                      children: h
                    }, h))
                  })
                }), /* @__PURE__ */ jsx("tbody", {
                  children: actionData.previewRows.map((row, i) => /* @__PURE__ */ jsx("tr", {
                    className: "border-b",
                    children: actionData.headers.map((h) => /* @__PURE__ */ jsx("td", {
                      className: "px-2 py-1.5 whitespace-nowrap max-w-[200px] truncate",
                      children: row[h]
                    }, h))
                  }, i))
                })]
              })
            })
          })]
        }), /* @__PURE__ */ jsxs(Form, {
          method: "post",
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "intent",
            value: "import"
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "importId",
            value: actionData.importId
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "mapping",
            value: JSON.stringify(mapping)
          }), /* @__PURE__ */ jsx(Link, {
            to: "/imports",
            children: /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              children: "Cancel"
            })
          }), /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(Upload, {
              className: "mr-2 h-4 w-4"
            }), "Import ", actionData.totalRows, " Leads"]
          })]
        })]
      })]
    })
  });
});
function autoMap(header) {
  const lower = header.toLowerCase().replace(/[^a-z]/g, "");
  const map = {
    companyname: "companyName",
    company: "companyName",
    contactname: "contactName",
    name: "contactName",
    fullname: "contactName",
    email: "email",
    industry: "industry",
    website: "website",
    url: "website",
    traffic: "estimatedTraffic",
    estimatedtraffic: "estimatedTraffic",
    techstack: "techStack",
    technology: "techStack",
    leadsource: "leadSource",
    source: "leadSource",
    linkedin: "linkedin",
    facebook: "facebook",
    instagram: "instagram",
    twitter: "twitter",
    notes: "notes"
  };
  return map[lower] || "";
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$b,
  default: imports_new,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });
  useEffect$1(() => {
    const root2 = document.documentElement;
    root2.classList.remove("dark", "light");
    root2.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => prev === "dark" ? "light" : "dark");
  };
  return { theme, toggleTheme };
}
async function loader$c({
  request
}) {
  const userId = await requireAuth(request);
  const url = new URL(request.url);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true,
      gmailTokens: true
    }
  });
  return {
    user,
    gmailStatus: url.searchParams.get("gmail")
  };
}
async function action$a({
  request
}) {
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "disconnectGmail") {
    await prisma.gmailToken.deleteMany({
      where: {
        userId
      }
    });
    return {
      success: true,
      disconnected: true
    };
  }
  return {};
}
const settings = UNSAFE_withComponentProps(function Settings3() {
  var _a;
  const {
    user,
    gmailStatus
  } = useLoaderData();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigation = useNavigation();
  const [, setSearchParams] = useSearchParams();
  const isDisconnecting = navigation.state === "submitting" && ((_a = navigation.formData) == null ? void 0 : _a.get("intent")) === "disconnectGmail";
  useEffect$1(() => {
    if (gmailStatus) {
      const timer = setTimeout(() => setSearchParams({}, {
        replace: true
      }), 4e3);
      return () => clearTimeout(timer);
    }
  }, [gmailStatus, setSearchParams]);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold tracking-tight",
          children: "Settings"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground",
          children: "Manage your account and integrations"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [theme === "dark" ? /* @__PURE__ */ jsx(Moon, {
                className: "h-4 w-4"
              }) : /* @__PURE__ */ jsx(Sun, {
                className: "h-4 w-4"
              }), "Appearance"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Toggle between light and dark mode"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between rounded-lg border p-4",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3",
                children: [theme === "dark" ? /* @__PURE__ */ jsx(Moon, {
                  className: "h-5 w-5 text-violet-400"
                }) : /* @__PURE__ */ jsx(Sun, {
                  className: "h-5 w-5 text-amber-500"
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsxs("p", {
                    className: "font-medium capitalize",
                    children: [theme, " Mode"]
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-muted-foreground",
                    children: theme === "dark" ? "Dark background with light text" : "Light background with dark text"
                  })]
                })]
              }), /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                onClick: toggleTheme,
                children: ["Switch to ", theme === "dark" ? "Light" : "Dark"]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              children: "Profile"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Your account information"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm font-medium text-muted-foreground",
                children: "Name"
              }), /* @__PURE__ */ jsx("p", {
                children: (user == null ? void 0 : user.name) || "Not set"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm font-medium text-muted-foreground",
                children: "Email"
              }), /* @__PURE__ */ jsx("p", {
                children: user == null ? void 0 : user.email
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm font-medium text-muted-foreground",
                children: "Role"
              }), /* @__PURE__ */ jsx(Badge, {
                variant: "secondary",
                children: user == null ? void 0 : user.role
              })]
            })]
          })]
        }), (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Users, {
                className: "h-4 w-4"
              }), "User Management"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Create and manage team accounts"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/settings/users",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(Users, {
                  className: "mr-2 h-4 w-4"
                }), "Manage Users"]
              })
            })
          })]
        }), (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(ShieldCheck, {
                className: "h-4 w-4"
              }), "Verification Criteria"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Customize how leads are evaluated"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/verification/criteria",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(ShieldCheck, {
                  className: "mr-2 h-4 w-4"
                }), "Manage Criteria"]
              })
            })
          })]
        }), (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Database, {
                className: "h-4 w-4"
              }), "Database Migrations"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Apply schema changes without losing data"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/settings/database",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(Database, {
                  className: "mr-2 h-4 w-4"
                }), "Manage Database"]
              })
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              children: "Gmail Integration"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Connect your Gmail account for email outreach"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [gmailStatus && /* @__PURE__ */ jsxs("div", {
              className: `rounded-md border p-3 text-sm ${gmailStatus === "connected" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : gmailStatus === "denied" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`,
              children: [gmailStatus === "connected" && "Gmail connected successfully!", gmailStatus === "denied" && "Gmail connection was denied.", gmailStatus === "disconnected" && "Gmail disconnected.", gmailStatus === "error" && "Something went wrong connecting Gmail."]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10",
                  children: /* @__PURE__ */ jsx("svg", {
                    className: "h-5 w-5 text-red-400",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx("path", {
                      d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    })
                  })
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "font-medium",
                    children: "Google OAuth"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-muted-foreground",
                    children: (user == null ? void 0 : user.gmailTokens) ? "Gmail account connected" : "No Gmail account connected"
                  })]
                })]
              }), /* @__PURE__ */ jsx(Badge, {
                variant: (user == null ? void 0 : user.gmailTokens) ? "success" : "secondary",
                children: (user == null ? void 0 : user.gmailTokens) ? "Connected" : "Disconnected"
              })]
            }), (user == null ? void 0 : user.gmailTokens) ? /* @__PURE__ */ jsxs("div", {
              className: "flex gap-2",
              children: [/* @__PURE__ */ jsx(Link, {
                to: "/auth/google",
                className: "flex-1",
                children: /* @__PURE__ */ jsx(Button, {
                  variant: "outline",
                  className: "w-full",
                  children: "Reconnect Gmail"
                })
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "flex-1",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "disconnectGmail"
                }), /* @__PURE__ */ jsx(Button, {
                  type: "submit",
                  variant: "outline",
                  className: "w-full text-red-400 hover:text-red-300",
                  disabled: isDisconnecting,
                  children: isDisconnecting ? "Disconnecting..." : "Disconnect"
                })]
              })]
            }) : /* @__PURE__ */ jsx(Link, {
              to: "/auth/google",
              children: /* @__PURE__ */ jsx(Button, {
                className: "w-full",
                children: "Connect Gmail"
              })
            })]
          })]
        }), (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Key, {
                className: "h-4 w-4"
              }), "API Keys"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Generate and manage API keys for external integrations"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/settings/api-keys",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(Key, {
                  className: "mr-2 h-4 w-4"
                }), "Manage API Keys"]
              })
            })
          })]
        }), (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Zap, {
                className: "h-4 w-4"
              }), "Scoring Rules"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Attribute-based rules that auto-score leads"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/settings/scoring-rules",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(Zap, {
                  className: "mr-2 h-4 w-4"
                }), "Manage Scoring Rules"]
              })
            })
          })]
        }), (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Columns3, {
                className: "h-4 w-4"
              }), "Pipeline Stages"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Customize your sales pipeline stages and order"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/settings/stages",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(Columns3, {
                  className: "mr-2 h-4 w-4"
                }), "Manage Stages"]
              })
            })
          })]
        })]
      })]
    })
  });
});
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: settings,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
const ALLOWED_ROLES = ["AGENT", "ADMIN"];
async function loader$b({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const users2 = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return {
    user,
    users: users2
  };
}
async function action$9({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "create") {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name") || null;
    const role = formData.get("role");
    if (!email || !password) return {
      error: "Email and password required."
    };
    if (!ALLOWED_ROLES.includes(role)) return {
      error: "Invalid role."
    };
    const existing = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existing) return {
      error: "Email already in use."
    };
    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role
      }
    });
    return {
      success: true
    };
  }
  if (intent === "updateRole") {
    const targetUserId = formData.get("userId");
    const newRole = formData.get("role");
    if (!ALLOWED_ROLES.includes(newRole)) return {
      error: "Invalid role."
    };
    await prisma.user.update({
      where: {
        id: targetUserId
      },
      data: {
        role: newRole
      }
    });
    return {
      success: true
    };
  }
  if (intent === "delete") {
    const targetUserId = formData.get("userId");
    const sessionUserId = await requireAdmin(request);
    if (targetUserId === sessionUserId) {
      return {
        error: "You cannot delete your own account."
      };
    }
    await prisma.user.delete({
      where: {
        id: targetUserId
      }
    });
    return {
      success: true
    };
  }
  return {};
}
const settings_users = UNSAFE_withComponentProps(function UserManagement() {
  const {
    user,
    users: users2
  } = useLoaderData();
  const actionData = useActionData();
  const [showCreate, setShowCreate] = useState(false);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/settings",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "User Management"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Create accounts and manage roles for your team"
          })]
        }), /* @__PURE__ */ jsxs(Button, {
          onClick: () => setShowCreate(true),
          children: [/* @__PURE__ */ jsx(Plus, {
            className: "mr-2 h-4 w-4"
          }), "Add User"]
        })]
      }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400",
        children: "Updated successfully."
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive",
        children: actionData.error
      }), /* @__PURE__ */ jsx(Dialog, {
        open: showCreate,
        onOpenChange: setShowCreate,
        children: /* @__PURE__ */ jsxs(DialogContent, {
          className: "max-w-md",
          children: [/* @__PURE__ */ jsx(DialogHeader, {
            children: /* @__PURE__ */ jsx(DialogTitle, {
              children: "Create New User"
            })
          }), /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "create"
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "name",
                children: "Full Name"
              }), /* @__PURE__ */ jsx(Input, {
                id: "name",
                name: "name",
                placeholder: "Juan Dela Cruz"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "email",
                children: "Email *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "email",
                name: "email",
                type: "email",
                required: true,
                placeholder: "user@company.com"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "password",
                children: "Password *"
              }), /* @__PURE__ */ jsx(Input, {
                id: "password",
                name: "password",
                type: "password",
                required: true,
                placeholder: "Min. 8 characters",
                minLength: 8
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "role",
                children: "Role"
              }), /* @__PURE__ */ jsxs(Select, {
                id: "role",
                name: "role",
                defaultValue: "AGENT",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "AGENT",
                  children: "Agent"
                }), /* @__PURE__ */ jsx("option", {
                  value: "ADMIN",
                  children: "Admin"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-end gap-2",
              children: [/* @__PURE__ */ jsx(Button, {
                type: "button",
                variant: "outline",
                onClick: () => setShowCreate(false),
                children: "Cancel"
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                children: "Create User"
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: users2.map((u) => {
          var _a, _b;
          return /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex items-center gap-4 p-4",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10",
                children: /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-semibold",
                  children: ((_b = (_a = u.name) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) || u.email[0].toUpperCase()
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "font-medium truncate",
                    children: u.name || u.email
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: u.role === "ADMIN" ? "default" : "secondary",
                    children: u.role
                  })]
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground truncate",
                  children: u.email
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["Joined ", new Date(u.createdAt).toLocaleDateString()]
                })]
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "updateRole"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "userId",
                  value: u.id
                }), /* @__PURE__ */ jsxs(Select, {
                  name: "role",
                  defaultValue: u.role,
                  className: "w-24",
                  onChange: (e) => {
                    e.target.closest("form").submit();
                  },
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "AGENT",
                    children: "Agent"
                  }), /* @__PURE__ */ jsx("option", {
                    value: "ADMIN",
                    children: "Admin"
                  })]
                })]
              }), /* @__PURE__ */ jsxs(Form, {
                method: "post",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "delete"
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "userId",
                  value: u.id
                }), /* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "currentUserId",
                  value: user.email
                }), /* @__PURE__ */ jsx(Button, {
                  type: "submit",
                  variant: "ghost",
                  size: "icon",
                  title: "Delete user",
                  children: /* @__PURE__ */ jsx(Trash2, {
                    className: "h-4 w-4 text-destructive"
                  })
                })]
              })]
            })
          }, u.id);
        })
      })]
    })
  });
});
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: settings_users,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
function getNextMigrationNumber(dir) {
  const files = discoverMigrationFiles(dir);
  if (files.length === 0) return 1;
  let max = 0;
  for (const f of files) {
    const match = f.match(/^(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  }
  return max + 1;
}
const DANGEROUS_PATTERNS = [
  { pattern: /\bDROP\s+DATABASE\b/i, label: "DROP DATABASE" },
  { pattern: /\bTRUNCATE\s+/i, label: "TRUNCATE" },
  { pattern: /\bDROP\s+TABLE\s+(?!IF\s+EXISTS)/i, label: "DROP TABLE without IF EXISTS" },
  { pattern: /\bDELETE\s+FROM\s+\w+\s*;/i, label: "DELETE without WHERE clause" },
  { pattern: /\bGRANT\s+/i, label: "GRANT (privilege escalation)" },
  { pattern: /\bREVOKE\s+/i, label: "REVOKE (privilege modification)" },
  { pattern: /\bALTER\s+USER\b/i, label: "ALTER USER (privilege escalation)" },
  { pattern: /\bCREATE\s+USER\b/i, label: "CREATE USER (privilege escalation)" },
  { pattern: /\bDROP\s+USER\b/i, label: "DROP USER" },
  { pattern: /\bLOAD\s+DATA\b/i, label: "LOAD DATA (file access)" },
  { pattern: /\bINTO\s+OUTFILE\b/i, label: "INTO OUTFILE (file write)" },
  { pattern: /\bINTO\s+DUMPFILE\b/i, label: "INTO DUMPFILE (file write)" },
  { pattern: /\bUPDATE\s+\w+\s+SET\s+/i, label: "UPDATE (data modification — use ALTER TABLE for schema changes)" }
];
function checkDangerousSQL(sql) {
  for (const { pattern, label } of DANGEROUS_PATTERNS) {
    if (pattern.test(sql)) {
      return `Potentially dangerous SQL detected: "${label}". Use IF EXISTS for drops, and always include WHERE clauses for deletes.`;
    }
  }
  return null;
}
function parseSQLStatements(sql) {
  return sql.split(";").map((s) => s.trim()).filter((s) => {
    if (s.length === 0) return false;
    const withoutComments = s.replace(/--.*/g, "").trim();
    return withoutComments.length > 0;
  });
}
function discoverMigrationFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".sql") && !f.startsWith("README")).sort();
}
function sanitizeMigrationName(name) {
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    throw new Error(`Invalid migration filename: "${name}"`);
  }
  return name;
}
const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");
async function ensureMigrationTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`_MigrationLog\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL UNIQUE,
      \`appliedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`checksum\` VARCHAR(64) NULL
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}
async function getAppliedMigrations() {
  await ensureMigrationTable();
  const rows = await prisma.$queryRaw`
    SELECT \`name\` FROM \`_MigrationLog\` ORDER BY \`name\` ASC
  `;
  return rows.map((r) => r.name);
}
async function recordMigration(name) {
  const safeName = sanitizeMigrationName(name);
  await prisma.$executeRaw`INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES (${safeName}, NOW(3))`;
}
async function getMigrationStatus() {
  const applied = await getAppliedMigrations();
  const files = discoverMigrationFiles(MIGRATIONS_DIR).map((name) => ({
    name,
    filePath: path.join(MIGRATIONS_DIR, name)
  }));
  const appliedSet = new Set(applied);
  const migrations = files.map((f) => ({
    name: f.name,
    applied: appliedSet.has(f.name)
  }));
  const pending = migrations.filter((m) => !m.applied);
  return {
    migrations,
    pendingCount: pending.length,
    appliedCount: applied.length,
    total: files.length
  };
}
async function applyPendingMigrations() {
  const status = await getMigrationStatus();
  const pending = status.migrations.filter((m) => !m.applied);
  if (pending.length === 0) {
    return { applied: [], errors: [] };
  }
  const appliedList = [];
  const errors = [];
  for (const migration of pending) {
    const sql = fs.readFileSync(
      path.join(MIGRATIONS_DIR, migration.name),
      "utf-8"
    );
    const danger = checkDangerousSQL(sql);
    if (danger) {
      errors.push({ migration: migration.name, error: `Blocked: ${danger}` });
      break;
    }
    try {
      await prisma.$transaction(async (tx) => {
        const statements = parseSQLStatements(sql);
        for (const stmt of statements) {
          try {
            await tx.$executeRawUnsafe(stmt);
          } catch (stmtErr) {
            const msg = stmtErr instanceof Error ? stmtErr.message : String(stmtErr);
            if (stmt.trimStart().toUpperCase().startsWith("ALTER TABLE") && msg.includes("Duplicate key name")) {
            } else {
              throw stmtErr;
            }
          }
        }
        await recordMigration(migration.name);
      });
      appliedList.push(migration.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ migration: migration.name, error: sanitizeErrorMessage$1(message) });
      break;
    }
  }
  return { applied: appliedList, errors };
}
async function createMigration(name, sql, options) {
  const dir = MIGRATIONS_DIR;
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return { filename: "", applied: false, error: "Name can only contain letters, numbers, dashes, and underscores." };
  }
  if (!sql.trim()) {
    return { filename: "", applied: false, error: "SQL content cannot be empty." };
  }
  const danger = checkDangerousSQL(sql);
  if (danger) {
    return { filename: "", applied: false, error: danger };
  }
  const nextNum = getNextMigrationNumber(dir);
  const filename = `${String(nextNum).padStart(3, "0")}_${name}.sql`;
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, sql, "utf-8");
  if (options == null ? void 0 : options.autoApply) {
    const result = await applySingleMigration(filename);
    if (result.error) {
      return { filename, applied: false, error: result.error };
    }
    return { filename, applied: true };
  }
  return { filename, applied: false };
}
async function applySingleMigration(filename) {
  sanitizeMigrationName(filename);
  const filePath = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return { applied: false, error: `Migration file not found: ${filename}` };
  }
  const applied = await getAppliedMigrations();
  if (applied.includes(filename)) {
    return { applied: false, error: `Migration already applied: ${filename}` };
  }
  const sql = fs.readFileSync(filePath, "utf-8");
  try {
    await prisma.$transaction(async (tx) => {
      const statements = parseSQLStatements(sql);
      for (const stmt of statements) {
        try {
          await tx.$executeRawUnsafe(stmt);
        } catch (stmtErr) {
          const msg = stmtErr instanceof Error ? stmtErr.message : String(stmtErr);
          if (stmt.trimStart().toUpperCase().startsWith("ALTER TABLE") && msg.includes("Duplicate key name")) {
          } else {
            throw stmtErr;
          }
        }
      }
      await recordMigration(filename);
    });
    return { applied: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { applied: false, error: sanitizeErrorMessage$1(message) };
  }
}
async function markBaselineApplied() {
  await ensureMigrationTable();
  const applied = await getAppliedMigrations();
  if (applied.includes("000_baseline.sql")) {
    return false;
  }
  await recordMigration("000_baseline.sql");
  return true;
}
async function markMigrationApplied(filename) {
  await ensureMigrationTable();
  sanitizeMigrationName(filename);
  const filePath = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `Migration file not found: ${filename}` };
  }
  const applied = await getAppliedMigrations();
  if (applied.includes(filename)) {
    return { success: false, error: `Migration already marked as applied: ${filename}` };
  }
  await recordMigration(filename);
  return { success: true };
}
function sanitizeErrorMessage$1(message) {
  return message.replace(/mysql:\/\//g, "mysql:[redacted]@").replace(/password=\S+/g, "password=[redacted]").replace(/host=\S+/g, "host=[redacted]").slice(0, 200);
}
function prismaTypeToMysql(field) {
  const t = field.dbType;
  if (t.includes("LongText")) return "LONGTEXT";
  if (t.includes("Text")) return "TEXT";
  if (t.includes("Long")) return "BIGINT";
  if (t.includes("Double")) return "DOUBLE";
  if (t.includes("Decimal")) return "DECIMAL(65,30)";
  if (t === "String") return "VARCHAR(191)";
  if (t === "Int") return "INT";
  if (t === "BigInt") return "BIGINT";
  if (t === "Float") return "DOUBLE";
  if (t === "Decimal") return "DECIMAL(65,30)";
  if (t === "Boolean") return "BOOLEAN";
  if (t === "DateTime") return "DATETIME(3)";
  if (t === "Json") return "JSON";
  if (t === "Bytes") return "LONGBLOB";
  return t;
}
function mysqlDefaultExpr(field) {
  if (!field.default_value) return null;
  const d = field.default_value;
  if (d === "autoincrement()") return null;
  if (d === "now()" || d === "CURRENT_TIMESTAMP") return "DEFAULT CURRENT_TIMESTAMP(3)";
  if (d === "cuid()" || d === "uuid()" || d === "nanoid()") return null;
  if (d === "true()") return "DEFAULT TRUE";
  if (d === "false()") return "DEFAULT FALSE";
  if (d.startsWith("'") || d.startsWith('"')) return `DEFAULT ${d}`;
  if (d.match(/^\d+$/)) return `DEFAULT ${d}`;
  if (d.match(/^\d+\.\d+$/)) return `DEFAULT ${d}`;
  return `DEFAULT ${d}`;
}
function parsePrismaSchema(schemaPath) {
  const content = fs.readFileSync(schemaPath, "utf-8");
  const models = [];
  const stripped = content.replace(/\/\/.*$/gm, "");
  const modelStartRegex = /^model\s+(\w+)\s*\{/gm;
  let match;
  while ((match = modelStartRegex.exec(stripped)) !== null) {
    const modelName = match[1];
    const startIdx = match.index + match[0].length;
    let depth = 1;
    let endIdx = startIdx;
    while (depth > 0 && endIdx < stripped.length) {
      if (stripped[endIdx] === "{") depth++;
      else if (stripped[endIdx] === "}") depth--;
      endIdx++;
    }
    const body = stripped.slice(startIdx, endIdx - 1);
    const fields = [];
    let tableName = modelName;
    const mapMatch = body.match(/@@map\s*\(\s*"(\w+)"\s*\)/);
    if (mapMatch) {
      tableName = mapMatch[1];
    }
    const lines = body.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) continue;
      const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(?:\s+(.*))?$/);
      if (!fieldMatch) continue;
      const [, fieldName, fieldType, attrsStr] = fieldMatch;
      if (attrsStr && attrsStr.includes("@relation")) continue;
      const prismaTypes = ["String", "Int", "BigInt", "Float", "Decimal", "Boolean", "DateTime", "Json", "Bytes"];
      if (!prismaTypes.includes(fieldType) && !(attrsStr == null ? void 0 : attrsStr.includes("@db."))) continue;
      const attrs = attrsStr || "";
      const isId = attrs.includes("@id");
      const isUnique = attrs.includes("@unique") || isId;
      const nullable = attrs.includes("?");
      const dbTypeMatch = attrs.match(/@db\.(\w+(?:\(\d+\))?)/);
      const dbType = dbTypeMatch ? dbTypeMatch[1] : fieldType;
      let default_value = null;
      const defaultMatch = attrs.match(/@default\s*\((.+)\)(?:\s|$)/);
      if (defaultMatch) {
        default_value = defaultMatch[1].trim();
      }
      let fullDbType = dbType;
      const varcharMatch = attrs.match(/@db\.VarChar\((\d+)\)/);
      if (varcharMatch) {
        fullDbType = `VARCHAR(${varcharMatch[1]})`;
      }
      fields.push({
        name: fieldName,
        dbType: fullDbType,
        nullable,
        default_value,
        isId,
        isUnique
      });
    }
    if (fields.length > 0) {
      models.push({ name: modelName, tableName, fields });
    }
  }
  return models;
}
async function getExistingTables() {
  const rows = await prisma.$queryRaw`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
  `;
  return new Set(rows.map((r) => r.TABLE_NAME));
}
async function getExistingColumns(tableName) {
  const rows = await prisma.$queryRaw`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${tableName}
    `;
  const map = /* @__PURE__ */ new Map();
  for (const r of rows) {
    map.set(r.COLUMN_NAME, {
      name: r.COLUMN_NAME,
      type: r.COLUMN_TYPE,
      nullable: r.IS_NULLABLE === "YES",
      default_value: r.COLUMN_DEFAULT
    });
  }
  return map;
}
function generateCreateTableSQL(model) {
  const lines = [];
  const pks = [];
  lines.push(`CREATE TABLE IF NOT EXISTS \`${model.tableName}\` (`);
  for (const field of model.fields) {
    const mysqlType = prismaTypeToMysql(field);
    const parts = [`  \`${field.name}\` ${mysqlType}`];
    if (!field.nullable && !field.isId) parts.push("NOT NULL");
    const defaultExpr = mysqlDefaultExpr(field);
    if (defaultExpr) parts.push(defaultExpr);
    lines.push(parts.join(" ") + ",");
    if (field.isId) pks.push(field.name);
  }
  if (pks.length > 0) {
    lines.push(`  PRIMARY KEY (\`${pks.join("`, `")}\`),`);
  }
  for (const field of model.fields) {
    if (field.isUnique && !field.isId) {
      lines.push(`  UNIQUE INDEX \`${model.tableName}_${field.name}_key\` (\`${field.name}\`),`);
    }
  }
  for (const field of model.fields) {
    if (field.name.endsWith("Id") && !field.isId && !field.isUnique) {
      lines.push(`  INDEX \`${model.tableName}_${field.name}_idx\` (\`${field.name}\`),`);
    }
  }
  let lastLine = lines[lines.length - 1];
  if (lastLine.endsWith(",")) {
    lines[lines.length - 1] = lastLine.slice(0, -1);
  }
  lines.push(`) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  return lines.join("\n");
}
function generateAlterTableSQL(model, missingColumns) {
  const lines = [];
  const table = model.tableName;
  for (const field of missingColumns) {
    const mysqlType = prismaTypeToMysql(field);
    const parts = [`ALTER TABLE \`${table}\` ADD COLUMN \`${field.name}\` ${mysqlType}`];
    if (!field.nullable) parts.push("NOT NULL");
    const defaultExpr = mysqlDefaultExpr(field);
    if (defaultExpr) parts.push(defaultExpr);
    else if (!field.nullable && field.default_value === null) {
      if (mysqlType.startsWith("VARCHAR") || mysqlType === "TEXT" || mysqlType === "LONGTEXT") {
        parts.push("DEFAULT ''");
      } else if (mysqlType === "INT" || mysqlType === "BIGINT") {
        parts.push("DEFAULT 0");
      } else if (mysqlType === "BOOLEAN") {
        parts.push("DEFAULT FALSE");
      } else if (mysqlType === "JSON") {
        parts[0] = parts[0].replace("NOT NULL", "");
        parts.push("DEFAULT NULL");
      } else if (mysqlType === "DATETIME(3)") {
        parts.push("DEFAULT CURRENT_TIMESTAMP(3)");
      } else if (mysqlType === "DOUBLE") {
        parts.push("DEFAULT 0");
      }
    }
    lines.push(parts.join(" ") + ";");
  }
  return lines.join("\n");
}
async function getSchemaDiff() {
  const schemaPath = path.resolve(process.cwd(), "prisma", "schema.prisma");
  const models = parsePrismaSchema(schemaPath);
  const existingTables = await getExistingTables();
  const sections = [];
  const ignoredTables = /* @__PURE__ */ new Set(["_MigrationLog", "_prisma_migrations"]);
  for (const model of models) {
    if (ignoredTables.has(model.tableName)) continue;
    if (!existingTables.has(model.tableName)) {
      const sql = generateCreateTableSQL(model);
      sections.push({
        model: model.name,
        table: model.tableName,
        status: "missing_table",
        sql,
        missingColumns: model.fields.map((f) => f.name)
      });
    } else {
      const existingColumns = await getExistingColumns(model.tableName);
      const missing = model.fields.filter((f) => !existingColumns.has(f.name));
      if (missing.length > 0) {
        const sql = generateAlterTableSQL(model, missing);
        sections.push({
          model: model.name,
          table: model.tableName,
          status: "missing_columns",
          sql,
          missingColumns: missing.map((f) => f.name)
        });
      }
    }
  }
  return sections;
}
async function applySchemaDiffSQL(sql) {
  const danger = checkDangerousSQL(sql);
  if (danger) {
    return { success: false, error: danger };
  }
  try {
    const statements = sql.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: sanitizeErrorMessage(message) };
  }
}
function sanitizeErrorMessage(message) {
  return message.replace(/mysql:\/\//g, "mysql:[redacted]@").replace(/password=\S+/g, "password=[redacted]").replace(/host=\S+/g, "host=[redacted]").slice(0, 200);
}
async function loader$a({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  await markBaselineApplied();
  const status = await getMigrationStatus();
  const schemaDiff = await getSchemaDiff();
  return {
    user,
    status,
    schemaDiff
  };
}
async function action$8({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "createMigration") {
    const name = (formData.get("migrationName") || "").trim();
    const sql = (formData.get("migrationSql") || "").trim();
    const autoApply = formData.get("autoApply") === "on";
    const result2 = await createMigration(name, sql, {
      autoApply
    });
    return {
      intent: "createMigration",
      ...result2
    };
  }
  if (intent === "applyDiff") {
    const sql = (formData.get("sql") || "").trim();
    const tableName = (formData.get("tableName") || "").trim();
    const result2 = await applySchemaDiffSQL(sql);
    return {
      intent: "applyDiff",
      tableName,
      ...result2
    };
  }
  if (intent === "applyAllDiff") {
    const diff = await getSchemaDiff();
    const results = [];
    for (const section of diff) {
      const result2 = await applySchemaDiffSQL(section.sql);
      results.push({
        table: section.table,
        success: result2.success,
        error: result2.error
      });
    }
    return {
      intent: "applyAllDiff",
      results
    };
  }
  if (intent === "markApplied") {
    const filename = (formData.get("filename") || "").trim();
    const result2 = await markMigrationApplied(filename);
    return {
      intent: "markApplied",
      ...result2
    };
  }
  const result = await applyPendingMigrations();
  return result;
}
const settings_database = UNSAFE_withComponentProps(function SettingsDatabase() {
  var _a, _b;
  const {
    user,
    status,
    schemaDiff
  } = useLoaderData();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const [showCreate, setShowCreate] = useState(false);
  const isApplying = navigation.state === "submitting" || fetcher.state === "submitting" && ((_a = fetcher.formData) == null ? void 0 : _a.get("intent")) === "applyMigrations";
  const isCreating = fetcher.state === "submitting" && ((_b = fetcher.formData) == null ? void 0 : _b.get("intent")) === "createMigration";
  const data2 = fetcher.data;
  const isCreateResult = data2 && "intent" in data2 && data2.intent === "createMigration";
  const applyData = isCreateResult ? null : data2;
  const appliedFromAction = (applyData == null ? void 0 : applyData.applied) ?? [];
  const errorsFromAction = (applyData == null ? void 0 : applyData.errors) ?? [];
  const createResult = isCreateResult ? data2 : null;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold tracking-tight",
          children: "Database Migrations"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground",
          children: "Manage schema changes without affecting existing data"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-4 md:grid-cols-3",
        children: [/* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx(Database, {
                className: "h-8 w-8 text-blue-500"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-2xl font-bold",
                  children: status.total
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Total Migrations"
                })]
              })]
            })
          })
        }), /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx(CheckCircle2, {
                className: "h-8 w-8 text-emerald-500"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-2xl font-bold",
                  children: status.appliedCount
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Applied"
                })]
              })]
            })
          })
        }), /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [status.pendingCount > 0 ? /* @__PURE__ */ jsx(AlertCircle, {
                className: "h-8 w-8 text-amber-500"
              }) : /* @__PURE__ */ jsx(CheckCircle2, {
                className: "h-8 w-8 text-emerald-500"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-2xl font-bold",
                  children: status.pendingCount
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Pending"
                })]
              })]
            })
          })
        })]
      }), status.pendingCount > 0 && /* @__PURE__ */ jsx(Card, {
        className: "border-amber-500/30 bg-amber-500/5",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("p", {
                className: "font-medium",
                children: [status.pendingCount, " pending migration", status.pendingCount !== 1 ? "s" : "", " ready to apply"]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Review the changes below before applying. Migrations run in order and stop on the first error."
              })]
            }), /* @__PURE__ */ jsxs(fetcher.Form, {
              method: "post",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "applyMigrations"
              }), /* @__PURE__ */ jsxs(Button, {
                type: "submit",
                disabled: isApplying,
                children: [/* @__PURE__ */ jsx(Play, {
                  className: "mr-2 h-4 w-4"
                }), isApplying ? "Applying..." : "Apply Migrations"]
              })]
            })]
          })
        })
      }), appliedFromAction.length > 0 && /* @__PURE__ */ jsx(Card, {
        className: "border-emerald-500/30 bg-emerald-500/5",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-start gap-3",
            children: [/* @__PURE__ */ jsx(CheckCircle2, {
              className: "mt-0.5 h-5 w-5 text-emerald-500"
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("p", {
                className: "font-medium text-emerald-400",
                children: ["Successfully applied ", appliedFromAction.length, " migration", appliedFromAction.length !== 1 ? "s" : "", ":"]
              }), /* @__PURE__ */ jsx("ul", {
                className: "mt-1 list-inside list-disc text-sm text-muted-foreground",
                children: appliedFromAction.map((m) => /* @__PURE__ */ jsx("li", {
                  children: m
                }, m))
              })]
            })]
          })
        })
      }), errorsFromAction.length > 0 && /* @__PURE__ */ jsx(Card, {
        className: "border-red-500/30 bg-red-500/5",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-start gap-3",
            children: [/* @__PURE__ */ jsx(AlertCircle, {
              className: "mt-0.5 h-5 w-5 text-red-500"
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-red-400",
                children: "Migration failed:"
              }), errorsFromAction.map((e) => /* @__PURE__ */ jsxs("div", {
                className: "mt-1",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium",
                  children: e.migration
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: e.error
                })]
              }, e.migration))]
            })]
          })
        })
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Migration History"
          }), /* @__PURE__ */ jsxs(CardDescription, {
            children: ["All migration files found in the ", /* @__PURE__ */ jsx("code", {
              children: "migrations/"
            }), " folder. Files are applied in alphabetical order."]
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: status.migrations.length === 0 ? /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-muted-foreground",
            children: ["No migration files found. Add SQL files to the", " ", /* @__PURE__ */ jsx("code", {
              children: "migrations/"
            }), " directory."]
          }) : /* @__PURE__ */ jsx("div", {
            className: "space-y-2",
            children: status.migrations.map((m) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between rounded-lg border p-3",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex items-center gap-3",
                children: /* @__PURE__ */ jsx("code", {
                  className: "text-sm",
                  children: m.name
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [!m.applied && /* @__PURE__ */ jsxs(fetcher.Form, {
                  method: "post",
                  className: "inline",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "intent",
                    value: "markApplied"
                  }), /* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "filename",
                    value: m.name
                  }), /* @__PURE__ */ jsx(Button, {
                    type: "submit",
                    variant: "ghost",
                    size: "sm",
                    className: "h-6 text-xs text-muted-foreground hover:text-foreground",
                    children: "Mark Applied"
                  })]
                }), /* @__PURE__ */ jsx(Badge, {
                  variant: m.applied ? "success" : "secondary",
                  className: m.applied ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25",
                  children: m.applied ? "Applied" : "Pending"
                })]
              })]
            }, m.name))
          })
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Search, {
                  className: "h-4 w-4"
                }), "Schema Diff"]
              }), /* @__PURE__ */ jsx(CardDescription, {
                children: "Auto-detects missing tables and columns by comparing your Prisma schema against the live database"
              })]
            }), schemaDiff.length > 0 && /* @__PURE__ */ jsxs(fetcher.Form, {
              method: "post",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "applyAllDiff"
              }), /* @__PURE__ */ jsxs(Button, {
                type: "submit",
                variant: "default",
                size: "sm",
                disabled: fetcher.state === "submitting",
                children: [/* @__PURE__ */ jsx(Play, {
                  className: "mr-2 h-3.5 w-3.5"
                }), fetcher.state === "submitting" ? "Applying..." : "Apply All Missing"]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: schemaDiff.length === 0 ? /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4",
            children: [/* @__PURE__ */ jsx(CheckCircle2, {
              className: "h-5 w-5 text-emerald-500 shrink-0"
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-emerald-400",
                children: "Database is up to date"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "All tables and columns from your Prisma schema exist in the database."
              })]
            })]
          }) : /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Found ", /* @__PURE__ */ jsx("strong", {
                children: schemaDiff.length
              }), " ", schemaDiff.length === 1 ? "section" : "sections", ' with differences. Review and apply individually or use "Apply All Missing" above.']
            }), schemaDiff.map((section) => /* @__PURE__ */ jsxs("div", {
              className: "rounded-lg border p-4 space-y-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [section.status === "missing_table" ? /* @__PURE__ */ jsx(Table2, {
                    className: "h-4 w-4 text-amber-400"
                  }) : /* @__PURE__ */ jsx(Columns3, {
                    className: "h-4 w-4 text-amber-400"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "font-medium",
                    children: section.model
                  }), /* @__PURE__ */ jsxs("code", {
                    className: "text-xs text-muted-foreground",
                    children: ["(", section.table, ")"]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx(Badge, {
                    className: section.status === "missing_table" ? "bg-red-500/15 text-red-400 border-red-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20",
                    children: section.status === "missing_table" ? "Missing Table" : "Missing Columns"
                  }), /* @__PURE__ */ jsxs(fetcher.Form, {
                    method: "post",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "intent",
                      value: "applyDiff"
                    }), /* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "tableName",
                      value: section.table
                    }), /* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "sql",
                      value: section.sql
                    }), /* @__PURE__ */ jsx(Button, {
                      type: "submit",
                      variant: "outline",
                      size: "sm",
                      disabled: fetcher.state === "submitting",
                      children: "Apply"
                    })]
                  })]
                })]
              }), section.status === "missing_columns" && /* @__PURE__ */ jsx("div", {
                className: "flex flex-wrap gap-1.5",
                children: section.missingColumns.map((col) => /* @__PURE__ */ jsx("code", {
                  className: "rounded bg-muted px-1.5 py-0.5 text-xs",
                  children: col
                }, col))
              }), /* @__PURE__ */ jsx("pre", {
                className: "rounded-md bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap font-mono",
                children: section.sql
              })]
            }, section.table))]
          })
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(FilePlus, {
                  className: "h-4 w-4"
                }), "Create New Migration"]
              }), /* @__PURE__ */ jsx(CardDescription, {
                children: "Write SQL directly from the browser — no file uploads needed"
              })]
            }), /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              size: "sm",
              onClick: () => setShowCreate(!showCreate),
              children: showCreate ? "Cancel" : "New Migration"
            })]
          })
        }), showCreate && /* @__PURE__ */ jsxs(CardContent, {
          children: [createResult && !isCreating && /* @__PURE__ */ jsx("div", {
            className: `mb-4 rounded-md border p-3 text-sm ${createResult.error ? "border-red-500/30 bg-red-500/5 text-red-400" : createResult.applied ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : "border-blue-500/30 bg-blue-500/5 text-blue-400"}`,
            children: createResult.error ? /* @__PURE__ */ jsx("p", {
              children: createResult.error
            }) : createResult.applied ? /* @__PURE__ */ jsxs("p", {
              children: ["Created and applied ", /* @__PURE__ */ jsx("code", {
                children: createResult.filename
              }), " successfully."]
            }) : /* @__PURE__ */ jsxs("p", {
              children: ["Created ", /* @__PURE__ */ jsx("code", {
                children: createResult.filename
              }), " as a pending migration. Apply it using the button above."]
            })
          }), /* @__PURE__ */ jsxs(fetcher.Form, {
            method: "post",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "createMigration"
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "migrationName",
                className: "text-xs text-muted-foreground",
                children: "Migration name"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-xs text-muted-foreground tabular-nums",
                  children: [String(status.migrations.length > 0 ? Math.max(...status.migrations.map((m) => {
                    const match = m.name.match(/^(\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                  })) + 1 : 1).padStart(3, "0"), "_"]
                }), /* @__PURE__ */ jsx(Input, {
                  id: "migrationName",
                  name: "migrationName",
                  placeholder: "add_phone_column",
                  className: "h-9",
                  required: true,
                  pattern: "[a-zA-Z0-9_-]+",
                  title: "Only letters, numbers, dashes, and underscores"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "The number prefix is auto-generated. Use snake_case for readability."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "migrationSql",
                className: "text-xs text-muted-foreground",
                children: "SQL content"
              }), /* @__PURE__ */ jsx(Textarea, {
                id: "migrationSql",
                name: "migrationSql",
                rows: 8,
                required: true,
                placeholder: `CREATE TABLE IF NOT EXISTS \`MyTable\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`name\` VARCHAR(191) NOT NULL,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
                className: "font-mono text-sm"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: ["Use ", /* @__PURE__ */ jsx("code", {
                  children: "IF NOT EXISTS"
                }), " / ", /* @__PURE__ */ jsx("code", {
                  children: "IF EXISTS"
                }), " to keep migrations idempotent. Dangerous operations (DROP DATABASE, TRUNCATE, DELETE without WHERE) are blocked."]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "flex items-center gap-3",
              children: /* @__PURE__ */ jsxs("label", {
                className: "flex items-center gap-2 text-sm",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "checkbox",
                  name: "autoApply",
                  defaultChecked: true,
                  className: "rounded border-input"
                }), "Auto-apply after creating"]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-end gap-2",
              children: [/* @__PURE__ */ jsx(Button, {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => setShowCreate(false),
                children: "Cancel"
              }), /* @__PURE__ */ jsxs(Button, {
                type: "submit",
                size: "sm",
                disabled: isCreating,
                children: [/* @__PURE__ */ jsx(FilePlus, {
                  className: "mr-2 h-3.5 w-3.5"
                }), isCreating ? "Creating..." : "Create Migration"]
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsx(CardTitle, {
            children: "How Migrations Work"
          })
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-3 text-sm text-muted-foreground",
          children: [/* @__PURE__ */ jsxs("p", {
            children: ["Instead of re-uploading ", /* @__PURE__ */ jsx("code", {
              children: "database-setup.sql"
            }), " (which wipes all data), create numbered SQL files in the", " ", /* @__PURE__ */ jsx("code", {
              children: "migrations/"
            }), " folder with only the changes you need."]
          }), /* @__PURE__ */ jsxs("div", {
            className: "rounded-lg bg-muted p-4",
            children: [/* @__PURE__ */ jsx("p", {
              className: "mb-2 font-medium text-foreground",
              children: "Migration file naming:"
            }), /* @__PURE__ */ jsx("pre", {
              className: "text-xs",
              children: `migrations/
  000_baseline.sql    ← Already applied (your current schema)
  001_add_phone.sql   ← Next change to apply
  002_new_table.sql   ← And so on...`
            })]
          }), /* @__PURE__ */ jsx("p", {
            children: "Each migration runs inside a transaction — if it fails, all changes in that migration are rolled back and no record is inserted. The runner stops on the first error to prevent later migrations from running against a broken schema."
          }), /* @__PURE__ */ jsxs("p", {
            className: "font-medium text-foreground",
            children: ["Always use ", /* @__PURE__ */ jsx("code", {
              children: "IF NOT EXISTS"
            }), " for CREATE statements and", " ", /* @__PURE__ */ jsx("code", {
              children: "IF EXISTS"
            }), " for DROP statements to keep migrations idempotent."]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-muted-foreground",
            children: ["If a migration's changes already exist in the database (e.g., you ran the SQL manually), use ", /* @__PURE__ */ jsx("strong", {
              children: "Mark Applied"
            }), " to record it without re-running the SQL."]
          })]
        })]
      })]
    })
  });
});
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: settings_database,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
async function loader$9({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
  const keys = await prisma.apiKey.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      prefix: true,
      scopes: true,
      tier: true,
      active: true,
      lastUsedAt: true,
      createdAt: true
    }
  });
  return {
    keys,
    user
  };
}
async function action$7({
  request
}) {
  const userId = await requireAdmin(request);
  if (request.method === "DELETE") {
    const formData = await request.formData();
    const keyId = formData.get("keyId");
    if (!keyId) {
      throw data({
        error: "keyId is required"
      }, {
        status: 400
      });
    }
    const existing = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId
      }
    });
    if (!existing) {
      throw data({
        error: "API key not found"
      }, {
        status: 404
      });
    }
    await prisma.apiKey.delete({
      where: {
        id: keyId
      }
    });
    if (existing.hash) {
      invalidateApiKeyCache(existing.hash);
    }
    return {
      success: true,
      revoked: keyId
    };
  }
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const name = formData.get("name");
      const tier = formData.get("tier") || "FREE";
      const scopeLeadsRead = formData.get("scope_leads_read") === "on";
      const scopeLeadsWrite = formData.get("scope_leads_write") === "on";
      const scopeScraperRead = formData.get("scope_scraper_read") === "on";
      if (!name || name.trim().length === 0) {
        throw data({
          error: "Key name is required"
        }, {
          status: 400
        });
      }
      const scopes = [];
      if (scopeLeadsWrite) {
        scopes.push("leads:write");
      } else if (scopeLeadsRead) {
        scopes.push("leads:read");
      }
      if (scopeScraperRead) {
        scopes.push("scraper:read");
      }
      if (scopes.length === 0) {
        scopes.push("leads:read");
      }
      const {
        rawKey,
        prefix,
        hash: hash2
      } = generateApiKey();
      await prisma.apiKey.create({
        data: {
          name: name.trim(),
          prefix,
          hash: hash2,
          scopes,
          tier,
          userId
        }
      });
      return {
        rawKey,
        prefix,
        name: name.trim()
      };
    } catch (err) {
      const message = (err == null ? void 0 : err.message) || (err == null ? void 0 : err.toString()) || "Unknown error";
      return {
        error: message
      };
    }
  }
  throw data({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const settings_apiKeys = UNSAFE_withComponentProps(function ApiKeysSettings() {
  var _a;
  const {
    keys,
    user
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isCreating = navigation.state === "submitting" && ((_a = navigation.formData) == null ? void 0 : _a.get("intent")) === "create";
  const justCreated = actionData && "rawKey" in actionData;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/settings",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("h1", {
            className: "text-3xl font-bold tracking-tight flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Key, {
              className: "h-8 w-8"
            }), "API Keys"]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Manage API keys for external integrations"
          })]
        })]
      }), justCreated && /* @__PURE__ */ jsxs(Card, {
        className: "border-amber-500/30 bg-amber-500/5",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "text-amber-400 flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Shield, {
              className: "h-4 w-4"
            }), "Save this key now — you won't see it again"]
          })
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-3",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium text-muted-foreground",
              children: "Key Name"
            }), /* @__PURE__ */ jsx("p", {
              children: actionData.name
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium text-muted-foreground",
              children: "API Key"
            }), /* @__PURE__ */ jsx("code", {
              className: "block rounded bg-muted p-3 text-sm break-all select-all",
              children: actionData.rawKey
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-xs text-muted-foreground",
            children: ["Store this in a secure location (e.g., environment variable or secrets manager). After leaving this page, only the prefix ", /* @__PURE__ */ jsx("code", {
              children: actionData.prefix
            }), "... will be visible."]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "h-4 w-4"
            }), "Create New API Key"]
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Generate a key for external systems to access the ScalePod API"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "create"
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "text-sm font-medium",
                children: "Key Name"
              }), /* @__PURE__ */ jsx("input", {
                name: "name",
                type: "text",
                required: true,
                placeholder: "e.g., Shopify Scraper, Lead Sync Service",
                className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "text-sm font-medium",
                children: "Tier"
              }), /* @__PURE__ */ jsx("select", {
                name: "tier",
                className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                children: Object.entries(TIER_LIMITS$1).map(([tier, limits]) => /* @__PURE__ */ jsxs("option", {
                  value: tier,
                  children: [tier, " — ", limits.perMinute, "/min, ", limits.perDay, "/day"]
                }, tier))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "text-sm font-medium",
                children: "Scopes"
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-2 space-y-2",
                children: [/* @__PURE__ */ jsxs("label", {
                  className: "flex items-center gap-2 text-sm",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "checkbox",
                    name: "scope_leads_write",
                    defaultChecked: true,
                    className: "rounded"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "Leads: Read & Write"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-xs text-muted-foreground",
                    children: "(includes read)"
                  })]
                }), /* @__PURE__ */ jsxs("label", {
                  className: "flex items-center gap-2 text-sm",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "checkbox",
                    name: "scope_leads_read",
                    className: "rounded"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "Leads: Read Only"
                  })]
                }), /* @__PURE__ */ jsxs("label", {
                  className: "flex items-center gap-2 text-sm",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "checkbox",
                    name: "scope_scraper_read",
                    className: "rounded"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "Scraper: Read Status"
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              disabled: isCreating,
              children: isCreating ? "Generating..." : "Generate API Key"
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Active API Keys"
          }), /* @__PURE__ */ jsxs(CardDescription, {
            children: [keys.length, " key", keys.length !== 1 ? "s" : "", " configured"]
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: keys.length === 0 ? /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "No API keys created yet."
          }) : /* @__PURE__ */ jsx("div", {
            className: "space-y-3",
            children: keys.map((key) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between rounded-lg border p-4",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-1",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "font-medium",
                    children: key.name
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: "secondary",
                    children: key.tier
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: key.active ? "success" : "outline",
                    children: key.active ? "Active" : "Revoked"
                  })]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground font-mono",
                  children: [key.prefix, "..."]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 text-xs text-muted-foreground",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/* @__PURE__ */ jsx(Shield, {
                      className: "h-3 w-3"
                    }), key.scopes.join(", ")]
                  }), key.lastUsedAt && /* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/* @__PURE__ */ jsx(Clock, {
                      className: "h-3 w-3"
                    }), "Last used ", new Date(key.lastUsedAt).toLocaleDateString()]
                  })]
                })]
              }), /* @__PURE__ */ jsxs(Form, {
                method: "delete",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "keyId",
                  value: key.id
                }), /* @__PURE__ */ jsxs(Button, {
                  type: "submit",
                  variant: "outline",
                  size: "sm",
                  className: "text-red-400 hover:text-red-300",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    className: "h-3 w-3 mr-1"
                  }), "Revoke"]
                })]
              })]
            }, key.id))
          })
        })]
      })]
    })
  });
});
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: settings_apiKeys,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const FIELD_TYPES = ["INDUSTRY", "ESTIMATED_TRAFFIC", "TECH_STACK", "LEAD_SOURCE", "WEBSITE"];
const OPERATORS = ["CONTAINS", "EQUALS", "STARTS_WITH", "REGEX"];
async function loader$8({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  let rules = [];
  try {
    rules = await prisma.scoringRule.findMany({
      orderBy: {
        priority: "asc"
      }
    });
  } catch (err) {
    console.error("[scoring-rules] Failed to load rules — run pending migrations:", err);
  }
  let scoreConfig = null;
  try {
    scoreConfig = await prisma.scoreConfig.findUnique({
      where: {
        id: "default"
      }
    });
  } catch (err) {
    console.error("[scoring-rules] Failed to load score config:", err);
  }
  return {
    rules,
    scoreConfig,
    user
  };
}
async function action$6({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "create") {
    const name = formData.get("name");
    const fieldType = formData.get("fieldType");
    const operator = formData.get("operator");
    const value = formData.get("value");
    const points = parseFloat(formData.get("points")) || 0;
    const priority = parseInt(formData.get("priority")) || 0;
    if (!(name == null ? void 0 : name.trim()) || !(value == null ? void 0 : value.trim())) {
      return {
        error: "Name and value are required"
      };
    }
    try {
      await prisma.scoringRule.create({
        data: {
          name: name.trim(),
          fieldType,
          operator,
          value: value.trim(),
          points,
          priority
        }
      });
    } catch (err) {
      console.error("[scoring-rules] Failed to create rule:", err);
      return {
        error: "Failed to create scoring rule. Make sure database migrations are up to date."
      };
    }
    return {
      success: true,
      created: name
    };
  }
  if (intent === "delete") {
    const ruleId = formData.get("ruleId");
    if (!ruleId) return {
      error: "Rule ID required"
    };
    try {
      await prisma.scoringRule.delete({
        where: {
          id: ruleId
        }
      });
    } catch (err) {
      console.error("[scoring-rules] Failed to delete rule:", err);
      return {
        error: "Failed to delete scoring rule."
      };
    }
    return {
      success: true,
      deleted: true
    };
  }
  if (intent === "toggleActive") {
    const ruleId = formData.get("ruleId");
    const active = formData.get("active") === "true";
    if (!ruleId) return {
      error: "Rule ID required"
    };
    try {
      await prisma.scoringRule.update({
        where: {
          id: ruleId
        },
        data: {
          active: !active
        }
      });
    } catch (err) {
      console.error("[scoring-rules] Failed to toggle rule:", err);
      return {
        error: "Failed to update scoring rule."
      };
    }
    return {
      success: true
    };
  }
  if (intent === "toggleAutoScore") {
    try {
      const current = await prisma.scoreConfig.findUnique({
        where: {
          id: "default"
        }
      });
      await prisma.scoreConfig.update({
        where: {
          id: "default"
        },
        data: {
          autoScore: !((current == null ? void 0 : current.autoScore) ?? true)
        }
      });
    } catch (err) {
      console.error("[scoring-rules] Failed to toggle auto-score:", err);
      return {
        error: "Failed to update auto-score setting. Make sure database migrations are up to date."
      };
    }
    return {
      success: true
    };
  }
  if (intent === "recalculateAll") {
    try {
      const result = await recalculateAllLeadScores();
      return {
        success: true,
        updated: result.updated,
        errors: result.errors
      };
    } catch (err) {
      console.error("[scoring-rules] Failed to recalculate:", err);
      return {
        error: "Failed to recalculate lead scores."
      };
    }
  }
  return {};
}
const settings_scoringRules = UNSAFE_withComponentProps(function ScoringRulesSettings() {
  var _a, _b;
  const {
    rules,
    scoreConfig,
    user
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const autoScoreEnabled = (scoreConfig == null ? void 0 : scoreConfig.autoScore) ?? true;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/settings",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("h1", {
            className: "text-3xl font-bold tracking-tight flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Zap, {
              className: "h-8 w-8"
            }), "Scoring Rules"]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Attribute-based rules that auto-score leads"
          })]
        })]
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
        className: "rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400",
        children: actionData.error
      }), (actionData == null ? void 0 : actionData.success) && (actionData == null ? void 0 : actionData.created) && /* @__PURE__ */ jsxs("div", {
        className: "rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400",
        children: ['Rule "', actionData.created, '" created successfully.']
      }), (actionData == null ? void 0 : actionData.success) && (actionData == null ? void 0 : actionData.updated) !== void 0 && /* @__PURE__ */ jsxs("div", {
        className: "rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400",
        children: ["Recalculated ", actionData.updated, " leads (", actionData.errors, " errors)."]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Auto-Scoring"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Automatically score new leads using rules when they are created"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "flex items-center justify-between rounded-lg border p-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "toggleAutoScore"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [autoScoreEnabled ? /* @__PURE__ */ jsx(ToggleRight, {
                className: "h-5 w-5 text-emerald-400"
              }) : /* @__PURE__ */ jsx(ToggleLeft, {
                className: "h-5 w-5 text-muted-foreground"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium",
                  children: "Auto-Score"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: autoScoreEnabled ? "Enabled — new leads are scored automatically" : "Disabled — new leads get default score (0)"
                })]
              })]
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              variant: "outline",
              size: "sm",
              children: autoScoreEnabled ? "Disable" : "Enable"
            })]
          }), /* @__PURE__ */ jsxs(Form, {
            method: "post",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "recalculateAll"
            }), /* @__PURE__ */ jsxs(Button, {
              type: "submit",
              variant: "outline",
              disabled: isSubmitting,
              className: "w-full",
              children: [/* @__PURE__ */ jsx(RefreshCw, {
                className: "mr-2 h-4 w-4"
              }), isSubmitting && ((_a = navigation.formData) == null ? void 0 : _a.get("intent")) === "recalculateAll" ? "Recalculating..." : "Recalculate All Lead Scores"]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "h-4 w-4"
            }), "Create Scoring Rule"]
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Assign bonus points when a lead field matches a rule"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "create"
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "text-sm font-medium",
                children: "Rule Name"
              }), /* @__PURE__ */ jsx("input", {
                name: "name",
                type: "text",
                required: true,
                placeholder: 'e.g., "High-Value Industry" or "Shopify Merchant"',
                className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-2 gap-4",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-sm font-medium",
                  children: "Field"
                }), /* @__PURE__ */ jsx("select", {
                  name: "fieldType",
                  className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  children: FIELD_TYPES.map((ft) => /* @__PURE__ */ jsx("option", {
                    value: ft,
                    children: ft.replace(/_/g, " ")
                  }, ft))
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-sm font-medium",
                  children: "Operator"
                }), /* @__PURE__ */ jsx("select", {
                  name: "operator",
                  className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  children: OPERATORS.map((op) => /* @__PURE__ */ jsx("option", {
                    value: op,
                    children: op
                  }, op))
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "text-sm font-medium",
                children: "Match Value"
              }), /* @__PURE__ */ jsx("input", {
                name: "value",
                type: "text",
                required: true,
                placeholder: "e.g., SaaS, Shopify, ^https://",
                className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-2 gap-4",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-sm font-medium",
                  children: "Points"
                }), /* @__PURE__ */ jsx("input", {
                  name: "points",
                  type: "number",
                  step: "0.5",
                  defaultValue: 10,
                  className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "text-sm font-medium",
                  children: "Priority"
                }), /* @__PURE__ */ jsx("input", {
                  name: "priority",
                  type: "number",
                  defaultValue: 0,
                  className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                })]
              })]
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              disabled: isSubmitting,
              children: isSubmitting && ((_b = navigation.formData) == null ? void 0 : _b.get("intent")) === "create" ? "Creating..." : "Create Rule"
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Scoring Rules"
          }), /* @__PURE__ */ jsxs(CardDescription, {
            children: [rules.length, " rule", rules.length !== 1 ? "s" : "", " configured"]
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: rules.length === 0 ? /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "No scoring rules yet. Create one above to start auto-scoring leads."
          }) : /* @__PURE__ */ jsx("div", {
            className: "space-y-3",
            children: rules.map((rule) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between rounded-lg border p-4",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-1",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "font-medium",
                    children: rule.name
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: "secondary",
                    children: rule.fieldType.replace(/_/g, " ")
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: "outline",
                    children: rule.operator
                  }), /* @__PURE__ */ jsx(Badge, {
                    variant: rule.active ? "success" : "outline",
                    children: rule.active ? "Active" : "Inactive"
                  })]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground font-mono",
                  children: [rule.fieldType.replace(/_/g, " "), " ", rule.operator.toLowerCase(), ' "', rule.value, '"']
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm font-medium",
                  children: ["+", rule.points, " points (priority ", rule.priority, ")"]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsxs(Form, {
                  method: "post",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "intent",
                    value: "toggleActive"
                  }), /* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "ruleId",
                    value: rule.id
                  }), /* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "active",
                    value: String(rule.active)
                  }), /* @__PURE__ */ jsx(Button, {
                    type: "submit",
                    variant: "ghost",
                    size: "sm",
                    children: rule.active ? "Disable" : "Enable"
                  })]
                }), /* @__PURE__ */ jsxs(Form, {
                  method: "post",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "intent",
                    value: "delete"
                  }), /* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "ruleId",
                    value: rule.id
                  }), /* @__PURE__ */ jsx(Button, {
                    type: "submit",
                    variant: "outline",
                    size: "sm",
                    className: "text-red-400 hover:text-red-300",
                    children: /* @__PURE__ */ jsx(Trash2, {
                      className: "h-3 w-3"
                    })
                  })]
                })]
              })]
            }, rule.id))
          })
        })]
      })]
    })
  });
});
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  default: settings_scoringRules,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
async function loader$7({
  request
}) {
  const userId = await requireAdmin(request);
  const [user, stages] = await Promise.all([prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  }), getStagesWithMeta()]);
  await seedDefaultStages();
  const leadCounts = {};
  for (const stage of stages) {
    try {
      leadCounts[stage.name] = await prisma.lead.count({
        where: {
          stage: stage.name
        }
      });
    } catch {
      leadCounts[stage.name] = 0;
    }
  }
  return {
    user,
    stages,
    leadCounts
  };
}
async function action$5({
  request
}) {
  var _a, _b, _c, _d;
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  await seedDefaultStages();
  if (!prisma.pipelineStage) {
    const available = Object.keys(prisma).filter((k) => typeof prisma[k] === "object").join(", ");
    return {
      error: `Prisma Client is missing the pipelineStage model. Available models: [${available || "none"}]. Run "npx prisma generate" and restart the server.`
    };
  }
  try {
    if (intent === "addStage") {
      const name = (_a = formData.get("name")) == null ? void 0 : _a.trim().toUpperCase().replace(/\s+/g, "_");
      const label = (_b = formData.get("label")) == null ? void 0 : _b.trim();
      const colorKey = formData.get("colorKey");
      if (!name || !label) {
        return {
          error: "Stage name and label are required"
        };
      }
      const existing = await prisma.pipelineStage.findUnique({
        where: {
          name
        }
      });
      if (existing) {
        return {
          error: `A stage with name "${name}" already exists`
        };
      }
      const maxPos = await prisma.pipelineStage.aggregate({
        _max: {
          position: true
        }
      });
      const nextPos = (maxPos._max.position ?? -1) + 1;
      await prisma.pipelineStage.create({
        data: {
          name,
          label,
          colorKey: colorKey || "slate",
          position: nextPos
        }
      });
      invalidateStagesCache();
      return redirect("/settings/stages");
    }
    if (intent === "editStage") {
      const id = formData.get("id");
      const label = (_c = formData.get("label")) == null ? void 0 : _c.trim();
      const colorKey = formData.get("colorKey");
      const newName = (_d = formData.get("name")) == null ? void 0 : _d.trim().toUpperCase().replace(/\s+/g, "_");
      if (!id || !label || !newName) {
        return {
          error: "All fields are required"
        };
      }
      const stage = await prisma.pipelineStage.findUnique({
        where: {
          id
        }
      });
      if (!stage) {
        return {
          error: "Stage not found"
        };
      }
      if (newName !== stage.name) {
        const existing = await prisma.pipelineStage.findUnique({
          where: {
            name: newName
          }
        });
        if (existing && existing.id !== id) {
          return {
            error: `A stage with name "${newName}" already exists`
          };
        }
        await prisma.$transaction([prisma.pipelineStage.update({
          where: {
            id
          },
          data: {
            name: newName,
            label,
            colorKey
          }
        }), prisma.lead.updateMany({
          where: {
            stage: stage.name
          },
          data: {
            stage: newName
          }
        }), prisma.stageHistory.updateMany({
          where: {
            fromStage: stage.name
          },
          data: {
            fromStage: newName
          }
        }), prisma.stageHistory.updateMany({
          where: {
            toStage: stage.name
          },
          data: {
            toStage: newName
          }
        })]);
      } else {
        await prisma.pipelineStage.update({
          where: {
            id
          },
          data: {
            label,
            colorKey
          }
        });
      }
      invalidateStagesCache();
      return redirect("/settings/stages");
    }
    if (intent === "deleteStage") {
      const id = formData.get("id");
      const stage = await prisma.pipelineStage.findUnique({
        where: {
          id
        }
      });
      if (!stage) {
        return {
          error: "Stage not found"
        };
      }
      const leadCount = await prisma.lead.count({
        where: {
          stage: stage.name
        }
      });
      if (leadCount > 0) {
        return {
          error: `Cannot delete "${stage.label}" — ${leadCount} lead${leadCount !== 1 ? "s" : ""} are currently in this stage. Move them first.`
        };
      }
      await prisma.pipelineStage.delete({
        where: {
          id
        }
      });
      invalidateStagesCache();
      return redirect("/settings/stages");
    }
    if (intent === "reorderStages") {
      const orderJson = formData.get("order");
      if (!orderJson) return {
        error: "No order provided"
      };
      const order = JSON.parse(orderJson);
      const txOps = order.map((id, index) => prisma.pipelineStage.update({
        where: {
          id
        },
        data: {
          position: index
        }
      }));
      await prisma.$transaction(txOps);
      invalidateStagesCache();
      return redirect("/settings/stages");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    return {
      error: `Failed to ${intent === "addStage" ? "create" : intent === "editStage" ? "update" : intent === "deleteStage" ? "delete" : "reorder"} stage.

Error: ${msg}

Stack: ${stack || "none"}`
    };
  }
  return {};
}
function ColorSwatch({
  colorKey
}) {
  const classes = STAGE_COLOR_PALETTE[colorKey] || STAGE_COLOR_PALETTE.slate;
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-center gap-2",
    children: [/* @__PURE__ */ jsx("div", {
      className: `h-3 w-3 rounded-full ${classes.dot} ring-2 ring-white/10`
    }), /* @__PURE__ */ jsx("span", {
      className: "text-[11px] text-muted-foreground capitalize font-medium",
      children: colorKey
    })]
  });
}
const settings_stages = UNSAFE_withComponentProps(function SettingsStagesPage() {
  const {
    user,
    stages,
    leadCounts
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [localStages, setLocalStages] = useState(stages);
  const [editName, setEditName] = useState("");
  if (navigation.state === "idle" && localStages !== stages) {
    setLocalStages(stages);
    setEditingId(null);
    setShowAdd(false);
  }
  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(localStages);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setLocalStages(items);
  }
  function submitReorder() {
    const form = document.getElementById("reorderForm");
    const orderInput = form.querySelector('[name="order"]');
    orderInput.value = JSON.stringify(localStages.map((s) => s.id));
    form.requestSubmit();
  }
  const orderChanged = localStages.some((s, i) => {
    var _a;
    return s.id !== ((_a = stages[i]) == null ? void 0 : _a.id);
  });
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-2xl mx-auto",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/settings",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            className: "rounded-xl hover:bg-muted/80",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 mb-1",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50",
              children: /* @__PURE__ */ jsx(Layers, {
                className: "h-5 w-5 text-primary/80"
              })
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold tracking-tight",
              children: "Pipeline Stages"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-sm pl-[52px]",
            children: "Add, edit, and reorder your sales pipeline stages"
          })]
        }), /* @__PURE__ */ jsxs(Button, {
          onClick: () => {
            setShowAdd(!showAdd);
            setEditingId(null);
          },
          size: "sm",
          className: "rounded-lg gap-1.5",
          children: [/* @__PURE__ */ jsx(Plus, {
            className: "h-4 w-4"
          }), "Add Stage"]
        })]
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", {
        className: "rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-start gap-3",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-4 w-4 shrink-0 mt-0.5"
        }), /* @__PURE__ */ jsx("pre", {
          className: "whitespace-pre-wrap font-sans",
          children: actionData.error
        })]
      }), showAdd && /* @__PURE__ */ jsxs(Card, {
        className: "border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden",
        children: [/* @__PURE__ */ jsx("div", {
          className: "h-1 w-full bg-gradient-to-r from-blue-500/40 to-violet-500/40"
        }), /* @__PURE__ */ jsx(CardHeader, {
          className: "pb-3",
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "text-sm font-semibold flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "h-4 w-4 text-blue-400"
            }), "New Stage"]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "addStage"
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-2 gap-4",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "add-name",
                  className: "text-sm font-medium",
                  children: "Name (stored key)"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "add-name",
                  name: "name",
                  type: "text",
                  required: true,
                  placeholder: "e.g. NEGOTIATION",
                  className: "mt-1.5 bg-background/50 border-border/60 uppercase"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground mt-1.5",
                  children: "Auto-formatted to UPPERCASE_SNAKE"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "add-label",
                  className: "text-sm font-medium",
                  children: "Display Label"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "add-label",
                  name: "label",
                  type: "text",
                  required: true,
                  placeholder: "e.g. Negotiation",
                  className: "mt-1.5 bg-background/50 border-border/60"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "add-colorKey",
                className: "text-sm font-medium",
                children: "Color"
              }), /* @__PURE__ */ jsx(Select, {
                name: "colorKey",
                defaultValue: "slate",
                className: "mt-1.5 bg-background/50 border-border/60",
                children: PALETTE_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", {
                  value: opt.value,
                  children: opt.label
                }, opt.value))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-2 pt-1",
              children: [/* @__PURE__ */ jsx(Button, {
                type: "submit",
                disabled: isSubmitting,
                size: "sm",
                className: "rounded-lg",
                children: isSubmitting ? "Creating..." : "Create Stage"
              }), /* @__PURE__ */ jsxs(Button, {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "rounded-lg",
                onClick: () => setShowAdd(false),
                children: [/* @__PURE__ */ jsx(X, {
                  className: "h-4 w-4 mr-1"
                }), "Cancel"]
              })]
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs(Form, {
        id: "reorderForm",
        method: "post",
        children: [/* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "intent",
          value: "reorderStages"
        }), /* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "order",
          value: ""
        })]
      }), /* @__PURE__ */ jsx(DragDropContext, {
        onDragEnd,
        children: /* @__PURE__ */ jsx(Droppable, {
          droppableId: "stages",
          children: (provided) => /* @__PURE__ */ jsxs("div", {
            ref: provided.innerRef,
            ...provided.droppableProps,
            className: "space-y-2",
            children: [localStages.map((stage, index) => {
              const isEditing = editingId === stage.id;
              const count = leadCounts[stage.name] ?? 0;
              const meta2 = stage.meta;
              return /* @__PURE__ */ jsx(Draggable, {
                draggableId: stage.id,
                index,
                children: (dragProvided, dragSnapshot) => /* @__PURE__ */ jsx("div", {
                  ref: dragProvided.innerRef,
                  ...dragProvided.draggableProps,
                  className: `rounded-2xl border ${meta2.border} ${meta2.bg} backdrop-blur-sm transition-all duration-200 ${dragSnapshot.isDragging ? "shadow-2xl opacity-95 rotate-1 scale-[1.01]" : "hover:shadow-md hover:border-border/60"}`,
                  children: isEditing ? /* @__PURE__ */ jsxs(Form, {
                    method: "post",
                    className: "p-5 space-y-4",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "intent",
                      value: "editStage"
                    }), /* @__PURE__ */ jsx("input", {
                      type: "hidden",
                      name: "id",
                      value: stage.id
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "grid grid-cols-2 gap-4",
                      children: [/* @__PURE__ */ jsxs("div", {
                        children: [/* @__PURE__ */ jsx(Label, {
                          className: "text-sm font-medium",
                          children: "Name (stored key)"
                        }), /* @__PURE__ */ jsx(Input, {
                          name: "name",
                          type: "text",
                          required: true,
                          defaultValue: stage.name,
                          className: "mt-1.5 bg-background/50 border-border/60 uppercase",
                          onChange: (e) => setEditName(e.target.value)
                        })]
                      }), /* @__PURE__ */ jsxs("div", {
                        children: [/* @__PURE__ */ jsx(Label, {
                          className: "text-sm font-medium",
                          children: "Display Label"
                        }), /* @__PURE__ */ jsx(Input, {
                          name: "label",
                          type: "text",
                          required: true,
                          defaultValue: stage.label,
                          className: "mt-1.5 bg-background/50 border-border/60"
                        })]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      children: [/* @__PURE__ */ jsx(Label, {
                        className: "text-sm font-medium",
                        children: "Color"
                      }), /* @__PURE__ */ jsx(Select, {
                        name: "colorKey",
                        defaultValue: stage.colorKey,
                        className: "mt-1.5 bg-background/50 border-border/60",
                        children: PALETTE_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", {
                          value: opt.value,
                          children: opt.label
                        }, opt.value))
                      })]
                    }), editName.toUpperCase().replace(/\s+/g, "_") !== stage.name && editName !== "" && /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3",
                      children: [/* @__PURE__ */ jsx(AlertTriangle, {
                        className: "h-4 w-4 text-amber-400 shrink-0"
                      }), /* @__PURE__ */ jsx("p", {
                        className: "text-xs text-amber-400/80",
                        children: "Renaming will cascade update all leads and stage history in this stage."
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex gap-2",
                      children: [/* @__PURE__ */ jsxs(Button, {
                        type: "submit",
                        disabled: isSubmitting,
                        size: "sm",
                        className: "rounded-lg gap-1.5",
                        children: [/* @__PURE__ */ jsx(Save, {
                          className: "h-3.5 w-3.5"
                        }), isSubmitting ? "Saving..." : "Save"]
                      }), /* @__PURE__ */ jsx(Button, {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className: "rounded-lg",
                        onClick: () => setEditingId(null),
                        children: "Cancel"
                      })]
                    })]
                  }) : /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-3 p-4",
                    children: [/* @__PURE__ */ jsx("div", {
                      ...dragProvided.dragHandleProps,
                      className: "cursor-grab text-muted-foreground/30 hover:text-muted-foreground/60 shrink-0 transition-colors",
                      children: /* @__PURE__ */ jsx(GripVertical, {
                        className: "h-4 w-4"
                      })
                    }), /* @__PURE__ */ jsx("div", {
                      className: `h-2.5 w-2.5 rounded-full ${meta2.dot} ring-2 ring-white/10 shrink-0`
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex-1 min-w-0",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "font-medium text-sm",
                          children: stage.label
                        }), /* @__PURE__ */ jsx(Badge, {
                          variant: "outline",
                          className: "text-[10px] font-mono rounded-md px-1.5",
                          children: stage.name
                        })]
                      }), /* @__PURE__ */ jsxs("p", {
                        className: "text-xs text-muted-foreground mt-0.5",
                        children: [count, " lead", count !== 1 ? "s" : "", " · Position ", stage.position]
                      })]
                    }), /* @__PURE__ */ jsx(ColorSwatch, {
                      colorKey: stage.colorKey
                    }), /* @__PURE__ */ jsx(Button, {
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 w-7 p-0 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-colors",
                      onClick: () => {
                        setEditingId(stage.id);
                        setShowAdd(false);
                        setEditName(stage.name);
                      },
                      children: /* @__PURE__ */ jsx(Pencil, {
                        className: "h-3.5 w-3.5"
                      })
                    }), /* @__PURE__ */ jsxs(Form, {
                      method: "post",
                      className: "inline",
                      children: [/* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "intent",
                        value: "deleteStage"
                      }), /* @__PURE__ */ jsx("input", {
                        type: "hidden",
                        name: "id",
                        value: stage.id
                      }), /* @__PURE__ */ jsx(Button, {
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 w-7 p-0 rounded-lg text-muted-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-colors",
                        disabled: isSubmitting,
                        children: /* @__PURE__ */ jsx(Trash2, {
                          className: "h-3.5 w-3.5"
                        })
                      })]
                    })]
                  })
                })
              }, stage.id);
            }), provided.placeholder]
          })
        })
      }), orderChanged && /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-200",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-4 w-4 text-amber-400 shrink-0"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-amber-400/90 flex-1",
          children: "Stage order has changed. Save to persist the new order."
        }), /* @__PURE__ */ jsxs(Button, {
          size: "sm",
          onClick: submitReorder,
          disabled: isSubmitting,
          className: "rounded-lg gap-1.5",
          children: [/* @__PURE__ */ jsx(Save, {
            className: "h-3.5 w-3.5"
          }), isSubmitting ? "Saving..." : "Save Order"]
        })]
      }), stages.length === 0 && /* @__PURE__ */ jsx(Card, {
        className: "border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "py-12 text-center",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx("div", {
                className: "absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl"
              }), /* @__PURE__ */ jsx("div", {
                className: "relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 ring-1 ring-border/50 shadow-xl",
                children: /* @__PURE__ */ jsx(Layers, {
                  className: "h-7 w-7 text-muted-foreground/40"
                })
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-5 text-sm font-semibold text-foreground/80",
              children: "No pipeline stages configured"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-muted-foreground mt-1 max-w-[280px]",
              children: "Add stages to define your sales pipeline workflow."
            })]
          })
        })
      })]
    })
  });
});
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: settings_stages,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6() {
  return redirect("/workflows");
}
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const TRIGGER_LABELS = {
  LEAD_CREATED: "Lead Created",
  STAGE_CHANGED: "Stage Changed",
  TEMPERATURE_CHANGED: "Temp Changed",
  LEAD_APPROVED: "Lead Approved",
  LEAD_SCORED: "Lead Scored"
};
const TRIGGER_ICONS = {
  LEAD_CREATED: /* @__PURE__ */ jsx(Zap, {
    className: "h-3.5 w-3.5"
  }),
  STAGE_CHANGED: /* @__PURE__ */ jsx(ArrowRight, {
    className: "h-3.5 w-3.5"
  }),
  TEMPERATURE_CHANGED: /* @__PURE__ */ jsx(Filter, {
    className: "h-3.5 w-3.5"
  }),
  LEAD_APPROVED: /* @__PURE__ */ jsx(CheckCircle2, {
    className: "h-3.5 w-3.5"
  }),
  LEAD_SCORED: /* @__PURE__ */ jsx(Zap, {
    className: "h-3.5 w-3.5"
  })
};
const ACTION_COLORS = {
  ASSIGN_TO_USER: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  SEND_NOTIFICATION: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  UPDATE_FIELD: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ADD_NOTE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  SEND_EMAIL: "bg-rose-500/10 text-rose-400 border-rose-500/20"
};
function formatCondition(event, condition) {
  if (condition.toStage) return `to ${formatStage(condition.toStage)}`;
  if (condition.temperature) return `temp is ${condition.temperature}`;
  return Object.entries(condition).map(([k, v]) => `${k}=${v}`).join(", ");
}
function formatAction(action2, config, userMap) {
  switch (action2) {
    case "ASSIGN_TO_USER": {
      const name = config.userId ? userMap.get(config.userId) || String(config.userId).slice(0, 8) : "?";
      return `Assign to ${name}`;
    }
    case "SEND_NOTIFICATION":
      return `"${String(config.message || "").slice(0, 30)}"`;
    case "UPDATE_FIELD":
      return `Set ${config.field || "?"} → ${(config.value || "?").slice(0, 20)}`;
    case "ADD_NOTE":
      return `"${String(config.note || "").slice(0, 30)}"`;
    case "SEND_EMAIL": {
      const fromName = config.fromUserId ? userMap.get(config.fromUserId) || String(config.fromUserId).slice(0, 8) : "?";
      return `Email from ${fromName}: "${String(config.subject || "").slice(0, 25)}"`;
    }
    default:
      return action2;
  }
}
function hasCondition(triggerEvent) {
  return triggerEvent === "STAGE_CHANGED" || triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED";
}
async function loader$5({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  let rules = [];
  try {
    rules = await prisma.workflowRule.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        actions: {
          where: {
            active: true
          },
          orderBy: {
            order: "asc"
          }
        }
      }
    });
  } catch (err) {
    console.error("[workflows] Failed to load rules — run pending migrations:", err);
  }
  let recentLogs = [];
  try {
    recentLogs = await prisma.workflowLog.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        rule: {
          select: {
            name: true
          }
        },
        lead: {
          select: {
            companyName: true
          }
        }
      }
    });
  } catch (err) {
    console.error("[workflows] Failed to load logs — run pending migrations:", err);
  }
  const users2 = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: {
      name: "asc"
    }
  });
  return {
    rules,
    recentLogs,
    users: users2,
    user
  };
}
async function action$4({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const ruleId = formData.get("ruleId");
    if (!ruleId) return {
      error: "Rule ID required"
    };
    try {
      await prisma.workflowRule.delete({
        where: {
          id: ruleId
        }
      });
    } catch (err) {
      console.error("[workflows] Failed to delete rule:", err);
      return {
        error: "Failed to delete workflow rule."
      };
    }
    return {
      success: true,
      deleted: true
    };
  }
  if (intent === "toggleActive") {
    const ruleId = formData.get("ruleId");
    const active = formData.get("active") === "true";
    if (!ruleId) return {
      error: "Rule ID required"
    };
    try {
      await prisma.workflowRule.update({
        where: {
          id: ruleId
        },
        data: {
          active: !active
        }
      });
    } catch (err) {
      console.error("[workflows] Failed to toggle rule:", err);
      return {
        error: "Failed to update workflow rule."
      };
    }
    return {
      success: true
    };
  }
  return {};
}
function RuleFlowCard({
  rule,
  userMap
}) {
  const showFilter = hasCondition(rule.triggerEvent) && rule.triggerCondition && Object.keys(rule.triggerCondition).length > 0;
  const displayActions = rule.actions && rule.actions.length > 0 ? rule.actions : rule.action && rule.action !== "LEGACY" ? [{
    id: `legacy_${rule.id}`,
    ruleId: rule.id,
    type: rule.action,
    config: rule.actionConfig,
    order: 0,
    active: true
  }] : [];
  return /* @__PURE__ */ jsxs("div", {
    className: "group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5",
    children: [/* @__PURE__ */ jsx("div", {
      className: `absolute left-0 top-0 h-full w-1 transition-colors duration-300 ${rule.active ? "bg-emerald-500/60" : "bg-muted-foreground/20"}`
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-3 min-w-0 flex-1",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2.5",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-sm font-semibold text-foreground",
            children: rule.name
          }), rule.active ? /* @__PURE__ */ jsxs(Badge, {
            variant: "outline",
            className: "text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium px-2",
            children: [/* @__PURE__ */ jsx("span", {
              className: "mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
            }), "Active"]
          }) : /* @__PURE__ */ jsx(Badge, {
            variant: "outline",
            className: "text-[10px] border-muted-foreground/20 bg-muted/40 text-muted-foreground font-medium px-2",
            children: "Inactive"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-1.5 flex-wrap",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 rounded-xl bg-blue-500/8 border border-blue-500/15 px-3 py-1.5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400",
              children: TRIGGER_ICONS[rule.triggerEvent] || /* @__PURE__ */ jsx(Zap, {
                className: "h-3.5 w-3.5"
              })
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs font-medium text-blue-400/90",
              children: TRIGGER_LABELS[rule.triggerEvent] || rule.triggerEvent
            })]
          }), /* @__PURE__ */ jsx(ArrowRight, {
            className: "h-3.5 w-3.5 text-muted-foreground/30 shrink-0"
          }), showFilter ? /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-xl bg-amber-500/8 border border-amber-500/15 px-3 py-1.5",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400",
                children: /* @__PURE__ */ jsx(Filter, {
                  className: "h-3.5 w-3.5"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-xs font-medium text-amber-400/90",
                children: formatCondition(rule.triggerEvent, rule.triggerCondition)
              })]
            }), /* @__PURE__ */ jsx(ArrowRight, {
              className: "h-3.5 w-3.5 text-muted-foreground/30 shrink-0"
            })]
          }) : null, displayActions.map((act, idx) => /* @__PURE__ */ jsxs(Fragment$1, {
            children: [idx > 0 && /* @__PURE__ */ jsx(ArrowRight, {
              className: "h-3.5 w-3.5 text-muted-foreground/30 shrink-0"
            }), /* @__PURE__ */ jsxs("div", {
              className: `flex items-center gap-2 rounded-xl border px-3 py-1.5 ${ACTION_COLORS[act.type] || "bg-muted/40 border-border/40 text-muted-foreground"}`,
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-6 w-6 items-center justify-center rounded-lg bg-white/5",
                children: /* @__PURE__ */ jsx(Play, {
                  className: "h-3 w-3"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-xs font-medium",
                children: formatAction(act.type, act.config, userMap)
              })]
            })]
          }, act.id))]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2 shrink-0",
        children: [/* @__PURE__ */ jsx(Link, {
          to: `/workflows/${rule.id}/edit`,
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "sm",
            className: "h-8 w-8 p-0 rounded-lg text-muted-foreground/50 hover:text-blue-400 hover:bg-blue-500/10 opacity-60 group-hover:opacity-100 transition-all duration-200",
            children: /* @__PURE__ */ jsx(Pencil, {
              className: "h-3.5 w-3.5"
            })
          })
        }), /* @__PURE__ */ jsxs(Form, {
          method: "post",
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "intent",
            value: "toggleActive"
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "ruleId",
            value: rule.id
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "active",
            value: String(rule.active)
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${rule.active ? "bg-emerald-500/80" : "bg-muted-foreground/25"}`,
            title: rule.active ? "Deactivate" : "Activate",
            children: /* @__PURE__ */ jsx("span", {
              className: `inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${rule.active ? "translate-x-6" : "translate-x-1"}`
            })
          })]
        }), /* @__PURE__ */ jsxs(Form, {
          method: "post",
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "intent",
            value: "delete"
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "ruleId",
            value: rule.id
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            variant: "ghost",
            size: "sm",
            className: "h-8 w-8 p-0 rounded-lg text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 opacity-60 group-hover:opacity-100 transition-all duration-200",
            children: /* @__PURE__ */ jsx(Trash2, {
              className: "h-3.5 w-3.5"
            })
          })]
        })]
      })]
    })]
  });
}
function EmptyRulesState() {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center py-16 text-center",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "relative",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl"
      }), /* @__PURE__ */ jsx("div", {
        className: "relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 ring-1 ring-border/50 shadow-xl",
        children: /* @__PURE__ */ jsx(Workflow, {
          className: "h-7 w-7 text-muted-foreground/40"
        })
      })]
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-5 text-sm font-semibold text-foreground/80",
      children: "No workflows yet"
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-1 text-xs text-muted-foreground max-w-[260px]",
      children: "Create your first workflow to automate actions when leads change state."
    }), /* @__PURE__ */ jsx(Link, {
      to: "/workflows/new",
      className: "mt-4",
      children: /* @__PURE__ */ jsxs(Button, {
        variant: "outline",
        size: "sm",
        className: "gap-1.5",
        children: [/* @__PURE__ */ jsx(Plus, {
          className: "h-3.5 w-3.5"
        }), "Create Workflow"]
      })
    })]
  });
}
const workflows = UNSAFE_withComponentProps(function WorkflowsPage() {
  const {
    rules,
    recentLogs,
    users: users2,
    user
  } = useLoaderData();
  const actionData = useActionData();
  useNavigation();
  const userMap = new Map(users2.map((u) => [u.id, u.name || u.email]));
  const activeCount = rules.filter((r) => r.active).length;
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 mb-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 ring-1 ring-border/50",
              children: /* @__PURE__ */ jsx(Workflow, {
                className: "h-5 w-5 text-blue-400"
              })
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold tracking-tight",
              children: "Workflows"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-sm pl-[52px]",
            children: rules.length > 0 ? `${activeCount} of ${rules.length} rule${rules.length !== 1 ? "s" : ""} active` : "Automate actions when leads change state"
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/workflows/new",
          children: /* @__PURE__ */ jsxs(Button, {
            className: "gap-2 shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "h-4 w-4"
            }), "Create Workflow"]
          })
        })]
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", {
        className: "rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-center gap-3",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-4 w-4 shrink-0"
        }), actionData.error]
      }), (actionData == null ? void 0 : actionData.success) && (actionData == null ? void 0 : actionData.deleted) && /* @__PURE__ */ jsxs("div", {
        className: "rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-emerald-400 flex items-center gap-3",
        children: [/* @__PURE__ */ jsx(CheckCircle2, {
          className: "h-4 w-4 shrink-0"
        }), "Workflow deleted successfully."]
      }), /* @__PURE__ */ jsxs("section", {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2 mb-4",
          children: [/* @__PURE__ */ jsx(Zap, {
            className: "h-4 w-4 text-muted-foreground/60"
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
            children: "Rules"
          })]
        }), rules.length === 0 ? /* @__PURE__ */ jsx(Card, {
          className: "border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm",
          children: /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(EmptyRulesState, {})
          })
        }) : /* @__PURE__ */ jsx("div", {
          className: "space-y-3",
          children: rules.map((rule) => /* @__PURE__ */ jsx(RuleFlowCard, {
            rule,
            userMap
          }, rule.id))
        })]
      }), /* @__PURE__ */ jsxs("section", {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2 mb-4",
          children: [/* @__PURE__ */ jsx(History, {
            className: "h-4 w-4 text-muted-foreground/60"
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
            children: "Recent Executions"
          })]
        }), /* @__PURE__ */ jsx(Card, {
          className: "border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm overflow-hidden",
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-0",
            children: recentLogs.length === 0 ? /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 px-6 py-8 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx(Clock, {
                className: "h-4 w-4 text-muted-foreground/40"
              }), "No workflow executions yet."]
            }) : /* @__PURE__ */ jsxs("div", {
              className: "divide-y divide-border/30",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-[1fr_1fr_100px_80px] gap-4 px-6 py-3 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider bg-muted/20",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "Rule"
                }), /* @__PURE__ */ jsx("span", {
                  children: "Lead"
                }), /* @__PURE__ */ jsx("span", {
                  children: "Result"
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-right",
                  children: "Time"
                })]
              }), recentLogs.map((log) => {
                var _a;
                return /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-[1fr_1fr_100px_80px] gap-4 items-center px-6 py-3 text-sm hover:bg-muted/20 transition-colors duration-150",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "truncate font-medium text-foreground/90",
                    children: log.rule.name
                  }), /* @__PURE__ */ jsx("span", {
                    className: "truncate text-muted-foreground text-xs",
                    children: ((_a = log.lead) == null ? void 0 : _a.companyName) || "—"
                  }), /* @__PURE__ */ jsx("span", {
                    children: log.success ? /* @__PURE__ */ jsxs(Badge, {
                      variant: "outline",
                      className: "text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium gap-1",
                      children: [/* @__PURE__ */ jsx(CheckCircle2, {
                        className: "h-3 w-3"
                      }), "OK"]
                    }) : /* @__PURE__ */ jsxs(Badge, {
                      variant: "outline",
                      className: "text-[10px] border-red-500/30 bg-red-500/10 text-red-400 font-medium gap-1",
                      children: [/* @__PURE__ */ jsx(XCircle, {
                        className: "h-3 w-3"
                      }), "Fail"]
                    })
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-right text-muted-foreground/60 tabular-nums text-[11px]",
                    children: new Date(log.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  })]
                }, log.id);
              }), recentLogs.some((l) => !l.success && l.error) && /* @__PURE__ */ jsx("div", {
                className: "px-6 py-3 bg-red-500/5 border-t border-red-500/10 space-y-1.5",
                children: recentLogs.filter((l) => !l.success && l.error).slice(0, 3).map((l) => /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-red-400/80 font-mono flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx(AlertTriangle, {
                    className: "h-3 w-3 shrink-0"
                  }), l.rule.name, ": ", l.error]
                }, l.id))
              })]
            })
          })
        })]
      })]
    })
  });
});
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: workflows,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const TRIGGER_OPTIONS$1 = [{
  value: "LEAD_CREATED",
  label: "A lead is created"
}, {
  value: "STAGE_CHANGED",
  label: "A lead's stage changes"
}, {
  value: "TEMPERATURE_CHANGED",
  label: "A lead's temperature changes"
}, {
  value: "LEAD_APPROVED",
  label: "A lead is approved"
}, {
  value: "LEAD_SCORED",
  label: "A lead is scored"
}];
const ACTION_TYPES$1 = [{
  value: "ASSIGN_TO_USER",
  label: "Assign to a user",
  icon: User,
  color: "violet"
}, {
  value: "SEND_NOTIFICATION",
  label: "Send a notification",
  icon: MessageSquare,
  color: "sky"
}, {
  value: "UPDATE_FIELD",
  label: "Update a lead field",
  icon: PenSquare,
  color: "amber"
}, {
  value: "ADD_NOTE",
  label: "Add a note",
  icon: StickyNote,
  color: "emerald"
}, {
  value: "SEND_EMAIL",
  label: "Send an email",
  icon: Mail,
  color: "rose"
}];
const TEMPERATURES$1 = [{
  value: "HOT",
  label: "HOT"
}, {
  value: "WARM",
  label: "WARM"
}, {
  value: "COLD",
  label: "COLD"
}];
const UPDATE_FIELDS$1 = [{
  value: "stage",
  label: "Stage",
  type: "select",
  options: []
}, {
  value: "status",
  label: "Status",
  type: "select",
  options: [{
    value: "INBOX",
    label: "Inbox"
  }, {
    value: "ACTIVE",
    label: "Active"
  }, {
    value: "REJECTED",
    label: "Rejected"
  }]
}, {
  value: "temperature",
  label: "Temperature",
  type: "select",
  options: TEMPERATURES$1
}, {
  value: "leadSource",
  label: "Lead Source",
  type: "text"
}, {
  value: "industry",
  label: "Industry",
  type: "text"
}, {
  value: "notes",
  label: "Notes",
  type: "textarea"
}];
const TRIGGERS_WITH_CONDITION$1 = /* @__PURE__ */ new Set(["STAGE_CHANGED", "TEMPERATURE_CHANGED", "LEAD_SCORED"]);
const COLOR_MAP$1 = {
  violet: "bg-violet-500/5 border-violet-500/10",
  sky: "bg-sky-500/5 border-sky-500/10",
  amber: "bg-amber-500/5 border-amber-500/10",
  emerald: "bg-emerald-500/5 border-emerald-500/10",
  rose: "bg-rose-500/5 border-rose-500/10"
};
const TEXT_COLOR_MAP$1 = {
  violet: "text-violet-400",
  sky: "text-sky-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  rose: "text-rose-400"
};
function makeActionStep$1(type = "ASSIGN_TO_USER") {
  return {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    configUserId: "",
    configMessage: "",
    configField: "stage",
    configValue: "",
    configNote: "",
    configFromUserId: "",
    configSubject: "",
    configBody: ""
  };
}
function StepConnector() {
  return /* @__PURE__ */ jsx("div", {
    className: "flex justify-center py-1",
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-center",
      children: [/* @__PURE__ */ jsx("div", {
        className: "h-4 w-px bg-gradient-to-b from-border via-border to-transparent"
      }), /* @__PURE__ */ jsx(ChevronDown, {
        className: "h-3.5 w-3.5 text-muted-foreground/30 -mt-1"
      })]
    })
  });
}
async function loader$4({
  request
}) {
  const userId = await requireAdmin(request);
  const [user, users2, stages, gmailTokens, emailTemplates] = await Promise.all([prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  }), prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: {
      name: "asc"
    }
  }), getStagesWithMeta(), prisma.gmailToken.findMany({
    select: {
      userId: true,
      gmailAddress: true
    }
  }), prisma.emailTemplate.findMany({
    orderBy: {
      name: "asc"
    }
  })]);
  const gmailUserIds = new Set(gmailTokens.map((t) => t.userId));
  const gmailAddressMap = new Map(gmailTokens.map((t) => [t.userId, t.gmailAddress || "Gmail connected"]));
  return {
    user,
    users: users2,
    stages,
    gmailUserIds,
    gmailAddressMap,
    emailTemplates
  };
}
function buildActionConfig(step) {
  switch (step.type) {
    case "ASSIGN_TO_USER":
      if (!step.configUserId) return null;
      return {
        type: step.type,
        config: {
          userId: step.configUserId
        }
      };
    case "SEND_NOTIFICATION":
      if (!step.configMessage.trim()) return null;
      return {
        type: step.type,
        config: {
          message: step.configMessage.trim()
        }
      };
    case "UPDATE_FIELD":
      if (!step.configField || !step.configValue.trim()) return null;
      return {
        type: step.type,
        config: {
          field: step.configField,
          value: step.configValue.trim()
        }
      };
    case "ADD_NOTE":
      if (!step.configNote.trim()) return null;
      return {
        type: step.type,
        config: {
          note: step.configNote.trim()
        }
      };
    case "SEND_EMAIL":
      if (!step.configFromUserId || !step.configSubject.trim() || !step.configBody.trim()) return null;
      return {
        type: step.type,
        config: {
          fromUserId: step.configFromUserId,
          subject: step.configSubject.trim(),
          body: step.configBody.trim()
        }
      };
    default:
      return null;
  }
}
async function action$3({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent !== "create") return {};
  const name = formData.get("name");
  const triggerEvent = formData.get("triggerEvent");
  const actionsJson = formData.get("actions");
  if (!(name == null ? void 0 : name.trim()) || !triggerEvent) {
    return {
      error: "Name and trigger event are required"
    };
  }
  let actions;
  try {
    actions = JSON.parse(actionsJson || "[]");
  } catch {
    return {
      error: "Invalid action data"
    };
  }
  if (actions.length === 0) {
    return {
      error: "At least one action is required"
    };
  }
  for (const act of actions) {
    if (act.type === "SEND_EMAIL") {
      const fromUserId = act.config.fromUserId;
      const senderToken = await prisma.gmailToken.findUnique({
        where: {
          userId: fromUserId
        }
      });
      if (!senderToken) {
        return {
          error: "The selected email sender does not have Gmail connected. Choose another user or have them connect Gmail in Settings."
        };
      }
    }
  }
  let triggerCondition = null;
  if (triggerEvent === "STAGE_CHANGED") {
    const toStage = formData.get("conditionToStage");
    if (toStage) triggerCondition = {
      toStage
    };
  } else if (triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED") {
    const temperature = formData.get("conditionTemperature");
    if (temperature) triggerCondition = {
      temperature
    };
  }
  try {
    const rule = await prisma.workflowRule.create({
      data: {
        name: name.trim(),
        triggerEvent,
        triggerCondition,
        action: "LEGACY",
        actionConfig: {},
        actions: {
          create: actions.map((act, i) => ({
            type: act.type,
            config: act.config,
            order: i
          }))
        }
      }
    });
  } catch (err) {
    console.error("[workflows] Failed to create rule:", err);
    return {
      error: "Failed to create workflow rule. Make sure database migrations are up to date."
    };
  }
  return redirect("/workflows");
}
function ActionConfigFields$1({
  step,
  onChange,
  users: users2,
  stages,
  gmailUserIds,
  gmailAddressMap,
  templates
}) {
  var _a, _b;
  const editorRef = useRef(null);
  const actionDef = ACTION_TYPES$1.find((a) => a.value === step.type);
  (actionDef == null ? void 0 : actionDef.icon) || Zap;
  const color = (actionDef == null ? void 0 : actionDef.color) || "slate";
  const selectedFieldDef = UPDATE_FIELDS$1.find((f) => f.value === step.configField);
  const valueInputType = (selectedFieldDef == null ? void 0 : selectedFieldDef.type) || "text";
  return /* @__PURE__ */ jsxs("div", {
    className: `rounded-xl border ${COLOR_MAP$1[color] || ""} p-4 space-y-3`,
    children: [step.type === "ASSIGN_TO_USER" && /* @__PURE__ */ jsxs(Select, {
      value: step.configUserId,
      onChange: (e) => onChange({
        ...step,
        configUserId: e.target.value
      }),
      className: "bg-background/50 border-border/60",
      children: [/* @__PURE__ */ jsx("option", {
        value: "",
        children: "Select a user..."
      }), users2.map((u) => /* @__PURE__ */ jsx("option", {
        value: u.id,
        children: u.name || u.email
      }, u.id))]
    }), step.type === "SEND_NOTIFICATION" && /* @__PURE__ */ jsx(Textarea, {
      value: step.configMessage,
      onChange: (e) => onChange({
        ...step,
        configMessage: e.target.value
      }),
      placeholder: "Enter the notification message...",
      className: "bg-background/50 border-border/60 min-h-[80px]",
      rows: 3
    }), step.type === "UPDATE_FIELD" && /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Field"
        }), /* @__PURE__ */ jsx(Select, {
          value: step.configField,
          onChange: (e) => onChange({
            ...step,
            configField: e.target.value,
            configValue: ""
          }),
          className: "mt-1 bg-background/50 border-border/60",
          children: UPDATE_FIELDS$1.map((f) => /* @__PURE__ */ jsx("option", {
            value: f.value,
            children: f.label
          }, f.value))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Value"
        }), valueInputType === "select" ? /* @__PURE__ */ jsxs(Select, {
          value: step.configValue,
          onChange: (e) => onChange({
            ...step,
            configValue: e.target.value
          }),
          className: "mt-1 bg-background/50 border-border/60",
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: "Select..."
          }), step.configField === "stage" ? stages.map((s) => /* @__PURE__ */ jsx("option", {
            value: s.name,
            children: s.label
          }, s.name)) : ((selectedFieldDef == null ? void 0 : selectedFieldDef.options) || []).map((opt) => /* @__PURE__ */ jsx("option", {
            value: opt.value,
            children: opt.label
          }, opt.value))]
        }) : valueInputType === "textarea" ? /* @__PURE__ */ jsx(Textarea, {
          value: step.configValue,
          onChange: (e) => onChange({
            ...step,
            configValue: e.target.value
          }),
          placeholder: `Enter new ${(_a = selectedFieldDef == null ? void 0 : selectedFieldDef.label) == null ? void 0 : _a.toLowerCase()}...`,
          className: "mt-1 bg-background/50 border-border/60",
          rows: 2
        }) : /* @__PURE__ */ jsx(Input, {
          type: "text",
          value: step.configValue,
          onChange: (e) => onChange({
            ...step,
            configValue: e.target.value
          }),
          placeholder: `Enter new ${(_b = selectedFieldDef == null ? void 0 : selectedFieldDef.label) == null ? void 0 : _b.toLowerCase()}...`,
          className: "mt-1 bg-background/50 border-border/60"
        })]
      })]
    }), step.type === "ADD_NOTE" && /* @__PURE__ */ jsx(Textarea, {
      value: step.configNote,
      onChange: (e) => onChange({
        ...step,
        configNote: e.target.value
      }),
      placeholder: "Enter the note to add...",
      className: "bg-background/50 border-border/60 min-h-[80px]",
      rows: 3
    }), step.type === "SEND_EMAIL" && /* @__PURE__ */ jsxs("div", {
      className: "space-y-3",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Send from"
        }), /* @__PURE__ */ jsxs(Select, {
          value: step.configFromUserId,
          onChange: (e) => onChange({
            ...step,
            configFromUserId: e.target.value
          }),
          className: "mt-1 bg-background/50 border-border/60",
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: "Select a sender..."
          }), users2.map((u) => /* @__PURE__ */ jsxs("option", {
            value: u.id,
            disabled: !gmailUserIds.has(u.id),
            children: [u.name || u.email, gmailUserIds.has(u.id) ? ` (${gmailAddressMap.get(u.id)})` : " — Gmail not connected"]
          }, u.id))]
        })]
      }), templates.length > 0 && /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Load Template"
        }), /* @__PURE__ */ jsxs(Select, {
          value: "",
          onChange: (e) => {
            const tmpl = templates.find((t) => t.id === e.target.value);
            if (tmpl) {
              const htmlBody = tmpl.body.includes("<") && tmpl.body.includes(">") ? tmpl.body : tmpl.body.replace(/\n/g, "<br>");
              onChange({
                ...step,
                configSubject: tmpl.subject
              });
              if (editorRef.current) {
                editorRef.current.setHTML(htmlBody);
              }
            }
          },
          className: "mt-1 bg-background/50 border-border/60",
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: "Choose a template..."
          }), templates.map((t) => /* @__PURE__ */ jsx("option", {
            value: t.id,
            children: t.name
          }, t.id))]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Subject"
        }), /* @__PURE__ */ jsx(Input, {
          type: "text",
          value: step.configSubject,
          onChange: (e) => onChange({
            ...step,
            configSubject: e.target.value
          }),
          placeholder: 'e.g. "Re: {{companyName}}"',
          className: "mt-1 bg-background/50 border-border/60"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Body"
        }), /* @__PURE__ */ jsx(RichEditor, {
          ref: editorRef,
          value: step.configBody,
          onChange: (html) => onChange({
            ...step,
            configBody: html
          }),
          placeholder: "Hi {{contactName}}, I noticed {{companyName}}...",
          minHeight: 140,
          className: "mt-1"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-[11px] text-muted-foreground mt-1",
          children: ["Variables: ", "{{companyName}}", ", ", "{{contactName}}", ", ", "{{email}}", ", ", "{{industry}}", ", ", "{{stage}}", ", ", "{{website}}"]
        })]
      })]
    })]
  });
}
const workflows_new = UNSAFE_withComponentProps(function WorkflowsNewPage() {
  const {
    user,
    users: users2,
    stages,
    gmailUserIds,
    gmailAddressMap,
    emailTemplates
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [triggerEvent, setTriggerEvent] = useState("LEAD_CREATED");
  const [conditionToStage, setConditionToStage] = useState("");
  const [conditionTemperature, setConditionTemperature] = useState("");
  const [actionSteps, setActionSteps] = useState([makeActionStep$1()]);
  const showFilter = TRIGGERS_WITH_CONDITION$1.has(triggerEvent);
  function handleTriggerChange(e) {
    setTriggerEvent(e.target.value);
    setConditionToStage("");
    setConditionTemperature("");
  }
  function addAction() {
    setActionSteps((prev) => [...prev, makeActionStep$1()]);
  }
  function removeAction(id) {
    setActionSteps((prev) => prev.filter((s) => s.id !== id));
  }
  function updateAction(updated) {
    setActionSteps((prev) => prev.map((s) => s.id === updated.id ? updated : s));
  }
  function changeActionType(id, newType) {
    setActionSteps((prev) => prev.map((s) => s.id === id ? {
      ...makeActionStep$1(newType),
      id: s.id
    } : s));
  }
  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(actionSteps);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setActionSteps(items);
  }
  const actionsPayload = actionSteps.map((step) => buildActionConfig(step)).filter(Boolean);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-2xl mx-auto",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/workflows",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            className: "rounded-xl hover:bg-muted/80",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Create Workflow"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mt-0.5",
            children: "Build an automation with multiple steps"
          })]
        })]
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", {
        className: "rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-center gap-3",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-4 w-4 shrink-0"
        }), actionData.error]
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-0",
        children: [/* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "intent",
          value: "create"
        }), /* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "actions",
          value: JSON.stringify(actionsPayload)
        }), /* @__PURE__ */ jsxs(Card, {
          className: "mb-4 border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden",
          children: [/* @__PURE__ */ jsx("div", {
            className: "h-1 w-full bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-emerald-500/40"
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "pt-6",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "name",
              className: "text-sm font-semibold",
              children: "Workflow Name"
            }), /* @__PURE__ */ jsx(Input, {
              id: "name",
              name: "name",
              type: "text",
              required: true,
              placeholder: 'e.g., "Assign HOT leads to sales manager"',
              className: "mt-2 bg-background/50 border-border/60"
            })]
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden",
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            className: "pb-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-xl border px-3 py-2 bg-blue-500/15 text-blue-400 border-blue-500/20 w-fit",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/5",
                children: /* @__PURE__ */ jsx("span", {
                  className: "text-xs font-bold",
                  children: "1"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-semibold",
                children: "When this happens"
              }), /* @__PURE__ */ jsx(Zap, {
                className: "h-3.5 w-3.5 opacity-60"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              className: "mt-2 pl-1",
              children: "Choose the event that starts this workflow"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            children: [/* @__PURE__ */ jsx(Label, {
              className: "text-sm font-medium",
              children: "Trigger Event"
            }), /* @__PURE__ */ jsx(Select, {
              name: "triggerEvent",
              value: triggerEvent,
              onChange: handleTriggerChange,
              className: "mt-2 bg-background/50 border-border/60",
              children: TRIGGER_OPTIONS$1.map((opt) => /* @__PURE__ */ jsx("option", {
                value: opt.value,
                children: opt.label
              }, opt.value))
            })]
          })]
        }), /* @__PURE__ */ jsx(StepConnector, {}), showFilter ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsxs(Card, {
            className: "border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden",
            children: [/* @__PURE__ */ jsx(CardHeader, {
              className: "pb-3",
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 rounded-xl border px-3 py-2 bg-amber-500/15 text-amber-400 border-amber-500/20",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/5",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xs font-bold",
                      children: "2"
                    })
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-sm font-semibold",
                    children: "Filter"
                  }), /* @__PURE__ */ jsx(Filter, {
                    className: "h-3.5 w-3.5 opacity-60"
                  })]
                }), /* @__PURE__ */ jsx(Badge, {
                  variant: "outline",
                  className: "text-[10px]",
                  children: "Optional"
                })]
              })
            }), /* @__PURE__ */ jsx(CardContent, {
              className: "space-y-4",
              children: triggerEvent === "STAGE_CHANGED" ? /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Label, {
                  className: "text-sm font-medium",
                  children: "Only when stage changes to"
                }), /* @__PURE__ */ jsxs(Select, {
                  name: "conditionToStage",
                  value: conditionToStage,
                  onChange: (e) => setConditionToStage(e.target.value),
                  className: "mt-2 bg-background/50 border-border/60",
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "",
                    children: "Any stage"
                  }), stages.map((s) => /* @__PURE__ */ jsx("option", {
                    value: s.name,
                    children: s.label
                  }, s.name))]
                })]
              }) : /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Label, {
                  className: "text-sm font-medium",
                  children: "Only when temperature is"
                }), /* @__PURE__ */ jsxs(Select, {
                  name: "conditionTemperature",
                  value: conditionTemperature,
                  onChange: (e) => setConditionTemperature(e.target.value),
                  className: "mt-2 bg-background/50 border-border/60",
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "",
                    children: "Any temperature"
                  }), TEMPERATURES$1.map((t) => /* @__PURE__ */ jsx("option", {
                    value: t.value,
                    children: t.label
                  }, t.value))]
                })]
              })
            })]
          }), /* @__PURE__ */ jsx(StepConnector, {})]
        }) : null, /* @__PURE__ */ jsxs(Card, {
          className: "border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden",
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            className: "pb-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-xl border px-3 py-2 bg-emerald-500/15 text-emerald-400 border-emerald-500/20 w-fit",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/5",
                children: /* @__PURE__ */ jsx("span", {
                  className: "text-xs font-bold",
                  children: showFilter ? "3" : "2"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-semibold",
                children: "Then do these"
              }), /* @__PURE__ */ jsx(Rocket, {
                className: "h-3.5 w-3.5 opacity-60"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              className: "mt-2 pl-1",
              children: "Add one or more actions to execute in order"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx(DragDropContext, {
              onDragEnd,
              children: /* @__PURE__ */ jsx(Droppable, {
                droppableId: "actions",
                children: (provided) => /* @__PURE__ */ jsxs("div", {
                  ref: provided.innerRef,
                  ...provided.droppableProps,
                  className: "space-y-3",
                  children: [actionSteps.map((step, index) => {
                    const actionDef = ACTION_TYPES$1.find((a) => a.value === step.type);
                    const Icon = (actionDef == null ? void 0 : actionDef.icon) || Zap;
                    const color = (actionDef == null ? void 0 : actionDef.color) || "slate";
                    return /* @__PURE__ */ jsx(Draggable, {
                      draggableId: step.id,
                      index,
                      children: (dragProvided, dragSnapshot) => /* @__PURE__ */ jsxs("div", {
                        ref: dragProvided.innerRef,
                        ...dragProvided.draggableProps,
                        className: `rounded-xl border border-border/40 bg-card/60 p-4 space-y-3 transition-shadow ${dragSnapshot.isDragging ? "shadow-lg" : ""}`,
                        children: [/* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [/* @__PURE__ */ jsx("div", {
                            ...dragProvided.dragHandleProps,
                            className: "cursor-grab text-muted-foreground/30 hover:text-muted-foreground shrink-0",
                            children: /* @__PURE__ */ jsx(GripVertical, {
                              className: "h-4 w-4"
                            })
                          }), /* @__PURE__ */ jsx("div", {
                            className: `flex h-6 w-6 items-center justify-center rounded-md ${COLOR_MAP$1[color] || "bg-muted"}`,
                            children: /* @__PURE__ */ jsx(Icon, {
                              className: `h-3 w-3 ${TEXT_COLOR_MAP$1[color] || "text-muted-foreground"}`
                            })
                          }), /* @__PURE__ */ jsxs(Badge, {
                            variant: "outline",
                            className: "text-[10px] tabular-nums",
                            children: ["Step ", index + 1]
                          }), /* @__PURE__ */ jsx(Select, {
                            value: step.type,
                            onChange: (e) => changeActionType(step.id, e.target.value),
                            className: "flex-1 bg-background/50 border-border/60 h-8 text-sm",
                            children: ACTION_TYPES$1.map((opt) => /* @__PURE__ */ jsx("option", {
                              value: opt.value,
                              children: opt.label
                            }, opt.value))
                          }), actionSteps.length > 1 && /* @__PURE__ */ jsx(Button, {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            className: "h-7 w-7 p-0 text-muted-foreground/40 hover:text-red-400 shrink-0",
                            onClick: () => removeAction(step.id),
                            children: /* @__PURE__ */ jsx(Trash2, {
                              className: "h-3.5 w-3.5"
                            })
                          })]
                        }), /* @__PURE__ */ jsx(ActionConfigFields$1, {
                          step,
                          onChange: updateAction,
                          users: users2,
                          stages,
                          gmailUserIds,
                          gmailAddressMap,
                          templates: emailTemplates
                        })]
                      })
                    }, step.id);
                  }), provided.placeholder]
                })
              })
            }), /* @__PURE__ */ jsxs(Button, {
              type: "button",
              variant: "outline",
              onClick: addAction,
              className: "w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground",
              children: [/* @__PURE__ */ jsx(Plus, {
                className: "h-4 w-4 mr-2"
              }), "Add Action Step"]
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "pt-6 pb-2",
          children: /* @__PURE__ */ jsx(Button, {
            type: "submit",
            disabled: isSubmitting || actionsPayload.length === 0,
            className: "w-full h-11 text-base font-semibold shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300",
            children: isSubmitting ? /* @__PURE__ */ jsxs("span", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Sparkles, {
                className: "h-4 w-4 animate-spin"
              }), "Creating..."]
            }) : /* @__PURE__ */ jsxs("span", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Rocket, {
                className: "h-4 w-4"
              }), "Create Workflow"]
            })
          })
        })]
      })]
    })
  });
});
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: workflows_new,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const TRIGGER_OPTIONS = [{
  value: "LEAD_CREATED",
  label: "A lead is created"
}, {
  value: "STAGE_CHANGED",
  label: "A lead's stage changes"
}, {
  value: "TEMPERATURE_CHANGED",
  label: "A lead's temperature changes"
}, {
  value: "LEAD_APPROVED",
  label: "A lead is approved"
}, {
  value: "LEAD_SCORED",
  label: "A lead is scored"
}];
const ACTION_TYPES = [{
  value: "ASSIGN_TO_USER",
  label: "Assign to a user",
  icon: User,
  color: "violet"
}, {
  value: "SEND_NOTIFICATION",
  label: "Send a notification",
  icon: MessageSquare,
  color: "sky"
}, {
  value: "UPDATE_FIELD",
  label: "Update a lead field",
  icon: PenSquare,
  color: "amber"
}, {
  value: "ADD_NOTE",
  label: "Add a note",
  icon: StickyNote,
  color: "emerald"
}, {
  value: "SEND_EMAIL",
  label: "Send an email",
  icon: Mail,
  color: "rose"
}];
const TEMPERATURES = [{
  value: "HOT",
  label: "HOT"
}, {
  value: "WARM",
  label: "WARM"
}, {
  value: "COLD",
  label: "COLD"
}];
const UPDATE_FIELDS = [{
  value: "stage",
  label: "Stage",
  type: "select",
  options: []
}, {
  value: "status",
  label: "Status",
  type: "select",
  options: [{
    value: "INBOX",
    label: "Inbox"
  }, {
    value: "ACTIVE",
    label: "Active"
  }, {
    value: "REJECTED",
    label: "Rejected"
  }]
}, {
  value: "temperature",
  label: "Temperature",
  type: "select",
  options: TEMPERATURES
}, {
  value: "leadSource",
  label: "Lead Source",
  type: "text"
}, {
  value: "industry",
  label: "Industry",
  type: "text"
}, {
  value: "notes",
  label: "Notes",
  type: "textarea"
}];
const TRIGGERS_WITH_CONDITION = /* @__PURE__ */ new Set(["STAGE_CHANGED", "TEMPERATURE_CHANGED", "LEAD_SCORED"]);
const COLOR_MAP = {
  violet: "bg-violet-500/5 border-violet-500/10",
  sky: "bg-sky-500/5 border-sky-500/10",
  amber: "bg-amber-500/5 border-amber-500/10",
  emerald: "bg-emerald-500/5 border-emerald-500/10",
  rose: "bg-rose-500/5 border-rose-500/10"
};
const TEXT_COLOR_MAP = {
  violet: "text-violet-400",
  sky: "text-sky-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  rose: "text-rose-400"
};
function makeActionStep(type = "ASSIGN_TO_USER") {
  return {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    configUserId: "",
    configMessage: "",
    configField: "stage",
    configValue: "",
    configNote: "",
    configFromUserId: "",
    configSubject: "",
    configBody: ""
  };
}
function configFromStep(step) {
  switch (step.type) {
    case "ASSIGN_TO_USER":
      return step.configUserId ? {
        userId: step.configUserId
      } : null;
    case "SEND_NOTIFICATION":
      return step.configMessage.trim() ? {
        message: step.configMessage.trim()
      } : null;
    case "UPDATE_FIELD":
      return step.configField && step.configValue.trim() ? {
        field: step.configField,
        value: step.configValue.trim()
      } : null;
    case "ADD_NOTE":
      return step.configNote.trim() ? {
        note: step.configNote.trim()
      } : null;
    case "SEND_EMAIL":
      return step.configFromUserId && step.configSubject.trim() && step.configBody.trim() ? {
        fromUserId: step.configFromUserId,
        subject: step.configSubject.trim(),
        body: step.configBody.trim()
      } : null;
    default:
      return null;
  }
}
async function loader$3({
  request,
  params
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const userId = await requireAdmin(request);
  const [user, users2, stages, gmailTokens, rule, emailTemplates] = await Promise.all([prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  }), prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: {
      name: "asc"
    }
  }), getStagesWithMeta(), prisma.gmailToken.findMany({
    select: {
      userId: true,
      gmailAddress: true
    }
  }), prisma.workflowRule.findUnique({
    where: {
      id: params.id
    },
    include: {
      actions: {
        orderBy: {
          order: "asc"
        }
      }
    }
  }), prisma.emailTemplate.findMany({
    orderBy: {
      name: "asc"
    }
  })]);
  if (!rule) {
    throw new Response("Workflow not found", {
      status: 404
    });
  }
  const gmailUserIds = new Set(gmailTokens.map((t) => t.userId));
  const gmailAddressMap = new Map(gmailTokens.map((t) => [t.userId, t.gmailAddress || "Gmail connected"]));
  const actionSteps = rule.actions.length > 0 ? rule.actions.map((a) => {
    const c = a.config;
    return {
      id: `act_${a.id}`,
      dbId: a.id,
      type: a.type,
      configUserId: c.userId || "",
      configMessage: c.message || "",
      configField: c.field || "stage",
      configValue: c.value || "",
      configNote: c.note || "",
      configFromUserId: c.fromUserId || "",
      configSubject: c.subject || "",
      configBody: c.body || ""
    };
  }) : (
    // Legacy fallback: single action/actionConfig
    [{
      id: `act_legacy_${rule.id}`,
      type: rule.action || "ASSIGN_TO_USER",
      configUserId: ((_a = rule.actionConfig) == null ? void 0 : _a.userId) || "",
      configMessage: ((_b = rule.actionConfig) == null ? void 0 : _b.message) || "",
      configField: ((_c = rule.actionConfig) == null ? void 0 : _c.field) || "stage",
      configValue: ((_d = rule.actionConfig) == null ? void 0 : _d.value) || "",
      configNote: ((_e = rule.actionConfig) == null ? void 0 : _e.note) || "",
      configFromUserId: ((_f = rule.actionConfig) == null ? void 0 : _f.fromUserId) || "",
      configSubject: ((_g = rule.actionConfig) == null ? void 0 : _g.subject) || "",
      configBody: ((_h = rule.actionConfig) == null ? void 0 : _h.body) || ""
    }]
  );
  const triggerCondition = rule.triggerCondition;
  return {
    user,
    users: users2,
    stages,
    gmailUserIds,
    gmailAddressMap,
    rule,
    actionSteps,
    triggerCondition,
    emailTemplates
  };
}
async function action$2({
  request,
  params
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "deleteWorkflow") {
    await prisma.workflowRule.delete({
      where: {
        id: params.id
      }
    });
    return redirect("/workflows");
  }
  if (intent !== "update") return {};
  const name = formData.get("name");
  const triggerEvent = formData.get("triggerEvent");
  const actionsJson = formData.get("actions");
  if (!(name == null ? void 0 : name.trim()) || !triggerEvent) {
    return {
      error: "Name and trigger event are required"
    };
  }
  let actions;
  try {
    actions = JSON.parse(actionsJson || "[]");
  } catch {
    return {
      error: "Invalid action data"
    };
  }
  if (actions.length === 0) {
    return {
      error: "At least one action is required"
    };
  }
  for (const act of actions) {
    if (act.type === "SEND_EMAIL") {
      const fromUserId = act.config.fromUserId;
      const senderToken = await prisma.gmailToken.findUnique({
        where: {
          userId: fromUserId
        }
      });
      if (!senderToken) {
        return {
          error: "The selected email sender does not have Gmail connected."
        };
      }
    }
  }
  let triggerCondition = null;
  if (triggerEvent === "STAGE_CHANGED") {
    const toStage = formData.get("conditionToStage");
    if (toStage) triggerCondition = {
      toStage
    };
  } else if (triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED") {
    const temperature = formData.get("conditionTemperature");
    if (temperature) triggerCondition = {
      temperature
    };
  }
  try {
    await prisma.workflowAction.deleteMany({
      where: {
        ruleId: params.id
      }
    });
    await prisma.workflowRule.update({
      where: {
        id: params.id
      },
      data: {
        name: name.trim(),
        triggerEvent,
        triggerCondition,
        actions: {
          create: actions.map((act, i) => ({
            type: act.type,
            config: act.config,
            order: i
          }))
        }
      }
    });
  } catch (err) {
    console.error("[workflows] Failed to update rule:", err);
    return {
      error: "Failed to update workflow rule."
    };
  }
  return redirect("/workflows");
}
function ActionConfigFields({
  step,
  onChange,
  users: users2,
  stages,
  gmailUserIds,
  gmailAddressMap,
  templates
}) {
  var _a, _b;
  const editorRef = useRef(null);
  const selectedFieldDef = UPDATE_FIELDS.find((f) => f.value === step.configField);
  const valueInputType = (selectedFieldDef == null ? void 0 : selectedFieldDef.type) || "text";
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-3",
    children: [step.type === "ASSIGN_TO_USER" && /* @__PURE__ */ jsxs(Select, {
      value: step.configUserId,
      onChange: (e) => onChange({
        ...step,
        configUserId: e.target.value
      }),
      className: "bg-background/50 border-border/60",
      children: [/* @__PURE__ */ jsx("option", {
        value: "",
        children: "Select a user..."
      }), users2.map((u) => /* @__PURE__ */ jsx("option", {
        value: u.id,
        children: u.name || u.email
      }, u.id))]
    }), step.type === "SEND_NOTIFICATION" && /* @__PURE__ */ jsx(Textarea, {
      value: step.configMessage,
      onChange: (e) => onChange({
        ...step,
        configMessage: e.target.value
      }),
      placeholder: "Enter the notification message...",
      className: "bg-background/50 border-border/60",
      rows: 3
    }), step.type === "UPDATE_FIELD" && /* @__PURE__ */ jsxs("div", {
      className: "space-y-3",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Field"
        }), /* @__PURE__ */ jsx(Select, {
          value: step.configField,
          onChange: (e) => onChange({
            ...step,
            configField: e.target.value,
            configValue: ""
          }),
          className: "mt-1 bg-background/50 border-border/60",
          children: UPDATE_FIELDS.map((f) => /* @__PURE__ */ jsx("option", {
            value: f.value,
            children: f.label
          }, f.value))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Value"
        }), valueInputType === "select" ? /* @__PURE__ */ jsxs(Select, {
          value: step.configValue,
          onChange: (e) => onChange({
            ...step,
            configValue: e.target.value
          }),
          className: "mt-1 bg-background/50 border-border/60",
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: "Select..."
          }), step.configField === "stage" ? stages.map((s) => /* @__PURE__ */ jsx("option", {
            value: s.name,
            children: s.label
          }, s.name)) : ((selectedFieldDef == null ? void 0 : selectedFieldDef.options) || []).map((opt) => /* @__PURE__ */ jsx("option", {
            value: opt.value,
            children: opt.label
          }, opt.value))]
        }) : valueInputType === "textarea" ? /* @__PURE__ */ jsx(Textarea, {
          value: step.configValue,
          onChange: (e) => onChange({
            ...step,
            configValue: e.target.value
          }),
          placeholder: `Enter new ${(_a = selectedFieldDef == null ? void 0 : selectedFieldDef.label) == null ? void 0 : _a.toLowerCase()}...`,
          className: "mt-1 bg-background/50 border-border/60",
          rows: 2
        }) : /* @__PURE__ */ jsx(Input, {
          type: "text",
          value: step.configValue,
          onChange: (e) => onChange({
            ...step,
            configValue: e.target.value
          }),
          placeholder: `Enter new ${(_b = selectedFieldDef == null ? void 0 : selectedFieldDef.label) == null ? void 0 : _b.toLowerCase()}...`,
          className: "mt-1 bg-background/50 border-border/60"
        })]
      })]
    }), step.type === "ADD_NOTE" && /* @__PURE__ */ jsx(Textarea, {
      value: step.configNote,
      onChange: (e) => onChange({
        ...step,
        configNote: e.target.value
      }),
      placeholder: "Enter the note to add...",
      className: "bg-background/50 border-border/60",
      rows: 3
    }), step.type === "SEND_EMAIL" && /* @__PURE__ */ jsxs("div", {
      className: "space-y-3",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Send from"
        }), /* @__PURE__ */ jsxs(Select, {
          value: step.configFromUserId,
          onChange: (e) => onChange({
            ...step,
            configFromUserId: e.target.value
          }),
          className: "mt-1 bg-background/50 border-border/60",
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: "Select a sender..."
          }), users2.map((u) => /* @__PURE__ */ jsxs("option", {
            value: u.id,
            disabled: !gmailUserIds.has(u.id),
            children: [u.name || u.email, gmailUserIds.has(u.id) ? ` (${gmailAddressMap.get(u.id)})` : " — Gmail not connected"]
          }, u.id))]
        })]
      }), templates.length > 0 && /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Load Template"
        }), /* @__PURE__ */ jsxs(Select, {
          value: "",
          onChange: (e) => {
            const tmpl = templates.find((t) => t.id === e.target.value);
            if (tmpl) {
              const htmlBody = tmpl.body.includes("<") && tmpl.body.includes(">") ? tmpl.body : tmpl.body.replace(/\n/g, "<br>");
              onChange({
                ...step,
                configSubject: tmpl.subject
              });
              if (editorRef.current) {
                editorRef.current.setHTML(htmlBody);
              }
            }
          },
          className: "mt-1 bg-background/50 border-border/60",
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: "Choose a template..."
          }), templates.map((t) => /* @__PURE__ */ jsx("option", {
            value: t.id,
            children: t.name
          }, t.id))]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Subject"
        }), /* @__PURE__ */ jsx(Input, {
          type: "text",
          value: step.configSubject,
          onChange: (e) => onChange({
            ...step,
            configSubject: e.target.value
          }),
          placeholder: 'e.g. "Re: {{companyName}}"',
          className: "mt-1 bg-background/50 border-border/60"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-xs font-medium",
          children: "Body"
        }), /* @__PURE__ */ jsx(RichEditor, {
          ref: editorRef,
          value: step.configBody,
          onChange: (html) => onChange({
            ...step,
            configBody: html
          }),
          placeholder: "Hi {{contactName}}, I noticed {{companyName}}...",
          minHeight: 140,
          className: "mt-1"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-[11px] text-muted-foreground mt-1",
          children: ["Variables: ", "{{companyName}}", ", ", "{{contactName}}", ", ", "{{email}}", ", ", "{{industry}}", ", ", "{{stage}}", ", ", "{{website}}"]
        })]
      })]
    })]
  });
}
const workflows_$id_edit = UNSAFE_withComponentProps(function WorkflowsEditPage() {
  const {
    user,
    users: users2,
    stages,
    gmailUserIds,
    gmailAddressMap,
    rule,
    actionSteps: initialSteps,
    triggerCondition: initialCondition,
    emailTemplates
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [triggerEvent, setTriggerEvent] = useState(rule.triggerEvent);
  const [conditionToStage, setConditionToStage] = useState((initialCondition == null ? void 0 : initialCondition.toStage) || "");
  const [conditionTemperature, setConditionTemperature] = useState((initialCondition == null ? void 0 : initialCondition.temperature) || "");
  const [actionSteps, setActionSteps] = useState(initialSteps);
  const showFilter = TRIGGERS_WITH_CONDITION.has(triggerEvent);
  function addAction() {
    setActionSteps((prev) => [...prev, makeActionStep()]);
  }
  function removeAction(id) {
    setActionSteps((prev) => prev.filter((s) => s.id !== id));
  }
  function updateAction(updated) {
    setActionSteps((prev) => prev.map((s) => s.id === updated.id ? updated : s));
  }
  function changeActionType(id, newType) {
    setActionSteps((prev) => prev.map((s) => s.id === id ? {
      ...makeActionStep(newType),
      id: s.id
    } : s));
  }
  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(actionSteps);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setActionSteps(items);
  }
  const actionsPayload = actionSteps.map((s) => configFromStep(s)).filter(Boolean);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6 max-w-2xl mx-auto",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/workflows",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Edit Workflow"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mt-0.5",
            children: rule.name
          })]
        })]
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", {
        className: "rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-center gap-3",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-4 w-4 shrink-0"
        }), actionData.error]
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-0",
        children: [/* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "intent",
          value: "update"
        }), /* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "actions",
          value: JSON.stringify(actionsPayload)
        }), /* @__PURE__ */ jsx(Card, {
          className: "mb-4 border-border/40 bg-gradient-to-br from-card/80 to-card/40",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "pt-6",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "name",
              className: "text-sm font-semibold",
              children: "Workflow Name"
            }), /* @__PURE__ */ jsx(Input, {
              id: "name",
              name: "name",
              type: "text",
              required: true,
              defaultValue: rule.name,
              className: "mt-2 bg-background/50 border-border/60"
            })]
          })
        }), /* @__PURE__ */ jsxs(Card, {
          className: "border-border/40 bg-gradient-to-br from-card/80 to-card/40",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-xl border px-3 py-2 bg-blue-500/15 text-blue-400 border-blue-500/20 w-fit",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/5",
                children: /* @__PURE__ */ jsx("span", {
                  className: "text-xs font-bold",
                  children: "1"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-semibold",
                children: "When this happens"
              }), /* @__PURE__ */ jsx(Zap, {
                className: "h-3.5 w-3.5 opacity-60"
              })]
            })
          }), /* @__PURE__ */ jsxs(CardContent, {
            children: [/* @__PURE__ */ jsx(Label, {
              className: "text-sm font-medium",
              children: "Trigger Event"
            }), /* @__PURE__ */ jsx(Select, {
              name: "triggerEvent",
              value: triggerEvent,
              onChange: (e) => {
                setTriggerEvent(e.target.value);
                setConditionToStage("");
                setConditionTemperature("");
              },
              className: "mt-2 bg-background/50 border-border/60",
              children: TRIGGER_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", {
                value: opt.value,
                children: opt.label
              }, opt.value))
            })]
          })]
        }), showFilter ? /* @__PURE__ */ jsxs(Card, {
          className: "mt-3 border-border/40 bg-gradient-to-br from-card/80 to-card/40",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2 rounded-xl border px-3 py-2 bg-amber-500/15 text-amber-400 border-amber-500/20",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/5",
                  children: /* @__PURE__ */ jsx("span", {
                    className: "text-xs font-bold",
                    children: "2"
                  })
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-semibold",
                  children: "Filter"
                }), /* @__PURE__ */ jsx(Filter, {
                  className: "h-3.5 w-3.5 opacity-60"
                })]
              }), /* @__PURE__ */ jsx(Badge, {
                variant: "outline",
                className: "text-[10px]",
                children: "Optional"
              })]
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: triggerEvent === "STAGE_CHANGED" ? /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(Label, {
                className: "text-sm font-medium",
                children: "Only when stage changes to"
              }), /* @__PURE__ */ jsxs(Select, {
                name: "conditionToStage",
                value: conditionToStage,
                onChange: (e) => setConditionToStage(e.target.value),
                className: "mt-2 bg-background/50 border-border/60",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "",
                  children: "Any stage"
                }), stages.map((s) => /* @__PURE__ */ jsx("option", {
                  value: s.name,
                  children: s.label
                }, s.name))]
              })]
            }) : /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(Label, {
                className: "text-sm font-medium",
                children: "Only when temperature is"
              }), /* @__PURE__ */ jsxs(Select, {
                name: "conditionTemperature",
                value: conditionTemperature,
                onChange: (e) => setConditionTemperature(e.target.value),
                className: "mt-2 bg-background/50 border-border/60",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "",
                  children: "Any temperature"
                }), TEMPERATURES.map((t) => /* @__PURE__ */ jsx("option", {
                  value: t.value,
                  children: t.label
                }, t.value))]
              })]
            })
          })]
        }) : null, /* @__PURE__ */ jsxs(Card, {
          className: "mt-3 border-border/40 bg-gradient-to-br from-card/80 to-card/40",
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            className: "pb-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-xl border px-3 py-2 bg-emerald-500/15 text-emerald-400 border-emerald-500/20 w-fit",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/5",
                children: /* @__PURE__ */ jsx("span", {
                  className: "text-xs font-bold",
                  children: showFilter ? "3" : "2"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-semibold",
                children: "Then do these"
              }), /* @__PURE__ */ jsx(Rocket, {
                className: "h-3.5 w-3.5 opacity-60"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              className: "mt-2 pl-1",
              children: "Add, remove, or reorder action steps"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx(DragDropContext, {
              onDragEnd,
              children: /* @__PURE__ */ jsx(Droppable, {
                droppableId: "actions",
                children: (provided) => /* @__PURE__ */ jsxs("div", {
                  ref: provided.innerRef,
                  ...provided.droppableProps,
                  className: "space-y-3",
                  children: [actionSteps.map((step, index) => {
                    const actionDef = ACTION_TYPES.find((a) => a.value === step.type);
                    const Icon = (actionDef == null ? void 0 : actionDef.icon) || Zap;
                    const color = (actionDef == null ? void 0 : actionDef.color) || "slate";
                    return /* @__PURE__ */ jsx(Draggable, {
                      draggableId: step.id,
                      index,
                      children: (dragProvided, dragSnapshot) => /* @__PURE__ */ jsxs("div", {
                        ref: dragProvided.innerRef,
                        ...dragProvided.draggableProps,
                        className: `rounded-xl border border-border/40 bg-card/60 p-4 space-y-3 transition-shadow ${dragSnapshot.isDragging ? "shadow-lg" : ""}`,
                        children: [/* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [/* @__PURE__ */ jsx("div", {
                            ...dragProvided.dragHandleProps,
                            className: "cursor-grab text-muted-foreground/30 hover:text-muted-foreground shrink-0",
                            children: /* @__PURE__ */ jsx(GripVertical, {
                              className: "h-4 w-4"
                            })
                          }), /* @__PURE__ */ jsx("div", {
                            className: `flex h-6 w-6 items-center justify-center rounded-md ${COLOR_MAP[color] || "bg-muted"}`,
                            children: /* @__PURE__ */ jsx(Icon, {
                              className: `h-3 w-3 ${TEXT_COLOR_MAP[color] || "text-muted-foreground"}`
                            })
                          }), /* @__PURE__ */ jsxs(Badge, {
                            variant: "outline",
                            className: "text-[10px] tabular-nums",
                            children: ["Step ", index + 1]
                          }), /* @__PURE__ */ jsx(Select, {
                            value: step.type,
                            onChange: (e) => changeActionType(step.id, e.target.value),
                            className: "flex-1 bg-background/50 border-border/60 h-8 text-sm",
                            children: ACTION_TYPES.map((opt) => /* @__PURE__ */ jsx("option", {
                              value: opt.value,
                              children: opt.label
                            }, opt.value))
                          }), actionSteps.length > 1 && /* @__PURE__ */ jsx(Button, {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            className: "h-7 w-7 p-0 text-muted-foreground/40 hover:text-red-400 shrink-0",
                            onClick: () => removeAction(step.id),
                            children: /* @__PURE__ */ jsx(Trash2, {
                              className: "h-3.5 w-3.5"
                            })
                          })]
                        }), /* @__PURE__ */ jsx(ActionConfigFields, {
                          step,
                          onChange: updateAction,
                          users: users2,
                          stages,
                          gmailUserIds,
                          gmailAddressMap,
                          templates: emailTemplates
                        })]
                      })
                    }, step.id);
                  }), provided.placeholder]
                })
              })
            }), /* @__PURE__ */ jsxs(Button, {
              type: "button",
              variant: "outline",
              onClick: addAction,
              className: "w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground",
              children: [/* @__PURE__ */ jsx(Plus, {
                className: "h-4 w-4 mr-2"
              }), "Add Action Step"]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "pt-6 pb-2 flex gap-3",
          children: [/* @__PURE__ */ jsx(Button, {
            type: "submit",
            disabled: isSubmitting || actionsPayload.length === 0,
            className: "flex-1 h-11 text-base font-semibold shadow-lg shadow-primary/5 hover:shadow-primary/10",
            children: isSubmitting ? /* @__PURE__ */ jsxs("span", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Sparkles, {
                className: "h-4 w-4 animate-spin"
              }), "Saving..."]
            }) : /* @__PURE__ */ jsxs("span", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(CheckCircle2, {
                className: "h-4 w-4"
              }), "Save Changes"]
            })
          }), /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "inline",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "deleteWorkflow"
            }), /* @__PURE__ */ jsxs(Button, {
              type: "submit",
              variant: "outline",
              className: "text-red-400 hover:text-red-300 hover:border-red-500/30",
              disabled: isSubmitting,
              children: [/* @__PURE__ */ jsx(Trash2, {
                className: "h-4 w-4 mr-2"
              }), "Delete"]
            })]
          })]
        })]
      })]
    })
  });
});
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: workflows_$id_edit,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  let jobs = [];
  try {
    jobs = await prisma.scraperJob.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    if (jobs.length > 0) {
      const userIds = [...new Set(jobs.map((j) => j.userId))];
      const users2 = await prisma.user.findMany({
        where: {
          id: {
            in: userIds
          }
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });
      const userMap = new Map(users2.map((u) => [u.id, u]));
      jobs = jobs.map((j) => ({
        ...j,
        user: userMap.get(j.userId) || {
          name: "Unknown",
          email: ""
        }
      }));
    }
  } catch (err) {
    console.error("[scraper] Failed to load jobs:", err);
  }
  return {
    user,
    jobs
  };
}
const scraper = UNSAFE_withComponentProps(function ScraperList() {
  const {
    user,
    jobs
  } = useLoaderData();
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "Shopify Scraper"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Discover and enrich Australian Shopify store leads"
          })]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/scraper/new",
          children: /* @__PURE__ */ jsxs(Button, {
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(Search, {
              className: "mr-2 h-4 w-4"
            }), "New Scrape"]
          })
        })]
      }), jobs.length === 0 ? /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center justify-center py-16",
          children: [/* @__PURE__ */ jsx(Globe, {
            className: "h-12 w-12 text-muted-foreground/50"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-4 text-lg font-medium text-muted-foreground",
            children: "No scraper jobs yet"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Discover Shopify stores or upload a list of URLs to scrape"
          })]
        })
      }) : /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: jobs.map((job) => /* @__PURE__ */ jsx(Link, {
          to: `/scraper/${job.id}`,
          children: /* @__PURE__ */ jsx(Card, {
            className: "hover:border-emerald-500/30 transition-colors",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex items-center gap-4 p-4",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 shrink-0",
                children: /* @__PURE__ */ jsx(Zap, {
                  className: "h-5 w-5 text-cyan-400"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium truncate",
                  children: job.name
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: [job.discoveryMode === "GOOGLE_DORK" ? "Google Discovery" : "URL Upload", " by ", job.user.name || job.user.email, " — ", new Date(job.createdAt).toLocaleDateString()]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3",
                children: [/* @__PURE__ */ jsx(ScraperStatusBadge$1, {
                  status: job.status
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-sm text-muted-foreground",
                  children: [job.totalImported, "/", job.totalDiscovered, " leads"]
                })]
              })]
            })
          })
        }, job.id))
      })]
    })
  });
});
function ScraperStatusBadge$1({
  status
}) {
  const config = {
    PENDING: "bg-slate-500/15 text-slate-400",
    DISCOVERING: "bg-blue-500/15 text-blue-400",
    VALIDATING: "bg-cyan-500/15 text-cyan-400",
    ENRICHING: "bg-amber-500/15 text-amber-400",
    IMPORTING: "bg-violet-500/15 text-violet-400",
    COMPLETED: "bg-emerald-500/15 text-emerald-400",
    FAILED: "bg-red-500/15 text-red-400",
    CANCELLED: "bg-gray-500/15 text-gray-400"
  };
  return /* @__PURE__ */ jsx(Badge, {
    className: config[status] || config.PENDING,
    children: status
  });
}
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: scraper,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
  request
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  return {
    user
  };
}
async function action$1({
  request
}) {
  const userId = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "url_upload") {
    const urls = formData.get("urls");
    const name = formData.get("name") || "URL Upload Scrape";
    if (!(urls == null ? void 0 : urls.trim())) {
      return {
        error: "Please enter at least one URL"
      };
    }
    const job = await prisma.scraperJob.create({
      data: {
        name,
        discoveryMode: "URL_UPLOAD",
        uploadedUrls: urls,
        userId,
        config: {
          delay: {
            min: 1e3,
            max: 3e3
          },
          batchSize: 30,
          batchPause: 1e4,
          respectRobots: true,
          playwrightEnabled: true,
          maxRetries: 3
        }
      }
    });
    import("./pipeline-CZX4hGZP.js").then(({
      runScraperPipeline
    }) => {
      runScraperPipeline(job.id).catch(console.error);
    }).catch((err) => {
      console.error("[scraper/new] Failed to load pipeline:", err);
    });
    return redirect(`/scraper/${job.id}`);
  }
  if (intent === "dns_scan") {
    const name = formData.get("name") || "DNS Scan — Australian Shopify Stores";
    const job = await prisma.scraperJob.create({
      data: {
        name,
        discoveryMode: "DNS_SCAN",
        userId,
        config: {
          delay: {
            min: 1e3,
            max: 3e3
          },
          batchSize: 30,
          batchPause: 1e4,
          respectRobots: true,
          playwrightEnabled: true,
          maxRetries: 3
        }
      }
    });
    import("./pipeline-CZX4hGZP.js").then(({
      runScraperPipeline
    }) => {
      runScraperPipeline(job.id).catch(console.error);
    }).catch((err) => {
      console.error("[scraper/new] Failed to load pipeline:", err);
    });
    return redirect(`/scraper/${job.id}`);
  }
  return {
    error: "Invalid action"
  };
}
const scraper_new = UNSAFE_withComponentProps(function ScraperNew() {
  const {
    user
  } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/scraper",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "New Scrape"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Choose how to discover Shopify stores"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 md:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Upload, {
                className: "h-5 w-5 text-emerald-400"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-lg",
                children: "Upload URLs"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Paste a list of Shopify store URLs to scrape"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs(Form, {
              method: "post",
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "url_upload"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "mb-1.5 block text-sm font-medium",
                  children: "Job Name"
                }), /* @__PURE__ */ jsx("input", {
                  name: "name",
                  type: "text",
                  placeholder: "e.g. Australian Fashion Stores",
                  className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsxs("label", {
                  className: "mb-1.5 block text-sm font-medium",
                  children: ["Store URLs ", /* @__PURE__ */ jsx("span", {
                    className: "text-red-400",
                    children: "*"
                  })]
                }), /* @__PURE__ */ jsx("textarea", {
                  name: "urls",
                  rows: 8,
                  placeholder: "https://store.com.au\nhttps://anotherstore.com\nhttps://mystore.myshopify.com",
                  className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
                  required: true
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-1 text-xs text-muted-foreground",
                  children: "One URL per line. Include https:// prefix."
                })]
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                disabled: isSubmitting,
                className: "w-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
                children: isSubmitting ? "Starting..." : "Start Scrape"
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Globe, {
                className: "h-5 w-5 text-blue-400"
              }), /* @__PURE__ */ jsx(CardTitle, {
                className: "text-lg",
                children: "DNS Scan"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Auto-discover Australian Shopify stores via DNS — free, no API keys"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs(Form, {
              method: "post",
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "intent",
                value: "dns_scan"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("label", {
                  className: "mb-1.5 block text-sm font-medium",
                  children: "Job Name"
                }), /* @__PURE__ */ jsx("input", {
                  name: "name",
                  type: "text",
                  placeholder: "e.g. AU Shopify DNS Scan",
                  className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 rounded-lg border border-border p-3 text-xs text-muted-foreground",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Downloads the ", /* @__PURE__ */ jsx("span", {
                    className: "text-foreground font-medium",
                    children: "Majestic Million"
                  }), " (top 1M domains, free)"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Filters for ", /* @__PURE__ */ jsx("span", {
                    className: "text-foreground font-medium",
                    children: "~8,600 .com.au"
                  }), " domains"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["DNS-checks each for ", /* @__PURE__ */ jsx("span", {
                    className: "text-foreground font-medium",
                    children: "Shopify CNAME"
                  }), " signature"]
                }), /* @__PURE__ */ jsx("p", {
                  children: "Then scrapes contact pages for owner details"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-emerald-400 font-medium pt-1",
                  children: "100% free — no API keys, no credit card"
                })]
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                disabled: isSubmitting,
                className: "w-full bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25",
                children: isSubmitting ? "Starting..." : "Scan Australian Shopify Stores"
              })]
            })
          })]
        })]
      })]
    })
  });
});
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: scraper_new,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  request,
  params
}) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      role: true
    }
  });
  const job = await prisma.scraperJob.findUnique({
    where: {
      id: params.jobId
    }
  });
  if (!job) {
    throw new Response("Not found", {
      status: 404
    });
  }
  let jobUser = null;
  try {
    jobUser = await prisma.user.findUnique({
      where: {
        id: job.userId
      },
      select: {
        name: true,
        email: true
      }
    });
  } catch (err) {
    console.error("[scraper/job] Failed to load job user:", err);
  }
  let leads = [];
  try {
    leads = await prisma.lead.findMany({
      where: {
        scraperJobId: job.id
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        email: true,
        industry: true,
        website: true,
        temperature: true,
        stage: true,
        status: true
      }
    });
  } catch (err) {
    console.error("[scraper/job] Failed to load leads:", err);
  }
  return {
    user,
    job: {
      ...job,
      user: jobUser || {
        name: "Unknown",
        email: ""
      }
    },
    leads
  };
}
async function action({
  request,
  params
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "cancel") {
    await prisma.scraperJob.update({
      where: {
        id: params.jobId
      },
      data: {
        status: "CANCELLED",
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    return {
      success: true
    };
  }
  return {
    success: false
  };
}
const scraper_$jobId = UNSAFE_withComponentProps(function ScraperJobDetail() {
  const {
    user,
    job,
    leads
  } = useLoaderData();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const isActive = !["COMPLETED", "FAILED", "CANCELLED"].includes(job.status);
  const intervalRef = useRef(null);
  useEffect$1(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        revalidator.revalidate();
      }, 5e3);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, revalidator]);
  const errors = job.errors || [];
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-4xl space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4",
          children: [/* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            onClick: () => navigate("/scraper"),
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4"
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold tracking-tight",
              children: job.name
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: [job.discoveryMode === "GOOGLE_DORK" ? "Google Discovery" : "URL Upload", " by ", job.user.name || job.user.email, " — ", new Date(job.createdAt).toLocaleString()]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(ScraperStatusBadge, {
            status: job.status
          }), isActive && /* @__PURE__ */ jsxs(fetcher.Form, {
            method: "post",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "cancel"
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              variant: "outline",
              size: "sm",
              className: "text-red-400 border-red-500/20 hover:bg-red-500/10",
              children: "Cancel"
            })]
          })]
        })]
      }), isActive && /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-4",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx(Loader2, {
              className: "h-5 w-5 animate-spin text-emerald-400"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-1",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-sm font-medium",
                children: [job.status === "DISCOVERING" && "Discovering store URLs...", job.status === "VALIDATING" && "Validating Shopify stores...", job.status === "ENRICHING" && "Scraping contact details...", job.status === "IMPORTING" && "Importing leads...", job.status === "PENDING" && "Starting pipeline..."]
              }), /* @__PURE__ */ jsx("div", {
                className: "mt-2 h-2 rounded-full bg-muted overflow-hidden",
                children: /* @__PURE__ */ jsx("div", {
                  className: "h-full bg-emerald-500 transition-all duration-500",
                  style: {
                    width: `${job.totalDiscovered > 0 ? Math.round((job.totalValid + job.totalSkipped + job.totalFailed) / job.totalDiscovered * 100) : 0}%`
                  }
                })
              })]
            })]
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
        children: [/* @__PURE__ */ jsx(StatCard, {
          label: "Discovered",
          value: job.totalDiscovered,
          icon: /* @__PURE__ */ jsx(Globe, {
            className: "h-4 w-4 text-blue-400"
          }),
          color: "text-blue-400"
        }), /* @__PURE__ */ jsx(StatCard, {
          label: "Valid",
          value: job.totalValid,
          icon: /* @__PURE__ */ jsx(Check, {
            className: "h-4 w-4 text-cyan-400"
          }),
          color: "text-cyan-400"
        }), /* @__PURE__ */ jsx(StatCard, {
          label: "Enriched",
          value: job.totalEnriched,
          icon: /* @__PURE__ */ jsx(Globe, {
            className: "h-4 w-4 text-amber-400"
          }),
          color: "text-amber-400"
        }), /* @__PURE__ */ jsx(StatCard, {
          label: "Imported",
          value: job.totalImported,
          icon: /* @__PURE__ */ jsx(Check, {
            className: "h-4 w-4 text-emerald-400"
          }),
          color: "text-emerald-400"
        }), /* @__PURE__ */ jsx(StatCard, {
          label: "Skipped",
          value: job.totalSkipped,
          icon: /* @__PURE__ */ jsx(Clock, {
            className: "h-4 w-4 text-slate-400"
          }),
          color: "text-slate-400"
        }), /* @__PURE__ */ jsx(StatCard, {
          label: "Failed",
          value: job.totalFailed,
          icon: /* @__PURE__ */ jsx(AlertTriangle, {
            className: "h-4 w-4 text-red-400"
          }),
          color: "text-red-400"
        })]
      }), leads.length > 0 && /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "text-lg",
            children: ["Leads Created (", leads.length, ")"]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "overflow-x-auto",
            children: /* @__PURE__ */ jsxs("table", {
              className: "w-full text-sm",
              children: [/* @__PURE__ */ jsx("thead", {
                children: /* @__PURE__ */ jsxs("tr", {
                  className: "border-b border-border",
                  children: [/* @__PURE__ */ jsx("th", {
                    className: "py-2 pr-4 text-left font-medium text-muted-foreground",
                    children: "Company"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "py-2 pr-4 text-left font-medium text-muted-foreground",
                    children: "Contact"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "py-2 pr-4 text-left font-medium text-muted-foreground",
                    children: "Email"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "py-2 pr-4 text-left font-medium text-muted-foreground",
                    children: "Industry"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "py-2 pr-4 text-left font-medium text-muted-foreground",
                    children: "Status"
                  })]
                })
              }), /* @__PURE__ */ jsx("tbody", {
                children: leads.map((lead) => /* @__PURE__ */ jsxs("tr", {
                  className: "border-b border-border/50 hover:bg-muted/30",
                  children: [/* @__PURE__ */ jsx("td", {
                    className: "py-2 pr-4",
                    children: /* @__PURE__ */ jsx(Link, {
                      to: `/inbox/${lead.id}`,
                      className: "font-medium text-emerald-400 hover:underline",
                      children: lead.companyName
                    })
                  }), /* @__PURE__ */ jsx("td", {
                    className: "py-2 pr-4 text-muted-foreground",
                    children: lead.contactName || "—"
                  }), /* @__PURE__ */ jsx("td", {
                    className: "py-2 pr-4 text-muted-foreground",
                    children: lead.email
                  }), /* @__PURE__ */ jsx("td", {
                    className: "py-2 pr-4 text-muted-foreground",
                    children: lead.industry || "—"
                  }), /* @__PURE__ */ jsx("td", {
                    className: "py-2 pr-4",
                    children: /* @__PURE__ */ jsx(Badge, {
                      className: "text-xs bg-blue-500/15 text-blue-400",
                      children: lead.status
                    })
                  })]
                }, lead.id))
              })]
            })
          })
        })]
      }), errors.length > 0 && /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "text-lg text-red-400",
            children: ["Errors (", errors.length, ")"]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "max-h-64 overflow-y-auto space-y-2",
            children: errors.map((err, i) => /* @__PURE__ */ jsxs("div", {
              className: "rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-sm",
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-red-400",
                children: err.phase
              }), /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground break-all",
                children: err.url
              }), /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground/70 text-xs",
                children: err.error
              })]
            }, i))
          })
        })]
      })]
    })
  });
});
function StatCard({
  label,
  value,
  icon,
  color
}) {
  return /* @__PURE__ */ jsx(Card, {
    children: /* @__PURE__ */ jsxs(CardContent, {
      className: "p-3",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [icon, /* @__PURE__ */ jsx("span", {
          className: `text-xl font-bold ${color}`,
          children: value
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xs text-muted-foreground mt-1",
        children: label
      })]
    })
  });
}
function ScraperStatusBadge({
  status
}) {
  const config = {
    PENDING: "bg-slate-500/15 text-slate-400",
    DISCOVERING: "bg-blue-500/15 text-blue-400",
    VALIDATING: "bg-cyan-500/15 text-cyan-400",
    ENRICHING: "bg-amber-500/15 text-amber-400",
    IMPORTING: "bg-violet-500/15 text-violet-400",
    COMPLETED: "bg-emerald-500/15 text-emerald-400",
    FAILED: "bg-red-500/15 text-red-400",
    CANCELLED: "bg-gray-500/15 text-gray-400"
  };
  return /* @__PURE__ */ jsx(Badge, {
    className: config[status] || config.PENDING,
    children: status
  });
}
const route40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: scraper_$jobId,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C_G8n_uG.js", "imports": ["/assets/jsx-runtime-D_zvdyIk.js", "/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/index-DwQcVxz_.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-5ziKnW_n.js", "imports": ["/assets/jsx-runtime-D_zvdyIk.js", "/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/index-DwQcVxz_.js"], "css": ["/assets/root--ACcKYhh.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/home-Bv0yp0_A.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/login-DhnMYjjD.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/card-CFdKZ9YC.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/register-CtrzlPQm.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/card-CFdKZ9YC.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.google": { "id": "routes/auth.google", "parentId": "root", "path": "auth/google", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/auth.google-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.google.callback": { "id": "routes/auth.google.callback", "parentId": "root", "path": "auth/google/callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/auth.google.callback-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/dashboard-BlDXzj-_.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/card-CFdKZ9YC.js", "/assets/trending-up-CMJUIi-W.js", "/assets/button-BzD4dEQS.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/analytics": { "id": "routes/analytics", "parentId": "root", "path": "analytics", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/analytics-gfUDjdce.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/stages-D3OpmkBZ.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/button-BzD4dEQS.js", "/assets/target-8zJQTku0.js", "/assets/zap-hxRe82mn.js", "/assets/clock-fXwO6rwC.js", "/assets/layers-5PCYnPU_.js", "/assets/trending-up-CMJUIi-W.js", "/assets/activity-Cs5Q3wMQ.js", "/assets/chevron-down-hWcYwWZo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/inbox": { "id": "routes/inbox", "parentId": "root", "path": "inbox", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/inbox-U-MKulJn.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/plus-CKQmuqgk.js", "/assets/chevron-down-hWcYwWZo.js", "/assets/circle-check-Bd7GRUCN.js", "/assets/circle-x-CcmLvm4B.js", "/assets/snowflake-DYO2kuLB.js", "/assets/sun-D5wbcKGA.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/inbox.$leadId": { "id": "routes/inbox.$leadId", "parentId": "root", "path": "inbox/:leadId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/inbox._leadId-Ds-70tJZ.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/textarea-DdgqXUtb.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/activity-log-DH7qE_2n.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/circle-x-CcmLvm4B.js", "/assets/user-B_UkjLKA.js", "/assets/pencil-3dCsYsP0.js", "/assets/save-OhtTfQbj.js", "/assets/twitter-NK69595T.js", "/assets/activity-Cs5Q3wMQ.js", "/assets/clock-fXwO6rwC.js", "/assets/send-DpJcvcuU.js", "/assets/stages-D3OpmkBZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/leads.new": { "id": "routes/leads.new", "parentId": "root", "path": "leads/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/leads.new-BFYppF3o.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/textarea-DdgqXUtb.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/snowflake-DYO2kuLB.js", "/assets/sun-D5wbcKGA.js", "/assets/circle-check-Bd7GRUCN.js", "/assets/circle-alert-DKG883Eb.js", "/assets/user-B_UkjLKA.js", "/assets/building-2-BMK6oK14.js", "/assets/twitter-NK69595T.js", "/assets/globe-BJRi8l2b.js", "/assets/loader-circle-B97ViLfp.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/verification.criteria": { "id": "routes/verification.criteria", "parentId": "root", "path": "verification/criteria", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/verification.criteria-DKlzPSgM.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/textarea-DdgqXUtb.js", "/assets/select-BkRFjuOF.js", "/assets/badge-BOBE8P4s.js", "/assets/card-CFdKZ9YC.js", "/assets/plus-CKQmuqgk.js", "/assets/trash-2-CqzlFwpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/verification.$leadId": { "id": "routes/verification.$leadId", "parentId": "root", "path": "verification/:leadId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/verification._leadId-DMNW31TH.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/textarea-DdgqXUtb.js", "/assets/card-CFdKZ9YC.js", "/assets/snowflake-DYO2kuLB.js", "/assets/sun-D5wbcKGA.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/circle-check-Bd7GRUCN.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/users": { "id": "routes/users", "parentId": "root", "path": "users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/users-CB5n3YwX.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/badge-BOBE8P4s.js", "/assets/card-CFdKZ9YC.js", "/assets/select-BkRFjuOF.js", "/assets/user-B_UkjLKA.js", "/assets/activity-Cs5Q3wMQ.js", "/assets/target-8zJQTku0.js", "/assets/trash-2-CqzlFwpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/users.new": { "id": "routes/users.new", "parentId": "root", "path": "users/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/users.new-BC31_Mxu.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/card-CFdKZ9YC.js", "/assets/select-BkRFjuOF.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/circle-check-Bd7GRUCN.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pipeline": { "id": "routes/pipeline", "parentId": "root", "path": "pipeline", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/pipeline-CnZYpKFL.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/badge-BOBE8P4s.js", "/assets/input-GOqtI8vL.js", "/assets/dnd.esm-DPtlM8vO.js", "/assets/card-CFdKZ9YC.js", "/assets/snowflake-DYO2kuLB.js", "/assets/dialog-Cu3tcv22.js", "/assets/label-AEHRrbgY.js", "/assets/textarea-DdgqXUtb.js", "/assets/activity-log-DH7qE_2n.js", "/assets/building-2-BMK6oK14.js", "/assets/pencil-3dCsYsP0.js", "/assets/save-OhtTfQbj.js", "/assets/user-B_UkjLKA.js", "/assets/globe-BJRi8l2b.js", "/assets/link-YSTzHXqy.js", "/assets/stages-D3OpmkBZ.js", "/assets/arrow-right-BR0jhrU9.js", "/assets/clock-fXwO6rwC.js", "/assets/circle-alert-DKG883Eb.js", "/assets/index-DwQcVxz_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails": { "id": "routes/emails", "parentId": "root", "path": "emails", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails-Dmi7uKEC.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/card-CFdKZ9YC.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/send-DpJcvcuU.js", "/assets/circle-alert-DKG883Eb.js", "/assets/sparkles-C_UsOhu4.js", "/assets/loader-circle-B97ViLfp.js", "/assets/arrow-right-BR0jhrU9.js", "/assets/clock-fXwO6rwC.js", "/assets/message-square-B7wyHtsu.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails.templates": { "id": "routes/emails.templates", "parentId": "root", "path": "emails/templates", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails.templates-CrOjuRcE.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/card-CFdKZ9YC.js", "/assets/rich-editor-C6-p66Uv.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/plus-CKQmuqgk.js", "/assets/sparkles-C_UsOhu4.js", "/assets/save-OhtTfQbj.js", "/assets/pencil-3dCsYsP0.js", "/assets/trash-2-CqzlFwpQ.js", "/assets/clock-fXwO6rwC.js", "/assets/link-YSTzHXqy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails.threads.$threadId": { "id": "routes/emails.threads.$threadId", "parentId": "root", "path": "emails/threads/:threadId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails.threads._threadId-BDVjS0TB.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/textarea-DdgqXUtb.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/user-B_UkjLKA.js", "/assets/reply-D99KUyiR.js", "/assets/send-DpJcvcuU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails.inbox.$messageId": { "id": "routes/emails.inbox.$messageId", "parentId": "root", "path": "emails/inbox/:messageId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails.inbox._messageId-CSzcDSSN.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/textarea-DdgqXUtb.js", "/assets/label-AEHRrbgY.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/reply-D99KUyiR.js", "/assets/send-DpJcvcuU.js", "/assets/user-B_UkjLKA.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/leads.$leadId.emails": { "id": "routes/leads.$leadId.emails", "parentId": "root", "path": "leads/:leadId/emails", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/leads._leadId.emails-CKOcOBXf.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/select-BkRFjuOF.js", "/assets/label-AEHRrbgY.js", "/assets/input-GOqtI8vL.js", "/assets/rich-editor-C6-p66Uv.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/circle-alert-DKG883Eb.js", "/assets/user-B_UkjLKA.js", "/assets/sparkles-C_UsOhu4.js", "/assets/send-DpJcvcuU.js", "/assets/clock-fXwO6rwC.js", "/assets/chevron-up-CO8iE6ce.js", "/assets/chevron-down-hWcYwWZo.js", "/assets/link-YSTzHXqy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.leads": { "id": "routes/api.leads", "parentId": "root", "path": "api/leads", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.leads-DT-a-5Em.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.lead-detail": { "id": "routes/api.lead-detail", "parentId": "root", "path": "api/lead-detail", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.lead-detail-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.scraper": { "id": "routes/api.scraper", "parentId": "root", "path": "api/scraper", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.scraper-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.diagnostic": { "id": "routes/api.diagnostic", "parentId": "root", "path": "api/diagnostic", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.diagnostic-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/docs.api": { "id": "routes/docs.api", "parentId": "root", "path": "docs/api", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/docs.api-D2eRzTlS.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/button-BzD4dEQS.js", "/assets/zap-hxRe82mn.js", "/assets/clock-fXwO6rwC.js", "/assets/shield-Bvz9Fpko.js", "/assets/triangle-alert-CDBYWix3.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/chevron-up-CO8iE6ce.js", "/assets/globe-BJRi8l2b.js", "/assets/circle-check-Bd7GRUCN.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/imports": { "id": "routes/imports", "parentId": "root", "path": "imports", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/imports-CLqvu2Z7.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/imports.new": { "id": "routes/imports.new", "parentId": "root", "path": "imports/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/imports.new-BCpyYrJr.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/select-BkRFjuOF.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/circle-check-Bd7GRUCN.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings": { "id": "routes/settings", "parentId": "root", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings-bo3G69J3.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/sun-D5wbcKGA.js", "/assets/database-BnaxoFpr.js", "/assets/key-BG9cY_wB.js", "/assets/zap-hxRe82mn.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.users": { "id": "routes/settings.users", "parentId": "root", "path": "settings/users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.users-CMz7yUuN.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/badge-BOBE8P4s.js", "/assets/card-CFdKZ9YC.js", "/assets/select-BkRFjuOF.js", "/assets/dialog-Cu3tcv22.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/plus-CKQmuqgk.js", "/assets/trash-2-CqzlFwpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.database": { "id": "routes/settings.database", "parentId": "root", "path": "settings/database", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.database-DUYjJWvC.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/textarea-DdgqXUtb.js", "/assets/database-BnaxoFpr.js", "/assets/circle-check-Bd7GRUCN.js", "/assets/circle-alert-DKG883Eb.js", "/assets/play-D-CYOOG5.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.api-keys": { "id": "routes/settings.api-keys", "parentId": "root", "path": "settings/api-keys", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.api-keys-CfRnXcae.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/key-BG9cY_wB.js", "/assets/shield-Bvz9Fpko.js", "/assets/plus-CKQmuqgk.js", "/assets/clock-fXwO6rwC.js", "/assets/trash-2-CqzlFwpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.scoring-rules": { "id": "routes/settings.scoring-rules", "parentId": "root", "path": "settings/scoring-rules", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.scoring-rules-DfLIPrxm.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/zap-hxRe82mn.js", "/assets/plus-CKQmuqgk.js", "/assets/trash-2-CqzlFwpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.stages": { "id": "routes/settings.stages", "parentId": "root", "path": "settings/stages", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.stages-WphDxBAX.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/stages-D3OpmkBZ.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/input-GOqtI8vL.js", "/assets/label-AEHRrbgY.js", "/assets/select-BkRFjuOF.js", "/assets/dnd.esm-DPtlM8vO.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/layers-5PCYnPU_.js", "/assets/plus-CKQmuqgk.js", "/assets/triangle-alert-CDBYWix3.js", "/assets/save-OhtTfQbj.js", "/assets/pencil-3dCsYsP0.js", "/assets/trash-2-CqzlFwpQ.js", "/assets/index-DwQcVxz_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.workflows": { "id": "routes/settings.workflows", "parentId": "root", "path": "settings/workflows", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/settings.workflows-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/workflows": { "id": "routes/workflows", "parentId": "root", "path": "workflows", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/workflows-6ktHDYhq.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/stages-D3OpmkBZ.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/plus-CKQmuqgk.js", "/assets/triangle-alert-CDBYWix3.js", "/assets/circle-check-Bd7GRUCN.js", "/assets/zap-hxRe82mn.js", "/assets/clock-fXwO6rwC.js", "/assets/circle-x-CcmLvm4B.js", "/assets/arrow-right-BR0jhrU9.js", "/assets/funnel-CZFWOZLj.js", "/assets/play-D-CYOOG5.js", "/assets/pencil-3dCsYsP0.js", "/assets/trash-2-CqzlFwpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/workflows.new": { "id": "routes/workflows.new", "parentId": "root", "path": "workflows/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/workflows.new-BBuM3BHp.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/input-GOqtI8vL.js", "/assets/textarea-DdgqXUtb.js", "/assets/label-AEHRrbgY.js", "/assets/select-BkRFjuOF.js", "/assets/dnd.esm-DPtlM8vO.js", "/assets/rich-editor-C6-p66Uv.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/triangle-alert-CDBYWix3.js", "/assets/zap-hxRe82mn.js", "/assets/funnel-CZFWOZLj.js", "/assets/sticky-note-vqy8P-yr.js", "/assets/user-B_UkjLKA.js", "/assets/message-square-B7wyHtsu.js", "/assets/trash-2-CqzlFwpQ.js", "/assets/plus-CKQmuqgk.js", "/assets/sparkles-C_UsOhu4.js", "/assets/chevron-down-hWcYwWZo.js", "/assets/index-DwQcVxz_.js", "/assets/link-YSTzHXqy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/workflows.$id.edit": { "id": "routes/workflows.$id.edit", "parentId": "root", "path": "workflows/:id/edit", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/workflows._id.edit-FMUypgiB.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/input-GOqtI8vL.js", "/assets/textarea-DdgqXUtb.js", "/assets/label-AEHRrbgY.js", "/assets/select-BkRFjuOF.js", "/assets/dnd.esm-DPtlM8vO.js", "/assets/rich-editor-C6-p66Uv.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/triangle-alert-CDBYWix3.js", "/assets/zap-hxRe82mn.js", "/assets/funnel-CZFWOZLj.js", "/assets/sticky-note-vqy8P-yr.js", "/assets/user-B_UkjLKA.js", "/assets/message-square-B7wyHtsu.js", "/assets/trash-2-CqzlFwpQ.js", "/assets/plus-CKQmuqgk.js", "/assets/sparkles-C_UsOhu4.js", "/assets/circle-check-Bd7GRUCN.js", "/assets/index-DwQcVxz_.js", "/assets/link-YSTzHXqy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scraper": { "id": "routes/scraper", "parentId": "root", "path": "scraper", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/scraper-BrLVEjhZ.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/globe-BJRi8l2b.js", "/assets/zap-hxRe82mn.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scraper.new": { "id": "routes/scraper.new", "parentId": "root", "path": "scraper/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/scraper.new-DihP2KIm.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/globe-BJRi8l2b.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scraper.$jobId": { "id": "routes/scraper.$jobId", "parentId": "root", "path": "scraper/:jobId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/scraper._jobId-DIpqcIJz.js", "imports": ["/assets/chunk-QFMPRPBF-CKC-AdDy.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-Dgyy5-9s.js", "/assets/button-BzD4dEQS.js", "/assets/card-CFdKZ9YC.js", "/assets/badge-BOBE8P4s.js", "/assets/arrow-left-VVe-IVuZ.js", "/assets/loader-circle-B97ViLfp.js", "/assets/globe-BJRi8l2b.js", "/assets/clock-fXwO6rwC.js", "/assets/triangle-alert-CDBYWix3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-5ebe1f8c.js", "version": "5ebe1f8c", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_passThroughRequests": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/auth.google": {
    id: "routes/auth.google",
    parentId: "root",
    path: "auth/google",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/auth.google.callback": {
    id: "routes/auth.google.callback",
    parentId: "root",
    path: "auth/google/callback",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/analytics": {
    id: "routes/analytics",
    parentId: "root",
    path: "analytics",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/inbox": {
    id: "routes/inbox",
    parentId: "root",
    path: "inbox",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/inbox.$leadId": {
    id: "routes/inbox.$leadId",
    parentId: "root",
    path: "inbox/:leadId",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/leads.new": {
    id: "routes/leads.new",
    parentId: "root",
    path: "leads/new",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/verification.criteria": {
    id: "routes/verification.criteria",
    parentId: "root",
    path: "verification/criteria",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/verification.$leadId": {
    id: "routes/verification.$leadId",
    parentId: "root",
    path: "verification/:leadId",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/users": {
    id: "routes/users",
    parentId: "root",
    path: "users",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/users.new": {
    id: "routes/users.new",
    parentId: "root",
    path: "users/new",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/pipeline": {
    id: "routes/pipeline",
    parentId: "root",
    path: "pipeline",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/emails": {
    id: "routes/emails",
    parentId: "root",
    path: "emails",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/emails.templates": {
    id: "routes/emails.templates",
    parentId: "root",
    path: "emails/templates",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/emails.threads.$threadId": {
    id: "routes/emails.threads.$threadId",
    parentId: "root",
    path: "emails/threads/:threadId",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/emails.inbox.$messageId": {
    id: "routes/emails.inbox.$messageId",
    parentId: "root",
    path: "emails/inbox/:messageId",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/leads.$leadId.emails": {
    id: "routes/leads.$leadId.emails",
    parentId: "root",
    path: "leads/:leadId/emails",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/api.leads": {
    id: "routes/api.leads",
    parentId: "root",
    path: "api/leads",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/api.lead-detail": {
    id: "routes/api.lead-detail",
    parentId: "root",
    path: "api/lead-detail",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/api.scraper": {
    id: "routes/api.scraper",
    parentId: "root",
    path: "api/scraper",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/api.diagnostic": {
    id: "routes/api.diagnostic",
    parentId: "root",
    path: "api/diagnostic",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/docs.api": {
    id: "routes/docs.api",
    parentId: "root",
    path: "docs/api",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/imports": {
    id: "routes/imports",
    parentId: "root",
    path: "imports",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/imports.new": {
    id: "routes/imports.new",
    parentId: "root",
    path: "imports/new",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/settings.users": {
    id: "routes/settings.users",
    parentId: "root",
    path: "settings/users",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/settings.database": {
    id: "routes/settings.database",
    parentId: "root",
    path: "settings/database",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/settings.api-keys": {
    id: "routes/settings.api-keys",
    parentId: "root",
    path: "settings/api-keys",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/settings.scoring-rules": {
    id: "routes/settings.scoring-rules",
    parentId: "root",
    path: "settings/scoring-rules",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/settings.stages": {
    id: "routes/settings.stages",
    parentId: "root",
    path: "settings/stages",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/settings.workflows": {
    id: "routes/settings.workflows",
    parentId: "root",
    path: "settings/workflows",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "routes/workflows": {
    id: "routes/workflows",
    parentId: "root",
    path: "workflows",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "routes/workflows.new": {
    id: "routes/workflows.new",
    parentId: "root",
    path: "workflows/new",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  },
  "routes/workflows.$id.edit": {
    id: "routes/workflows.$id.edit",
    parentId: "root",
    path: "workflows/:id/edit",
    index: void 0,
    caseSensitive: void 0,
    module: route37
  },
  "routes/scraper": {
    id: "routes/scraper",
    parentId: "root",
    path: "scraper",
    index: void 0,
    caseSensitive: void 0,
    module: route38
  },
  "routes/scraper.new": {
    id: "routes/scraper.new",
    parentId: "root",
    path: "scraper/new",
    index: void 0,
    caseSensitive: void 0,
    module: route39
  },
  "routes/scraper.$jobId": {
    id: "routes/scraper.$jobId",
    parentId: "root",
    path: "scraper/:jobId",
    index: void 0,
    caseSensitive: void 0,
    module: route40
  }
};
const allowedActionOrigins = false;
export {
  getScoreConfig as a,
  allowedActionOrigins as b,
  serverManifest as c,
  assetsBuildDirectory as d,
  basename as e,
  entry as f,
  getFirstStageName as g,
  future as h,
  isSpaMode as i,
  prerender as j,
  publicPath as k,
  logActivity as l,
  routes as m,
  ssr as n,
  prisma as p,
  routeDiscovery as r,
  scoreLeadWithRules as s
};
