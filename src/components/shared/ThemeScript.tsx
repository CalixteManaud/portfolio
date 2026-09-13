/**
 * Applique le thème avant le premier rendu.
 *
 * Sans ce script, la page peint d'abord le thème clair puis bascule : le
 * fameux flash blanc, qui est pire en sombre qu'en clair parce qu'il éblouit
 * quelqu'un qui a précisément choisi de ne pas l'être. Il doit donc être
 * synchrone et inline dans le <head> — un composant React arriverait trop tard.
 *
 * `suppressHydrationWarning` sur <html> est indispensable côté layout : ce
 * script modifie la classe avant que React ne compare le DOM au serveur.
 */
const SCRIPT = `(function(){try{
var s=localStorage.getItem("theme");
var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.classList.toggle("dark",d);
}catch(e){}})();`;

export function ThemeScript() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: script anti-flash synchrone, contenu statique sans donnée externe
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
