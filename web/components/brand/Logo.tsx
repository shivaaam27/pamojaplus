import { cn } from "@/lib/cn";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-extrabold", className)}>
      <LogoMark size={size} />
      <span className="text-ink text-xl tracking-tight">Pamoja<span className="text-green">+</span></span>
    </span>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      {/* Green community dots arranged around a yellow star */}
      <g fill="#2BB24C">
        <circle cx="32" cy="8" r="4" />
        <circle cx="55" cy="20" r="4" />
        <circle cx="55" cy="44" r="4" />
        <circle cx="32" cy="56" r="4" />
        <circle cx="9" cy="44" r="4" />
        <circle cx="9" cy="20" r="4" />
      </g>
      {/* Yellow 4-point star */}
      <path d="M32 14 L38 28 L52 32 L38 36 L32 50 L26 36 L12 32 L26 28 Z" fill="#F5C518" />
      <path d="M32 26 L34 31 L39 32 L34 33 L32 38 L30 33 L25 32 L30 31 Z" fill="#FFFFFF" />
    </svg>
  );
}
