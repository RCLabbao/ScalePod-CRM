# Engineering Plan: Custom Digital Marketing CRM

## 1. Project Overview

A custom CRM tailored for a digital marketing agency to ingest, qualify, and manage leads. The system will initially handle manual entry and qualification, feature a Kanban-style pipeline, and integrate natively with the Gmail API for seamless email outreach. The architecture is designed to scale and eventually support a data scraper via an API gateway.

---

## 2. Tech Stack & Infrastructure

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | Remix (React) + TypeScript | Remix's data loaders and form actions are perfect for data-heavy, highly interactive dashboards like Kanban boards. |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible, composable UI primitives. |
| **Backend** | Node.js + Express (or Remix's native server) | Asynchronous handling is ideal for communicating with external APIs (Gmail) and handling future scraper payloads. |
| **Database** | MySQL (Hosted on cPanel) | Managed hosting already available via cPanel. |
| **ORM** | Prisma (`prisma-client`) | Excellent type safety; handles MySQL migrations gracefully. |
| **Authentication** | NextAuth.js (Auth.js) / Remix Auth | Secure credentials login for agency staff. |
| **Deployment** | cPanel (via Phusion Passenger) | Uses cPanel's "Setup Node.js App" feature. The Remix server acts as the `app.js` entry point, securely proxying traffic from the domain to the Node environment without requiring dedicated VPS configuration. |

---

## 3. Core Modules

### Module 1: Lead Intake & Qualification (The "Inbox")

- **Feature:** A centralized table or list view of raw, newly sourced leads.
- **Data Points:** Company Name, Website, Contact Person, Email, Estimated Traffic, Tech Stack, Industry, Lead Source.
- **Action:** "Accept" (moves to active pipeline) or "Reject" (archives/blacklists).

### Module 2: Pipeline Management (Kanban Board)

- **Feature:** Visual drag-and-drop board for tracking lead progress.
- **Stages:** Sourced → Qualified → First Contact → Meeting Booked → Proposal Sent → Closed Won / Closed Lost.
- **Action:** Updating a lead's stage triggers timestamp updates and UI revalidation.

### Module 3: Email Outreach Hub (Gmail API)

- **Feature:** Integrated communication layer.
- **Capabilities:**
  - OAuth 2.0 connection to the agency's existing free Gmail accounts.
  - Send outbound emails directly from the CRM profile view.
  - Fetch and display replies chronologically within the lead's profile.
- **Templates:** Create, save, and insert dynamic templates (e.g., swapping `{{company_name}}`).

### Module 4: API Gateway (Future-Proofing)

- **Feature:** Secure REST endpoints.
- **Capabilities:** Accepts structured JSON payloads from external web scrapers to auto-populate the "Lead Intake" module.

---

## 4. Database Schema (Prisma / MySQL)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  name          String?
  role          String   @default("AGENT") // AGENT, ADMIN
  createdAt     DateTime @default(now())
}

model Lead {
  id               String    @id @default(cuid())
  companyName      String
  website          String?
  contactName      String?
  email            String    @unique
  industry         String?
  estimatedTraffic String?
  techStack        String?
  status           String    @default("INBOX")   // INBOX, REJECTED, ACTIVE
  stage            String    @default("SOURCED")  // Kanban stages
  notes            String?   @db.Text
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  emails           EmailThread[]
}

model EmailThread {
  id             String   @id @default(cuid())
  leadId         String
  lead           Lead     @relation(fields: [leadId], references: [id])
  gmailThreadId  String   @unique // Provided by Google API
  subject        String
  snippet        String?  @db.Text
  lastMessage    DateTime @default(now())
  status         String   @default("SENT") // SENT, REPLIED, WAITING
}

model EmailTemplate {
  id        String   @id @default(cuid())
  name      String
  subject   String
  body      String   @db.Text
  createdAt DateTime @default(now())
}
```

---

## 5. Critical Functions & Logic

Your AI agent should prioritize building these distinct functional logic blocks:

### `ingestLead(payload)`

API endpoint logic. Validates incoming lead data (from manual entry or future scraper) ensuring duplicate emails are either rejected or merged, then saves to the `Lead` table with status `INBOX`.

### `updateLeadStage(leadId, newStage)`

Mutation. Updates the Kanban stage of a lead. If moved to `REJECTED`, strips non-essential data to save DB space but keeps the domain/email to prevent re-scraping.

### `authenticateGmail(userId)`

Integrates `googleapis`. Generates the Google OAuth consent screen URL, captures the callback tokens, and stores the `refresh_token` securely so the CRM can act on behalf of the agency's Gmail account offline.

### `sendOutreachEmail(leadId, templateId, accountId)`

1. Fetches `Lead` data and `EmailTemplate` data.
2. Parses template variables (regex replace `{{variable}}`).
3. Constructs a MIME-formatted email.
4. Pushes to Gmail API `users.messages.send`.
5. Logs the interaction in the `EmailThread` database table.

### `syncEmailThreads(leadId)`

Background or on-demand fetch. Calls Gmail API `users.threads.get` using the stored `gmailThreadId` to pull the latest replies and display them on the frontend.

---

## 6. Deployment Strategy (cPanel Specifics)

1. **Build:** Run `npm run build` locally to compile the Remix app and Prisma client.
2. **Upload:** Transfer the `build/`, `public/`, `package.json`, and `prisma/` folders to a dedicated directory in cPanel (e.g., `/home/user/crm-app`). Do **not** upload `node_modules`.
3. **App Manager:** Use cPanel's **Setup Node.js App**. Point the Application Root to the uploaded folder, set the mode to **Production**, and set the Startup File to Remix's build output (often `build/index.js` or a custom `server.js`).
4. **Dependencies:** Use the cPanel UI to run `npm install` and trigger `npx prisma generate` & `npx prisma db push` to align the MySQL database.
5. **Environment:** Set `DATABASE_URL` (MySQL credentials), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `SESSION_SECRET` securely in the cPanel Node.js interface.
