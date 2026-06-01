"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PhaseBadge, RiskBadge } from "@/components/project-badges";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-zinc-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const { getProject } = useProjectStore();
  const project = getProject(params.projectId);

  if (!project) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-600">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-zinc-950">Project not found</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This project is not present in localStorage for this browser.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Project detail"
        title={project.name}
        description={project.idea}
        action={
          <ButtonLink href="/tasks" variant="secondary">
            Open task board
            <ExternalLink className="h-4 w-4" />
          </ButtonLink>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <PhaseBadge phase={project.phase} />
        <RiskBadge risk={project.risk} />
        <Badge>{project.status.replaceAll("-", " ")}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-950">App spec</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-zinc-500">Audience</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-700">
                  {project.appSpec.audience}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500">Problem</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-700">
                  {project.appSpec.problem}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <ListBlock title="Core features" items={project.appSpec.coreFeatures} />
            <ListBlock title="Non-goals" items={project.appSpec.nonGoals} />
            <ListBlock title="Technical plan" items={project.technicalPlan} />
            <ListBlock title="Scaffold plan" items={project.scaffoldPlan} />
          </div>
        </div>

        <aside className="space-y-6">
          <ListBlock title="Clarifying questions" items={project.clarifyingQuestions} />
          <ListBlock title="Review checklist" items={project.reviewChecklist} />
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-zinc-950">Export prompts</h2>
              <Copy className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="mt-4 space-y-3">
              {project.exportPrompts.map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm leading-6 text-zinc-700"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
