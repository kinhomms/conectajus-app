import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "warning" | "danger" | "success";
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  const tones = {
    default: "bg-blue-50 text-blue-800",
    warning: "bg-yellow-50 text-yellow-800",
    danger: "bg-red-50 text-red-800",
    success: "bg-emerald-50 text-emerald-800",
  };
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black", tones[tone])}>{children}</span>;
}
