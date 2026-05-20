import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI for Aerial Robotics — Black Bee",
  description:
    "From perceptrons to the Nectar SDK detection workflow. A presentation on artificial intelligence for the Black Bee Drones team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bone text-ink antialiased">{children}</body>
    </html>
  );
}
