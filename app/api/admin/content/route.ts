import { NextResponse } from "next/server";
import { getAuthorizedAdminId } from "@/lib/admin/auth";
import { getWebContent, saveWebContent, type WebContent } from "@/lib/admin/site-content";

export async function GET() {
  if (!(await getAuthorizedAdminId())) return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });
  return NextResponse.json(await getWebContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdminId())) return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });

  let content: unknown;
  try {
    content = await request.json();
  } catch {
    return NextResponse.json({ error: "Format konten tidak valid." }, { status: 400 });
  }
  if (!content || typeof content !== "object" || !Array.isArray((content as WebContent).portfolio) || !Array.isArray((content as WebContent).products)) {
    return NextResponse.json({ error: "Data portofolio dan template harus berupa daftar." }, { status: 400 });
  }
  if (JSON.stringify(content).length > 2_000_000) {
    return NextResponse.json({ error: "Ukuran data konten melebihi batas." }, { status: 413 });
  }

  try {
    await saveWebContent(content as WebContent);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save CMS content.", error);
    return NextResponse.json({ error: "Konten gagal disimpan." }, { status: 500 });
  }
}
