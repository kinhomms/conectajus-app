import { cn } from "@/lib/utils";

type CardProps = { children: React.ReactNode; className?: string };

export function Card({ children, className }: CardProps) {
  return <div className={cn("rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</div>;
}
