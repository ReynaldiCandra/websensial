import Image from "next/image";

export default function Logo({ className = "h-auto w-36" }: { className?: string }) {
  return (
    <Image
      src="/Logo Websensial dengan Aksen Biru.png"
      alt=""
      aria-hidden="true"
      width={2170}
      height={725}
      className={`ws-brand-logo ${className}`}
      priority
    />
  );
}
