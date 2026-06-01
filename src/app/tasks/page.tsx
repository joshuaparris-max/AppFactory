"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PhaseBadge, RiskBadge } from "@/components/project-badges";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/context/project-store";
import type { AgentTask } from "@/lib/types";

const columns = [
  { id: "backlog", label: "Backlog" },
  { id: "ready", label: "Ready" },
  { id: "in-progress", label: "In progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
] as const;

const owners: AgentTask["owner"][] = [
  "Codex C1",
  "UI Agent",
  "Integration Agent",
  "QA Agent",
];

export default function TaskBoardPage() {
  const { projects } = useProjectStore();
  const [projectFilter, setProjectFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");

  const tasks = useMemo(
    () =>
      projects
        .flatMap((project) =>
          project.agentTasks.map((task) => ({
            ...task,
            projectName: project.name,
          })),
        )
        .filter((task) => projectFilter === "all" || task.projectId === projectFilter)
        .filter((task) => ownerFilter === "all" || task.owner === ownerFilter),
    [ownerFilter, projectFilter, projects],
  );

  return (
    <>
      <PageHeader
        eyebrow="Agent task board"
        title="Split work without losing review control."
        description="Tasks are mock planning artifacts for the MVP. They define ownership, phase, risk, and acceptance criteria before another agent starts work."
      />

      <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <label className="block sm:min-w-64">
            <span className="text-xs font-medium text-zinc-500">Project</span>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            >
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:min-w-56">
            <span className="text-xs font-medium text-zinc-500">Owner</span>
            <select
              value={ownerFilter}
              onChange={(event) => setOwnerFilter(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            >
              <option value="all">All owners</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </label>
          <Badge>{tasks.length} tasks</Badge>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <section
              key={column.id}
              className="min-h-64 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-950">{column.label}</h2>
                <Badge>{columnTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <p className="text-sm font-semibold text-zinc-950">{task.title}</p>
                    <p className="mt-1 text-xs font-medium text-zinc-500">
                      {task.projectName} / {task.owner}
                    </p>
                    <p className="mt-3 text-sm leading-5 text-zinc-700">
                      {task.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <PhaseBadge phase={task.phase} />
                      <RiskBadge risk={task.risk} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
