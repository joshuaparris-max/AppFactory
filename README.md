# AppFactory

AppFactory is a guided AI app-building command centre for Josh. It helps turn an app idea into a reviewed build plan before any agent scaffolds code or touches deployment.

The MVP is intentionally local-first and non-autonomous. It captures ideas, generates planning artifacts, splits work into agent tasks, shows review gates, and prepares exportable prompts for Codex or Copilot. It does not call OpenAI, GitHub, Vercel, or any paid API.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- LocalStorage persistence
- Placeholder integration boundaries for future OpenAI, GitHub, and Vercel workflows

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Current Features

- Home dashboard with project and task summaries
- New App Wizard for local project creation
- Searchable Projects list and project detail route
- Project detail planning controls for phase, risk, prompt export, JSON download, and delete
- Agent Task Board route with project and owner filters
- Settings route documenting safe placeholder integrations
- Local backup export, import, and reset controls
- Shared TypeScript types for `Project`, `AppSpec`, `AgentTask`, `BuildPhase`, and `RiskLevel`
- Mock data seeded into localStorage on first load

## Safety Model

AppFactory should guide, plan, scaffold, review, and prepare projects for approval. The foundation follows these constraints:

- No secrets are committed
- No production deployments are triggered
- No paid API calls are required
- GitHub, Vercel, and OpenAI work remains behind future placeholder interfaces
- Human approval is required before scaffold or deployment actions

## Project Structure

```text
src/app              App Router routes
src/components       Shared UI and product components
src/context          Client-side project store
src/lib              Types, phases, mock data, and localStorage helpers
```

## Environment

Copy `.env.example` to `.env.local` when future integrations need configuration. The current MVP does not require environment variables.
