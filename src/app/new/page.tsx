"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Lightbulb, ListChecks, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/context/project-store";

const wizardSteps = [
  { icon: Lightbulb, label: "Capture idea", description: "Tell us about your app concept" },
  { icon: ListChecks, label: "Generate questions", description: "Clarifying questions for your spec" },
  { icon: Sparkles, label: "Prepare spec", description: "Structured app specification" },
  { icon: ListChecks, label: "Plan scaffold", description: "Technical implementation plan" },
  { icon: ListChecks, label: "Split agent tasks", description: "Discrete tasks for agents" },
  { icon: ListChecks, label: "Review and export", description: "Export prompts for agents" },
];

export default function NewAppPage() {
  const router = useRouter();
  const { createProject } = useProjectStore();
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState("");
  const [integrations, setIntegrations] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !idea.trim()) {
      setError("Add a project name and idea before continuing.");
      return;
    }

    const project = createProject({
      name,
      idea,
      audience,
      mustHaveFeatures: splitLines(features),
      integrations: splitLines(integrations)
    });
    router.push(`/projects/${project.id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="New app wizard"
        title="Capture a project idea."
        description="This wizard creates a local planning workspace with clarifying questions, a starter spec, agent tasks, and exportable prompts."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Project name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Client Portal Builder"
                className="mt-3 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 placeholder:text-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">App idea</span>
              <textarea
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="Describe the user, problem, workflow, constraints, and anything the app must not do yet."
                rows={10}
                className="mt-3 w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 placeholder:text-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Primary audience</span>
              <input
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder="e.g., small business owners, parents, learners, staff managers"
                className="mt-3 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 placeholder:text-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Must-have features</span>
              <textarea
                value={features}
                onChange={(event) => setFeatures(event.target.value)}
                placeholder="One feature per line. Leave blank to use the template defaults."
                rows={5}
                className="mt-3 w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 placeholder:text-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Planned integrations</span>
              <textarea
                value={integrations}
                onChange={(event) => setIntegrations(event.target.value)}
                placeholder="One integration per line. These stay mocked until approved."
                rows={3}
                className="mt-3 w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 placeholder:text-zinc-400"
              />
            </label>
          </div>
          {error ? (
            <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-4">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          ) : null}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition"
            >
              Cancel
            </button>
            <Button type="submit" className="flex items-center gap-2">
              Create planning workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <aside className="rounded-lg border border-zinc-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-sm sticky top-24 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-base font-semibold text-zinc-950">Wizard steps</h2>
          </div>
          <ol className="space-y-4">
            {wizardSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-950">{step.label}</p>
                    <p className="text-xs text-zinc-600">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </>
  );
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
