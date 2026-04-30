"use client";

import { useEffect, useRef, useState } from "react";

type Line = {
  id: number;
  kind: "input" | "output" | "html";
  value: string;
  cwd?: string;
  node?: React.ReactNode;
};

const PROMPT_USER = "you";
const PROMPT_HOST = "portfolio";
const INITIAL_CWD = "~";

const HELP_LINES = [
  "Available commands:",
  "  help              show this list",
  "  whoami            who's behind this site",
  "  ls                list sections",
  "  cat <section>    read a section (e.g. cat about, cat stack)",
  "  open <path>       navigate (e.g. open /projects)",
  "  clear             clear the terminal",
  "  date              current date",
  "  echo <text>       print text",
];

const SECTIONS: Record<string, string[]> = {
  about: [
    "DevOps / DevSecOps engineer & web developer.",
    "Pipelines, secure platforms, web experiences that hold the line.",
  ],
  stack: [
    "Core: TypeScript, Go, Python, Bash",
    "Infra: Kubernetes, Terraform, AWS, Docker",
    "CI/CD: GitHub Actions, GitLab CI, ArgoCD",
    "Security: Trivy, Snyk, Vault, Sigstore",
    "Web: Next.js, React, R3F, Tailwind",
  ],
  contact: ["Email: hi@example.dev", "Tip: try `open /contact` to use the form."],
};

const SECTION_NAMES = Object.keys(SECTIONS);

export function Terminal() {
  const idRef = useRef(1);
  const nextId = () => idRef.current++;

  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, kind: "output", value: "Welcome. Type `help` to start." },
  ]);
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
        printOutput(...HELP_LINES);
        break;
      case "whoami":
        printOutput("guest@portfolio · DevOps & web engineer");
        break;
      case "ls":
        printOutput(SECTION_NAMES.map((s) => `${s}.md`).join("  "));
        break;
      case "cat": {
        const target = args[0];
        if (!target) {
          printOutput("usage: cat <section>");
          break;
        }
        const key = target.replace(/\.md$/, "");
        const out = SECTIONS[key];
        if (!out) printOutput(`cat: ${target}: no such file`);
        else printOutput(...out);
        break;
      }
      case "open": {
        const path = args[0];
        if (!path) {
          printOutput("usage: open <path>");
          break;
        }
        if (typeof window !== "undefined") {
          window.location.assign(path.startsWith("/") ? path : `/${path}`);
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
        printOutput(`${cmd}: command not found. Try \`help\`.`);
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
      className="overflow-hidden rounded-lg border border-border/60 bg-[#0b0b14] font-mono text-sm shadow-inner"
      aria-label="Interactive terminal"
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
        <span className="ml-2 text-[11px] text-foreground/55">
          {PROMPT_USER}@{PROMPT_HOST}: {cwd}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-3 leading-relaxed"
        aria-live="polite"
      >
        {lines.map((line) => {
          if (line.kind === "input") {
            return (
              <p key={line.id} className="whitespace-pre-wrap text-foreground/85">
                <Prompt cwd={line.cwd ?? cwd} />
                <span>{line.value}</span>
              </p>
            );
          }
          if (line.kind === "output") {
            return (
              <p key={line.id} className="whitespace-pre-wrap text-foreground/65">
                {line.value}
              </p>
            );
          }
          return (
            <div key={line.id} className="text-foreground/85">
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
            aria-label="Terminal input"
            className="flex-1 border-0 bg-transparent text-foreground/90 outline-none placeholder:text-foreground/40"
            placeholder="type `help` and press Enter…"
          />
        </form>
      </div>
    </section>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="select-none text-foreground/70">
      <span className="text-emerald-400">{PROMPT_USER}</span>
      <span className="text-foreground/45">@</span>
      <span className="text-violet-400">{PROMPT_HOST}</span>
      <span className="text-foreground/45">:</span>
      <span className="text-sky-400">{cwd}</span>
      <span className="text-foreground/45">$ </span>
    </span>
  );
}
