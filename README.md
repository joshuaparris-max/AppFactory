# AppFactory

AppFactory is a local-first command centre for turning rough app ideas into structured build plans that multiple agents can work from safely.

The MVP wires the Round 1 generator into a Next.js app. A user can create a project idea, save it in localStorage, review the generated app spec, inspect the tech/scaffold plan, copy the four-agent prompt pack, and run through a review checklist before any scaffold or deployment work begins.

## What It Does

- Captures a new app idea through `/new`
- Generates clarifying questions, an app spec, a tech plan, agent tasks, prompts, risks, and a checklist
- Saves projects locally in the browser
- Shows saved projects on `/projects`
- Shows useful project details on `/projects/[projectId]`
- Keeps GitHub, Vercel, and AI integrations behind safe placeholder service interfaces

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
```

## Generator Example

```ts
import {
  createGeneratorOutput,
  exportMarkdownSpec,
  formatPromptPackMarkdown
} from "./lib/generator";

const output = createGeneratorOutput({
  idea: "A family chore and allowance app with parent approvals, streaks, and simple dashboards.",
  audience: "busy families with children aged 8-15",
  mustHaveFeatures: ["parent approval flow", "allowance ledger", "weekly chore board"],
  integrations: ["email reminders"],
  authRequired: true,
  roles: ["parent", "child"]
});

console.log(exportMarkdownSpec(output.spec, output.techPlan));
console.log(formatPromptPackMarkdown(output.promptPack));
```

## Kept From Round 1

The integration keeps the typed generator in `lib/generator` as the source of truth for app specs, tech plans, agent tasks, prompt packs, checklists, complexity, and risks. The earlier standalone UI project model was replaced with a project wrapper that stores generator outputs directly.

## Documentation

| Document | Purpose |
|----------|---------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute and work with AppFactory |
| [docs/APPFACTORY_SPEC.md](docs/APPFACTORY_SPEC.md) | Complete architecture and specifications |
| [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md) | Step-by-step multi-agent workflow guide |
| [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md) | Security, data, and deployment rules |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Current and planned features |
| [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) | Pre-release verification steps |
| [docs/PROMPT_TEMPLATES.md](docs/PROMPT_TEMPLATES.md) | Templates for agent prompts |

## Project Status

Round 2 MVP integration: local app creation, generator-backed project details, persistent projects, and copyable prompt packs are wired together.
