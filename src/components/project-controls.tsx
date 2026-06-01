"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, Trash2 } from "lucide-react";
import { buildPhases } from "@/lib/phases";
import type { BuildPhase, Project, RiskLevel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";

const riskOptions: RiskLevel[] = ["low", "medium", "high"];

export function ProjectControls({ project }: { project: Project }) {
  const { updateProject, deleteProject } = useProjectStore();
  const [copied, setCopied] = useState(false);

  const promptBundle = useMemo(
    () =>
      [
        `Project: ${project.name}`,
        `Idea: ${project.idea}`,
        "",
        "Technical plan:",
        ...project.technicalPlan.map((item) => `- ${item}`),
        "",
        "Scaffold plan:",
        ...project.scaffoldPlan.map((item) => `- ${item}`),
        "",
        "Review checklist:",
        ...project.reviewChecklist.map((item) => `- ${item}`),
        "",
        "Agent prompts:",
        ...project.exportPrompts.map((item) => `- ${item}`),
      ].join("\n"),
    [project],
  );

  async function copyPromptBundle() {
    await navigator.clipboard.writeText(promptBundle);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadProject() {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.name.toLowerCase().replaceAll(" ", "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function confirmDelete() {
    if (window.confirm(`Delete "${project.name}" from this browser?`)) {
      deleteProject(project.id);
      window.location.href = "/projects";
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-950">Planning controls</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Build phase</span>
          <select
            value={project.phase}
            onChange={(event) =>
              updateProject(project.id, { phase: event.target.value as BuildPhase })
            }
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          >
            {buildPhases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Risk level</span>
          <select
            value={project.risk}
            onChange={(event) =>
              updateProject(project.id, { risk: event.target.value as RiskLevel })
            }
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm capitalize outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          >
            {riskOptions.map((risk) => (
              <option key={risk} value={risk}>
                {risk}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={copyPromptBundle}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy prompt pack"}
        </Button>
        <Button type="button" variant="secondary" onClick={downloadProject}>
          <Download className="h-4 w-4" />
          Download JSON
        </Button>
        <Button type="button" variant="subtle" onClick={confirmDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </section>
  );
}
