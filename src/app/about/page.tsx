import { CheckCircle2, Github, ShieldCheck, Workflow } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/Badge';

const liveFeatures = [
  'Step-by-step app idea wizard',
  'LocalStorage project persistence',
  'Generated app spec, tech plan, risks, and checklist',
  'Four-agent prompt pack',
  'Scaffold preview and downloads',
  'Project duplicate, edit, regenerate, delete, search, and filters',
];

const placeholders = [
  'Live OpenAI generation',
  'GitHub repository creation',
  'Vercel production deployment automation',
  'Shared team accounts and cloud persistence',
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="AppFactory status and safety mode"
        description="A quick view of what is real in this MVP, what is intentionally stubbed, and what needs human approval before going live."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white">
              <Workflow className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">AppFactory</h2>
              <p className="mt-1 text-sm text-zinc-600">Round 3 local-first MVP</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoBlock label="Safety mode" value="Local-only / no live APIs" />
            <InfoBlock label="Build label" value="round3-polish-preview" />
            <InfoBlock label="Updated" value="June 2026" />
          </div>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                Human approval is still required before adding live API credentials, creating
                repositories, deploying production builds, or connecting external systems.
              </p>
            </div>
          </div>
        </section>

        <aside className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-zinc-950">Repository</h2>
          <a
            href="https://github.com/joshuaparris-max/AppFactory"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <Github className="h-4 w-4" />
            GitHub repo
          </a>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Deployments are preview-first. Production deploys should happen only after build checks,
            manual QA, and owner approval.
          </p>
        </aside>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FeatureList title="Live in this MVP" items={liveFeatures} tone="green" />
        <FeatureList title="Still placeholder-only" items={placeholders} tone="amber" />
      </div>
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-zinc-950">{value}</p>
    </div>
  );
}

function FeatureList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'green' | 'amber';
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        <Badge tone={tone}>{items.length}</Badge>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map(item => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
