import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "yellow";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-green text-white hover:bg-green-dark shadow-card",
  secondary: "bg-white text-ink border border-line hover:border-green hover:text-green",
  ghost: "text-ink hover:bg-green-soft",
  yellow: "bg-yellow text-ink hover:brightness-95 shadow-card"
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base"
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export function Button({ variant = "primary", size = "md", href, className, children, ...rest }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 font-display font-bold rounded-full transition-all duration-200 ease-brand",
    variants[variant], sizes[size], className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
