"use client";

import { useRef, useState } from "react";
import { ClipboardList, Download, KeyRound, PlugZap, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/context/project-store";
import { parseProjectsBackup } from "@/lib/storage";

const settings = [
  {
    title: "OpenAI connector",
    status: "Placeholder",
    icon: KeyRound,
    detail: "Model calls stay disabled until an approved key-management flow exists.",
  },
  {
    title: "GitHub workflow",
    status: "Placeholder",
    icon: PlugZap,
    detail: "Future work can create branches, commits, and PRs behind explicit review gates.",
  },
  {
    title: "Vercel deployment",
    status: "Placeholder",
    icon: ShieldCheck,
    detail: "Deployments will require Josh approval and environment checks before execution.",
  },
];

export default function SettingsPage() {
  const { projects, replaceProjects, resetProjects } = useProjectStore();
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(projects, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "appfactory-projects.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Downloaded local project backup.");
  }

  async function importBackupFromClipboard() {
    try {
      const raw = await navigator.clipboard.readText();
      replaceProjects(parseProjectsBackup(raw));
      setMessage("Imported project backup from clipboard.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not import clipboard backup.");
    }
  }

  async function importBackup(file: File) {
    try {
      const text = await file.text();
      replaceProjects(parseProjectsBackup(text));
      setMessage("Imported project backup into this browser.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not import backup.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function confirmReset() {
    if (window.confirm("Reset this browser to the starter mock projects?")) {
      resetProjects();
      setMessage("Local projects reset to starter data.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Safe integration boundaries"
        description="The MVP documents where integrations will live without requiring secrets, accounts, or paid APIs."
      />

      <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Local data controls</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Export, import, or reset the browser-local project list without a database.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={downloadBackup}>
              <Download className="h-4 w-4" />
              Export backup
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Import backup
            </Button>
            <Button type="button" variant="secondary" onClick={importBackupFromClipboard}>
              <ClipboardList className="h-4 w-4" />
              Import from clipboard
            </Button>
            <Button type="button" variant="subtle" onClick={confirmReset}>
              <RotateCcw className="h-4 w-4" />
              Reset seed
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void importBackup(file);
            }
          }}
        />
        {message ? <p className="mt-4 text-sm font-medium text-zinc-700">{message}</p> : null}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <section
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-zinc-100 text-zinc-700">
                  <Icon className="h-5 w-5" />
                </span>
                <Badge tone="amber">{item.status}</Badge>
              </div>
              <h2 className="mt-5 text-base font-semibold text-zinc-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.detail}</p>
            </section>
          );
        })}
      </div>
    </>
  );
}
