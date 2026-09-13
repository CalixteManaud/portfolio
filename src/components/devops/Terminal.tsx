"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { defaultLocale } from "@/i18n/config";

type Line = {
  id: number;
  kind: "input" | "output" | "html";
  value: string;
  cwd?: string;
  node?: React.ReactNode;
};

const PROMPT_USER = "manaud";
const PROMPT_HOST = "portfolio";
const INITIAL_CWD = "~";

/** Ordre d'affichage de `ls` et clés acceptées par `cat`. Le contenu vit dans
 *  `messages/*.json`, sous le namespace Terminal. */
const SECTION_NAMES = ["about", "stack", "proof", "certs", "contact"] as const;
type SectionName = (typeof SECTION_NAMES)[number];

type Row = [label: string, value: string];

/**
 * Aligne une colonne de paires sur le plus long libellé.
 *
 * L'alignement n'est pas codé en dur : un libellé traduit n'a pas la longueur de
 * l'original — la version anglaise était déjà désalignée d'un caractère, et
 * « Verwendung » aurait tout décalé. La mise en forme se calcule donc au rendu,
 * sur les données réellement affichées.
 */
function align(rows: Row[], indent = "  ", gap = 2): string[] {
  const width = Math.max(...rows.map(([label]) => label.length));
  return rows.map(([label, value]) =>
    value ? `${indent}${label.padEnd(width + gap)}${value}` : `${indent}${label}`,
  );
}

