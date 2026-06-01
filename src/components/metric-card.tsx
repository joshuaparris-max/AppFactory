import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm transition hover:shadow-md hover:border-zinc-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">{label}</p>
        <span className="rounded-md bg-zinc-100 p-2 text-zinc-700">{icon}</span>
      </div>
      <p className="mt-3 text-4xl font-bold text-zinc-950">{value}</p>
      <p className="mt-2 text-sm text-zinc-600">{detail}</p>
    </div>
  );
}
