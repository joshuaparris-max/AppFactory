'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout, PageHeader, Section, Grid } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress, StepProgress } from '@/components/ui/Progress';
import { Checklist, Tabs, Alert } from '@/components/ui/Feedback';
import { TaskBoard } from '@/components/AppComponents';
import type { App } from '@/types';

// Mock data - in a real app this would come from an API
const MOCK_APPS: Record<string, App> = {
  '1': {
    id: '1',
    name: 'Customer Dashboard',
    description: 'Internal dashboard for tracking customer metrics and analytics',
    status: 'in-progress',
    progress: 65,
    createdAt: '2024-05-20',
    updatedAt: '2024-06-01',
    agents: [
      {
        id: 'a1',
        name: 'UI Developer',
        role: 'Frontend',
        tasks: [
          {
            id: 't1',
            title: 'Design layout',
            description: 'Create main layout components',
            status: 'completed',
            priority: 'high',
            assignedTo: 'a1',
          },
          {
            id: 't2',
            title: 'Build charts',
            description: 'Integrate chart library',
            status: 'in-progress',
            priority: 'high',
            assignedTo: 'a1',
          },
        ],
      },
      {
        id: 'a2',
        name: 'Backend Engineer',
        role: 'API',
        tasks: [
          {
            id: 't3',
            title: 'Build API',
            description: 'Create REST API endpoints',
            status: 'in-progress',
            priority: 'high',
            assignedTo: 'a2',
          },
          {
            id: 't4',
            title: 'Database schema',
            description: 'Design database structure',
            status: 'pending',
            priority: 'high',
            assignedTo: 'a2',
          },
        ],
      },
      {
        id: 'a3',
        name: 'QA Tester',
        role: 'Testing',
        tasks: [
          {
            id: 't5',
            title: 'Test plan',
            description: 'Create test scenarios',
            status: 'pending',
            priority: 'medium',
            assignedTo: 'a3',
          },
        ],
      },
    ],
  },
};

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params?.id as string;
  const app = MOCK_APPS[appId];
  const [showPromptExport, setShowPromptExport] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  if (!app) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">App not found</h1>
          <Button onClick={() => router.push('/')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  const buildPhases = [
    {
      id: 'setup',
      name: 'Setup & Configuration',
      description: 'Initialize project structure',
      steps: [
        { id: 's1', title: 'Create project folder', completed: true },
        { id: 's2', title: 'Initialize git repo', completed: true },
        { id: 's3', title: 'Setup dependencies', completed: false },
      ],
      completed: false,
    },
    {
      id: 'frontend',
      name: 'Frontend Development',
      description: 'Build UI components',
      steps: [
        { id: 's4', title: 'Design components', completed: true },
        { id: 's5', title: 'Implement layouts', completed: true },
        { id: 's6', title: 'Add interactions', completed: false },
      ],
      completed: false,
    },
    {
      id: 'backend',
      name: 'Backend Development',
      description: 'Build API and database',
      steps: [
        { id: 's7', title: 'Design schema', completed: true },
        { id: 's8', title: 'Build endpoints', completed: false },
        { id: 's9', title: 'Add authentication', completed: false },
      ],
      completed: false,
    },
    {
      id: 'testing',
      name: 'Testing & Deployment',
      description: 'Quality assurance and launch',
      steps: [
        { id: 's10', title: 'Unit tests', completed: false },
        { id: 's11', title: 'Integration tests', completed: false },
        { id: 's12', title: 'Deploy to production', completed: false },
      ],
      completed: false,
    },
  ];

  const generatePrompt = (agent: any): string => {
    const taskList = agent.tasks.map((t: any) => `- ${t.title}: ${t.description}`).join('\n');
    return `You are a ${agent.role} AI agent working on the "${app.name}" project.

Project Description:
${app.description}

Your Tasks:
${taskList}

Please work on these tasks and provide working code. Focus on clean, maintainable, and well-documented code.`;
  };

  const copyToClipboard = (text: string, promptId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(promptId);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const statusConfig = {
    draft: { badge: 'warning', label: 'Draft', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    'in-progress': { badge: 'info', label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    completed: { badge: 'success', label: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' },
  };

  const status = statusConfig[app.status as keyof typeof statusConfig];

  return (
    <Layout maxWidth="xl">
      <PageHeader
        title={app.name}
        subtitle={app.description}
        action={
          <Button variant="secondary" onClick={() => router.push('/')}>
            ← Back
          </Button>
        }
      />

      <Section title="Project Status">
        <div className="grid gap-4 md:grid-cols-4">
          <div className={`rounded-lg p-4 ${status.color}`}>
            <p className="text-sm font-medium mb-2">Status</p>
            <Badge variant={status.badge as any}>{status.label}</Badge>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Overall Progress</p>
            <Progress value={app.progress} max={100} showPercent={true} />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Agents</p>
            <p className="text-2xl font-bold">{app.agents.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Tasks</p>
            <p className="text-2xl font-bold">{app.agents.reduce((sum, a) => sum + a.tasks.length, 0)}</p>
          </div>
        </div>
      </Section>

      <Section title="Agent Task Board">
        <TaskBoard agents={app.agents} />
      </Section>

      <Section title="Build Phases">
        <div className="space-y-4">
          {buildPhases.map((phase) => {
            const completedSteps = phase.steps.filter((s) => s.completed).length;
            const totalSteps = phase.steps.length;

            return (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{phase.name}</CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {phase.description}
                      </p>
                    </div>
                    <Badge variant={completedSteps === totalSteps ? 'success' : 'info'}>
                      {completedSteps}/{totalSteps}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={completedSteps} max={totalSteps} showPercent />
                    <Checklist
                      items={phase.steps.map((s) => ({
                        id: s.id,
                        label: s.title,
                        completed: s.completed,
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Prompt Export">
        <div className="space-y-4">
          <Alert variant="info" title="Export Agent Prompts">
            Copy and paste these prompts to your AI coding agents to generate code for this project.
          </Alert>

          <div className="grid gap-4">
            {app.agents.map((agent) => {
              const prompt = generatePrompt(agent);
              const promptId = `prompt-${agent.id}`;

              return (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{agent.name}</CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {agent.role}
                        </p>
                      </div>
                      <Badge variant="primary">{agent.tasks.length} tasks</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <pre className="text-xs whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono max-h-48 overflow-y-auto">
                        {prompt}
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={copiedPrompt === promptId ? 'success' : 'secondary'}
                      size="sm"
                      onClick={() => copyToClipboard(prompt, promptId)}
                    >
                      {copiedPrompt === promptId ? '✓ Copied!' : 'Copy Prompt'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title="Risk & Safety Checklist">
        <Card>
          <CardContent className="pt-6">
            <Checklist
              items={[
                { id: 'r1', label: 'Security review completed', completed: false },
                { id: 'r2', label: 'Performance tested', completed: false },
                { id: 'r3', label: 'Error handling implemented', completed: true },
                { id: 'r4', label: 'Data validation in place', completed: false },
                { id: 'r5', label: 'Logging configured', completed: true },
                { id: 'r6', label: 'Documentation complete', completed: false },
              ]}
            />
          </CardContent>
        </Card>
      </Section>
    </Layout>
  );
}