export function Terminal({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations("Terminal");
  const locale = useLocale();
  const idRef = useRef(10);
  const nextId = () => idRef.current++;

  // Intégré, le terminal s'ouvre sur deux commandes déjà jouées — de vraies
  // commandes de ce shell, avec leur vraie sortie.
  const [lines, setLines] = useState<Line[]>(() =>
    embedded
      ? [
          { id: 0, kind: "input", value: "whoami", cwd: INITIAL_CWD },
          { id: 1, kind: "output", value: t("whoami") },
          { id: 2, kind: "input", value: 'echo "Build. Deploy. Learn. Repeat."', cwd: INITIAL_CWD },
          { id: 3, kind: "output", value: "Build. Deploy. Learn. Repeat." },
        ]
      : [{ id: 0, kind: "output", value: t("welcome") }],
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [cwd] = useState(INITIAL_CWD);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on every appended line — `lines` is the trigger
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  /* Les sorties sont composées à partir des messages : le shell n'assemble plus
     de fragments, il rend des données déjà traduites. */
  const helpLines = useMemo(() => [t("help.intro"), ...align(t.raw("help.rows") as Row[])], [t]);

  const sections = useMemo<Record<SectionName, string[]>>(
    () => ({
      about: t.raw("sections.about.lines") as string[],
      stack: [
        ...align(t.raw("sections.stack.rows") as Row[], ""),
        "",
        ...(t.raw("sections.stack.footer") as string[]),
      ],
      proof: [
        t("sections.proof.title"),
        "",
        ...align(t.raw("sections.proof.rows") as Row[]),
        "",
        ...(t.raw("sections.proof.footer") as string[]),
      ],
      certs: [
        t("sections.certs.title"),
        "",
        ...align(t.raw("sections.certs.rows") as Row[]),
        "",
        t("sections.certs.educationTitle"),
        "",
        ...align(t.raw("sections.certs.education") as Row[]),
        "",
        ...(t.raw("sections.certs.footer") as string[]),
      ],
      contact: t.raw("sections.contact.lines") as string[],
    }),
    [t],
  );

  const focus = () => inputRef.current?.focus();

  const printInput = (value: string) =>
    setLines((prev) => [...prev, { id: nextId(), kind: "input", value, cwd }]);
  const printOutput = (...vals: string[]) =>
    setLines((prev) => [
      ...prev,
      ...vals.map((v) => ({ id: nextId(), kind: "output" as const, value: v })),
    ]);

  const run = (raw: string) => {
    const command = raw.trim();
    printInput(command);
    if (!command) return;
    setHistory((prev) => [...prev, command]);

    const [cmd, ...args] = command.split(/\s+/);
    switch (cmd) {
      case "help":
        printOutput(...helpLines);
        break;
      case "whoami":
        printOutput(t("whoami"));
        break;
      case "ls":
        printOutput(SECTION_NAMES.map((name) => `${name}.md`).join("  "));
        break;
      case "cat": {
        const target = args[0];
        if (!target) {
          printOutput(t("errors.catUsage"));
          break;
        }
        const key = target.replace(/\.md$/, "") as SectionName;
        const out = sections[key];
        if (!out) printOutput(t("errors.catMissing", { target }));
        else printOutput(...out);
        break;
      }
      case "open": {
        const path = args[0];
        if (!path) {
          printOutput(t("errors.openUsage"));
          break;
        }
        if (typeof window !== "undefined") {
          const target = path.startsWith("/") ? path : `/${path}`;
          /* `localePrefix: "as-needed"` : le français n'a pas de préfixe, les
             autres langues en ont un. Sans ça, `open /projekte` depuis /de
             quittait la locale et tombait en 404 — et l'aide donne maintenant
             un exemple par langue, donc chacun doit fonctionner. */
          window.location.assign(locale === defaultLocale ? target : `/${locale}${target}`);
        }
        break;
      }
      case "clear":
        setLines([]);
        break;
      case "date":
        printOutput(new Date().toISOString());
        break;
      case "echo":
        printOutput(args.join(" "));
        break;
      default:
        printOutput(t("errors.notFound", { cmd: cmd ?? "" }));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run(input);
    setInput("");
    setHistoryIdx(null);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(history[next] ?? "");
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section
      onClick={focus}
      onKeyDown={(e) => {
        if (e.key === "Enter" && document.activeElement !== inputRef.current) focus();
      }}
      className={
        embedded
          ? "overflow-hidden rounded-xl bg-screen-sunk font-mono text-[12.5px] text-screen-ink"
          : "overflow-hidden rounded-lg border border-screen bg-screen font-mono text-sm text-screen-ink shadow-lift-2"
      }
      aria-label={t("ariaLabel")}
    >
      {embedded ? null : (
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <span className="size-2.5 rounded-full bg-stop/80" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-copper/80" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-go/80" aria-hidden="true" />
          <span className="ml-2 text-[11px] text-screen-ink/60">
            {PROMPT_USER}@{PROMPT_HOST}: {cwd}
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        className={
          embedded
            ? "h-[212px] overflow-y-auto px-4 py-3 leading-relaxed"
            : "h-72 overflow-y-auto px-4 py-3 leading-relaxed"
        }
        aria-live="polite"
      >
        {lines.map((line) => {
          if (line.kind === "input") {
            return (
              <p key={line.id} className="whitespace-pre-wrap text-screen-ink/90">
                <Prompt cwd={line.cwd ?? cwd} />
                <span>{line.value}</span>
              </p>
            );
          }
          if (line.kind === "output") {
            return (
              <p key={line.id} className="whitespace-pre-wrap text-screen-ink/70">
                {line.value}
              </p>
            );
          }
          return (
            <div key={line.id} className="text-screen-ink/90">
              {line.node}
            </div>
          );
        })}

        <form onSubmit={onSubmit} className="flex items-center">
          <Prompt cwd={cwd} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label={t("inputLabel")}
            className="flex-1 border-0 bg-transparent text-screen-ink outline-none placeholder:text-screen-ink/40"
            placeholder={t("placeholder")}
          />
        </form>
      </div>
    </section>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="select-none text-screen-ink/70">
      <span className="text-go">{PROMPT_USER}</span>
      <span className="text-screen-ink/45">@</span>
      <span className="text-copper">{PROMPT_HOST}</span>
      <span className="text-screen-ink/45">:</span>
      <span className="text-steel">{cwd}</span>
      <span className="text-screen-ink/45">$ </span>
    </span>
  );
}
