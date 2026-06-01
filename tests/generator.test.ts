import {
  createClarifyingQuestions,
  createGeneratorOutput,
  exportMarkdownSpec,
  exportProjectPlanJson,
  formatChecklistMarkdown,
  formatPromptPackMarkdown,
} from '../lib/generator';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(haystack: string, needles: string[], label: string): void {
  for (const needle of needles) {
    assert(haystack.includes(needle), `${label} should include "${needle}".`);
  }
}

const sample = createGeneratorOutput({
  idea: 'A family chore and allowance app with parent approvals, streaks, and simple dashboards.',
  audience: 'busy families with children aged 8-15',
  primaryGoal: 'make recurring chores visible, fair, and easy to approve',
  mustHaveFeatures: ['parent approval flow', 'allowance ledger', 'weekly chore board'],
  niceToHaveFeatures: ['streak celebrations'],
  integrations: ['email reminders'],
  dataSensitivity: 'moderate',
  authRequired: true,
  roles: ['parent', 'child'],
  successMetrics: [
    'parents approve completed chores in under one minute',
    'children can see current allowance',
  ],
});

assert(sample.spec.type === 'family-life-app', 'Expected family/life template inference.');
assert(sample.spec.coreFeatures.length >= 4, 'Expected template and requested core features.');
assert(
  sample.spec.integrations.some(integration => integration.name === 'email reminders'),
  'Expected planned email reminder integration.'
);
assert(sample.techPlan.scaffoldPlan.length > 5, 'Expected scaffold plan items.');
assert(sample.tasks.length === 4, 'Expected exactly four agent tasks.');
assert(sample.promptPack.prompts.length === 4, 'Expected exactly four agent prompts.');
assert(sample.reviewChecklist.categories.length >= 5, 'Expected review checklist categories.');
assert(
  sample.risks.some(risk => risk.id === 'risk-agent-collision'),
  'Expected agent collision guardrail risk.'
);

const promptRoles = sample.promptPack.prompts.map(prompt => prompt.role);
includesAll(
  promptRoles.join('\n'),
  ['Foundation / architecture', 'UI / UX', 'Backend / integrations', 'QA / tests / docs'],
  'Prompt roles'
);

const promptText = formatPromptPackMarkdown(sample.promptPack);
includesAll(
  promptText,
  [
    'Do not overwrite other agent work',
    'Open a pull request before merge',
    'Do not commit secrets',
    'human approval before production deployment',
  ],
  'Prompt pack'
);

const markdownSpec = exportMarkdownSpec(sample.spec, sample.techPlan);
includesAll(
  markdownSpec,
  ['# Family Chore Allowance App Spec', '## Core Features', '## Guardrails'],
  'Markdown spec'
);

const checklist = formatChecklistMarkdown(sample.reviewChecklist);
includesAll(
  checklist,
  ['# Family Chore Allowance Review Checklist', '## Agent Coordination', '## Required Approvals'],
  'Checklist'
);

const json = exportProjectPlanJson(sample);
const parsed = JSON.parse(json);
assert(parsed.spec.name === sample.spec.name, 'JSON export should contain the spec.');
assert(Array.isArray(parsed.promptPack.prompts), 'JSON export should contain prompts.');

const questions = createClarifyingQuestions('A dashboard for tracking team operations and alerts.');
assert(
  questions.some(question => question.id === 'critical-metrics'),
  'Expected dashboard-specific questions.'
);

console.log('Generator tests passed.');
