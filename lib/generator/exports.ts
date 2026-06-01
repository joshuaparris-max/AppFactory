import type { AppSpec, ProjectPlan, PromptPack, ReviewChecklist, TechPlan } from './types';

export function exportMarkdownSpec(spec: AppSpec, techPlan?: TechPlan): string {
  const lines = [
    `# ${spec.name} App Spec`,
    '',
    `**Type:** ${spec.type}`,
    `**Audience:** ${spec.primaryAudience}`,
    '',
    '## Summary',
    spec.summary,
    '',
    '## Core Problem',
    spec.coreProblem,
    '',
    '## Value Proposition',
    spec.valueProposition,
    '',
    '## Goals',
    ...spec.goals.map(goal => `- ${goal}`),
    '',
    '## Non-Goals',
    ...spec.nonGoals.map(goal => `- ${goal}`),
    '',
    '## Core Features',
    ...spec.coreFeatures.map(
      feature => `- **${feature.name}** (${feature.priority}): ${feature.description}`
    ),
    '',
    '## User Journeys',
    ...spec.userJourneys.flatMap(journey => [
      `### ${journey.name}`,
      `Actor: ${journey.actor}`,
      ...journey.steps.map(step => `- ${step}`),
      `Success: ${journey.successState}`,
      '',
    ]),
    '## Data Model',
    ...spec.dataModel.map(entity => `- **${entity.name}:** ${entity.description}`),
    '',
    '## Integrations',
    ...(spec.integrations.length
      ? spec.integrations.map(
          integration => `- **${integration.name}:** ${integration.purpose} (${integration.mode})`
        )
      : ['- None planned for the first release.']),
    '',
    '## Guardrails',
    ...spec.guardrails.map(guardrail => `- ${guardrail}`),
    '',
    '## Acceptance Criteria',
    ...spec.acceptanceCriteria.map(item => `- ${item}`),
  ];

  if (techPlan) {
    lines.push(
      '',
      '## Recommended Stack',
      `- Frontend: ${techPlan.stack.frontend}`,
      `- Backend: ${techPlan.stack.backend}`,
      `- Data: ${techPlan.stack.data}`,
      `- Auth: ${techPlan.stack.auth}`,
      `- Hosting: ${techPlan.stack.hosting}`,
      `- Testing: ${techPlan.stack.testing}`,
      `- AI: ${techPlan.stack.ai}`,
      '',
      '## Scaffold Plan',
      ...techPlan.scaffoldPlan.map(
        item => `- \`${item.path}\` (${item.ownerRole}): ${item.purpose}`
      )
    );
  }

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
}

export function exportProjectPlanJson(plan: ProjectPlan): string {
  return JSON.stringify(plan, null, 2);
}

export function formatPromptPackMarkdown(promptPack: PromptPack): string {
  return [
    '# Agent Prompt Pack',
    '',
    '## Global Guardrails',
    ...promptPack.globalGuardrails.map(guardrail => `- ${guardrail}`),
    '',
    ...promptPack.prompts.flatMap(agentPrompt => [
      `## ${agentPrompt.title}`,
      `Branch: \`${agentPrompt.branchName}\``,
      '',
      '```text',
      agentPrompt.prompt,
      '```',
      '',
    ]),
  ]
    .join('\n')
    .trimEnd();
}

export function formatChecklistMarkdown(checklist: ReviewChecklist): string {
  return [
    `# ${checklist.title}`,
    '',
    ...checklist.categories.flatMap(category => [
      `## ${category.name}`,
      ...category.items.map(item => `- [ ] ${item}`),
      '',
    ]),
    '## Required Approvals',
    ...checklist.requiredApprovals.map(approval => `- [ ] ${approval}`),
  ]
    .join('\n')
    .trimEnd();
}
