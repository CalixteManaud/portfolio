import { Activity, GitBranch, TerminalSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CIPipeline3D } from "@/components/devops/CIPipeline3D";
import { GitHubDashboard } from "@/components/devops/GitHubDashboard";
import { Terminal } from "@/components/devops/Terminal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function DevOpsShowcase() {
  const tNav = await getTranslations("Nav");
  const t = await getTranslations("DevOpsShowcase");

  return (
    <section className="border-t border-border/40 bg-background/30 py-24" aria-label={tNav("home")}>
      <div className="mx-auto max-w-6xl space-y-16 px-4 md:px-6">
        <header className="max-w-2xl space-y-4">
          <Badge
            variant="outline"
            className="h-7 border-border/60 bg-background/40 px-3 font-mono text-xs uppercase tracking-wider text-primary/85"
          >
            $ ./prove --it
          </Badge>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight md:text-5xl">
            {t("heading")}
          </h2>
          <p className="text-pretty text-foreground/70 leading-relaxed">{t("subheading")}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TerminalSquare className="size-4 text-primary" aria-hidden="true" />
                Interactive shell
              </CardTitle>
              <CardDescription>
                Type <code className="font-mono text-foreground/80">help</code> to explore.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Terminal />
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4 text-primary" aria-hidden="true" />
                GitHub · live
              </CardTitle>
              <CardDescription>Refreshed every hour from the public API.</CardDescription>
            </CardHeader>
            <CardContent>
              <GitHubDashboard />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="size-4 text-primary" aria-hidden="true" />
              CI/CD pipeline
            </CardTitle>
            <CardDescription>lint → test → build → scan → deploy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-hidden rounded-lg border border-border/60 bg-background/40 md:h-96">
              <CIPipeline3D className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
