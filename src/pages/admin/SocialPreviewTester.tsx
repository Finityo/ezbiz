import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, ExternalLink, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SITE_URL } from "@/lib/site";

const SCRAPER_UAS = [
  { label: "Facebook (legacy)", ua: "facebookexternalhit/1.1" },
  { label: "Facebook (current)", ua: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" },
  { label: "Twitterbot", ua: "Twitterbot/1.0" },
  { label: "LinkedInBot", ua: "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +https://www.linkedin.com)" },
  { label: "Slackbot", ua: "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)" },
  { label: "Discordbot", ua: "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)" },
  { label: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { label: "Chrome (control)", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36" },
];

const classBadge = (c: string) => {
  if (c === "OK") return "default";
  if (c === "Edge challenge (Cloudflare)") return "destructive";
  if (c.startsWith("App")) return "destructive";
  return "secondary";
};

export default function SocialPreviewTester() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  const [url, setUrl] = useState(`${SITE_URL}/`);
  const [ua, setUa] = useState(SCRAPER_UAS[0].ua);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<any>(null);

  const [diagLoading, setDiagLoading] = useState(false);
  const [diagResult, setDiagResult] = useState<any>(null);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!isAdmin) {
    navigate("/admin/login");
    return null;
  }

  const runPreview = async () => {
    setPreviewLoading(true);
    setPreviewResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("social-preview-fetch", {
        body: { url, userAgent: ua },
      });
      if (error) throw error;
      setPreviewResult(data);
    } catch (e: any) {
      toast({ title: "Preview failed", description: e.message || "Unknown error", variant: "destructive" });
    } finally {
      setPreviewLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setDiagLoading(true);
    setDiagResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("social-diagnostics", {
        body: { url },
      });
      if (error) throw error;
      setDiagResult(data);
    } catch (e: any) {
      toast({ title: "Diagnostics failed", description: e.message || "Unknown error", variant: "destructive" });
    } finally {
      setDiagLoading(false);
    }
  };

  const copyMarkdown = () => {
    if (!diagResult) return;
    const lines: string[] = [];
    lines.push(`# Social Diagnostics Report`);
    lines.push(`**URL:** ${diagResult.url}`);
    lines.push(`**Ran at:** ${diagResult.ranAt}`);
    lines.push(``);
    lines.push(`## Summary`);
    Object.entries(diagResult.summary).forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
    lines.push(``);
    lines.push(`## Probes`);
    lines.push(`| User-Agent | Status | Final URL | CF | Class | ms |`);
    lines.push(`| --- | --- | --- | --- | --- | --- |`);
    diagResult.probes.forEach((p: any) => {
      lines.push(`| ${p.label} | ${p.finalStatus ?? "—"} | ${p.finalUrl ?? p.error ?? "—"} | ${p.cloudflare ? "yes" : ""} | ${p.classification} | ${p.durationMs} |`);
    });
    navigator.clipboard.writeText(lines.join("\n"));
    toast({ title: "Copied", description: "Markdown report copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Social Preview Tester | Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto py-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Social Preview Tester</h1>
            <p className="text-muted-foreground">See exactly what Facebook, Twitter, LinkedIn and Slack scrapers fetch.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin")}>← Admin</Button>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Target URL</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.ezbiz-fs.com/" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview (single UA)</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics (all bots)</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>User-Agent</Label>
                  <Select value={ua} onValueChange={setUa}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SCRAPER_UAS.map((u) => (
                        <SelectItem key={u.ua} value={u.ua}>{u.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={runPreview} disabled={previewLoading}>
                  {previewLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Fetch as scraper
                </Button>
              </CardContent>
            </Card>

            {previewResult && (
              <>
                <Card>
                  <CardHeader><CardTitle>Result</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {previewResult.error && (
                      <div className="text-destructive font-medium">Error: {previewResult.error}</div>
                    )}
                    {previewResult.finalStatus !== undefined && (
                      <div>
                        <Badge variant={previewResult.finalStatus < 400 ? "default" : "destructive"}>
                          {previewResult.finalStatus} {previewResult.finalStatusText}
                        </Badge>
                        <span className="ml-2 text-sm text-muted-foreground break-all">
                          → {previewResult.finalUrl}
                        </span>
                      </div>
                    )}

                    {previewResult.chain?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Redirect chain</h3>
                        <ol className="list-decimal pl-5 text-sm space-y-1">
                          {previewResult.chain.map((h: any, i: number) => (
                            <li key={i} className="break-all">
                              <Badge variant={h.status >= 400 ? "destructive" : h.status >= 300 ? "secondary" : "default"}>{h.status}</Badge>
                              {" "}{h.url}
                              {h.location && <div className="text-xs text-muted-foreground pl-4">→ {h.location}</div>}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {previewResult.meta && (
                  <Card>
                    <CardHeader><CardTitle>Detected meta tags</CardTitle></CardHeader>
                    <CardContent>
                      <table className="w-full text-sm">
                        <tbody>
                          {Object.entries(previewResult.meta).map(([k, v]: any) => (
                            <tr key={k} className="border-b">
                              <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap align-top">{k}</td>
                              <td className="py-2 break-all">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                )}

                {previewResult.meta?.["og:image"] && (
                  <Card>
                    <CardHeader><CardTitle>Facebook-style preview</CardTitle></CardHeader>
                    <CardContent>
                      <div className="max-w-md border rounded-lg overflow-hidden bg-card">
                        <img src={previewResult.meta["og:image"]} alt="og preview" className="w-full aspect-[1200/630] object-cover bg-muted" />
                        <div className="p-3 text-sm">
                          <div className="text-xs uppercase text-muted-foreground">{previewResult.meta["og:url"] ? new URL(previewResult.meta["og:url"]).hostname : ""}</div>
                          <div className="font-semibold">{previewResult.meta["og:title"] || previewResult.meta.title}</div>
                          <div className="text-muted-foreground line-clamp-2">{previewResult.meta["og:description"] || previewResult.meta.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {previewResult.headers && (
                  <Card>
                    <CardHeader><CardTitle>Response headers</CardTitle></CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-80">{JSON.stringify(previewResult.headers, null, 2)}</pre>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-4">
            <Card>
              <CardContent className="pt-6 flex gap-2">
                <Button onClick={runDiagnostics} disabled={diagLoading}>
                  {diagLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Run full diagnostics
                </Button>
                {diagResult && (
                  <Button variant="outline" onClick={copyMarkdown}>
                    <Copy className="mr-2 h-4 w-4" /> Copy as Markdown
                  </Button>
                )}
                <Button variant="ghost" asChild>
                  <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer">
                    Facebook Debugger <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {diagResult && (
              <>
                <Card>
                  <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(diagResult.summary).map(([k, v]: any) => (
                        <div key={k} className="border rounded p-3">
                          <div className="text-xs text-muted-foreground">{k}</div>
                          <div className="text-2xl font-bold">{String(v)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Per-bot results</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="py-2 pr-2">Bot</th>
                            <th className="py-2 pr-2">Status</th>
                            <th className="py-2 pr-2">Hops</th>
                            <th className="py-2 pr-2">CF</th>
                            <th className="py-2 pr-2">Classification</th>
                            <th className="py-2 pr-2">ms</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diagResult.probes.map((p: any) => (
                            <tr key={p.label} className="border-b">
                              <td className="py-2 pr-2 font-medium">{p.label}</td>
                              <td className="py-2 pr-2">{p.finalStatus ?? "—"}</td>
                              <td className="py-2 pr-2">{p.chain.length}</td>
                              <td className="py-2 pr-2">{p.cloudflare ? "✓" : ""}{p.cfMitigated ? ` (${p.cfMitigated})` : ""}</td>
                              <td className="py-2 pr-2">
                                <Badge variant={classBadge(p.classification) as any}>{p.classification}</Badge>
                              </td>
                              <td className="py-2 pr-2 text-muted-foreground">{p.durationMs}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Raw report</CardTitle></CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">{JSON.stringify(diagResult, null, 2)}</pre>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
