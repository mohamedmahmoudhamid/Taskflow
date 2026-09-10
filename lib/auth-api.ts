import { AUTH_API } from "./config";
import type { AuthResponse, AuthUser } from "./types";

function cleanUser(user?: AuthResponse["user"]): AuthUser | null {
  if (!user?._id || !user.email) return null;
  return { _id: user._id, email: user.email, role: user.role || "user" };
}

export async function registerUser(email: string, password: string, name?: string) {
  const res = await fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data: AuthResponse = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "تعذر إنشاء الحساب.");
  return { message: data.message, user: cleanUser(data.user) };
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data: AuthResponse = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "البريد أو كلمة المرور غير صحيحة.");
  const user = cleanUser(data.user);
  if (!data.token || !user) throw new Error("تعذر تسجيل الدخول.");
  return { token: data.token, user, message: data.message };
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMe(token: string) {
  const res = await fetch(`${AUTH_API}/me`, { headers: authHeaders(token) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function fetchProtected(token: string) {
  const res = await fetch(`${AUTH_API}/protected`, { headers: authHeaders(token) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function fetchAdmin(token: string) {
  const res = await fetch(`${AUTH_API}/admin`, { headers: authHeaders(token) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
