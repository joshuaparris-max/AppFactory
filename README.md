# AppFactory

AppFactory is a local-first command centre for turning rough app ideas into complete, scaffolded application plans that agents can build from safely.

The MVP captures app ideas, generates specs, creates Next.js scaffold previews, and prepares review artifacts for multi-agent development workflows. It does not call live OpenAI, GitHub, or Vercel APIs.

## What It Does

- Captures ideas through a step-by-step `/new` wizard
- Generates clarifying questions, app specs, tech plans, data models, risks, and checklists
- Creates scaffold previews with file trees, starter files, suggested branches, and downloads
- Splits work into four agent prompts with branch names, ownership, and guardrails
- Exports Markdown specs, prompt packs, review checklists, JSON plans, and scaffold ZIPs
- Manages projects locally in the browser with search, duplicate, edit/regenerate, delete, and export actions
- Shows safety and version status on `/about`

## Real vs Placeholder

Real in this MVP:

- Local project creation and localStorage persistence
- Deterministic generator output from `lib/generator`
- Copyable prompt packs and downloadable planning files
- Scaffold preview/export for a starter Next.js project
- Build, lint, typecheck, tests, formatting, and CI scripts

Placeholder only:

- Live OpenAI generation
- GitHub repository creation
- Vercel production deploy automation
- Shared cloud storage or multi-user accounts

## Safety Rules

- No real API keys are required
- No live OpenAI, GitHub, or Vercel calls are made from the app
- Projects persist through browser localStorage only in this MVP
- Agent prompts include branch naming, file ownership, PR, no-secret, and deploy-approval guardrails
- Human approval is required before connecting credentials, creating repos, or deploying production builds

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run format
```

## Manual QA

Before deployment, check:

- Dashboard loads and project metrics render
- `/new` wizard moves through every step and creates a project
- Created projects appear on `/projects`
- Refreshing the browser keeps projects in localStorage
- Project detail shows spec, scaffold preview, agent prompts, exports, and review checklist
- Copy one prompt and copy all prompts
- Download spec, checklist, JSON, scaffold JSON, and scaffold ZIP
- Duplicate, edit/regenerate, and delete a project
- `/tasks`, `/settings`, and `/about` render on desktop and mobile widths

## Generator Example

```ts
import {
  createGeneratorOutput,
  exportMarkdownSpec,
  formatPromptPackMarkdown,
} from './lib/generator';

const output = createGeneratorOutput({
  idea: 'A family chore and allowance app with parent approvals, streaks, and simple dashboards.',
  audience: 'busy families with children aged 8-15',
  mustHaveFeatures: ['parent approval flow', 'allowance ledger', 'weekly chore board'],
  integrations: ['email reminders'],
  authRequired: true,
  roles: ['parent', 'child'],
});

console.log(exportMarkdownSpec(output.spec, output.techPlan));
console.log(formatPromptPackMarkdown(output.promptPack));
```

## Source Of Truth

The typed generator in `lib/generator` is the source of truth for app specs, tech plans, agent tasks, prompt packs, checklists, scaffold previews, complexity, and risks. The UI stores generated project artifacts in a local project wrapper instead of maintaining duplicate planning models.

## Documentation

| Document                                               | Purpose                                    |
| ------------------------------------------------------ | ------------------------------------------ |
| [CONTRIBUTING.md](CONTRIBUTING.md)                     | How to contribute and work with AppFactory |
| [docs/APPFACTORY_SPEC.md](docs/APPFACTORY_SPEC.md)     | Complete architecture and specifications   |
| [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md)       | Step-by-step multi-agent workflow guide    |
| [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md) | Security, data, and deployment rules       |
| [docs/ROADMAP.md](docs/ROADMAP.md)                     | Current and planned features               |
| [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) | Pre-release verification steps             |
| [docs/PROMPT_TEMPLATES.md](docs/PROMPT_TEMPLATES.md)   | Templates for agent prompts                |

## Project Status

Round 3 polish preview: step wizard, scaffold preview, local project management, about/status page, and safe export workflow are wired together.
