"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";
import type { Project } from "@/lib/types";

const statuses: Array<Project["status"] | "all"> = [
  "all",
  "draft",
  "planning",
  "ready-for-scaffold",
  "review",
  "approved",
];

export default function ProjectsPage() {
  const { projects } = useProjectStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Project["status"] | "all">("all");

  const filteredProjects = useMemo(
    () =>
      projects
        .filter((project) => status === "all" || project.status === status)
        .filter((project) => {
          const target = `${project.name} ${project.idea}`.toLowerCase();
          return target.includes(query.trim().toLowerCase());
        }),
    [projects, query, status],
  );

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Local planning workspaces"
        description="Projects live in localStorage for this MVP. They can be reviewed, exported, and later connected to GitHub or Vercel workflows."
        action={<ButtonLink href="/new">New app</ButtonLink>}
      />

      <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <label className="relative block">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or idea"
              className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as Project["status"] | "all")}
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm capitalize outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("-", " ")}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filteredProjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-base font-semibold text-zinc-950">No matching projects</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Clear the filters or create a new planning workspace.
          </p>
        </div>
      )}
    </>
  );
}
