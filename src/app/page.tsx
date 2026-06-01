'use client';

import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  ListChecks,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { MetricCard } from '@/components/metric-card';
import { PageHeader } from '@/components/page-header';
import { ProjectCard } from '@/components/project-card';
import { ButtonLink } from '@/components/ui/Button';
import { useProjectStore } from '@/context/project-store';

export default function DashboardPage() {
  const { projects } = useProjectStore();
  const taskCount = projects.reduce((sum, project) => sum + project.agentTasks.length, 0);
  const highRisk = projects.filter(project => project.risk === 'high').length;
  const inProgress = projects.filter(
    project => project.status === 'planning' || project.status === 'ready-for-agents'
  ).length;
  const recentProjects = projects.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Command centre"
        title="Plan apps before agents build them."
        description="AppFactory captures ideas, turns them into reviewable build artifacts, and keeps every scaffold step behind an approval gate."
        action={<ButtonLink href="/new">Start new app</ButtonLink>}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Local projects"
          value={projects.length}
          detail="Stored in this browser"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <MetricCard
          label="In progress"
          value={inProgress}
          detail="Ready for scaffold"
          icon={<Sparkles className="h-5 w-5" />}
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

      {recentProjects.length > 0 && (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-zinc-950">Recent projects</h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recentProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-950">Your projects</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Click to view details, review specs, or export prompts
              </p>
            </div>
            {projects.length > 4 && (
              <ButtonLink href="/projects" variant="secondary">
                View all
              </ButtonLink>
            )}
          </div>
          {projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.slice(0, 4).map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-center">
              <FolderKanban className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">No projects yet</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Get started by creating your first app. We&apos;ll guide you through capturing your
                idea, generating a spec, and planning the scaffold.
              </p>
              <ButtonLink href="/new" className="mt-6">
                Create your first app
              </ButtonLink>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-950">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Foundation rules
            </h2>
            <div className="mt-4 space-y-3">
              {[
                'No secrets in project files',
                'No paid API calls in the MVP',
                'Every external integration is a placeholder',
                'Scaffold and deployment require Josh approval',
              ].map(item => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="leading-6 text-zinc-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {highRisk > 0 && (
            <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                {highRisk} high-risk {highRisk === 1 ? 'project' : 'projects'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                These projects need review before scaffolding. Review and approve them to proceed.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
