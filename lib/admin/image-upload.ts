/**
 * Browser-side helpers for admin media uploads.
 *
 * Images are compressed before they leave the browser: previews are screenshots
 * of long pages, so shrinking the bytes (and only capping the very large widths)
 * keeps uploads fast without cropping anything.
 */
export const maxUploadBytes = 10 * 1024 * 1024;
export const allowedUploadTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const maxWidth = 1920;
const maxHeight = 12000;
const reencodeThreshold = 320 * 1024;
const quality = 0.9;

export type PreparedImage = { file: File; compressed: boolean; originalBytes: number };

type DecodedImage = { source: CanvasImageSource; width: number; height: number; release: () => void };

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // Fall back to an <img> element below.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Gambar tidak dapat dibaca. Coba format JPG, PNG, WebP, atau AVIF."));
      element.src = url;
    });
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, release: () => URL.revokeObjectURL(url) };
  } catch (reason) {
    URL.revokeObjectURL(url);
    throw reason;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, encodeQuality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob), type, encodeQuality));
}

export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  if (!allowedUploadTypes.has(file.type)) {
    throw new Error(`${file.name} bukan gambar JPG, PNG, WebP, atau AVIF.`);
  }
  if (file.size === 0) throw new Error(`${file.name} kosong.`);

  const decoded = await decodeImage(file);
  try {
    const scale = Math.min(1, maxWidth / decoded.width, maxHeight / decoded.height);
    const untouched = { file, compressed: false, originalBytes: file.size };
    if (scale === 1 && file.size <= reencodeThreshold) return untouched;

    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return untouched;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(decoded.source, 0, 0, width, height);

    let blob = await canvasToBlob(canvas, "image/webp", quality);
    if (!blob || blob.type !== "image/webp") blob = await canvasToBlob(canvas, "image/jpeg", 0.88);
    if (!blob || blob.size >= file.size) return untouched;

    const extension = blob.type === "image/webp" ? "webp" : "jpg";
    const name = `${file.name.replace(/\.[^.]+$/, "") || "pratinjau"}.${extension}`;
    return {
      file: new File([blob], name, { type: blob.type, lastModified: Date.now() }),
      compressed: true,
      originalBytes: file.size,
    };
  } finally {
    decoded.release();
  }
}

export type UploadResult = { ok: boolean; status: number };

/** PUTs the file straight to Supabase Storage and reports real upload progress. */
export function putWithProgress(url: string, file: File, onProgress: (percent: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => resolve({ ok: request.status >= 200 && request.status < 300, status: request.status });
    request.onerror = () => reject(new TypeError("Network request failed"));
    request.onabort = () => reject(new TypeError("Upload aborted"));
    request.send(file);
  });
}
