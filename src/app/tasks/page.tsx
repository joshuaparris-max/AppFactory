"use client";

import { PageHeader } from "@/components/page-header";
import { PhaseBadge, RiskBadge } from "@/components/project-badges";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/context/project-store";

const columns = [
  { id: "backlog", label: "Backlog" },
  { id: "ready", label: "Ready" },
  { id: "in-progress", label: "In progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
] as const;

export default function TaskBoardPage() {
  const { projects } = useProjectStore();
  const tasks = projects.flatMap((project) =>
    project.agentTasks.map((task) => ({ ...task, projectName: project.name })),
  );

  return (
    <>
      <PageHeader
        eyebrow="Agent task board"
        title="Split work without losing review control."
        description="Tasks are mock planning artifacts for the MVP. They define ownership, phase, risk, and acceptance criteria before another agent starts work."
      />

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
