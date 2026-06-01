import {
  createClarifyingQuestions,
  createGeneratorOutput,
  exportMarkdownSpec,
  exportProjectPlanJson,
  formatChecklistMarkdown,
  formatPromptPackMarkdown,
  generateNextJsScaffold,
} from '../../lib/generator';
import type { CreateProjectInput, Project, RiskLevel } from '@/lib/types';

const demoTimestamp = '2026-06-01T06:00:00.000Z';

export const demoProjects: Project[] = [
  createProjectRecord(
    {
      name: 'AppFactory',
      idea: 'A guided AI app-building command centre that helps Josh plan, scaffold, review, and prepare new apps safely.',
      audience: 'Josh and trusted build agents',
      mustHaveFeatures: [
        'New app wizard',
        'local project persistence',
        'copyable four-agent prompt pack',
        'review checklist',
      ],
      integrations: ['GitHub placeholder', 'Vercel placeholder', 'AI placeholder'],
    },
    'project-appfactory-demo',
    demoTimestamp
  ),
];

export function createProjectDraft(input: CreateProjectInput): Project {
  const timestamp = new Date().toISOString();
  return createProjectRecord(input, createProjectId(), timestamp);
}

function createProjectRecord(input: CreateProjectInput, id: string, timestamp: string): Project {
  const plan = createGeneratorOutput({
    idea: input.idea.trim(),
    name: input.name.trim(),
    audience: input.audience?.trim() || undefined,
    mustHaveFeatures: input.mustHaveFeatures?.filter(Boolean),
    integrations: input.integrations?.filter(Boolean),
    authRequired: true,
  });
  const clarifyingQuestions = createClarifyingQuestions(input.idea);
  const risk = highestRisk(plan.risks.map(item => item.severity));
  const scaffoldFiles = generateNextJsScaffold(plan.spec.name, plan.spec, plan.techPlan);

  return {
    id,
    name: plan.spec.name,
    idea: input.idea.trim(),
    status: 'ready-for-agents',
    phase: 'review',
    risk,
    createdAt: timestamp,
    updatedAt: timestamp,
    plan,
    appSpec: plan.spec,
    techPlan: plan.techPlan,
    clarifyingQuestions,
    agentTasks: plan.tasks,
    prompts: plan.promptPack.prompts,
    reviewChecklist: plan.reviewChecklist,
    complexity: plan.complexity,
    risks: plan.risks,
    exports: {
      markdownSpec: exportMarkdownSpec(plan.spec, plan.techPlan),
      jsonProjectPlan: exportProjectPlanJson(plan),
      promptPackMarkdown: formatPromptPackMarkdown(plan.promptPack),
      checklistMarkdown: formatChecklistMarkdown(plan.reviewChecklist),
      scaffoldFiles,
    },
  };
}

function createProjectId(): string {
  const randomId =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `project-${randomId}`;
}

function highestRisk(levels: RiskLevel[]): RiskLevel {
  if (levels.includes('high')) {
    return 'high';
  }

  if (levels.includes('medium')) {
    return 'medium';
  }

  return 'low';
}
