"use client";

import { AlertTriangle, CheckCircle2, FolderKanban, ListChecks } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";

export default function DashboardPage() {
  const { projects } = useProjectStore();
  const taskCount = projects.reduce((sum, project) => sum + project.agentTasks.length, 0);
  const highRisk = projects.filter((project) => project.risk === "high").length;

  return (
    <>
      <PageHeader
        eyebrow="Command centre"
        title="Plan apps before agents build them."
        description="AppFactory captures ideas, turns them into reviewable build artifacts, and keeps every scaffold step behind an approval gate."
        action={<ButtonLink href="/new">Start new app</ButtonLink>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Local projects"
          value={projects.length}
          detail="Stored in this browser"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <MetricCard
          label="Agent tasks"
          value={taskCount}
          detail="Ready for scoped handoff"
          icon={<ListChecks className="h-5 w-5" />}
        />
        <MetricCard
          label="High-risk plans"
          value={highRisk}
          detail="Require review before scaffold"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950">Recent projects</h2>
            <ButtonLink href="/projects" variant="secondary">
              View all
            </ButtonLink>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Foundation rules</h2>
          <div className="mt-4 space-y-4">
            {[
              "No secrets in project files",
              "No paid API calls in the MVP",
              "Every external integration is a placeholder",
              "Scaffold and deployment require Josh approval",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-zinc-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
