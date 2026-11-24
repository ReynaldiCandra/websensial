import { NextResponse } from "next/server";
import { getAuthorizedAdminId } from "@/lib/admin/auth";
import { getStoredWebContent, saveWebContent, validateWebContent, type WebContent } from "@/lib/admin/site-content";
import { validateServices } from "@/lib/admin/home-content";

export async function GET() {
  if (!(await getAuthorizedAdminId())) return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });
  try {
    // Strict: the editor must never receive the bundled demo catalog, because
    // saving that would overwrite the real content stored in Supabase.
    const content = await getStoredWebContent({ strict: true });
    if (!content) {
      return NextResponse.json(
        { error: "Konten tersimpan tidak dapat dibaca. Coba muat ulang; editor tidak menampilkan konten bawaan demi menjaga data tersimpan." },
        { status: 503 },
      );
    }
    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load CMS content for the admin panel.", error);
    return NextResponse.json(
      { error: "CMS Websensial tidak dapat dihubungi. Konten Anda tersimpan di Supabase: periksa proyek Supabase (paused/terhapus) serta variabel SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY, lalu coba lagi." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdminId())) return NextResponse.json({ error: "Silakan masuk sebagai admin." }, { status: 401 });

  let content: unknown;
  try {
    content = await request.json();
  } catch {
    return NextResponse.json({ error: "Format konten tidak valid." }, { status: 400 });
  }
  if (JSON.stringify(content).length > 2_000_000) {
    return NextResponse.json({ error: "Ukuran data konten melebihi batas." }, { status: 413 });
  }
  const validationError = validateWebContent(content);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
  const servicesError = content && typeof content === "object" && "services" in content
    ? validateServices(content.services)
    : null;
  if (servicesError) return NextResponse.json({ error: servicesError }, { status: 400 });

  try {
    await saveWebContent(content as WebContent);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save CMS content.", error);
    return NextResponse.json({ error: "Konten gagal disimpan." }, { status: 500 });
  }
}
