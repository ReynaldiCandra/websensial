import { NextResponse } from "next/server";
import { getAuthorizedAdminId } from "@/lib/admin/auth";
import { getCmsAdminClient } from "@/lib/admin/site-content";

// Terms documents go straight from the browser to Supabase Storage. Keeping
// this separate from the image signer makes the PDF-only rule explicit.
const bucket = "websensial-media";
const maxBytes = 10 * 1024 * 1024;
const storageUrl = () => process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");

export async function POST(request: Request) {
  if (!(await getAuthorizedAdminId())) {
    return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });
  }
  const client = getCmsAdminClient();
  const base = storageUrl();
  if (!client || !base) return NextResponse.json({ error: "CMS belum dikonfigurasi." }, { status: 503 });

  let body: { contentType?: unknown; size?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan unggah tidak valid." }, { status: 400 });
  }
  const contentType = typeof body.contentType === "string"
    ? body.contentType.split(";")[0].trim().toLowerCase()
    : "";
  const size = typeof body.size === "number" ? body.size : 0;
  if (contentType !== "application/pdf") {
    return NextResponse.json({ error: "Dokumen harus berupa file PDF." }, { status: 400 });
  }
  if (!Number.isFinite(size) || size <= 0 || size > maxBytes) {
    return NextResponse.json({ error: "Ukuran PDF harus di bawah 10 MB." }, { status: 400 });
  }

  const path = `documents/${crypto.randomUUID()}.pdf`;
  const { data, error } = await client.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data?.token) {
    console.error("Failed to sign a terms document upload.", error);
    return NextResponse.json({ error: "Dokumen gagal disiapkan untuk diunggah." }, { status: 500 });
  }

  return NextResponse.json({
    uploadUrl: `${base}/storage/v1/object/upload/sign/${bucket}/${data.path}?token=${encodeURIComponent(data.token)}`,
    publicUrl: client.storage.from(bucket).getPublicUrl(path).data.publicUrl,
  });
}
