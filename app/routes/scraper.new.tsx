import { redirect, useLoaderData, Form, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Upload, Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { runScraperPipeline } from "../lib/scraper/pipeline";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  return { user };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "url_upload") {
    const urls = formData.get("urls") as string;
    const name = (formData.get("name") as string) || "URL Upload Scrape";

    if (!urls?.trim()) {
      return { error: "Please enter at least one URL" };
    }

    const job = await prisma.scraperJob.create({
      data: {
        name,
        discoveryMode: "URL_UPLOAD",
        uploadedUrls: urls,
        userId,
        config: {
          delay: { min: 1000, max: 3000 },
          batchSize: 30,
          batchPause: 10000,
          respectRobots: true,
          playwrightEnabled: true,
          maxRetries: 3,
        },
      },
    });

    runScraperPipeline(job.id).catch(console.error);
    return redirect(`/scraper/${job.id}`);
  }

  if (intent === "dns_scan") {
    const name = (formData.get("name") as string) || "DNS Scan — Australian Shopify Stores";

    const job = await prisma.scraperJob.create({
      data: {
        name,
        discoveryMode: "DNS_SCAN",
        userId,
        config: {
          delay: { min: 1000, max: 3000 },
          batchSize: 30,
          batchPause: 10000,
          respectRobots: true,
          playwrightEnabled: true,
          maxRetries: 3,
        },
      },
    });

    runScraperPipeline(job.id).catch(console.error);
    return redirect(`/scraper/${job.id}`);
  }

  return { error: "Invalid action" };
}

export default function ScraperNew() {
  const { user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/scraper">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Scrape</h1>
            <p className="text-sm text-muted-foreground">
              Choose how to discover Shopify stores
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* URL Upload Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-emerald-400" />
                <CardTitle className="text-lg">Upload URLs</CardTitle>
              </div>
              <CardDescription>
                Paste a list of Shopify store URLs to scrape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="url_upload" />

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Job Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Australian Fashion Stores"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Store URLs <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="urls"
                    rows={8}
                    placeholder={"https://store.com.au\nhttps://anotherstore.com\nhttps://mystore.myshopify.com"}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    One URL per line. Include https:// prefix.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25"
                >
                  {isSubmitting ? "Starting..." : "Start Scrape"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* DNS Scan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg">DNS Scan</CardTitle>
              </div>
              <CardDescription>
                Auto-discover Australian Shopify stores via DNS — free, no API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="dns_scan" />

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Job Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. AU Shopify DNS Scan"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2 rounded-lg border border-border p-3 text-xs text-muted-foreground">
                  <p>Downloads the <span className="text-foreground font-medium">Majestic Million</span> (top 1M domains, free)</p>
                  <p>Filters for <span className="text-foreground font-medium">~8,600 .com.au</span> domains</p>
                  <p>DNS-checks each for <span className="text-foreground font-medium">Shopify CNAME</span> signature</p>
                  <p>Then scrapes contact pages for owner details</p>
                  <p className="text-emerald-400 font-medium pt-1">100% free — no API keys, no credit card</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25"
                >
                  {isSubmitting ? "Starting..." : "Scan Australian Shopify Stores"}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
