import { KeyRound, PlugZap, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/Badge";

const settings = [
  {
    title: "OpenAI connector",
    status: "Placeholder",
    icon: KeyRound,
    detail: "Model calls stay disabled until an approved key-management flow exists.",
  },
  {
    title: "GitHub workflow",
    status: "Placeholder",
    icon: PlugZap,
    detail: "Future work can create branches, commits, and PRs behind explicit review gates.",
  },
  {
    title: "Vercel deployment",
    status: "Placeholder",
    icon: ShieldCheck,
    detail: "Deployments will require Josh approval and environment checks before execution.",
  },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Safe integration boundaries"
        description="The MVP documents where integrations will live without requiring secrets, accounts, or paid APIs."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <section
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-zinc-100 text-zinc-700">
                  <Icon className="h-5 w-5" />
                </span>
                <Badge tone="amber">{item.status}</Badge>
              </div>
              <h2 className="mt-5 text-base font-semibold text-zinc-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.detail}</p>
            </section>
          );
        })}
      </div>
    </>
  );
}
