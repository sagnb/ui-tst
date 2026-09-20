import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  FileStack,
  ShieldCheck,
  UserCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/get-dictionary";
import { mockActiveProject, mockCurrentUser, mockPapers } from "@/shared/lib/mock-dashboard-data";
import { StatTile } from "@/shared/ui/StatTile";

const iconColorMap = {
  teal: "bg-relis-teal/15 text-relis-teal",
  blue: "bg-relis-blue/15 text-relis-blue",
  purple: "bg-relis-purple/15 text-relis-purple",
  orange: "bg-relis-orange/15 text-relis-orange",
} as const;

interface WorkflowCard {
  segment: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: keyof typeof iconColorMap;
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale as Locale);
  const projectBase = `/${locale}/projects/${mockActiveProject.id}`;

  const total = mockPapers.length;
  const processed = mockPapers.filter((p) => p.status !== "pending").length;
  const pending = mockPapers.filter((p) => p.status === "pending").length;
  const excluded = mockPapers.filter((p) => p.status === "excluded").length;

  const workflows: WorkflowCard[] = [
    { segment: "screening", ...dictionary.home.workflows.screening, icon: ClipboardList, color: "teal" },
    {
      segment: "quality-assessment",
      ...dictionary.home.workflows.qualityAssessment,
      icon: ShieldCheck,
      color: "blue",
    },
    {
      segment: "data-extraction",
      ...dictionary.home.workflows.dataExtraction,
      icon: FileSpreadsheet,
      color: "purple",
    },
    { segment: "reporting", ...dictionary.home.workflows.reporting, icon: BarChart3, color: "orange" },
  ];

  return (
    <div>
      <p className="text-sm text-slate-400">
        {dictionary.home.greeting.replace("{name}", mockCurrentUser.name)}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-white">{mockActiveProject.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-400">{mockActiveProject.description}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label={dictionary.home.statLabels.allPapers} value={total} icon={FileStack} color="blue" />
        <StatTile
          label={dictionary.home.statLabels.processedPapers}
          value={processed}
          icon={ClipboardList}
          color="teal"
        />
        <StatTile
          label={dictionary.home.statLabels.pendingPapers}
          value={pending}
          icon={ShieldCheck}
          color="orange"
        />
        <StatTile label={dictionary.home.statLabels.assignedToMe} value={total} icon={UserCheck} color="purple" />
        <StatTile
          label={dictionary.home.statLabels.excludedPapers}
          value={excluded}
          icon={XCircle}
          color="red"
        />
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold text-white">{dictionary.home.workflowsTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {workflows.map(({ segment, label, description, icon: Icon, color }) => (
          <Link
            key={segment}
            href={`${projectBase}/${segment}`}
            className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-relis-teal/40"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColorMap[color]}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
