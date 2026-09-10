import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="hero-grid">
      <section className="panel">
        <p className="kicker">PERSONAL PRODUCTIVITY</p>
        <h1>Make room for the work that matters.</h1>
        <p className="muted">
          Taskflow brings your daily priorities into one calm, focused workspace. Capture tasks, keep momentum, and finish with confidence.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Link href="/login" className="primary" style={{ display: "inline-block" }}>
            Get started <ArrowRight size={16} />
          </Link>
          <Link href="/todo" className="ghost" style={{ display: "inline-block" }}>
            Open task list <LayoutDashboard size={16} />
          </Link>
        </div>
      </section>
      <aside className="panel">
        <h2>Built for clarity</h2>
        <p className="muted">A lightweight task system that keeps your attention on the next meaningful step.</p>
      </aside>
      <div className="cards" style={{ gridColumn: "1 / -1" }}>
        <article className="mini-card">
          <h2><Zap size={18} /> Fast capture</h2>
          <p className="muted">Add a task in seconds and keep moving without losing your train of thought.</p>
        </article>
        <article className="mini-card">
          <h2><ShieldCheck size={18} /> Private by default</h2>
          <p className="muted">Your workspace is connected to your account and stays personal.</p>
        </article>
        <article className="mini-card">
          <h2><CheckCircle2 size={18} /> Clear progress</h2>
          <p className="muted">Simple statuses and useful summaries make progress easy to see.</p>
        </article>
      </div>
    </div>
  );
}
