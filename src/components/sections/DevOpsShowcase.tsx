import { getTranslations } from "next-intl/server";
import { CIPipeline3D } from "@/components/devops/CIPipeline3D";
import { GitHubDashboard } from "@/components/devops/GitHubDashboard";
import { Terminal } from "@/components/devops/Terminal";

export async function DevOpsShowcase() {
  const tNav = await getTranslations("Nav");

  return (
    <section className="border-t border-border/40 bg-background/30 py-24" aria-label={tNav("home")}>
      <div className="mx-auto max-w-6xl space-y-20 px-4 md:px-6">
        <header className="max-w-2xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-primary/80">
            $ ./prove --it
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Le code est la démonstration.
          </h2>
          <p className="text-foreground/70 leading-relaxed">
            Trois preuves en direct : un terminal jouable, les stats GitHub
            mises à jour à l'heure, une pipeline CI/CD qui tourne en 3D.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Terminal />
          <GitHubDashboard />
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-foreground/60">
            $ ci/cd · live preview
          </p>
          <div className="h-[360px] overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm md:h-[420px]">
            <CIPipeline3D className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
