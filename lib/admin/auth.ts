import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { cookieName, verifyAdminCookie } from "@/app/api/admin/login/route";

export async function getAuthorizedAdminId() {
  const cookieStore = await cookies();
  const userId = verifyAdminCookie(cookieStore.get(cookieName)?.value);
  if (!userId) return null;

  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;

  const client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.from("websensial_admins").select("user_id").eq("user_id", userId).maybeSingle();
  return error || !data ? null : userId;
}
