import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthorizedAdminId } from "@/lib/admin/auth";
import { getCmsAdminClient, getStoredWebContent } from "@/lib/admin/site-content";

const bucket = "websensial-media";
const storageUrl = () => process.env.SUPABASE_URL?.trim();
const adminKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

async function getAdminClient() {
  const userId = await getAuthorizedAdminId();
  const url = storageUrl();
  const key = adminKey();
  return userId && url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

async function storageObject(client: ReturnType<typeof getCmsAdminClient>, publicUrl: string) {
  const url = storageUrl();
  if (!client || !url) return null;
  const prefix = `${url}/storage/v1/object/public/${bucket}/`;
  if (!publicUrl.startsWith(prefix)) return null;
  const path = decodeURIComponent(publicUrl.slice(prefix.length));
  if (!path || path.includes("..") || !/^(portfolio|products)\/[a-zA-Z0-9._-]+$/.test(path)) return null;
  return path;
}

export async function GET() {
  const client = await getAdminClient();
  if (!client) return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });
  const { data, error } = await client.storage.from(bucket).list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
  if (error) return NextResponse.json({ error: "Media gagal dimuat." }, { status: 500 });
  const folders = (data ?? []).filter((item) => item.id === null && ["portfolio", "products"].includes(item.name));
  const nested = await Promise.all(folders.map(async ({ name: folder }) => {
    const { data: files } = await client.storage.from(bucket).list(folder, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
    return (files ?? []).filter((item) => item.id !== null).map((item) => {
      const path = `${folder}/${item.name}`;
      return {
        name: item.name,
        url: client.storage.from(bucket).getPublicUrl(path).data.publicUrl,
        width: Number(item.metadata?.width ?? 0),
        height: Number(item.metadata?.height ?? 0),
        bytes: Number(item.metadata?.size ?? 0),
      };
    });
  }));
  return NextResponse.json(nested.flat(), { headers: { "Cache-Control": "no-store" } });
}

// Image bytes are uploaded from the browser to Supabase Storage through the
// signed URL issued by /api/admin/media/sign; see that route for why.
export async function DELETE(request: Request) {
  if (!(await getAuthorizedAdminId())) return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });
  const client = getCmsAdminClient();
  if (!client) return NextResponse.json({ error: "CMS belum dikonfigurasi." }, { status: 503 });
  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan hapus tidak valid." }, { status: 400 });
  }
  const path = typeof body.url === "string" ? await storageObject(client, body.url) : null;
  if (!path) return NextResponse.json({ error: "Gambar ini bukan bagian dari media Websensial." }, { status: 400 });
  const currentContent = await getStoredWebContent();
  if (!currentContent) return NextResponse.json({ error: "Konten CMS tidak dapat diverifikasi; file tidak dihapus." }, { status: 503 });
  const isReferenced = [
    ...currentContent.portfolio.flatMap((item) => [item.previewPath, ...(item.previewPaths ?? [])]),
    ...currentContent.products.flatMap((item) => item.previews),
  ].includes(body.url as string);
  if (isReferenced) return NextResponse.json({ error: "Gambar masih digunakan. Lepas referensinya dan simpan perubahan terlebih dahulu." }, { status: 409 });
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) return NextResponse.json({ error: "Gambar gagal dihapus." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
