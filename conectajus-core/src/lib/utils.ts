export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`;
}
