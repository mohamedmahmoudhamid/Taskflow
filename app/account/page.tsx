"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AccountPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <p className="muted">Loading your account...</p>;

  return (
    <section className="panel">
      <p className="kicker">ACCOUNT</p>
      <h1>{user.email}</h1>
      <p className="muted">You are signed in. Current role: {user.role}.</p>
      <div className="cards">
        <article className="mini-card">
          <h2>Session</h2>
          <p className="muted">Your session is securely stored on this device for quick access.</p>
        </article>
        <article className="mini-card">
          <h2>Tasks</h2>
          <p className="muted">Add, edit, complete, or remove tasks from your workspace.</p>
        </article>
        <article className="mini-card">
          <h2>Sign out</h2>
          <p className="muted">Use the sign out button in the navigation whenever you are finished.</p>
        </article>
      </div>
    </section>
  );
}
