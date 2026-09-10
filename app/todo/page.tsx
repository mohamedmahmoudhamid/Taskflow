"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { TODO_API } from "@/lib/config";
import { Check, ClipboardList, Pencil, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import styles from "./page.module.css";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

type Filter = "all" | "active" | "completed";

export default function TodoPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const getErrorMessage = useCallback(async (res: Response, fallback: string) => {
    try {
      const data = await res.json();
      return data.error || data.message || fallback;
    } catch {
      return fallback;
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${TODO_API}/todos`);
      if (!res.ok) throw new Error(await getErrorMessage(res, "Couldn't load your tasks."));
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load your tasks.");
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  useEffect(() => {
    if (!ready || !user) return;
    const task = window.setTimeout(() => {
      fetchTodos();
    }, 0);
    return () => window.clearTimeout(task);
  }, [ready, user, fetchTodos]);

  const addTodo = async (event?: FormEvent) => {
    event?.preventDefault();
    const value = todo.trim();
    if (!value || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${TODO_API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, completed: false }),
      });
      if (!res.ok) throw new Error(await getErrorMessage(res, "Couldn't add that task."));
      const created: Todo = await res.json();
      setTodos((current) => [...current, created]);
      setTodo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add that task.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCompleted = async (item: Todo) => {
    setError(null);
    // Optimistic update
    setTodos((current) =>
      current.map((t) => (t._id === item._id ? { ...t, completed: !t.completed } : t)),
    );
    try {
      const res = await fetch(`${TODO_API}/todos/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title, completed: !item.completed }),
      });
      if (!res.ok) throw new Error(await getErrorMessage(res, "Couldn't update that task."));
      const updated: Todo = await res.json();
      setTodos((current) => current.map((t) => (t._id === item._id ? updated : t)));
    } catch (err) {
      // Revert on failure
      setTodos((current) =>
        current.map((t) => (t._id === item._id ? { ...t, completed: item.completed } : t)),
      );
      setError(err instanceof Error ? err.message : "Couldn't update that task.");
    }
  };

  const startEdit = (item: Todo) => {
    setEditingId(item._id);
    setEditValue(item.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (item: Todo, event?: FormEvent) => {
    event?.preventDefault();
    const value = editValue.trim();
    if (!value) return;

    setError(null);
    try {
      const res = await fetch(`${TODO_API}/todos/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, completed: item.completed }),
      });
      if (!res.ok) throw new Error(await getErrorMessage(res, "Couldn't save that edit."));
      const updated: Todo = await res.json();
      setTodos((current) => current.map((t) => (t._id === item._id ? updated : t)));
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that edit.");
    }
  };

  const deleteTodo = async (id: string) => {
    setError(null);
    const previous = todos;
    setTodos((current) => current.filter((t) => t._id !== id));
    try {
      const res = await fetch(`${TODO_API}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await getErrorMessage(res, "Couldn't delete that task."));
    } catch (err) {
      setTodos(previous);
      setError(err instanceof Error ? err.message : "Couldn't delete that task.");
    }
  };

  const completedCount = todos.filter((item) => item.completed).length;
  const activeCount = todos.length - completedCount;
  const visibleTodos = todos.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  if (!ready || !user) {
    return <p className="muted">Loading your workspace...</p>;
  }

  return (
    <div className={styles.page}>
      <main className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><Sparkles size={14} /> Personal workspace</p>
            <h1 className={styles.title}>Your tasks, in focus.</h1>
            <p className={styles.subtitle}>Turn today&apos;s priorities into visible progress.</p>
          </div>
          <div className={styles.progressBadge}>
            <span className={styles.progressValue}>{completedCount}</span>
            <span>of {todos.length} done</span>
          </div>
        </header>

        <section className={styles.stats} aria-label="Task summary">
          <div className={styles.statCard}><span className={`${styles.statIcon} ${styles.blue}`}><ClipboardList size={18} /></span><span><strong>{todos.length}</strong><small>Total tasks</small></span></div>
          <div className={styles.statCard}><span className={`${styles.statIcon} ${styles.orange}`}><Sparkles size={18} /></span><span><strong>{activeCount}</strong><small>In progress</small></span></div>
          <div className={styles.statCard}><span className={`${styles.statIcon} ${styles.green}`}><Check size={18} /></span><span><strong>{completedCount}</strong><small>Completed</small></span></div>
        </section>

        <form className={styles.inputRow} onSubmit={addTodo}>
          <input
            type="text"
            className={styles.input}
            placeholder="What needs to be done?"
            value={todo}
            onChange={(event) => setTodo(event.target.value)}
            disabled={submitting}
          />
          <button type="submit" className={styles.addButton} disabled={submitting}>
            <Plus size={18} />
            {submitting ? "Adding..." : "Add task"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.toolbar}>
          <div className={styles.filterTabs} role="tablist" aria-label="Filter tasks">
            {(["all", "active", "completed"] as Filter[]).map((option) => (
              <button key={option} type="button" className={filter === option ? styles.filterActive : styles.filter} onClick={() => setFilter(option)} role="tab" aria-selected={filter === option}>
                {option === "all" ? "All tasks" : option === "active" ? "In progress" : "Completed"}
              </button>
            ))}
          </div>
          <span className={styles.taskCount}>{visibleTodos.length} {visibleTodos.length === 1 ? "task" : "tasks"}</span>
        </div>

        {loading ? (
          <p className={styles.empty}>Loading your tasks...</p>
        ) : visibleTodos.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}><ClipboardList size={28} /></span>
            <strong>{todos.length === 0 ? "Your list is ready" : "Nothing here yet"}</strong>
            <p>{todos.length === 0 ? "Add a task above and make your day count." : "Try another filter to see more tasks."}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {visibleTodos.map((item) => (
              <li key={item._id} className={styles.item}>
                {editingId === item._id ? (
                  <form className={styles.editRow} onSubmit={(e) => saveEdit(item, e)}>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className={styles.saveButton}>
                      <Save size={15} />
                      Save
                    </button>
                    <button type="button" className={styles.cancelButton} onClick={cancelEdit}>
                      <X size={15} />
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`${styles.checkbox} ${item.completed ? styles.checkboxChecked : ""}`}
                      onClick={() => toggleCompleted(item)}
                      aria-label={item.completed ? "Mark as active" : "Mark as completed"}
                    >
                      {item.completed && <Check size={15} strokeWidth={3} />}
                    </button>
                    <span className={`${styles.itemText} ${item.completed ? styles.itemDone : ""}`}>
                      {item.title}
                    </span>
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.title}`}
                        title="Edit task"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => deleteTodo(item._id)}
                        aria-label={`Delete ${item.title}`}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}