"use client";

import { useTranslations } from "next-intl";
import { Terminal } from "@/components/devops/Terminal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TABS = ["terminal", "build", "deploy"] as const;

/**
 * Le panneau terminal de la bande de preuve : le vrai terminal jouable, et
 * deux journaux qui recopient ce que la chaîne fait réellement — les étapes
 * de `.github/workflows/ci.yml` et la construction Docker du dépôt.
 */
export function ProofTabs() {
  const t = useTranslations("Landing.proof");
  const logs = {
    build: t.raw("build") as string[],
    deploy: t.raw("deploy") as string[],
  };

  return (
    <Tabs defaultValue="terminal" className="gap-3">
      <TabsList className="h-9 w-fit gap-1 rounded-lg bg-screen-sunk p-1 group-data-horizontal/tabs:h-9">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="h-7 flex-none rounded-md border-0 px-4 text-[12.5px] font-medium text-screen-soft shadow-none hover:text-screen-ink dark:text-screen-soft dark:hover:text-screen-ink data-active:bg-screen-ink data-active:text-screen data-active:shadow-sm dark:data-active:border-transparent dark:data-active:bg-screen-ink dark:data-active:text-screen"
          >
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="terminal">
        <Terminal embedded />
      </TabsContent>
      {(["build", "deploy"] as const).map((tab) => (
        <TabsContent key={tab} value={tab}>
          <Log lines={logs[tab]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function Log({ lines }: { lines: string[] }) {
  const rows = lines.map((text, i) => ({ id: `l${i}`, text }));

  return (
    <pre className="h-[212px] overflow-auto rounded-xl bg-screen-sunk px-4 py-3 font-mono text-[12.5px] leading-relaxed text-screen-ink/85">
      {rows.map(({ id, text }) => (
        <span
          key={id}
          className={cn(
            "block",
            text.startsWith("$") && "text-go-bright",
            text.startsWith("▸") && "text-copper-bright",
            text.startsWith("#") && "text-screen-soft",
          )}
        >
          {text || " "}
        </span>
      ))}
    </pre>
  );
}
