import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, createCookieSessionStorage, useActionData, Form, Link, useLocation, useLoaderData, useSearchParams, useNavigate, useFetcher, useNavigation, data, useRevalidator } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import pkg from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import * as React from "react";
import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { google } from "googleapis";
import { randomBytes } from "crypto";
import { X, LayoutDashboard, UserPlus, Inbox, Kanban, Mail, BarChart3, Upload, Search, Users, ShieldCheck, Settings, LogOut, Menu, TrendingUp, UserCheck, FileCheck, Trophy, XCircle, Target, ChevronDown, Plus, ChevronRight, CheckCircle2, ExternalLink, Snowflake, Sun, Flame, ArrowLeft, CheckCircle, User, Linkedin, Facebook, Instagram, Twitter, Activity, Clock, Send, ArrowUp, ArrowDown, Trash2, CheckSquare, Square, GripVertical, Building2, Pencil, Save, Globe, Link as Link$1, ArrowRight, FileText, AlertCircle, Loader2, MessageSquare, Reply, Bold, Italic, Underline, List, ListOrdered, Pilcrow, PenLine, FileSpreadsheet, Moon, Database, Play, Zap, Check, AlertTriangle } from "lucide-react";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";
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
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
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
async function loader$t() {
  return redirect("/dashboard");
}
const home = UNSAFE_withComponentProps(function Index() {
  return null;
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  loader: loader$t
}, Symbol.toStringTag, { value: "Module" }));
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
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
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
async function loader$s({
  request
}) {
  const session = await getSession(request);
  if (session.get("userId")) {
    return redirect("/dashboard");
  }
  return {};
}
async function action$k({
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
  action: action$k,
  default: login,
  loader: loader$s
}, Symbol.toStringTag, { value: "Module" }));
async function loader$r({
  request
}) {
  const session = await getSession(request);
  if (session.get("userId")) {
    return redirect("/dashboard");
  }
  return {};
}
async function action$j({
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
  action: action$j,
  default: register,
  loader: loader$r
}, Symbol.toStringTag, { value: "Module" }));
async function requireAuth(request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
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
  return userId;
}
async function requireAdmin(request) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  if (!user || user.role !== "ADMIN") {
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
async function loader$q({
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
  loader: loader$q
}, Symbol.toStringTag, { value: "Module" }));
async function loader$p({
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
  loader: loader$p
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
  { to: "/verification/criteria", label: "Criteria", icon: ShieldCheck, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings }
];
function AppShell({ user, children }) {
  var _a, _b;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-1 p-4", children: navItems.filter((item) => !("adminOnly" in item && item.adminOnly) || user.role === "ADMIN").map((item) => {
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
              /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary/20", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-sidebar-primary", children: ((_b = (_a = user.name) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) || user.email[0].toUpperCase() }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 truncate", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-sidebar-foreground", children: user.name || user.email }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-sidebar-foreground/50", children: user.role })
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
async function loader$o({
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
  const [inboxCount, activeCount, emailCount, wonCount] = await Promise.all([prisma.lead.count({
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
  })]);
  return {
    user,
    stats: {
      inboxCount,
      activeCount,
      emailCount,
      wonCount
    }
  };
}
const dashboard = UNSAFE_withComponentProps(function Dashboard() {
  const {
    user,
    stats
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
            children: /* @__PURE__ */ jsx(PipelineBreakdown, {})
          })]
        })]
      })]
    })
  });
});
function PipelineBreakdown() {
  return /* @__PURE__ */ jsx("div", {
    className: "space-y-3 text-sm",
    children: [{
      stage: "Sourced",
      color: "bg-slate-400",
      bar: "bg-slate-400/20"
    }, {
      stage: "Qualified",
      color: "bg-blue-400",
      bar: "bg-blue-400/20"
    }, {
      stage: "First Contact",
      color: "bg-violet-400",
      bar: "bg-violet-400/20"
    }, {
      stage: "Meeting Booked",
      color: "bg-amber-400",
      bar: "bg-amber-400/20"
    }, {
      stage: "Proposal Sent",
      color: "bg-orange-400",
      bar: "bg-orange-400/20"
    }, {
      stage: "Closed Won",
      color: "bg-emerald-400",
      bar: "bg-emerald-400/20"
    }, {
      stage: "Closed Lost",
      color: "bg-red-400",
      bar: "bg-red-400/20"
    }].map((item) => /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-3",
      children: [/* @__PURE__ */ jsx("div", {
        className: `h-3 w-3 rounded-full ${item.color}`
      }), /* @__PURE__ */ jsx("span", {
        className: "flex-1",
        children: item.stage
      }), /* @__PURE__ */ jsx("div", {
        className: `h-2 w-16 rounded-full ${item.bar}`,
        children: /* @__PURE__ */ jsx("div", {
          className: `h-2 w-1/3 rounded-full ${item.color}`
        })
      })]
    }, item.stage))
  });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard,
  loader: loader$o
}, Symbol.toStringTag, { value: "Module" }));
function formatStage(stage) {
  return stage.replace(/_/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
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
const PIPELINE_STAGES = ["SOURCED", "QUALIFIED", "FIRST_CONTACT", "MEETING_BOOKED", "PROPOSAL_SENT", "CLOSED_WON"];
const STAGE_COLORS$1 = {
  SOURCED: "bg-slate-400/20 text-slate-300",
  QUALIFIED: "bg-blue-500/20 text-blue-400",
  FIRST_CONTACT: "bg-violet-500/20 text-violet-400",
  MEETING_BOOKED: "bg-amber-500/20 text-amber-400",
  PROPOSAL_SENT: "bg-orange-500/20 text-orange-400",
  CLOSED_WON: "bg-emerald-500/20 text-emerald-400",
  CLOSED_LOST: "bg-red-500/20 text-red-400"
};
const STAGE_BAR_COLORS = {
  SOURCED: "bg-slate-400/50",
  QUALIFIED: "bg-blue-500/60",
  FIRST_CONTACT: "bg-violet-500/60",
  MEETING_BOOKED: "bg-amber-500/60",
  PROPOSAL_SENT: "bg-orange-500/60",
  CLOSED_WON: "bg-emerald-500/60",
  CLOSED_LOST: "bg-red-500/60"
};
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
    if (!firstArrivalMap.has(key)) {
      firstArrivalMap.set(key, h);
    }
  }
  const dedupedHistory = Array.from(firstArrivalMap.values());
  const stageHistory = startDate || endDate ? dedupedHistory.filter((h) => {
    const t = new Date(h.changedAt).getTime();
    if (startDate && t < startDate.getTime()) return false;
    if (endDate && t > endDate.getTime()) return false;
    return true;
  }) : dedupedHistory;
  const stageCounts = {};
  for (const stage of [...PIPELINE_STAGES, "CLOSED_LOST"]) {
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
    } : {});
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
  return {
    user,
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
    totalEmailsSent
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
      className: "flex gap-1 rounded-lg bg-muted/50 p-1",
      children: [ranges.map((r) => /* @__PURE__ */ jsx(Link, {
        to: `/analytics?range=${r.key}`,
        className: `rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${range === r.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
        children: r.label
      }, r.key)), /* @__PURE__ */ jsx(Link, {
        to: `/analytics?range=custom`,
        className: `rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${isCustom ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
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
          className: "h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1.5",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-xs text-muted-foreground",
          children: "To"
        }), /* @__PURE__ */ jsx("input", {
          type: "date",
          name: "to",
          className: "h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
        })]
      }), /* @__PURE__ */ jsx(Button, {
        type: "submit",
        size: "sm",
        variant: "outline",
        className: "h-8 text-xs",
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
      border: "border-violet-500/20"
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20"
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20"
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20"
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20"
    },
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20"
    },
    slate: {
      bg: "bg-slate-400/10",
      text: "text-slate-300",
      border: "border-slate-400/20"
    }
  };
  const a = accents[accent] || accents.violet;
  return /* @__PURE__ */ jsx(Card, {
    className: `border ${a.border}`,
    children: /* @__PURE__ */ jsx(CardContent, {
      className: "p-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-start justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-2xl font-bold",
            children: value
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-muted-foreground mt-0.5",
            children: label
          }), sub && /* @__PURE__ */ jsx("p", {
            className: "text-[10px] text-muted-foreground/60 mt-0.5",
            children: sub
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: `flex h-9 w-9 items-center justify-center rounded-lg ${a.bg}`,
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
      height: 160
    },
    children: data2.map((d) => /* @__PURE__ */ jsxs("div", {
      className: "flex-1 flex flex-col items-center gap-1",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-end gap-0.5 w-full",
        style: {
          height: 130
        },
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex-1 flex flex-col justify-end",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full rounded-t bg-violet-500/50 min-h-[3px] transition-all",
            style: {
              height: `${d.contacted / maxVal * 100}%`
            }
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1 flex flex-col justify-end",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full rounded-t bg-emerald-500/60 min-h-[3px] transition-all",
            style: {
              height: `${d.won / maxVal * 100}%`
            }
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1 flex flex-col justify-end",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full rounded-t bg-red-500/50 min-h-[3px] transition-all",
            style: {
              height: `${d.lost / maxVal * 100}%`
            }
          })
        })]
      }), /* @__PURE__ */ jsx("span", {
        className: "text-[10px] text-muted-foreground whitespace-nowrap",
        children: d.month
      })]
    }, d.month))
  });
}
function FunnelBar({
  stage,
  count,
  maxCount
}) {
  const width = maxCount > 0 ? Math.max(count / maxCount * 100, count > 0 ? 6 : 0) : 0;
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-center gap-3 group",
    children: [/* @__PURE__ */ jsx("span", {
      className: "text-xs text-muted-foreground w-28 shrink-0 text-right truncate",
      children: formatStage(stage)
    }), /* @__PURE__ */ jsx("div", {
      className: "flex-1 h-8 bg-muted/20 rounded overflow-hidden relative",
      children: count > 0 && /* @__PURE__ */ jsx("div", {
        className: `h-full rounded flex items-center px-2.5 transition-all ${STAGE_BAR_COLORS[stage] || "bg-muted"}`,
        style: {
          width: `${Math.min(width, 100)}%`,
          minWidth: 40
        },
        children: /* @__PURE__ */ jsx("span", {
          className: "text-xs font-semibold whitespace-nowrap",
          children: count
        })
      })
    }), /* @__PURE__ */ jsx("span", {
      className: "text-[10px] text-muted-foreground w-10 shrink-0 text-right",
      children: count
    })]
  });
}
function DataTable({
  rows
}) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsx("div", {
      className: "flex flex-col items-center py-8 text-muted-foreground",
      children: /* @__PURE__ */ jsx("p", {
        className: "text-sm",
        children: "No records found for this period."
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "overflow-x-auto",
    children: /* @__PURE__ */ jsxs("table", {
      className: "w-full text-sm",
      children: [/* @__PURE__ */ jsx("thead", {
        children: /* @__PURE__ */ jsxs("tr", {
          className: "border-b border-border text-left text-[10px] text-muted-foreground uppercase tracking-wider",
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
            children: "Current Stage"
          })]
        })
      }), /* @__PURE__ */ jsx("tbody", {
        className: "divide-y divide-border/40",
        children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
          className: "hover:bg-muted/15 transition-colors",
          children: [/* @__PURE__ */ jsx("td", {
            className: "py-2.5 pr-4",
            children: /* @__PURE__ */ jsx(Link, {
              to: `/inbox/${r.leadId}`,
              className: "font-medium text-violet-400 hover:underline",
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
              className: `text-[10px] ${STAGE_COLORS$1[r.currentStage] || "bg-muted text-muted-foreground"}`,
              children: formatStage(r.currentStage)
            })
          })]
        }, r.id))
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
    className: `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
    children: [label, /* @__PURE__ */ jsx("span", {
      className: `rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-primary-foreground/20" : "bg-muted"}`,
      children: count
    })]
  });
}
const analytics = UNSAFE_withComponentProps(function Analytics() {
  const data2 = useLoaderData();
  const [activeTab, setActiveTab] = useState("won");
  const toRow = (h) => {
    var _a, _b, _c, _d, _e;
    return {
      id: h.id,
      leadId: ((_a = h.lead) == null ? void 0 : _a.id) || "",
      company: ((_b = h.lead) == null ? void 0 : _b.companyName) || "—",
      contact: ((_c = h.lead) == null ? void 0 : _c.contactName) || "",
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
            className: "text-muted-foreground",
            children: "Pipeline performance and outreach metrics"
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
          icon: UserCheck,
          label: "Contacted",
          value: data2.stageCounts["FIRST_CONTACT"],
          sub: "Reached First Contact",
          accent: "violet"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: FileCheck,
          label: "Proposals Sent",
          value: data2.stageCounts["PROPOSAL_SENT"],
          accent: "orange"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Trophy,
          label: "Deals Won",
          value: data2.won,
          accent: "emerald"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: XCircle,
          label: "Deals Lost",
          value: data2.lost,
          accent: "red"
        }), /* @__PURE__ */ jsx(KPICard, {
          icon: Target,
          label: "Win Rate",
          value: `${data2.winRate}%`,
          sub: `${data2.won}W / ${data2.lost}L`,
          accent: "amber"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-5",
        children: [/* @__PURE__ */ jsxs(Card, {
          className: "lg:col-span-3",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Conversion Funnel"
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-2",
            children: PIPELINE_STAGES.map((stage, i) => {
              const count = data2.stageCounts[stage];
              const prevCount = i > 0 ? data2.stageCounts[PIPELINE_STAGES[i - 1]] : 0;
              const maxCount = data2.stageCounts["SOURCED"] || Math.max(...Object.values(data2.stageCounts), 1);
              const convRate = i > 0 && prevCount > 0 && count > 0 ? Math.round(count / prevCount * 100) : null;
              return /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(FunnelBar, {
                  stage,
                  count,
                  maxCount
                }), i < PIPELINE_STAGES.length - 1 && /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 ml-[calc(7rem+0.5rem)] my-0.5",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "h-px flex-1 bg-border/30"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-[10px] text-muted-foreground/60 font-medium",
                    children: convRate !== null ? `${convRate}% conversion` : "—"
                  }), /* @__PURE__ */ jsx(ChevronDown, {
                    className: "h-3 w-3 text-muted-foreground/30"
                  })]
                })]
              }, stage);
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "lg:col-span-2",
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Won vs Lost"
            })
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex gap-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-center",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-3xl font-bold text-emerald-400",
                  children: data2.won
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-emerald-400/70 mt-1",
                  children: "Won"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-3xl font-bold text-red-400",
                  children: data2.lost
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-red-400/70 mt-1",
                  children: "Lost"
                })]
              })]
            }), data2.won + data2.lost > 0 && /* @__PURE__ */ jsxs("div", {
              className: "space-y-1",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex h-2 rounded-full overflow-hidden bg-muted/30",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "bg-emerald-500/70 transition-all",
                  style: {
                    width: `${data2.won / (data2.won + data2.lost) * 100}%`
                  }
                }), /* @__PURE__ */ jsx("div", {
                  className: "bg-red-500/50 transition-all",
                  style: {
                    width: `${data2.lost / (data2.won + data2.lost) * 100}%`
                  }
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex justify-between text-[10px] text-muted-foreground",
                children: [/* @__PURE__ */ jsxs("span", {
                  children: [data2.winRate, "% won"]
                }), /* @__PURE__ */ jsxs("span", {
                  children: [100 - data2.winRate, "% lost"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-1.5 pt-2 border-t border-border/30",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-[10px] text-muted-foreground uppercase tracking-wider font-medium",
                children: "Recent outcomes"
              }), [...data2.wonHistory.slice(0, 3).map((h) => ({
                ...h,
                outcome: "won"
              })), ...data2.lostHistory.slice(0, 3).map((h) => ({
                ...h,
                outcome: "lost"
              }))].sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()).slice(0, 4).map((h) => {
                var _a, _b;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 text-xs",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `h-1.5 w-1.5 rounded-full shrink-0 ${h.outcome === "won" ? "bg-emerald-400" : "bg-red-400"}`
                  }), /* @__PURE__ */ jsx(Link, {
                    to: `/inbox/${(_a = h.lead) == null ? void 0 : _a.id}`,
                    className: "truncate text-foreground/80 hover:text-violet-400 hover:underline flex-1",
                    children: (_b = h.lead) == null ? void 0 : _b.companyName
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-muted-foreground shrink-0",
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
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-2",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Monthly Trends"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-3",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1 text-[10px] text-muted-foreground",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-sm bg-violet-500/50"
                }), " Contacted"]
              }), /* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1 text-[10px] text-muted-foreground",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-sm bg-emerald-500/60"
                }), " Won"]
              }), /* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1 text-[10px] text-muted-foreground",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-sm bg-red-500/50"
                }), " Lost"]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: data2.monthlyTrends.every((m) => m.contacted === 0 && m.won === 0 && m.lost === 0) ? /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center py-8 text-muted-foreground",
            children: [/* @__PURE__ */ jsx(BarChart3, {
              className: "h-8 w-8 mb-2 opacity-30"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm",
              children: "No trend data for this period"
            })]
          }) : /* @__PURE__ */ jsx(GroupedBarChart, {
            data: data2.monthlyTrends
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Lead Sources"
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.leadSources.length === 0 ? /* @__PURE__ */ jsx("p", {
              className: "text-sm text-muted-foreground text-center py-6",
              children: "No lead source data."
            }) : /* @__PURE__ */ jsx("div", {
              className: "space-y-2.5",
              children: data2.leadSources.slice(0, 8).map((s) => /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-xs text-muted-foreground w-24 shrink-0 truncate text-right",
                  children: s.source
                }), /* @__PURE__ */ jsx("div", {
                  className: "flex-1 h-6 bg-muted/20 rounded overflow-hidden",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "h-full rounded bg-violet-500/40 flex items-center px-2 transition-all",
                    style: {
                      width: `${Math.max(s.count / maxSource * 100, 8)}%`
                    },
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-[10px] font-semibold",
                      children: s.count
                    })
                  })
                })]
              }, s.source))
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsx(CardHeader, {
            className: "pb-3",
            children: /* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Team Performance"
            })
          }), /* @__PURE__ */ jsx(CardContent, {
            children: data2.teamStats.length === 0 ? /* @__PURE__ */ jsx("p", {
              className: "text-sm text-muted-foreground text-center py-6",
              children: "No team activity yet."
            }) : /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-[1fr_60px_60px_60px] text-[10px] text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30",
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
                className: "grid grid-cols-[1fr_60px_60px_60px] items-center text-xs py-1.5",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-semibold",
                    children: (t.name || t.email)[0].toUpperCase()
                  }), /* @__PURE__ */ jsx("span", {
                    className: "truncate font-medium",
                    children: t.name || t.email
                  })]
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center text-muted-foreground",
                  children: t.contacted
                }), /* @__PURE__ */ jsx("span", {
                  className: "text-center text-emerald-400 font-medium",
                  children: t.dealsWon
                }), /* @__PURE__ */ jsxs("span", {
                  className: "text-center text-muted-foreground",
                  children: [t.winRate, "%"]
                })]
              }, t.id))]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
              children: "Details"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-1 rounded-lg bg-muted/50 p-0.5",
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
            rows: tabData[activeTab]
          })
        })]
      })]
    })
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: analytics,
  loader: loader$n
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
async function logActivity(input) {
  return prisma.activityLog.create({
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
}
async function loader$m({
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
  return {
    user,
    leads,
    search,
    status,
    tempFilter,
    criteria
  };
}
async function action$i({
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
    criteria
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
                isAdmin
              }, lead.id))
            })]
          })
        })
      })]
    })
  });
});
function StageBadge$1({
  stage
}) {
  const config = {
    SOURCED: {
      classes: "bg-slate-500/15 text-slate-300 border-slate-500/20"
    },
    QUALIFIED: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20"
    },
    FIRST_CONTACT: {
      classes: "bg-violet-500/15 text-violet-400 border-violet-500/20"
    },
    MEETING_BOOKED: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20"
    },
    PROPOSAL_SENT: {
      classes: "bg-orange-500/15 text-orange-400 border-orange-500/20"
    },
    CLOSED_WON: {
      classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
    },
    CLOSED_LOST: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20"
    }
  };
  const c = config[stage] || config.SOURCED;
  return /* @__PURE__ */ jsx("span", {
    className: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
    children: stage.replace(/_/g, " ")
  });
}
function TemperatureBadge$1({
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
  isAdmin
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
        children: /* @__PURE__ */ jsx(TemperatureBadge$1, {
          temperature: lead.temperature
        })
      }), /* @__PURE__ */ jsx("td", {
        className: "px-4 py-3",
        children: /* @__PURE__ */ jsx(StageBadge$1, {
          stage: lead.stage
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
  action: action$i,
  default: inbox,
  loader: loader$m
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
  return {
    user,
    lead,
    users: users2,
    gmailConnected: !!(user == null ? void 0 : user.gmailTokens)
  };
}
async function action$h({
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
  return {};
}
const inbox_$leadId = UNSAFE_withComponentProps(function LeadDetail() {
  var _a;
  const {
    user,
    lead,
    users: users2,
    gmailConnected
  } = useLoaderData();
  const actionData = useActionData();
  const isAdmin = (user == null ? void 0 : user.role) === "ADMIN";
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
              stage: lead.stage
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
              children: /* @__PURE__ */ jsx(CardTitle, {
                children: "Lead Details"
              })
            }), /* @__PURE__ */ jsxs(CardContent, {
              children: [/* @__PURE__ */ jsx("dl", {
                className: "grid gap-4 sm:grid-cols-2",
                children: [["Company", lead.companyName], ["Website", lead.website], ["Contact", lead.contactName], ["Email", lead.email], ["Industry", lead.industry], ["Est. Traffic", lead.estimatedTraffic], ["Tech Stack", lead.techStack], ["Lead Source", lead.leadSource], ["Status", lead.status], ["Stage", lead.stage.replace(/_/g, " ")]].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
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
                  children: [lead.linkedin && /* @__PURE__ */ jsxs("a", {
                    href: lead.linkedin,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors",
                    children: [/* @__PURE__ */ jsx(Linkedin, {
                      className: "h-3.5 w-3.5"
                    }), " LinkedIn"]
                  }), lead.facebook && /* @__PURE__ */ jsxs("a", {
                    href: lead.facebook,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors",
                    children: [/* @__PURE__ */ jsx(Facebook, {
                      className: "h-3.5 w-3.5"
                    }), " Facebook"]
                  }), lead.instagram && /* @__PURE__ */ jsxs("a", {
                    href: lead.instagram,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-1.5 rounded-md border border-pink-500/20 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 hover:bg-pink-500/20 transition-colors",
                    children: [/* @__PURE__ */ jsx(Instagram, {
                      className: "h-3.5 w-3.5"
                    }), " Instagram"]
                  }), lead.twitter && /* @__PURE__ */ jsxs("a", {
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
          }), /* @__PURE__ */ jsxs(Card, {
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
  stage
}) {
  const config = {
    SOURCED: {
      classes: "bg-slate-500/15 text-slate-300 border-slate-500/20"
    },
    QUALIFIED: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20"
    },
    FIRST_CONTACT: {
      classes: "bg-violet-500/15 text-violet-400 border-violet-500/20"
    },
    MEETING_BOOKED: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20"
    },
    PROPOSAL_SENT: {
      classes: "bg-orange-500/15 text-orange-400 border-orange-500/20"
    },
    CLOSED_WON: {
      classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
    },
    CLOSED_LOST: {
      classes: "bg-red-500/15 text-red-400 border-red-500/20"
    }
  };
  const c = config[stage] || config.SOURCED;
  return /* @__PURE__ */ jsx("span", {
    className: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
    children: stage.replace(/_/g, " ")
  });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h,
  default: inbox_$leadId,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
async function loader$k({
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
async function action$g({
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
  const {
    user,
    criteria
  } = useLoaderData();
  const actionData = useActionData();
  useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const successData = searchParams.get("success") === "true" ? {
    leadId: searchParams.get("leadId") || "",
    companyName: searchParams.get("companyName") || "",
    temperature: searchParams.get("temperature") || "COLD",
    score: Number(searchParams.get("score")) || 0,
    maxScore: Number(searchParams.get("maxScore")) || 0,
    percentage: Number(searchParams.get("percentage")) || 0
  } : null;
  useEffect(() => {
    if (successData) {
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    }
  }, [successData]);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl space-y-6",
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
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: "Add New Lead"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Fill out the details and qualification scorecard"
          })]
        })]
      }), successData && /* @__PURE__ */ jsx(Card, {
        className: `border-2 ${successData.temperature === "HOT" ? "border-red-500/40 bg-red-500/5" : successData.temperature === "WARM" ? "border-amber-500/40 bg-amber-500/5" : "border-blue-500/40 bg-blue-500/5"}`,
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center gap-4 p-5",
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: `h-8 w-8 shrink-0 ${successData.temperature === "HOT" ? "text-red-400" : successData.temperature === "WARM" ? "text-amber-400" : "text-blue-400"}`
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex-1",
            children: [/* @__PURE__ */ jsxs("p", {
              className: "font-semibold",
              children: [successData.companyName, " added successfully!"]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Score: ", successData.score, "/", successData.maxScore, " (", successData.percentage, "%) —", " ", /* @__PURE__ */ jsx(TemperatureBadge, {
                temperature: successData.temperature
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2",
            children: [/* @__PURE__ */ jsx(Link, {
              to: `/inbox/${successData.leadId}`,
              children: /* @__PURE__ */ jsx(Button, {
                variant: "outline",
                size: "sm",
                children: "View Lead"
              })
            }), /* @__PURE__ */ jsx(Button, {
              size: "sm",
              onClick: () => {
                setSearchParams({}, {
                  replace: true
                });
              },
              children: "Add Another"
            })]
          })]
        })
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-6",
        children: [(actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
          className: "rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20",
          children: actionData.error
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Point of Contact"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Who are we reaching out to?"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "grid gap-4 sm:grid-cols-2",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "contactName",
                  children: "Contact Name *"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "contactName",
                  name: "contactName",
                  placeholder: "John Smith",
                  required: true
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
                  placeholder: "john@company.com",
                  required: true
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Company Info"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Business details and background"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "grid gap-4 sm:grid-cols-2",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "companyName",
                  children: "Company Name *"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "companyName",
                  name: "companyName",
                  placeholder: "Acme Corp",
                  required: true
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "industry",
                  children: "Industry"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "industry",
                  name: "industry",
                  placeholder: "e.g. SaaS, E-commerce"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "website",
                  children: "Website"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "website",
                  name: "website",
                  placeholder: "https://example.com"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "estimatedTraffic",
                  children: "Est. Monthly Traffic"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "estimatedTraffic",
                  name: "estimatedTraffic",
                  placeholder: "e.g. 10K-50K"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "techStack",
                  children: "Tech Stack"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "techStack",
                  name: "techStack",
                  placeholder: "e.g. WordPress, Shopify"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "leadSource",
                  children: "Lead Source"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "leadSource",
                  name: "leadSource",
                  placeholder: "e.g. LinkedIn, Referral"
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Social Links"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Where to find them online"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "grid gap-4 sm:grid-cols-2",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsxs(Label, {
                  htmlFor: "linkedin",
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(Linkedin, {
                    className: "h-3.5 w-3.5 text-blue-400"
                  }), " LinkedIn"]
                }), /* @__PURE__ */ jsx(Input, {
                  id: "linkedin",
                  name: "linkedin",
                  placeholder: "https://linkedin.com/in/..."
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsxs(Label, {
                  htmlFor: "facebook",
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(Facebook, {
                    className: "h-3.5 w-3.5 text-blue-500"
                  }), " Facebook"]
                }), /* @__PURE__ */ jsx(Input, {
                  id: "facebook",
                  name: "facebook",
                  placeholder: "https://facebook.com/..."
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsxs(Label, {
                  htmlFor: "instagram",
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(Instagram, {
                    className: "h-3.5 w-3.5 text-pink-400"
                  }), " Instagram"]
                }), /* @__PURE__ */ jsx(Input, {
                  id: "instagram",
                  name: "instagram",
                  placeholder: "https://instagram.com/..."
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [/* @__PURE__ */ jsxs(Label, {
                  htmlFor: "twitter",
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(Twitter, {
                    className: "h-3.5 w-3.5 text-sky-400"
                  }), " Twitter / X"]
                }), /* @__PURE__ */ jsx(Input, {
                  id: "twitter",
                  name: "twitter",
                  placeholder: "https://x.com/..."
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Notes"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Any additional context about this lead"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(Textarea, {
              id: "notes",
              name: "notes",
              rows: 3,
              placeholder: "Add notes about this lead..."
            })
          })]
        }), criteria.length > 0 && /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-base",
              children: "Lead Qualification Scorecard"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Answer each criterion to calculate the lead score. Higher scores = hotter leads."
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-4",
            children: criteria.map((c, idx) => /* @__PURE__ */ jsxs("div", {
              className: "rounded-lg border border-border/50 bg-muted/10 p-4 space-y-3",
              children: [/* @__PURE__ */ jsx("input", {
                type: "hidden",
                name: "criteriaId",
                value: c.id
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-start justify-between gap-2",
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsxs("p", {
                    className: "text-sm font-medium",
                    children: [idx + 1, ". ", c.name, c.required && /* @__PURE__ */ jsx("span", {
                      className: "ml-1 text-red-400",
                      children: "*"
                    })]
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
                    required: c.required,
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
                    required: c.required,
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
                    className: `flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors ${cls}`,
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "radio",
                      name: `response_${c.id}`,
                      value: String(score),
                      required: c.required,
                      className: "fixed opacity-0 pointer-events-none"
                    }), score]
                  }, score);
                })
              }), c.type === "TEXT" && /* @__PURE__ */ jsx(Textarea, {
                name: `response_${c.id}`,
                rows: 2,
                placeholder: "Enter your evaluation...",
                required: c.required
              })]
            }, c.id))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between rounded-lg border bg-muted/30 p-4",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/inbox",
            children: /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              children: "Cancel"
            })
          }), /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25",
            children: [/* @__PURE__ */ jsx(UserPlus, {
              className: "mr-2 h-4 w-4"
            }), "Score & Add Lead"]
          })]
        })]
      })]
    })
  });
});
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
    className: `inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: "h-3 w-3"
    }), temperature]
  });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g,
  default: leads_new,
  loader: loader$k
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
async function loader$j({
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
async function action$f({
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
  action: action$f,
  default: verification_criteria,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
async function loader$i({
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
async function action$e({
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
  action: action$e,
  default: verification_$leadId,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
async function loader$h({
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
async function action$d({
  request
}) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "updateRole") {
    const targetUserId = formData.get("userId");
    const newRole = formData.get("role");
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
    const currentUserId = formData.get("currentUserId");
    if (targetUserId === currentUserId) {
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
  action: action$d,
  default: users,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
async function loader$g({
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
async function action$c({
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
  useEffect(() => {
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
  action: action$c,
  default: users_new,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
function LeadCard({ lead, index, draggable = true, onClick, selected = false, onSelect }) {
  return /* @__PURE__ */ jsx(Draggable, { draggableId: lead.id, index, isDragDisabled: !draggable, children: (provided, snapshot) => /* @__PURE__ */ jsx(
    "div",
    {
      ref: provided.innerRef,
      ...provided.draggableProps,
      className: `${snapshot.isDragging ? "opacity-90 shadow-lg" : ""}`,
      children: /* @__PURE__ */ jsx(Card, { className: `cursor-default p-3 transition-all hover:shadow-md ${selected ? "ring-2 ring-primary bg-primary/5" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
        draggable && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onSelect == null ? void 0 : onSelect(lead.id),
            onMouseDown: (e) => e.stopPropagation(),
            className: "mt-0.5 text-muted-foreground hover:text-primary shrink-0",
            title: selected ? "Deselect" : "Select for bulk move",
            children: selected ? /* @__PURE__ */ jsx(CheckSquare, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsx(Square, { className: "h-4 w-4" })
          }
        ),
        draggable && /* @__PURE__ */ jsx(
          "div",
          {
            ...provided.dragHandleProps,
            className: "mt-1 cursor-grab text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onClick == null ? void 0 : onClick(lead.id),
              onMouseDown: (e) => e.stopPropagation(),
              className: "truncate text-sm font-medium hover:underline text-left",
              children: lead.companyName
            }
          ) }),
          lead.contactName && /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: lead.contactName }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
            lead.industry && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[10px] px-1.5 py-0", children: lead.industry }),
            /* @__PURE__ */ jsx("div", { className: "ml-auto flex gap-1", children: /* @__PURE__ */ jsx(Link, { to: `/leads/${lead.id}/emails`, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", children: /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }) }) }) })
          ] })
        ] })
      ] }) })
    }
  ) });
}
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
const STAGE_COLORS = {
  SOURCED: "bg-slate-500/20 text-slate-300",
  QUALIFIED: "bg-blue-500/20 text-blue-300",
  FIRST_CONTACT: "bg-violet-500/20 text-violet-300",
  MEETING_BOOKED: "bg-amber-500/20 text-amber-300",
  PROPOSAL_SENT: "bg-orange-500/20 text-orange-300",
  CLOSED_WON: "bg-emerald-500/20 text-emerald-300",
  CLOSED_LOST: "bg-red-500/20 text-red-300"
};
function LeadDetailModal({
  lead,
  open,
  onOpenChange,
  onSave,
  saving
}) {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    setEditing(false);
  }, [lead == null ? void 0 : lead.id]);
  if (!lead) return null;
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
              className: `mt-1 ${STAGE_COLORS[lead.stage] || "bg-muted text-muted-foreground"}`,
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
            var _a, _b;
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
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: ((_a = s.changedBy) == null ? void 0 : _a.name) || ((_b = s.changedBy) == null ? void 0 : _b.email) || "Unknown" }),
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
const STAGES = [{
  id: "SOURCED",
  label: "Sourced",
  color: "border-t-slate-400",
  bg: "bg-slate-500/10",
  dot: "bg-slate-400"
}, {
  id: "QUALIFIED",
  label: "Qualified",
  color: "border-t-blue-400",
  bg: "bg-blue-500/10",
  dot: "bg-blue-400"
}, {
  id: "FIRST_CONTACT",
  label: "First Contact",
  color: "border-t-violet-400",
  bg: "bg-violet-500/10",
  dot: "bg-violet-400"
}, {
  id: "MEETING_BOOKED",
  label: "Meeting Booked",
  color: "border-t-amber-400",
  bg: "bg-amber-500/10",
  dot: "bg-amber-400"
}, {
  id: "PROPOSAL_SENT",
  label: "Proposal Sent",
  color: "border-t-orange-400",
  bg: "bg-orange-500/10",
  dot: "bg-orange-400"
}, {
  id: "CLOSED_WON",
  label: "Closed Won",
  color: "border-t-emerald-400",
  bg: "bg-emerald-500/10",
  dot: "bg-emerald-400"
}, {
  id: "CLOSED_LOST",
  label: "Closed Lost",
  color: "border-t-red-400",
  bg: "bg-red-500/10",
  dot: "bg-red-400"
}];
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
  const leads = await prisma.lead.findMany({
    where: {
      status: "ACTIVE"
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
  const grouped = STAGES.map((stage) => ({
    ...stage,
    leads: leads.filter((l) => l.stage === stage.id)
  }));
  return {
    user,
    stages: grouped
  };
}
async function action$b({
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
    const operations = [];
    for (const lead of leads) {
      if (lead.stage === newStage) continue;
      operations.push(prisma.lead.update({
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
      }), logActivity({
        leadId: lead.id,
        userId,
        action: "STAGE_CHANGED",
        description: `${currentUser.name || "Unknown"} moved from ${formatStage(lead.stage)} to ${formatStage(newStage)}`,
        metadata: {
          fromStage: lead.stage,
          toStage: newStage
        }
      }));
    }
    await prisma.$transaction(operations.filter(Boolean));
    return {
      success: true
    };
  }
  return {};
}
const pipeline = UNSAFE_withComponentProps(function Pipeline() {
  const {
    user,
    stages
  } = useLoaderData();
  const [localStages, setLocalStages] = useState(stages);
  const [selectedIds, setSelectedIds] = useState(/* @__PURE__ */ new Set());
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const detailFetcher = useFetcher();
  useEffect(() => {
    setLocalStages(stages);
  }, [stages]);
  useEffect(() => {
    var _a;
    if ((_a = detailFetcher.data) == null ? void 0 : _a.lead) {
      setSelectedLead(detailFetcher.data.lead);
      if (!detailFetcher.data.edited) {
        setModalOpen(true);
      }
      if (detailFetcher.data.edited) {
        const updated = detailFetcher.data.lead;
        setLocalStages((prev) => prev.map((stage) => ({
          ...stage,
          leads: stage.leads.map((l) => l.id === updated.id ? {
            ...l,
            ...updated
          } : l)
        })));
      }
    }
  }, [detailFetcher.data]);
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
  const onDragEnd = useCallback(async (result) => {
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
    setSelectedIds(/* @__PURE__ */ new Set());
    if (idsToMove.length === 1) {
      const formData = new FormData();
      formData.set("intent", "moveStage");
      formData.set("leadId", idsToMove[0]);
      formData.set("newStage", newStage);
      await fetch("/pipeline", {
        method: "POST",
        body: formData
      });
    } else {
      const formData = new FormData();
      formData.set("intent", "bulkMoveStage");
      formData.set("leadIds", JSON.stringify(idsToMove));
      formData.set("newStage", newStage);
      await fetch("/pipeline", {
        method: "POST",
        body: formData
      });
    }
  }, [user == null ? void 0 : user.role, selectedIds]);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Pipeline"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Select leads with checkboxes, then drag to move. Click a company name for details."
          })]
        }), selectedIds.size > 0 && /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsxs(Badge, {
            variant: "secondary",
            className: "text-sm px-3 py-1",
            children: [selectedIds.size, " selected"]
          }), /* @__PURE__ */ jsxs(Button, {
            variant: "ghost",
            size: "sm",
            onClick: clearSelection,
            className: "h-7 px-2",
            children: [/* @__PURE__ */ jsx(X, {
              className: "h-3.5 w-3.5 mr-1"
            }), "Clear"]
          })]
        })]
      }), /* @__PURE__ */ jsx(DragDropContext, {
        onDragEnd,
        children: /* @__PURE__ */ jsx("div", {
          className: "flex gap-4 overflow-x-auto pb-4",
          children: localStages.map((stage) => /* @__PURE__ */ jsxs("div", {
            className: "flex w-72 shrink-0 flex-col",
            children: [/* @__PURE__ */ jsx("div", {
              className: `rounded-t-lg border border-b-0 p-3 ${stage.color} ${stage.bg}`,
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: `h-2 w-2 rounded-full ${stage.dot}`
                  }), /* @__PURE__ */ jsx("h3", {
                    className: "text-sm font-semibold text-card-foreground",
                    children: stage.label
                  })]
                }), /* @__PURE__ */ jsx(Badge, {
                  variant: "secondary",
                  className: "text-xs text-secondary-foreground",
                  children: stage.leads.length
                })]
              })
            }), /* @__PURE__ */ jsx(Droppable, {
              droppableId: stage.id,
              children: (provided, snapshot) => /* @__PURE__ */ jsxs("div", {
                ref: provided.innerRef,
                ...provided.droppableProps,
                className: `flex-1 space-y-2 rounded-b-lg border border-t-0 bg-muted/30 p-2 transition-colors min-h-[200px] ${snapshot.isDraggingOver ? "bg-muted/60" : ""}`,
                children: [stage.leads.map((lead, index) => /* @__PURE__ */ jsx(LeadCard, {
                  lead,
                  index,
                  draggable: (user == null ? void 0 : user.role) === "ADMIN",
                  onClick: handleLeadClick,
                  selected: selectedIds.has(lead.id),
                  onSelect: handleSelect
                }, lead.id)), provided.placeholder]
              })
            })]
          }, stage.id))
        })
      }), /* @__PURE__ */ jsx(LeadDetailModal, {
        lead: selectedLead,
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
  action: action$b,
  default: pipeline,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
async function loader$e({
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
      const message = err instanceof Error ? err.message : "Failed to fetch Gmail inbox.";
      inboxError = message;
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
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      icon: Send
    },
    REPLIED: {
      classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      icon: MessageSquare
    },
    WAITING: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: Clock
    }
  };
  const c = config[status] || config.SENT;
  const Icon = c.icon;
  return /* @__PURE__ */ jsxs("span", {
    className: `inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`,
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
    className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
    children: [/* @__PURE__ */ jsx(Icon, {
      className: "h-4 w-4"
    }), label, count !== void 0 && count > 0 && /* @__PURE__ */ jsx("span", {
      className: `rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`,
      children: count
    })]
  });
}
function GmailInboxRow({
  msg
}) {
  const isUnread = msg.labelIds.includes("UNREAD");
  return /* @__PURE__ */ jsxs(Link, {
    to: `/emails/inbox/${msg.id}`,
    className: "flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 cursor-pointer",
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10",
      children: /* @__PURE__ */ jsx(Mail, {
        className: "h-5 w-5 text-violet-400"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "min-w-0 flex-1",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */ jsx("span", {
          className: `text-sm truncate ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`,
          children: msg.from.split("<")[0].trim()
        }), isUnread && /* @__PURE__ */ jsx("span", {
          className: "h-2 w-2 rounded-full bg-blue-400 shrink-0"
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: `text-sm truncate ${isUnread ? "font-medium text-foreground" : "text-foreground/80"}`,
        children: msg.subject
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-0.5 truncate text-xs text-muted-foreground",
        children: msg.snippet
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "shrink-0 text-right",
      children: /* @__PURE__ */ jsx("span", {
        className: "text-xs text-muted-foreground",
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
    className: "block cursor-pointer",
    children: /* @__PURE__ */ jsx(Card, {
      className: "transition-all hover:bg-muted/30 hover:border-border",
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "flex items-center gap-4 p-4",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10",
          children: /* @__PURE__ */ jsx(Send, {
            className: "h-5 w-5 text-blue-400"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [thread.lead && /* @__PURE__ */ jsx("span", {
              className: "text-sm font-medium text-violet-400 hover:text-violet-300",
              children: thread.lead.companyName
            }), /* @__PURE__ */ jsx(StatusBadge$1, {
              status: thread.status
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm font-medium text-foreground/80 truncate",
            children: thread.subject
          }), thread.snippet && /* @__PURE__ */ jsx("p", {
            className: "mt-0.5 truncate text-xs text-muted-foreground",
            children: thread.snippet
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "shrink-0 text-right",
          children: [messageCount > 1 && /* @__PURE__ */ jsxs("p", {
            className: "text-xs text-muted-foreground mb-0.5",
            children: [messageCount, " messages"]
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs text-muted-foreground",
            children: new Date(thread.lastMessage).toLocaleDateString()
          })]
        }), /* @__PURE__ */ jsx(ArrowRight, {
          className: "h-4 w-4 text-muted-foreground/50 shrink-0"
        })]
      })
    })
  });
}
function LoadingSpinner() {
  return /* @__PURE__ */ jsx(Card, {
    children: /* @__PURE__ */ jsxs(CardContent, {
      className: "flex flex-col items-center justify-center py-16",
      children: [/* @__PURE__ */ jsx(Loader2, {
        className: "h-8 w-8 animate-spin text-muted-foreground"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-3 text-sm text-muted-foreground",
        children: "Loading emails..."
      })]
    })
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
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl font-bold tracking-tight",
            children: "Email Hub"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Track email conversations and outreach"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex gap-2",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/emails/templates",
            children: /* @__PURE__ */ jsxs(Button, {
              className: "bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25",
              children: [/* @__PURE__ */ jsx(FileText, {
                className: "mr-2 h-4 w-4"
              }), "Templates"]
            })
          })
        })]
      }), /* @__PURE__ */ jsx(Card, {
        className: `border-l-4 ${gmailConnected ? "border-l-emerald-500" : "border-l-amber-500"}`,
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center justify-between p-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: `flex h-10 w-10 items-center justify-center rounded-lg ${gmailConnected ? "bg-emerald-500/10" : "bg-amber-500/10"}`,
              children: /* @__PURE__ */ jsx(Mail, {
                className: `h-5 w-5 ${gmailConnected ? "text-emerald-400" : "text-amber-400"}`
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium",
                children: "Gmail Integration"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: gmailConnected ? "Connected and ready to send emails" : "Connect your Gmail account in Settings to send emails and view inbox"
              })]
            })]
          }), !gmailConnected && /* @__PURE__ */ jsx(Link, {
            to: "/settings",
            children: /* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "outline",
              children: "Connect"
            })
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex gap-1 rounded-lg bg-muted/50 p-1",
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
              className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            }), /* @__PURE__ */ jsx(Input, {
              name: "q",
              placeholder: "Search emails...",
              defaultValue: search,
              className: "pl-9 w-64"
            })]
          }), search && /* @__PURE__ */ jsx(Button, {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: clearSearch,
            children: "Clear"
          })]
        })]
      }), isLoading ? /* @__PURE__ */ jsx(LoadingSpinner, {}) : tab === "all" ? (
        /* All tab: combine Gmail inbox + DB threads */
        /* @__PURE__ */ jsxs("div", {
          className: "space-y-3",
          children: [gmailConnected && gmailMessages.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("p", {
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wider px-1",
              children: ["Gmail Inbox (", gmailMessages.length, ")"]
            }), /* @__PURE__ */ jsx(Card, {
              children: /* @__PURE__ */ jsx("div", {
                className: "divide-y divide-border/50",
                children: gmailMessages.map((msg) => /* @__PURE__ */ jsx(GmailInboxRow, {
                  msg
                }, msg.id))
              })
            })]
          }), gmailConnected && inboxError && /* @__PURE__ */ jsx(Card, {
            className: "border-destructive/30",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex items-center gap-3 p-3",
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                className: "h-4 w-4 text-destructive shrink-0"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: ["Could not load Gmail inbox: ", inboxError]
              })]
            })
          }), filteredThreads.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("p", {
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 pt-2",
              children: ["Sent from CRM (", filteredThreads.length, ")"]
            }), filteredThreads.map((thread) => /* @__PURE__ */ jsx(ThreadRow, {
              thread
            }, thread.id))]
          }), !gmailConnected && filteredThreads.length === 0 && /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-12",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10",
                children: /* @__PURE__ */ jsx(Mail, {
                  className: "h-8 w-8 text-blue-400"
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 font-medium",
                children: "No emails yet"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Connect Gmail to see your inbox, or send an email from a lead's profile."
              })]
            })
          }), gmailConnected && gmailMessages.length === 0 && filteredThreads.length === 0 && !inboxError && /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-12",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10",
                children: /* @__PURE__ */ jsx(Mail, {
                  className: "h-8 w-8 text-blue-400"
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 font-medium",
                children: "No emails yet"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Send an email from a lead's profile to get started."
              })]
            })
          })]
        })
      ) : tab === "inbox" ? (
        // Gmail Inbox tab (dedicated)
        /* @__PURE__ */ jsx("div", {
          className: "space-y-2",
          children: !gmailConnected ? /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-12",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10",
                children: /* @__PURE__ */ jsx(AlertCircle, {
                  className: "h-8 w-8 text-amber-400"
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 font-medium",
                children: "Gmail not connected"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Connect your Gmail account to view your inbox here."
              }), /* @__PURE__ */ jsx(Link, {
                to: "/settings",
                className: "mt-4",
                children: /* @__PURE__ */ jsx(Button, {
                  variant: "outline",
                  children: "Go to Settings"
                })
              })]
            })
          }) : inboxError ? /* @__PURE__ */ jsx(Card, {
            className: "border-destructive/50",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-12",
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                className: "h-8 w-8 text-destructive"
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 font-medium text-destructive",
                children: "Failed to load inbox"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: inboxError
              })]
            })
          }) : gmailMessages.length === 0 ? /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-12",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10",
                children: /* @__PURE__ */ jsx(Inbox, {
                  className: "h-8 w-8 text-violet-400"
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 font-medium",
                children: "Inbox is empty"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: search ? "No messages match your search." : "No messages in your Gmail inbox."
              })]
            })
          }) : /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsx("div", {
              className: "divide-y divide-border/50",
              children: gmailMessages.map((msg) => /* @__PURE__ */ jsx(GmailInboxRow, {
                msg
              }, msg.id))
            })
          })
        })
      ) : (
        // DB thread tabs (Sent / Drafts)
        /* @__PURE__ */ jsx("div", {
          className: "space-y-3",
          children: filteredThreads.length === 0 ? /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "flex flex-col items-center justify-center py-12",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10",
                children: /* @__PURE__ */ jsx(Mail, {
                  className: "h-8 w-8 text-blue-400"
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 font-medium",
                children: tab === "drafts" ? "No drafts yet" : search ? "No threads match your search" : "No sent emails yet"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: tab === "drafts" ? "Draft emails will appear here." : "Send an email from a lead's profile to get started."
              })]
            })
          }) : filteredThreads.map((thread) => /* @__PURE__ */ jsx(ThreadRow, {
            thread
          }, thread.id))
        })
      )]
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: emails,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
async function loader$d({
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
      createdAt: "desc"
    }
  });
  return {
    user,
    templates
  };
}
async function action$a({
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
const emails_templates = UNSAFE_withComponentProps(function EmailTemplates() {
  const {
    user,
    templates
  } = useLoaderData();
  useActionData();
  const [showForm, setShowForm] = useState(false);
  return /* @__PURE__ */ jsx(AppShell, {
    user,
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/emails",
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
            children: "Email Templates"
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-muted-foreground",
            children: ["Use ", /* @__PURE__ */ jsx("code", {
              className: "text-xs bg-muted px-1 py-0.5 rounded",
              children: "{{variable}}"
            }), " for dynamic placeholders like ", /* @__PURE__ */ jsx("code", {
              className: "text-xs bg-muted px-1 py-0.5 rounded",
              children: "{{company_name}}"
            }), ",", " ", /* @__PURE__ */ jsx("code", {
              className: "text-xs bg-muted px-1 py-0.5 rounded",
              children: "{{contact_name}}"
            }), ",", " ", /* @__PURE__ */ jsx("code", {
              className: "text-xs bg-muted px-1 py-0.5 rounded",
              children: "{{industry}}"
            })]
          })]
        }), /* @__PURE__ */ jsxs(Button, {
          onClick: () => setShowForm(!showForm),
          children: [/* @__PURE__ */ jsx(Plus, {
            className: "mr-2 h-4 w-4"
          }), "New Template"]
        })]
      }), showForm && /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsx(CardTitle, {
            children: "Create Template"
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "create"
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid gap-4 sm:grid-cols-2",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "name",
                  children: "Template Name"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "name",
                  name: "name",
                  placeholder: "e.g. Cold Outreach",
                  required: true
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
                  required: true
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "body",
                children: "Email Body"
              }), /* @__PURE__ */ jsx(Textarea, {
                id: "body",
                name: "body",
                rows: 8,
                placeholder: "Hi {{contact_name}}...",
                required: true
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-end gap-2",
              children: [/* @__PURE__ */ jsx(Button, {
                type: "button",
                variant: "outline",
                onClick: () => setShowForm(false),
                children: "Cancel"
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                children: "Create Template"
              })]
            })]
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-4",
        children: templates.map((template) => /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-4",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-start justify-between",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex-1",
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "font-medium",
                  children: template.name
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: ["Subject: ", template.subject]
                }), /* @__PURE__ */ jsx("pre", {
                  className: "mt-2 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-3",
                  children: template.body
                })]
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
                  children: /* @__PURE__ */ jsx(Trash2, {
                    className: "h-4 w-4 text-destructive"
                  })
                })]
              })]
            })
          })
        }, template.id))
      })]
    })
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: emails_templates,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
async function loader$c({
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
async function action$9({
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
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/emails",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
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
            className: "flex items-center gap-2 mt-1",
            children: [thread.lead && /* @__PURE__ */ jsx(Link, {
              to: `/leads/${thread.lead.id}/emails`,
              className: "text-sm text-violet-400 hover:underline",
              children: thread.lead.companyName
            }), /* @__PURE__ */ jsx(Badge, {
              variant: thread.status === "REPLIED" ? "success" : thread.status === "WAITING" ? "warning" : "secondary",
              children: thread.status
            })]
          })]
        }), gmailConnected && ((_a = thread.lead) == null ? void 0 : _a.email) && /* @__PURE__ */ jsxs(Button, {
          onClick: () => setReplyOpen(!replyOpen),
          children: [/* @__PURE__ */ jsx(Reply, {
            className: "mr-2 h-4 w-4"
          }), "Reply"]
        })]
      }), replyOpen && /* @__PURE__ */ jsxs(Card, {
        className: "border-blue-500/30",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "pb-3",
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "text-sm",
            children: ["Reply to ", ((_b = thread.lead) == null ? void 0 : _b.contactName) || ((_c = thread.lead) == null ? void 0 : _c.email) || "lead"]
          })
        }), /* @__PURE__ */ jsx(CardContent, {
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
              autoFocus: true
            }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", {
              className: "text-sm text-destructive",
              children: actionData.error
            }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", {
              className: "text-sm text-emerald-400",
              children: "Reply sent!"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-2",
              children: [/* @__PURE__ */ jsxs(Button, {
                type: "submit",
                size: "sm",
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
        className: "space-y-4",
        children: thread.messages.length === 0 ? /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex flex-col items-center py-12",
            children: [/* @__PURE__ */ jsx(Mail, {
              className: "h-10 w-10 text-muted-foreground/50"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-3 text-muted-foreground",
              children: "No messages in this thread."
            })]
          })
        }) : thread.messages.map((msg, i) => /* @__PURE__ */ jsxs("div", {
          className: `rounded-lg border ${msg.direction === "sent" ? "border-blue-500/20 bg-blue-500/5" : "border-border bg-card"}`,
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between border-b border-border/30 px-4 py-2.5",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${msg.direction === "sent" ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"}`,
                children: msg.direction === "sent" ? (msg.fromAddress || "You")[0].toUpperCase() : (msg.fromAddress || "?")[0].toUpperCase()
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-medium",
                children: msg.direction === "sent" ? "You" : msg.fromAddress
              })]
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs text-muted-foreground",
              children: msg.sentAt ? new Date(msg.sentAt).toLocaleString() : new Date(msg.createdAt).toLocaleString()
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "px-4 py-3",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-sm whitespace-pre-wrap text-foreground/90",
              children: msg.bodyPlain || msg.snippet || "(No content)"
            })
          })]
        }, msg.id))
      })]
    })
  });
});
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: emails_threads_$threadId,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function loader$b({
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
async function action$8({
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
  if (html) {
    const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 12px; background: #fff; word-wrap: break-word; }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  table { max-width: 100%; }
</style>
</head>
<body>${html}</body>
</html>`;
    return /* @__PURE__ */ jsx("iframe", {
      ref: iframeRef,
      srcDoc: srcdoc,
      sandbox: "allow-same-origin",
      title: "Email content",
      className: "w-full border-0 rounded-md",
      style: {
        minHeight: "200px"
      },
      onLoad: () => {
        if (iframeRef.current) {
          try {
            const doc = iframeRef.current.contentDocument;
            if (doc == null ? void 0 : doc.body) {
              iframeRef.current.style.height = doc.body.scrollHeight + 24 + "px";
            }
          } catch {
          }
        }
      }
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed",
    children: plain || "(No content)"
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
      className: "space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/emails?tab=inbox",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
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
            className: "flex items-center gap-2 mt-1",
            children: [/* @__PURE__ */ jsxs("span", {
              className: "text-sm text-muted-foreground",
              children: ["From: ", msg.from]
            }), matchedLead && /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground",
                children: "·"
              }), /* @__PURE__ */ jsx(Link, {
                to: `/leads/${matchedLead.id}/emails`,
                className: "text-sm text-violet-400 hover:underline",
                children: matchedLead.companyName
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(Button, {
          onClick: () => setReplyOpen(!replyOpen),
          children: [/* @__PURE__ */ jsx(Reply, {
            className: "mr-2 h-4 w-4"
          }), "Reply"]
        })]
      }), matchedLead && !existingThread && /* @__PURE__ */ jsx(Card, {
        className: "border-l-4 border-l-violet-500",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center gap-3 p-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10",
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
        })
      }), replyOpen && /* @__PURE__ */ jsx(Card, {
        className: "border-blue-500/30",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "pt-4 space-y-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "grid gap-2",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-[auto_1fr] gap-2 items-center text-sm",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground text-xs font-medium",
                children: "To"
              }), /* @__PURE__ */ jsx("span", {
                children: senderEmail
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-[auto_1fr] gap-2 items-center text-sm",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground text-xs font-medium",
                children: "Subject"
              }), /* @__PURE__ */ jsx("span", {
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
              className: "text-sm"
            }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", {
              className: "text-sm text-destructive",
              children: actionData.error
            }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", {
              className: "text-sm text-emerald-400",
              children: "Reply sent!"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-2",
              children: [/* @__PURE__ */ jsxs(Button, {
                type: "submit",
                size: "sm",
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
        })
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx("div", {
          className: "border-b border-border/30 px-4 py-2.5",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-sm font-semibold",
                children: (msg.from[0] || "?").toUpperCase()
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium",
                  children: msg.from
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["To: ", msg.to]
                })]
              })]
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs text-muted-foreground",
              children: new Date(msg.date).toLocaleString()
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "p-2",
          children: /* @__PURE__ */ jsx(EmailBody, {
            html: msg.bodyHtml,
            plain: msg.bodyPlain || msg.snippet
          })
        })]
      }), existingThread && existingThread.messages.length > 0 && /* @__PURE__ */ jsxs("div", {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-sm font-medium text-muted-foreground",
          children: "Previous messages in this thread"
        }), existingThread.messages.map((m) => /* @__PURE__ */ jsxs("div", {
          className: `rounded-lg border ${m.direction === "sent" ? "border-blue-500/20 bg-blue-500/5" : "border-border bg-card"}`,
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between border-b border-border/30 px-4 py-2",
            children: [/* @__PURE__ */ jsx("span", {
              className: "text-sm font-medium",
              children: m.direction === "sent" ? "You" : m.fromAddress
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs text-muted-foreground",
              children: m.sentAt ? new Date(m.sentAt).toLocaleString() : new Date(m.createdAt).toLocaleString()
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "px-4 py-3",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-sm whitespace-pre-wrap text-foreground/90",
              children: m.bodyPlain || m.snippet || "(No content)"
            })
          })]
        }, m.id))]
      })]
    })
  });
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: emails_inbox_$messageId,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
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
  template.innerHTML = html;
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
          isInternalChange.current = true;
          editorRef.current.innerHTML = html;
          onChange(html);
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
    useEffect(() => {
      if (editorRef.current && !isInternalChange.current) {
        if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value;
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
async function loader$a({
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
async function action$7({
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
    var _a, _b;
    setSelectedTemplate(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setSubject(parsePreview(tmpl.subject));
      const htmlBody = parsePreview(tmpl.body).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
      setBodyHtml(htmlBody);
      (_a = editorRef.current) == null ? void 0 : _a.setHTML(htmlBody);
    } else {
      setSubject("");
      setBodyHtml("");
      (_b = editorRef.current) == null ? void 0 : _b.setHTML("");
    }
  };
  const handleInsertSignature = () => {
    if (gmailSignature && editorRef.current) {
      editorRef.current.appendHTML(`<br><br>${gmailSignature}`);
    }
  };
  const previewSrcDoc = bodyHtml ? buildPreviewHtml(gmailSignature && !bodyHtml.includes(gmailSignature) ? `${bodyHtml}<br><br>${gmailSignature}` : bodyHtml) : "";
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
          children: [/* @__PURE__ */ jsxs("h1", {
            className: "text-2xl font-bold tracking-tight",
            children: ["Email: ", lead.companyName]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: lead.contactName || lead.email
          })]
        })]
      }), !gmailConnected && /* @__PURE__ */ jsx(Card, {
        className: "border-amber-500/50",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex items-center gap-3 p-4",
          children: [/* @__PURE__ */ jsx(Badge, {
            variant: "warning",
            children: "Gmail Not Connected"
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-muted-foreground",
            children: ["Connect your Gmail account in", " ", /* @__PURE__ */ jsx(Link, {
              to: "/settings",
              className: "underline hover:text-foreground",
              children: "Settings"
            }), " ", "to send emails."]
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsx("div", {
          className: "space-y-4",
          children: /* @__PURE__ */ jsxs(Card, {
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsx(CardTitle, {
                className: "text-lg",
                children: "Compose"
              })
            }), /* @__PURE__ */ jsx(CardContent, {
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
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    children: "To"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm rounded-md bg-muted/50 px-3 py-2 truncate",
                    children: lead.email || "No email address"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx(Label, {
                    children: "Load Template"
                  }), /* @__PURE__ */ jsxs(Select, {
                    value: selectedTemplate,
                    onChange: (e) => handleTemplateChange(e.target.value),
                    children: [/* @__PURE__ */ jsx("option", {
                      value: "",
                      children: "Choose a template..."
                    }), templates.map((t) => /* @__PURE__ */ jsx("option", {
                      value: t.id,
                      children: t.name
                    }, t.id))]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx(Label, {
                    children: "Subject"
                  }), /* @__PURE__ */ jsx(Input, {
                    name: "subject",
                    value: subject,
                    onChange: (e) => setSubject(e.target.value),
                    placeholder: "Email subject...",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [/* @__PURE__ */ jsx(Label, {
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
                    placeholder: "Write your message..."
                  })]
                }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("div", {
                  className: "rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400",
                  children: "Email sent successfully!"
                }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", {
                  className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive",
                  children: actionData.error
                }), /* @__PURE__ */ jsxs(Button, {
                  type: "submit",
                  className: "w-full",
                  disabled: !gmailConnected || !subject.trim() || !bodyHtml.replace(/<[^>]*>/g, "").trim(),
                  children: [/* @__PURE__ */ jsx(Send, {
                    className: "mr-2 h-4 w-4"
                  }), "Send Email"]
                })]
              })
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Preview"
              }), gmailSignature && /* @__PURE__ */ jsx("span", {
                className: "text-xs text-muted-foreground",
                children: "with signature"
              })]
            }), /* @__PURE__ */ jsx(Card, {
              className: "overflow-hidden",
              children: previewSrcDoc ? /* @__PURE__ */ jsx("iframe", {
                ref: previewRef,
                srcDoc: previewSrcDoc,
                sandbox: "allow-same-origin",
                title: "Email preview",
                className: "w-full border-0 bg-white",
                style: {
                  minHeight: "200px"
                },
                onLoad: () => {
                  if (previewRef.current) {
                    try {
                      const doc = previewRef.current.contentDocument;
                      if (doc == null ? void 0 : doc.body) {
                        previewRef.current.style.height = doc.body.scrollHeight + 24 + "px";
                      }
                    } catch {
                    }
                  }
                }
              }) : /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col items-center justify-center py-16",
                children: [/* @__PURE__ */ jsx(Send, {
                  className: "h-10 w-10 text-muted-foreground/20"
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-3 text-muted-foreground text-sm",
                  children: "Start typing to see a preview"
                })]
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("h3", {
              className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2",
              children: ["Email History", emails2.length > 0 && /* @__PURE__ */ jsxs("span", {
                className: "ml-2 font-normal",
                children: ["(", emails2.length, ")"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-2",
              children: emails2.length === 0 ? /* @__PURE__ */ jsx(Card, {
                children: /* @__PURE__ */ jsx(CardContent, {
                  className: "flex flex-col items-center justify-center py-8",
                  children: /* @__PURE__ */ jsx("p", {
                    className: "text-muted-foreground text-sm",
                    children: "No emails sent yet."
                  })
                })
              }) : emails2.map((thread) => {
                const isExpanded = expandedThread === thread.id;
                return /* @__PURE__ */ jsxs(Card, {
                  className: "overflow-hidden",
                  children: [/* @__PURE__ */ jsx("button", {
                    type: "button",
                    className: "w-full text-left p-3 hover:bg-muted/30 transition-colors",
                    onClick: () => setExpandedThread(isExpanded ? null : thread.id),
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center justify-between gap-3",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "min-w-0 flex-1",
                        children: [/* @__PURE__ */ jsx("p", {
                          className: "text-sm font-medium truncate",
                          children: thread.subject
                        }), /* @__PURE__ */ jsx("div", {
                          className: "flex items-center gap-2 mt-0.5",
                          children: /* @__PURE__ */ jsx(Badge, {
                            variant: thread.status === "REPLIED" ? "success" : thread.status === "WAITING" ? "warning" : "secondary",
                            children: thread.status
                          })
                        })]
                      }), /* @__PURE__ */ jsx("span", {
                        className: "text-xs text-muted-foreground shrink-0",
                        children: new Date(thread.lastMessage).toLocaleDateString()
                      })]
                    })
                  }), isExpanded && thread.messages.length > 0 && /* @__PURE__ */ jsx("div", {
                    className: "border-t border-border/50",
                    children: thread.messages.map((msg, i) => /* @__PURE__ */ jsxs("div", {
                      className: `px-3 py-2 text-sm ${i > 0 ? "border-t border-border/30" : ""} ${msg.direction === "sent" ? "bg-blue-500/5" : "bg-muted/20"}`,
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center justify-between mb-1",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "text-xs font-medium text-muted-foreground",
                          children: msg.direction === "sent" ? "You" : msg.fromAddress
                        }), /* @__PURE__ */ jsx("span", {
                          className: "text-xs text-muted-foreground",
                          children: msg.sentAt ? new Date(msg.sentAt).toLocaleString() : new Date(msg.createdAt).toLocaleString()
                        })]
                      }), /* @__PURE__ */ jsx("p", {
                        className: "whitespace-pre-wrap text-foreground/90",
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
    padding: 12px 16px;
    word-wrap: break-word;
  }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  ul, ol { padding-left: 20px; }
</style>
</head>
<body>${bodyContent}</body>
</html>`;
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: leads_$leadId_emails,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
function validateApiKey(request) {
  const apiKey = request.headers.get("X-API-Key");
  return !!apiKey && apiKey.length > 0;
}
const LeadPayloadSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  industry: z.string().optional(),
  estimatedTraffic: z.string().optional(),
  techStack: z.string().optional(),
  leadSource: z.string().optional().default("SCRAPER"),
  notes: z.string().optional()
});
async function loader$9({
  request
}) {
  if (!validateApiKey(request)) {
    throw data({
      error: "Unauthorized. Provide X-API-Key header."
    }, {
      status: 401
    });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || void 0;
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const leads = await prisma.lead.findMany({
    where: status ? {
      status
    } : void 0,
    take: Math.min(limit, 100),
    skip: offset,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      companyName: true,
      website: true,
      contactName: true,
      email: true,
      industry: true,
      estimatedTraffic: true,
      techStack: true,
      status: true,
      stage: true,
      leadSource: true,
      createdAt: true
    }
  });
  const total = await prisma.lead.count({
    where: status ? {
      status
    } : void 0
  });
  return data({
    leads,
    total,
    limit,
    offset
  });
}
async function action$6({
  request
}) {
  if (!validateApiKey(request)) {
    throw data({
      error: "Unauthorized. Provide X-API-Key header."
    }, {
      status: 401
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
      }
    });
    if (existing) {
      const updated = await prisma.lead.update({
        where: {
          id: existing.id
        },
        data: {
          companyName: payload.companyName,
          website: payload.website ?? existing.website,
          contactName: payload.contactName ?? existing.contactName,
          industry: payload.industry ?? existing.industry,
          estimatedTraffic: payload.estimatedTraffic ?? existing.estimatedTraffic,
          techStack: payload.techStack ?? existing.techStack,
          leadSource: payload.leadSource,
          notes: payload.notes ? `${existing.notes || ""}
[Updated]: ${payload.notes}`.trim() : existing.notes
        }
      });
      await logActivity({
        leadId: existing.id,
        action: "LEAD_EDITED",
        description: `External API updated lead data (${payload.leadSource})`,
        metadata: {
          source: payload.leadSource,
          merged: true
        }
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
        ...payload,
        status: "INBOX",
        stage: "SOURCED"
      }
    });
    await logActivity({
      leadId: lead.id,
      action: "LEAD_CREATED",
      description: `Added via external API (${payload.leadSource})`,
      metadata: {
        source: payload.leadSource
      }
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
    throw data({
      error: "Internal server error"
    }, {
      status: 500
    });
  }
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
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
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imports,
  loader: loader$8
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
    if (value) lead[leadField] = value;
  }
  return lead;
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
async function loader$7({
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
async function action$5({
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
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: imports_new,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });
  useEffect(() => {
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
async function loader$6({
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
async function action$4({
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
const settings = UNSAFE_withComponentProps(function Settings2() {
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
  useEffect(() => {
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
        }), /* @__PURE__ */ jsxs(Card, {
          className: "lg:col-span-2",
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              children: "API Access"
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Use the API endpoint to ingest leads from external scrapers"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "rounded-lg bg-muted p-4",
              children: [/* @__PURE__ */ jsx("p", {
                className: "mb-2 text-sm font-medium",
                children: "POST /api/leads"
              }), /* @__PURE__ */ jsx("pre", {
                className: "overflow-x-auto text-xs",
                children: `curl -X POST https://your-domain.com/api/leads \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "website": "https://acme.com",
    "industry": "SaaS",
    "leadSource": "scraper-bot"
  }'`
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "rounded-lg bg-muted p-4",
              children: [/* @__PURE__ */ jsx("p", {
                className: "mb-2 text-sm font-medium",
                children: "GET /api/leads?status=INBOX&limit=50"
              }), /* @__PURE__ */ jsx("pre", {
                className: "overflow-x-auto text-xs",
                children: `curl https://your-domain.com/api/leads \\
  -H "X-API-Key: your-api-key"`
              })]
            })]
          })]
        })]
      })]
    })
  });
});
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: settings,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
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
async function action$3({
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
    const currentUserId = formData.get("currentUserId");
    if (targetUserId === currentUserId) {
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
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: settings_users,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const DANGEROUS_PATTERNS = [
  { pattern: /\bDROP\s+DATABASE\b/i, label: "DROP DATABASE" },
  { pattern: /\bTRUNCATE\s+/i, label: "TRUNCATE" },
  { pattern: /\bDROP\s+TABLE\s+(?!IF\s+EXISTS)/i, label: "DROP TABLE without IF EXISTS" },
  { pattern: /\bDELETE\s+FROM\s+\w+\s*;/i, label: "DELETE without WHERE clause" }
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
          await tx.$executeRawUnsafe(stmt);
        }
        const safeName = sanitizeMigrationName(migration.name);
        await tx.$executeRawUnsafe(
          `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
        );
      });
      appliedList.push(migration.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ migration: migration.name, error: message });
      break;
    }
  }
  return { applied: appliedList, errors };
}
async function markBaselineApplied() {
  await ensureMigrationTable();
  const applied = await getAppliedMigrations();
  if (applied.includes("000_baseline.sql")) {
    return false;
  }
  const safeName = sanitizeMigrationName("000_baseline.sql");
  await prisma.$executeRawUnsafe(
    `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
  );
  return true;
}
async function loader$4({
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
  return {
    user,
    status
  };
}
async function action$2({
  request
}) {
  await requireAdmin(request);
  const result = await applyPendingMigrations();
  return result;
}
const settings_database = UNSAFE_withComponentProps(function SettingsDatabase() {
  var _a, _b, _c;
  const {
    user,
    status
  } = useLoaderData();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isApplying = navigation.state === "submitting" || fetcher.state === "submitting" && ((_a = fetcher.formData) == null ? void 0 : _a.get("intent")) === "applyMigrations";
  const appliedFromAction = ((_b = fetcher.data) == null ? void 0 : _b.applied) || [];
  const errorsFromAction = ((_c = fetcher.data) == null ? void 0 : _c.errors) || [];
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
              }), /* @__PURE__ */ jsx(Badge, {
                variant: m.applied ? "success" : "secondary",
                className: m.applied ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25",
                children: m.applied ? "Applied" : "Pending"
              })]
            }, m.name))
          })
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
          })]
        })]
      })]
    })
  });
});
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: settings_database,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
async function loader$3({
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
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: scraper,
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
    import("./pipeline-csUyn056.js").then(({
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
    import("./pipeline-csUyn056.js").then(({
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
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: scraper_new,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
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
  useEffect(() => {
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
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: scraper_$jobId,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  request
}) {
  await requireAuth(request);
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) {
    return Response.json({
      error: "jobId is required"
    }, {
      status: 400
    });
  }
  const job = await prisma.scraperJob.findUnique({
    where: {
      id: jobId
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
    return Response.json({
      error: "Job not found"
    }, {
      status: 404
    });
  }
  return Response.json(job);
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Dv3zLPER.js", "imports": ["/assets/jsx-runtime-D_zvdyIk.js", "/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/index-D7YUbBXl.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-BNAGhpuH.js", "imports": ["/assets/jsx-runtime-D_zvdyIk.js", "/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/index-D7YUbBXl.js"], "css": ["/assets/root-C6zCa6ug.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/home-CrM5JQaT.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/login-f1Q9rWLd.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/card-CukL0JBy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/register-BA8earGe.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/card-CukL0JBy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.google": { "id": "routes/auth.google", "parentId": "root", "path": "auth/google", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/auth.google-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.google.callback": { "id": "routes/auth.google.callback", "parentId": "root", "path": "auth/google/callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/auth.google.callback-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/dashboard-CVogkU7v.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/card-CukL0JBy.js", "/assets/button-S0umEhYV.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/analytics": { "id": "routes/analytics", "parentId": "root", "path": "analytics", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/analytics-CEY_SK58.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/activity-log-C5qbkjuf.js", "/assets/app-shell-BlZrXGuO.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/button-S0umEhYV.js", "/assets/target-rUoQOMM-.js", "/assets/circle-x-CipAbzTs.js", "/assets/chevron-down-ShYYAKVh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/inbox": { "id": "routes/inbox", "parentId": "root", "path": "inbox", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/inbox-CVRVBHwk.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/plus-CFPk2CPu.js", "/assets/chevron-down-ShYYAKVh.js", "/assets/circle-check-BuE9zyca.js", "/assets/circle-x-CipAbzTs.js", "/assets/snowflake-B6Sa6qQd.js", "/assets/sun-B1RvF6PX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/inbox.$leadId": { "id": "routes/inbox.$leadId", "parentId": "root", "path": "inbox/:leadId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/inbox._leadId-DgjanACM.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/textarea-CVOQnmbV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/activity-log-C5qbkjuf.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/circle-x-CipAbzTs.js", "/assets/user-CSMFkmWF.js", "/assets/twitter-BCsyruiZ.js", "/assets/activity-D1E1P4Z3.js", "/assets/clock-BupdL0B6.js", "/assets/send-COB60qoq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/leads.new": { "id": "routes/leads.new", "parentId": "root", "path": "leads/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/leads.new-DtT-eu3a.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/textarea-CVOQnmbV.js", "/assets/card-CukL0JBy.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/circle-check-BuE9zyca.js", "/assets/twitter-BCsyruiZ.js", "/assets/snowflake-B6Sa6qQd.js", "/assets/sun-B1RvF6PX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/verification.criteria": { "id": "routes/verification.criteria", "parentId": "root", "path": "verification/criteria", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/verification.criteria-DOuCaWM0.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/textarea-CVOQnmbV.js", "/assets/select-CC0mcc3s.js", "/assets/badge-DpNWdVIX.js", "/assets/card-CukL0JBy.js", "/assets/plus-CFPk2CPu.js", "/assets/trash-2-DIZqGR8h.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/verification.$leadId": { "id": "routes/verification.$leadId", "parentId": "root", "path": "verification/:leadId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/verification._leadId-COd2Z7f7.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/textarea-CVOQnmbV.js", "/assets/card-CukL0JBy.js", "/assets/snowflake-B6Sa6qQd.js", "/assets/sun-B1RvF6PX.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/circle-check-BuE9zyca.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/users": { "id": "routes/users", "parentId": "root", "path": "users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/users-ZC92cQR8.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/badge-DpNWdVIX.js", "/assets/card-CukL0JBy.js", "/assets/select-CC0mcc3s.js", "/assets/user-CSMFkmWF.js", "/assets/activity-D1E1P4Z3.js", "/assets/target-rUoQOMM-.js", "/assets/trash-2-DIZqGR8h.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/users.new": { "id": "routes/users.new", "parentId": "root", "path": "users/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/users.new-BcL5BKj3.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/card-CukL0JBy.js", "/assets/select-CC0mcc3s.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/circle-check-BuE9zyca.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pipeline": { "id": "routes/pipeline", "parentId": "root", "path": "pipeline", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/pipeline-BlEna6vJ.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/badge-DpNWdVIX.js", "/assets/index-D7YUbBXl.js", "/assets/card-CukL0JBy.js", "/assets/dialog-BDMiuwjf.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/textarea-CVOQnmbV.js", "/assets/activity-log-C5qbkjuf.js", "/assets/user-CSMFkmWF.js", "/assets/globe-BmxV-63u.js", "/assets/link-DKv6pUKY.js", "/assets/arrow-right-CiIzx3Ni.js", "/assets/clock-BupdL0B6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails": { "id": "routes/emails", "parentId": "root", "path": "emails", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails-SDzkJpRp.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/card-CukL0JBy.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/send-COB60qoq.js", "/assets/circle-alert-IopUk0mf.js", "/assets/loader-circle-B6fwOL5c.js", "/assets/arrow-right-CiIzx3Ni.js", "/assets/clock-BupdL0B6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails.templates": { "id": "routes/emails.templates", "parentId": "root", "path": "emails/templates", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails.templates-C7uUr1rY.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/textarea-CVOQnmbV.js", "/assets/card-CukL0JBy.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/plus-CFPk2CPu.js", "/assets/trash-2-DIZqGR8h.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails.threads.$threadId": { "id": "routes/emails.threads.$threadId", "parentId": "root", "path": "emails/threads/:threadId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails.threads._threadId-D2ozC1Qa.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/textarea-CVOQnmbV.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/reply-Dzu_LmIu.js", "/assets/send-COB60qoq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/emails.inbox.$messageId": { "id": "routes/emails.inbox.$messageId", "parentId": "root", "path": "emails/inbox/:messageId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/emails.inbox._messageId-UGhJCIVU.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/textarea-CVOQnmbV.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/reply-Dzu_LmIu.js", "/assets/send-COB60qoq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/leads.$leadId.emails": { "id": "routes/leads.$leadId.emails", "parentId": "root", "path": "leads/:leadId/emails", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/leads._leadId.emails-Br6F_dBM.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/select-CC0mcc3s.js", "/assets/label-C5IVyZAB.js", "/assets/input-CKOq3GXZ.js", "/assets/link-DKv6pUKY.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/send-COB60qoq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.leads": { "id": "routes/api.leads", "parentId": "root", "path": "api/leads", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.leads-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/imports": { "id": "routes/imports", "parentId": "root", "path": "imports", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/imports-Du0Imdxb.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/imports.new": { "id": "routes/imports.new", "parentId": "root", "path": "imports/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/imports.new-DNupHURv.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/select-CC0mcc3s.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/circle-check-BuE9zyca.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings": { "id": "routes/settings", "parentId": "root", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings-TccGZBIj.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/sun-B1RvF6PX.js", "/assets/database-DpurACcA.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.users": { "id": "routes/settings.users", "parentId": "root", "path": "settings/users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.users-D18LJae4.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/input-CKOq3GXZ.js", "/assets/label-C5IVyZAB.js", "/assets/badge-DpNWdVIX.js", "/assets/card-CukL0JBy.js", "/assets/select-CC0mcc3s.js", "/assets/dialog-BDMiuwjf.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/plus-CFPk2CPu.js", "/assets/trash-2-DIZqGR8h.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings.database": { "id": "routes/settings.database", "parentId": "root", "path": "settings/database", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/settings.database-Co8Qfu5U.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/database-DpurACcA.js", "/assets/circle-check-BuE9zyca.js", "/assets/circle-alert-IopUk0mf.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scraper": { "id": "routes/scraper", "parentId": "root", "path": "scraper", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/scraper-BPPxW1z8.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/globe-BmxV-63u.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scraper.new": { "id": "routes/scraper.new", "parentId": "root", "path": "scraper/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/scraper.new-Dg_CLZX4.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/globe-BmxV-63u.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scraper.$jobId": { "id": "routes/scraper.$jobId", "parentId": "root", "path": "scraper/:jobId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/scraper._jobId-BtFOo-PS.js", "imports": ["/assets/chunk-QFMPRPBF-CJePKBBp.js", "/assets/jsx-runtime-D_zvdyIk.js", "/assets/app-shell-BlZrXGuO.js", "/assets/button-S0umEhYV.js", "/assets/card-CukL0JBy.js", "/assets/badge-DpNWdVIX.js", "/assets/arrow-left-DLmm2aWm.js", "/assets/loader-circle-B6fwOL5c.js", "/assets/globe-BmxV-63u.js", "/assets/clock-BupdL0B6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.scraper": { "id": "routes/api.scraper", "parentId": "root", "path": "api/scraper", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.scraper-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-3c9c43ed.js", "version": "3c9c43ed", "sri": void 0 };
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
  "routes/imports": {
    id: "routes/imports",
    parentId: "root",
    path: "imports",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/imports.new": {
    id: "routes/imports.new",
    parentId: "root",
    path: "imports/new",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/settings.users": {
    id: "routes/settings.users",
    parentId: "root",
    path: "settings/users",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/settings.database": {
    id: "routes/settings.database",
    parentId: "root",
    path: "settings/database",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/scraper": {
    id: "routes/scraper",
    parentId: "root",
    path: "scraper",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/scraper.new": {
    id: "routes/scraper.new",
    parentId: "root",
    path: "scraper/new",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/scraper.$jobId": {
    id: "routes/scraper.$jobId",
    parentId: "root",
    path: "scraper/:jobId",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/api.scraper": {
    id: "routes/api.scraper",
    parentId: "root",
    path: "api/scraper",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins as a,
  assetsBuildDirectory as b,
  basename as c,
  prerender as d,
  entry as e,
  future as f,
  publicPath as g,
  routes as h,
  isSpaMode as i,
  ssr as j,
  logActivity as l,
  prisma as p,
  routeDiscovery as r,
  serverManifest as s
};
