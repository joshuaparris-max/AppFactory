'use client';

import { PageHeader } from '@/components/page-header';
import { RiskBadge } from '@/components/project-badges';
import { Badge } from '@/components/ui/Badge';
import { useProjectStore } from '@/context/project-store';
import type { AgentRole } from '../../../lib/generator';

const columns: AgentRole[] = [
  'Foundation / architecture',
  'UI / UX',
  'Backend / integrations',
  'QA / tests / docs',
];

export default function TaskBoardPage() {
  const { projects } = useProjectStore();
  const tasks = projects.flatMap(project =>
    project.agentTasks.map(task => ({
      ...task,
      projectName: project.name,
      projectRisk: project.risk,
    }))
  );

  return (
    <>
      <PageHeader
        eyebrow="Agent task board"
        title="Split work without losing review control."
        description="Tasks come from the generator and preserve branch names, ownership boundaries, deliverables, and acceptance criteria for each project."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map(role => {
          const columnTasks = tasks.filter(task => task.role === role);

          return (
            <section
              key={role}
              className="min-h-64 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-zinc-950">{role}</h2>
                <Badge>{columnTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {columnTasks.map(task => (
                  <article
                    key={`${task.projectName}-${task.role}`}
                    className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <p className="text-sm font-semibold text-zinc-950">{task.projectName}</p>
                    <p className="mt-1 break-all text-xs font-medium text-zinc-500">
                      {task.branchName}
                    </p>
                    <p className="mt-3 text-sm leading-5 text-zinc-700">{task.mission}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <RiskBadge risk={task.projectRisk} />
                      <Badge>{task.ownedPaths.length} owned paths</Badge>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {task.deliverables.slice(0, 3).map(deliverable => (
                        <li key={deliverable} className="text-xs leading-5 text-zinc-600">
                          {deliverable}
                        </li>
                      ))}
                    </ul>
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
