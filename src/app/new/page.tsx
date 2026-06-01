"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";

const wizardSteps = [
  "Capture idea",
  "Generate questions",
  "Prepare spec",
  "Plan scaffold",
  "Split agent tasks",
  "Review and export",
];

export default function NewAppPage() {
  const router = useRouter();
  const { createProject } = useProjectStore();
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !idea.trim()) {
      setError("Add a project name and idea before continuing.");
      return;
    }

    const project = createProject({ name, idea });
    router.push(`/projects/${project.id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="New app wizard"
        title="Capture a project idea."
        description="This wizard creates a local planning workspace with clarifying questions, a starter spec, agent tasks, and exportable prompts."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-zinc-800">Project name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Client Portal Builder"
                className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-800">App idea</span>
              <textarea
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="Describe the user, problem, workflow, constraints, and anything the app must not do yet."
                rows={9}
                className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-3 text-sm leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </label>
          </div>
          {error ? <p className="mt-4 text-sm font-medium text-rose-700">{error}</p> : null}
          <div className="mt-6 flex justify-end">
            <Button type="submit">
              Create planning workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-sky-50 text-sky-700">
              <ClipboardList className="h-5 w-5" />
            </span>
            <h2 className="text-base font-semibold text-zinc-950">Wizard output</h2>
          </div>
          <ol className="mt-5 space-y-3">
            {wizardSteps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-zinc-700">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-500">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}
