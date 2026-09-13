import {
  SiDocker,
  SiGit,
  SiGitlab,
  SiGrafana,
  SiHelm,
  SiJavascript,
  SiJenkins,
  SiKubernetes,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiPostgresql,
  SiPrometheus,
  SiPython,
  SiSonarqubeserver,
  SiSupabase,
  SiTerraform,
  SiTrivy,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import type { ComponentType, SVGProps } from "react";
import { AwsMark } from "@/components/icons/AwsMark";

export type Category = "cloud" | "devops" | "dev" | "security" | "monitoring" | "data" | "other";
type IconType = ComponentType<SVGProps<SVGSVGElement> & { color?: string }>;

/**
 * Les outils réellement pratiqués (CV, GitHub, confirmation du propriétaire).
 * Sur fond sombre, les marques bleu nuit (Helm, Trivy…) disparaîtraient dans
 * leur couleur officielle : elles sont éclaircies d'un cran, sans changer de teinte.
 */
export const TOOLS: Array<{ name: string; Icon: IconType; color?: string; cats: Category[] }> = [
  { name: "AWS", Icon: AwsMark, cats: ["cloud"] },
  { name: "Docker", Icon: SiDocker, color: "default", cats: ["devops"] },
  { name: "Kubernetes", Icon: SiKubernetes, color: "#5a92f2", cats: ["devops", "cloud"] },
  { name: "Terraform", Icon: SiTerraform, color: "#a47ade", cats: ["devops", "cloud"] },
  { name: "GitLab CI", Icon: SiGitlab, color: "default", cats: ["devops"] },
  { name: "Jenkins", Icon: SiJenkins, color: "default", cats: ["devops"] },
  { name: "Prometheus", Icon: SiPrometheus, color: "default", cats: ["monitoring"] },
  { name: "Grafana", Icon: SiGrafana, color: "default", cats: ["monitoring"] },
  { name: "Helm", Icon: SiHelm, color: "#7b9cf0", cats: ["devops", "cloud"] },
  { name: "Nginx", Icon: SiNginx, color: "default", cats: ["other"] },
  { name: "Next.js", Icon: SiNextdotjs, color: "currentColor", cats: ["dev"] },
  { name: "TypeScript", Icon: SiTypescript, color: "default", cats: ["dev"] },
  { name: "JavaScript", Icon: SiJavascript, color: "default", cats: ["dev"] },
  { name: "Python", Icon: SiPython, color: "#5a9fd4", cats: ["dev"] },
  { name: "Supabase", Icon: SiSupabase, color: "default", cats: ["data"] },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#7596e6", cats: ["data"] },
  { name: "MongoDB", Icon: SiMongodb, color: "default", cats: ["data"] },
  { name: "Trivy", Icon: SiTrivy, color: "#6b86ff", cats: ["security"] },
  { name: "SonarQube", Icon: SiSonarqubeserver, color: "#4aa3ff", cats: ["security"] },
  { name: "Git", Icon: SiGit, color: "default", cats: ["other"] },
];
