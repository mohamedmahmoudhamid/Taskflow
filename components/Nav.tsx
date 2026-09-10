"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { CheckSquare, LogIn, LogOut } from "lucide-react";

const links = [
  { href: "/", label: "Overview" },
  { href: "/about", label: "About" },
  { href: "/todo", label: "Tasks" },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const isActive = (href: string) => mounted && pathname === href;

  return (
    <header className="nav-wrap">
      <nav className="nav-card">
        <Link href="/" className="brand">
          <span className="brand-mark"><CheckSquare size={19} /></span>
          Taskflow
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "nav-link active" : "nav-link"}
            >
              {link.label}
            </Link>
          ))}
          {ready && user ? (
            <>
              <Link href="/account" className={isActive("/account") ? "nav-link active" : "nav-link"}>
                Account
              </Link>
              <button type="button" className="nav-link nav-button" onClick={logout}>
                <LogOut size={15} />
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className={isActive("/login") ? "nav-link active" : "nav-link"}>
              <LogIn size={15} />
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
