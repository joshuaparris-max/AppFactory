import Link from "next/link";
import { ArrowRight, Calendar, Zap } from "lucide-react";
import { PhaseBadge, RiskBadge } from "@/components/project-badges";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-lg border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-lg hover:to-blue-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-950 group-hover:text-zinc-700">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {project.idea}
          </p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-500" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PhaseBadge phase={project.phase} />
        <RiskBadge risk={project.risk} />
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(project.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-medium text-zinc-700">
            {project.agentTasks.length} {project.agentTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>
    </Link>
  );
}
