'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  FileText,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/page-header';
import { PhaseBadge, RiskBadge } from '@/components/project-badges';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { useProjectStore } from '@/context/project-store';
import {
  copyScaffoldFileToClipboard,
  downloadScaffoldAsJson,
  downloadScaffoldAsZip,
} from '@/lib/scaffold-download';
import type { AgentPrompt } from '@/lib/types';

function Panel({ title, children }: { title: string; children: ReactNode }) {
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
      {items.map(item => (
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
  const { getProject, deleteProject, createProject, updateProject } = useProjectStore();
  const project = getProject(params.projectId);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editIdea, setEditIdea] = useState('');
  const [editAudience, setEditAudience] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editIntegrations, setEditIntegrations] = useState('');

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function copyAllPrompts() {
    if (!project) return;
    await copyText('all-prompts', project.exports.promptPackMarkdown);
  }

  function exportAsJSON() {
    if (!project) return;
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-export.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportAsMarkdown(type: 'spec' | 'prompts' | 'checklist') {
    if (!project) return;
    let content = '';
    let filename = '';

    if (type === 'spec') {
      content = project.exports.markdownSpec;
      filename = `${project.name.toLowerCase().replace(/\s+/g, '-')}-spec.md`;
    } else if (type === 'prompts') {
      content = project.exports.promptPackMarkdown;
      filename = `${project.name.toLowerCase().replace(/\s+/g, '-')}-prompts.md`;
    } else if (type === 'checklist') {
      content = project.exports.checklistMarkdown;
      filename = `${project.name.toLowerCase().replace(/\s+/g, '-')}-checklist.md`;
    }

    const dataBlob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
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
      router.push('/projects');
    }
  }

  async function duplicateProject() {
    if (!project) return;
    setIsDuplicating(true);
    const duplicate = createProject({
      name: `${project.name} Copy`,
      idea: project.idea,
      audience: project.appSpec.primaryAudience,
      mustHaveFeatures: project.appSpec.coreFeatures.map(feature => feature.name),
      integrations: project.appSpec.integrations.map(integration => integration.name),
    });
    router.push(`/projects/${duplicate.id}`);
  }

  function beginEdit() {
    if (!project) return;
    setEditName(project.name);
    setEditIdea(project.idea);
    setEditAudience(project.appSpec.primaryAudience);
    setEditFeatures(project.appSpec.coreFeatures.map(feature => feature.name).join('\n'));
    setEditIntegrations(
      project.appSpec.integrations.map(integration => integration.name).join('\n')
    );
    setIsEditing(true);
  }

  function saveEdits() {
    if (!project) return;
    updateProject(project.id, {
      name: editName,
      idea: editIdea,
      audience: editAudience,
      mustHaveFeatures: splitLines(editFeatures),
      integrations: splitLines(editIntegrations),
    });
    setIsEditing(false);
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
              onClick={beginEdit}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              <FileText className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={duplicateProject}
              disabled={isDuplicating}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              Duplicate
            </button>
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
        <Badge>{project.status.replace(/-/g, ' ')}</Badge>
        <Badge>{project.complexity.size} build</Badge>
        <Badge>Created {formatDateTime(project.createdAt)}</Badge>
        <Badge>Updated {formatDateTime(project.updatedAt)}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-6">
          <Panel title="App idea">
            <p className="text-sm leading-6 text-zinc-700">{project.idea}</p>
          </Panel>

          {isEditing ? (
            <Panel title="Edit and regenerate">
              <div className="grid gap-4">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-zinc-700">
                    Project name
                  </span>
                  <input
                    value={editName}
                    onChange={event => setEditName(event.target.value)}
                    className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-zinc-700">Idea</span>
                  <textarea
                    value={editIdea}
                    onChange={event => setEditIdea(event.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-zinc-700">Audience</span>
                    <input
                      value={editAudience}
                      onChange={event => setEditAudience(event.target.value)}
                      className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-zinc-700">
                      Integrations
                    </span>
                    <textarea
                      value={editIntegrations}
                      onChange={event => setEditIntegrations(event.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                    />
                  </label>
                </div>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-zinc-700">
                    Must-have features
                  </span>
                  <textarea
                    value={editFeatures}
                    onChange={event => setEditFeatures(event.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveEdits}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    <Save className="h-4 w-4" />
                    Regenerate plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex h-10 items-center rounded-md px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Panel>
          ) : null}

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
                  {project.appSpec.coreFeatures.map(feature => (
                    <div
                      key={feature.id}
                      className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
                    >
                      <p className="text-sm font-semibold text-zinc-950">{feature.name}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-700">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Data model</h3>
                <TextList
                  items={project.appSpec.dataModel.map(
                    entity => `${entity.name}: ${entity.description}`
                  )}
                />
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
                    item => `${item.path} (${item.ownerRole}): ${item.purpose}`
                  )}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Scaffold preview">
            <div>
              <p className="mb-4 text-sm text-zinc-600">
                Your complete Next.js app structure is ready to download.{' '}
                {project.exports.scaffoldFiles.length} files generated.
              </p>
              <div className="mb-4 grid gap-3 md:grid-cols-2">
                <SpecField label="Suggested repo" value={project.appSpec.slug} />
                <SpecField
                  label="Environment variables"
                  value="No required secrets for the local-first MVP. Add live API keys only after approval."
                />
                <SpecField
                  label="Agent branches"
                  value={project.agentTasks.map(task => task.branchName).join(', ')}
                />
                <SpecField
                  label="Deployment gate"
                  value="Preview deploy only after build passes; production requires human approval."
                />
              </div>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {project.exports.scaffoldFiles.map(file => (
                  <div key={file.path} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <p className="break-all font-mono text-xs font-semibold text-zinc-900">
                          {file.path}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">{file.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyScaffoldFileToClipboard(file)}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Agent task split">
            <div className="grid gap-4 md:grid-cols-2">
              {project.agentTasks.map(task => (
                <article
                  key={task.role}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-4"
                >
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
              {project.clarifyingQuestions.map(question => (
                <div key={question.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-sm font-medium leading-6 text-zinc-900">{question.question}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{question.why}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Four-agent prompts">
            <button
              type="button"
              onClick={copyAllPrompts}
              className="mb-4 inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              {copied === 'all-prompts' ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied === 'all-prompts' ? 'Copied all' : 'Copy all prompts'}
            </button>
            <div className="space-y-4">
              {project.prompts.map(prompt => (
                <PromptBlock
                  key={prompt.role}
                  prompt={prompt}
                  copied={copied === prompt.role}
                  onCopy={() => copyText(prompt.role, prompt.prompt)}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Export and download">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Scaffold preview
                </h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadScaffoldAsJson(project.name, project.exports.scaffoldFiles)
                    }
                    className="flex w-full items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-left text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    Download scaffold JSON
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadScaffoldAsZip(project.name, project.exports.scaffoldFiles)
                    }
                    className="flex w-full items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-left text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    Download scaffold ZIP
                  </button>
                  <p className="mt-2 px-2 text-xs text-zinc-600">
                    Gets you a complete Next.js project structure with the generated app spec built
                    in.
                  </p>
                </div>
              </div>
              <hr />
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Documentation
                </h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => exportAsMarkdown('spec')}
                    className="flex w-full items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Spec
                  </button>
                  <button
                    type="button"
                    onClick={() => exportAsMarkdown('prompts')}
                    className="flex w-full items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Prompts
                  </button>
                  <button
                    type="button"
                    onClick={() => exportAsMarkdown('checklist')}
                    className="flex w-full items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Checklist
                  </button>
                  <button
                    type="button"
                    onClick={exportAsJSON}
                    className="flex w-full items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    <FileJson className="h-3.5 w-3.5" />
                    Full JSON
                  </button>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Safety gate">
            <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                Human approval is required before any live deploy, credential change, repository
                creation, or external API connection.
              </p>
            </div>
          </Panel>

          <Panel title="Review checklist">
            <div className="space-y-5">
              {project.reviewChecklist.categories.map(category => (
                <div key={category.name}>
                  <h3 className="text-sm font-semibold text-zinc-950">{category.name}</h3>
                  <ul className="mt-2 space-y-2">
                    {category.items.map(item => (
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
  onCopy,
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
          {copied ? 'Copied' : 'Copy'}
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

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean);
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
