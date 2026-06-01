import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:outline-zinc-950",
  secondary:
    "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-zinc-600",
  subtle:
    "bg-transparent text-zinc-700 hover:bg-zinc-100 focus-visible:outline-zinc-600",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-700",
};

const base =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} href={href} {...props}>
      {children}
    </Link>
  );
}
