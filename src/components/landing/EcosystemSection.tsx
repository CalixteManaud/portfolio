import {
  SiGitlab,
  SiGrafana,
  SiJenkins,
  SiKubernetes,
  SiNextdotjs,
  SiPrometheus,
  SiReact,
  SiTerraform,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { AwsMark } from "@/components/icons/AwsMark";
import { SectionHead } from "./SectionHead";

type IconProps = SVGProps<SVGSVGElement> & { color?: string };

/** Les outils réellement pratiqués (CV, expérience freelance, certifications),
 *  dans l'ordre de la maquette. Couleurs de marque, sauf Next.js dont le noir
 *  disparaîtrait en thème sombre. */
const TOOLS: Array<{ name: string; Icon: ComponentType<IconProps>; color?: string }> = [
  { name: "GitLab CI", Icon: SiGitlab, color: "default" },
  { name: "Jenkins", Icon: SiJenkins, color: "default" },
  { name: "Terraform", Icon: SiTerraform, color: "default" },
  { name: "Kubernetes", Icon: SiKubernetes, color: "default" },
  { name: "Prometheus", Icon: SiPrometheus, color: "default" },
  { name: "Grafana", Icon: SiGrafana, color: "default" },
  { name: "AWS", Icon: AwsMark },
  { name: "Next.js", Icon: SiNextdotjs, color: "currentColor" },
  { name: "React", Icon: SiReact, color: "default" },
  { name: "TypeScript", Icon: SiTypescript, color: "default" },
];

export async function EcosystemSection() {
  const t = await getTranslations("Landing.ecosystem");

  return (
    <section aria-labelledby="ecosystem-title" className="pt-12 lg:pt-[40px]">
      <div className="container-page">
        <SectionHead
          id="ecosystem-title"
          kicker={t("kicker")}
          title={t("title")}
          aside={t("aside")}
        />

        <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-10">
          {TOOLS.map(({ name, Icon, color }) => (
            <li
              key={name}
              className="flex h-[94px] flex-col items-center justify-center gap-2.5 rounded-xl border border-rule/80 bg-chalk text-ink shadow-lift-1 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift-2"
            >
              <Icon className="h-8 w-auto max-w-11" color={color} aria-hidden="true" />
              <span className="text-[12.5px] font-medium">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
