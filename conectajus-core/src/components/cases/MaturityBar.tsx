import { formatPercent } from "@/lib/utils";

export function MaturityBar({ value }: { value: number }) {
  const label =
    value <= 30 ? "Caso incompleto" :
    value <= 60 ? "Parcialmente estruturado" :
    value <= 80 ? "Boa base de análise" :
    "Caso bem estruturado";
  return (
    <div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#F5D779]" style={{ width: formatPercent(value) }} />
      </div>
      <p className="mt-2 text-sm text-slate-600"><strong className="text-[#07182F]">{formatPercent(value)}</strong> — {label}</p>
    </div>
  );
}
