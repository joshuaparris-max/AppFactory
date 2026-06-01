"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Copy, Download, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { PhaseBadge, RiskBadge } from "@/components/project-badges";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useProjectStore } from "@/context/project-store";
import type { AgentPrompt } from "@/lib/types";

function Panel({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="text-sm leading-6 text-zinc-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const { getProject, deleteProject } = useProjectStore();
  const project = getProject(params.projectId);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function exportAsJSON() {
    if (!project) return;
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-export.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportAsMarkdown(type: "spec" | "prompts" | "checklist") {
    if (!project) return;
    let content = "";
    let filename = "";

    if (type === "spec") {
      content = project.exports.markdownSpec;
      filename = `${project.name.toLowerCase().replace(/\s+/g, "-")}-spec.md`;
    } else if (type === "prompts") {
      content = project.exports.promptPackMarkdown;
      filename = `${project.name.toLowerCase().replace(/\s+/g, "-")}-prompts.md`;
    } else if (type === "checklist") {
      content = project.exports.checklistMarkdown;
      filename = `${project.name.toLowerCase().replace(/\s+/g, "-")}-checklist.md`;
    }

    const dataBlob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleDelete() {
    if (!project) return;
    if (confirm(`Are you sure you want to delete "${project.name}"? This cannot be undone.`)) {
      setIsDeleting(true);
      deleteProject(project.id);
      router.push("/projects");
    }
  }

  if (!project) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-600">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-zinc-950">Project not found</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This project is not present in localStorage for this browser.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Project detail"
        title={project.name}
        description={project.appSpec.summary}
        action={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/tasks" variant="secondary">
              Open task board
              <ExternalLink className="h-4 w-4" />
            </ButtonLink>
            <button
              type="button"
              onClick={exportAsJSON}
              title="Export project as JSON"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:border-red-400 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <PhaseBadge phase={project.phase} />
        <RiskBadge risk={project.risk} />
        <Badge>{project.status.replace(/-/g, " ")}</Badge>
        <Badge>{project.complexity.size} build</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-6">
          <Panel title="App idea">
            <p className="text-sm leading-6 text-zinc-700">{project.idea}</p>
          </Panel>

          <Panel title="Generated spec">
            <div className="grid gap-4 md:grid-cols-2">
              <SpecField label="Audience" value={project.appSpec.primaryAudience} />
              <SpecField label="Core problem" value={project.appSpec.coreProblem} />
              <SpecField label="Value proposition" value={project.appSpec.valueProposition} />
              <SpecField label="Experience" value={project.appSpec.experience.visualDirection} />
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Core features</h3>
                <div className="mt-3 space-y-3">
                  {project.appSpec.coreFeatures.map((feature) => (
                    <div key={feature.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-sm font-semibold text-zinc-950">{feature.name}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-700">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Data model</h3>
                <TextList items={project.appSpec.dataModel.map((entity) => `${entity.name}: ${entity.description}`)} />
              </div>
            </div>
          </Panel>

          <Panel title="Tech plan">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(project.techPlan.stack).map(([key, value]) => (
                <SpecField key={key} label={key} value={value} />
              ))}
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Architecture decisions</h3>
                <TextList items={project.techPlan.architectureDecisions} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Scaffold plan</h3>
                <TextList
                  items={project.techPlan.scaffoldPlan.map(
                    (item) => `${item.path} (${item.ownerRole}): ${item.purpose}`
                  )}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Agent task split">
            <div className="grid gap-4 md:grid-cols-2">
              {project.agentTasks.map((task) => (
                <article key={task.role} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-950">{task.role}</p>
                  <p className="mt-1 text-xs font-medium text-zinc-500">{task.branchName}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{task.mission}</p>
                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Owned paths
                  </h3>
                  <TextList items={task.ownedPaths.slice(0, 4)} />
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Clarifying questions">
            <div className="space-y-3">
              {project.clarifyingQuestions.map((question) => (
                <div key={question.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-sm font-medium leading-6 text-zinc-900">{question.question}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{question.why}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Four-agent prompts">
            <div className="space-y-4">
              {project.prompts.map((prompt) => (
                <PromptBlock
                  key={prompt.role}
                  prompt={prompt}
                  copied={copied === prompt.role}
                  onCopy={() => copyText(prompt.role, prompt.prompt)}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Export & Download">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => exportAsMarkdown("spec")}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                📋 Download Spec
              </button>
              <button
                type="button"
                onClick={() => exportAsMarkdown("prompts")}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                💬 Download Prompts
              </button>
              <button
                type="button"
                onClick={() => exportAsMarkdown("checklist")}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                ✅ Download Checklist
              </button>
              <button
                type="button"
                onClick={exportAsJSON}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                💾 Download Full JSON
              </button>
            </div>
          </Panel>

          <Panel title="Review checklist">
            <div className="space-y-5">
              {project.reviewChecklist.categories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-sm font-semibold text-zinc-950">{category.name}</h3>
                  <ul className="mt-2 space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="text-sm leading-6 text-zinc-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium capitalize text-zinc-500">{label}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-700">{value}</p>
    </div>
  );
}

function PromptBlock({
  prompt,
  copied,
  onCopy
}: {
  prompt: AgentPrompt;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-950">{prompt.role}</p>
          <p className="mt-1 text-xs text-zinc-500">{prompt.branchName}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        readOnly
        value={prompt.prompt}
        className="mt-3 h-48 w-full resize-none rounded-md border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 text-zinc-700"
      />
    </div>
  );
}
