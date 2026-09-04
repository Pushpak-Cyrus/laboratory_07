import type { Metadata } from "next";
import "./globals.css";
import "./profile.css";

export const metadata: Metadata = { title: "LABORATORY_07 — THE EXPERIMENT", description: "A personal research laboratory." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
