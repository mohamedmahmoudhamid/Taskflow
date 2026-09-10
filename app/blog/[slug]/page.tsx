export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug.replaceAll("-", " ");

  return (
    <article className="panel">
      <p className="kicker">QUICK NOTE</p>
      <h1>{title}</h1>
      <p className="muted">
        A short space for ideas, notes, and useful reminders. Return to your task list when you are ready to turn the thought into action.
      </p>
    </article>
  );
}
