# AppFactory

AppFactory is a local-first command centre for turning rough app ideas into complete, scaffolded applications that teams can build from safely.

The MVP captures app ideas, generates specs, creates complete Next.js project scaffolds, and prepares review artifacts for multi-agent development workflows.

## What It Does

- **Captures ideas** through the `/new` wizard
- **Generates specs**: Clarifying questions, app specs, tech plans, data models
- **Creates app scaffolds**: Complete Next.js project structure with starter code
- **Splits work**: Agent tasks with branch names, ownership, and deliverables
- **Exports everything**: Markdown specs, agent prompts, checklists, JSON configs, and runnable code
- **Manages projects** locally in the browser with search, delete, and export features
- **Stays safe**: No API keys required, all work local, review gates before deployment

## Key Features

✨ **App Scaffolding**: Download complete, runnable Next.js projects with your app's specifications built in

📋 **Project Management**: Create, search, delete, and export projects with full version history

🤖 **Agent Prompts**: Four-agent prompt packs with clear ownership boundaries and guardrails

🔍 **Spec Generation**: Automatic generation of app specs, tech plans, and risk assessments

📦 **Multi-format Export**: Download as Markdown, JSON, or complete project scaffold

## Safety Rules

- No real API keys are required
- No live OpenAI, GitHub, or Vercel calls are made
- Projects persist through localStorage only in this MVP
- Agent prompts include branch naming, file ownership, PR, no-secret, and deploy-approval guardrails

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run typecheck
npm run format
```

## Automation

This project now includes GitHub Actions CI for build, lint, and test runs on push and pull requests, plus local pre-commit checks for formatting and secret scanning.

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

## Kept From Round 1

The integration keeps the typed generator in `lib/generator` as the source of truth for app specs, tech plans, agent tasks, prompt packs, checklists, complexity, and risks. The earlier standalone UI project model was replaced with a project wrapper that stores generator outputs directly.

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

Round 2 MVP integration: local app creation, generator-backed project details, persistent projects, and copyable prompt packs are wired together.
