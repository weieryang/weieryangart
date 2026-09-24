import type { Metadata } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-sans-arabic";
import "../src/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://weieryangart.com"),
  title: "WEIERYANG Sculpture Studio",
  description: "Art-led custom sculpture with engineering, fabrication, export packing and overseas installation guidance.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
