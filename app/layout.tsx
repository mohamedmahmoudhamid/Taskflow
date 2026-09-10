import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskflow | Personal productivity",
  description: "A focused workspace for getting your most important tasks done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="scene">
            <div className="orb orb-a" />
            <div className="orb orb-b" />
            <div className="orb orb-c" />
            <Nav />
            <main className="shell">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
