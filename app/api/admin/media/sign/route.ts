import { NextResponse } from "next/server";
import { getAuthorizedAdminId } from "@/lib/admin/auth";
import { getCmsAdminClient } from "@/lib/admin/site-content";

// Uploads must travel straight from the browser to Supabase Storage. Vercel
// rejects request bodies above ~4.5 MB before a route handler runs, so proxying
// a 10 MB preview through the server fails with a network error in the browser.
// This endpoint only authorizes the upload and signs its destination.
const bucket = "websensial-media";
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const storageUrl = () => process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");

export async function POST(request: Request) {
  if (!(await getAuthorizedAdminId())) {
    return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });
  }
  const client = getCmsAdminClient();
  const base = storageUrl();
  if (!client || !base) return NextResponse.json({ error: "CMS belum dikonfigurasi." }, { status: 503 });

  let body: { section?: unknown; contentType?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan unggah tidak valid." }, { status: 400 });
  }
  const section = body.section;
  const contentType = typeof body.contentType === "string"
    ? body.contentType.split(";")[0].trim().toLowerCase()
    : "";
  const extension = extensions[contentType];
  if (!(section === "portfolio" || section === "products") || !extension) {
    return NextResponse.json({ error: "Gambar harus JPG, PNG, WebP, atau AVIF." }, { status: 400 });
  }

  const path = `${section}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await client.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data?.signedUrl) {
    console.error("Failed to sign a CMS media upload.", error);
    return NextResponse.json({ error: "Gambar gagal disiapkan untuk diunggah." }, { status: 500 });
  }

  return NextResponse.json({
    uploadUrl: `${base}${data.signedUrl.startsWith("/") ? "" : "/"}${data.signedUrl}`,
    publicUrl: client.storage.from(bucket).getPublicUrl(path).data.publicUrl,
  });
}
