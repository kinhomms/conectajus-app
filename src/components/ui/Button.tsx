import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "gold";
  className?: string;
};

export function Button({ children, href, variant = "primary", className }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition hover:-translate-y-0.5";
  const variants = {
    primary: "bg-[#07182F] text-white shadow-lg shadow-slate-900/10",
    secondary: "border border-slate-300 bg-white text-[#07182F]",
    gold: "bg-[#C9A227] text-[#07182F]",
  };
  const classes = cn(base, variants[variant], className);
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}
