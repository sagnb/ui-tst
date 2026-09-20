import type { LucideIcon } from "lucide-react";

const colorMap = {
  teal: "from-relis-teal/20 text-relis-teal",
  blue: "from-relis-blue/20 text-relis-blue",
  red: "from-relis-red/20 text-relis-red",
  orange: "from-relis-orange/20 text-relis-orange",
  purple: "from-relis-purple/20 text-relis-purple",
} as const;

interface StatTileProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: keyof typeof colorMap;
}

export function StatTile({ label, value, icon: Icon, color = "teal" }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10">
      <div
        className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br to-transparent ${colorMap[color]}`}
      >
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}
