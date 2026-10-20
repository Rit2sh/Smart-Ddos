import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart DDoS Shield | Autonomous Enterprise DDoS Mitigation & Threat Defense",
  description: "Enterprise-grade real-time defensive DDoS monitoring, telemetry ingestion, automated rate-limiting, and deep packet mitigation platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased selection:bg-brand-cyan/20 selection:text-brand-cyan min-h-screen">
        {children}
      </body>
    </html>
  );
}
