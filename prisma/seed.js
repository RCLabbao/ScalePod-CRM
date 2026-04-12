import { PrismaClient } from "@prisma/client";
import pkg from "bcryptjs";
const { hash } = pkg;

const prisma = new PrismaClient();

async function main() {
  // ── Users ──
  const adminHash = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@scalepod.com" },
    update: {},
    create: {
      email: "admin@scalepod.com",
      passwordHash: adminHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const agentHash = await hash("agent123", 12);
  await prisma.user.upsert({
    where: { email: "agent@scalepod.com" },
    update: {},
    create: {
      email: "agent@scalepod.com",
      passwordHash: agentHash,
      name: "Agent",
      role: "AGENT",
    },
  });

  // ── Email Templates ──
  await prisma.emailTemplate.upsert({
    where: { id: "template-cold-outreach" },
    update: {},
    create: {
      id: "template-cold-outreach",
      name: "Cold Outreach",
      subject: "Helping {{company_name}} grow with digital marketing",
      body: `Hi {{contact_name}},

I came across {{company_name}} and was really impressed by what you're doing in the {{industry}} space.

I'd love to share some ideas on how we could help boost your online presence and drive more qualified traffic to your website.

Would you be open to a quick 15-minute call this week?

Best regards`,
    },
  });

  await prisma.emailTemplate.upsert({
    where: { id: "template-follow-up" },
    update: {},
    create: {
      id: "template-follow-up",
      name: "Follow Up",
      subject: "Following up — {{company_name}}",
      body: `Hi {{contact_name}},

I reached out last week about potentially helping {{company_name}} scale your digital marketing efforts.

I understand you're busy, so I'll keep this brief — would any of these times work for a quick chat?

- Tuesday 2-4 PM
- Wednesday 10 AM - 12 PM
- Thursday 3-5 PM

Looking forward to connecting.`,
    },
  });

  // ── Sample Verification Criteria ──
  const criteriaSeed = [
    {
      name: "Valid Website",
      description: "Does the company have a functional website with real content?",
      type: "YES_NO",
      weight: 2,
      required: true,
      sortOrder: 0,
    },
    {
      name: "Business Email",
      description: "Is the contact using a business/domain email (not Gmail, Yahoo, etc.)?",
      type: "YES_NO",
      weight: 2,
      required: true,
      sortOrder: 1,
    },
    {
      name: "Industry Fit",
      description: "Does this company match our target industries?",
      type: "SCORE",
      weight: 3,
      required: true,
      sortOrder: 2,
    },
    {
      name: "Website Traffic",
      description: "How much estimated monthly traffic does the site receive?",
      type: "SCORE",
      weight: 2,
      required: false,
      sortOrder: 3,
    },
    {
      name: "Decision Maker Identified",
      description: "Do we have the name and role of a decision-maker?",
      type: "YES_NO",
      weight: 3,
      required: true,
      sortOrder: 4,
    },
    {
      name: "Competitor Analysis",
      description: "Notes on what marketing tools/competitors they currently use",
      type: "TEXT",
      weight: 1,
      required: false,
      sortOrder: 5,
    },
  ];

  for (const c of criteriaSeed) {
    await prisma.verificationCriteria.upsert({
      where: { id: `criteria-${c.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `criteria-${c.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...c,
      },
    });
  }

  console.log("Database seeded successfully!");
  console.log("");
  console.log("Accounts created:");
  console.log("  Admin:  admin@scalepod.com  / admin123");
  console.log("  Agent:  agent@scalepod.com  / agent123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
