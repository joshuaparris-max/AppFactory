"use client";

import { Search } from "lucide-react";
import { FolderKanban } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/Button";
import { useProjectStore } from "@/context/project-store";

export default function ProjectsPage() {
  const { projects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.idea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Your planning workspaces"
        description="Projects live in localStorage for this MVP. They can be reviewed, exported, and later connected to GitHub or Vercel workflows."
        action={<ButtonLink href="/new">New app</ButtonLink>}
      />
      {projects.length > 0 ? (
        <>
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2">
            <Search className="h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects by name or idea..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
          {filteredProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-slate-50 to-blue-50 p-16 text-center">
              <FolderKanban className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-xl font-semibold text-zinc-900">No matching projects</h3>
              <p className="mt-3 max-w-md mx-auto text-zinc-600">
                We couldn&apos;t find any projects matching &quot;{searchQuery}&quot;. Try adjusting your search.
              </p>
              <ButtonLink href="/projects" className="mt-6" onClick={() => setSearchQuery("")}>
                Clear search
              </ButtonLink>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-slate-50 to-blue-50 p-16 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-xl font-semibold text-zinc-900">No projects yet</h3>
          <p className="mt-3 max-w-md mx-auto text-zinc-600">
            Start building by creating your first app. We&apos;ll help you capture your idea, generate a specification, plan the technical approach, and export prompts for AI agents.
          </p>
          <ButtonLink href="/new" className="mt-6">
            Create your first app
          </ButtonLink>
        </div>
      )}
    </>
  );
}
