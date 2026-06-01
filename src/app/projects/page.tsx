"use client";

import { FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/Button";
import { useProjectStore } from "@/context/project-store";

export default function ProjectsPage() {
  const { projects } = useProjectStore();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Your planning workspaces"
        description="Projects live in localStorage for this MVP. They can be reviewed, exported, and later connected to GitHub or Vercel workflows."
        action={<ButtonLink href="/new">New app</ButtonLink>}
      />
      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-slate-50 to-blue-50 p-16 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-xl font-semibold text-zinc-900">No projects yet</h3>
          <p className="mt-3 max-w-md mx-auto text-zinc-600">
            Start building by creating your first app. We'll help you capture your idea, generate a specification, plan the technical approach, and export prompts for AI agents.
          </p>
          <ButtonLink href="/new" className="mt-6">
            Create your first app
          </ButtonLink>
        </div>
      )}
    </>
  );
}
