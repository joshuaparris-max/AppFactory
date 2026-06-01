'use client';

import { useState } from 'react';
import { KeyRound, PlugZap, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const settings = [
  {
    title: 'OpenAI connector',
    status: 'Placeholder',
    icon: KeyRound,
    detail: 'Model calls stay disabled until an approved key-management flow exists.',
  },
  {
    title: 'Vercel deployment',
    status: 'Placeholder',
    icon: ShieldCheck,
    detail: 'Deployments will require Josh approval and environment checks before execution.',
  },
];

const GITHUB_REPO_STORAGE_KEY = 'appfactory.githubRepository';

export default function SettingsPage() {
  const initialRepo =
    typeof window !== 'undefined'
      ? (window.localStorage.getItem(GITHUB_REPO_STORAGE_KEY) ?? '')
      : '';
  const [githubRepo, setGithubRepo] = useState(initialRepo);
  const [savedRepo, setSavedRepo] = useState(initialRepo);
  const [savedAt, setSavedAt] = useState(initialRepo ? new Date().toLocaleString() : null);

  const saveGithubRepo = () => {
    const repo = githubRepo.trim();
    window.localStorage.setItem(GITHUB_REPO_STORAGE_KEY, repo);
    setSavedRepo(repo);
    setSavedAt(new Date().toLocaleString());
  };

  const clearGithubRepo = () => {
    window.localStorage.removeItem(GITHUB_REPO_STORAGE_KEY);
    setGithubRepo('');
    setSavedRepo('');
    setSavedAt(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Safe integration boundaries"
        description="The MVP documents where integrations will live without requiring secrets, accounts, or paid APIs."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map(item => {
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

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-100 text-blue-700">
              <PlugZap className="h-5 w-5" />
            </span>
            <Badge tone="green">Saved locally</Badge>
          </div>
          <h2 className="mt-5 text-base font-semibold text-zinc-950">GitHub repository</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Store your GitHub repository URL here so the app can remember where to push deployments
            and scaffold exports.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={githubRepo}
              onChange={event => setGithubRepo(event.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Button type="button" onClick={saveGithubRepo} className="h-11 px-4">
              Save
            </Button>
          </div>

          {savedRepo ? (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-zinc-700">
              <p>
                <strong>Saved repository:</strong> {savedRepo}
              </p>
              <p className="mt-1 text-xs text-zinc-500">Last saved at {savedAt}</p>
              <Button
                type="button"
                variant="secondary"
                onClick={clearGithubRepo}
                className="mt-3 h-10 px-3"
              >
                Clear repository
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No GitHub repository saved yet. Add one to keep track of deployment and repo settings.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
