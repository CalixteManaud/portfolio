// Root layout passes children through — `[locale]/layout.tsx` owns <html> + <body>.
// Required by Next.js because the App Router needs a root layout file.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
