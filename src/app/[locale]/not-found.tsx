import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 container-px text-center"
    >
      <p className="text-sm uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link href="/" className="mt-4 underline underline-offset-4">
        {t("backHome")}
      </Link>
    </main>
  );
}
