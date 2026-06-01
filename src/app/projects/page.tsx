"use client";

import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";

export default function ProjectsPage() {
  const { projects } = useProjectStore();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Local planning workspaces"
        description="Projects live in localStorage for this MVP. They can be reviewed, exported, and later connected to GitHub or Vercel workflows."
        action={<ButtonLink href="/new">New app</ButtonLink>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
