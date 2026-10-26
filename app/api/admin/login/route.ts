import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const cookieName = "ws-admin-session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

function signingSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL?.trim();
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const secret = signingSecret();
  if (!url || !anonKey || !serviceKey || !secret) {
    return NextResponse.json({ error: "Konfigurasi CMS belum lengkap." }, { status: 503 });
  }

  let input: { email?: unknown; password?: unknown };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan login tidak valid." }, { status: 400 });
  }
  const email = typeof input.email === "string" ? input.email.trim().slice(0, 254) : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!email || !password || password.length > 1024) {
    return NextResponse.json({ error: "Email atau password tidak valid." }, { status: 400 });
  }

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: admin, error: adminError } = await adminClient
    .from("websensial_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (adminError || !admin) {
    await authClient.auth.signOut();
    return NextResponse.json({ error: "Akun ini belum diberi akses admin Websensial." }, { status: 403 });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds;
  const payload = Buffer.from(JSON.stringify({ sub: data.user.id, exp: expiresAt })).toString("base64url");
  const value = `${payload}.${sign(payload, secret)}`;
  const response = NextResponse.json({ ok: true, email: data.user.email });
  response.cookies.set(cookieName, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}

export function verifyAdminCookie(value: string | undefined, secret = signingSecret()) {
  if (!value || !secret) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, secret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: unknown; exp?: unknown };
    if (typeof parsed.sub !== "string" || typeof parsed.exp !== "number" || parsed.exp <= Date.now() / 1000) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}

export { cookieName };
