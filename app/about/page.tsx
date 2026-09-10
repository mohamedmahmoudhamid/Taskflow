export default function About() {
  return (
    <section className="panel">
      <p className="kicker">ABOUT TASKFLOW</p>
      <h1>A quieter way to get things done.</h1>
      <p className="muted">
        Taskflow combines a focused task list with a simple, secure account experience. Every part of the workspace is designed to reduce friction between intention and action.
      </p>
      <div className="cards">
        <article className="mini-card">
          <h2>Task management</h2>
          <p className="muted">Create, edit, complete, and remove tasks without leaving the page.</p>
        </article>
        <article className="mini-card">
          <h2>Your account</h2>
          <p className="muted">Sign up or sign in with your email and password.</p>
        </article>
        <article className="mini-card">
          <h2>Protected workspace</h2>
          <p className="muted">Protected routes verify your session before showing private data.</p>
        </article>
      </div>
    </section>
  );
}
