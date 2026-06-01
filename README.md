# AppFactory

**AppFactory** is an intelligent application development framework designed to enable collaborative, multi-agent development of web applications. It provides guardrails, workflows, and templates to ensure safe, reliable, and iterative development.

## Quick Start (5 minutes)

### What is AppFactory?

AppFactory enables **multiple AI agents** to safely collaborate on building applications together. Each agent works on its own branch, follows safety guidelines, and submits changes for review before deployment.

### Key Principles

1. **Multi-Agent Safe**: Agents never silently deploy; humans approve all changes
2. **Documented**: Specs and workflows are clear and discoverable
3. **Tested**: Changes must pass checks before merge
4. **Reversible**: Each agent works on separate branches
5. **Observable**: All changes are tracked and explainable

### The 4-Agent Workflow

AppFactory uses four agent roles working in parallel:

| Agent | Role | Tools |
|-------|------|-------|
| **Copilot** | Architecture & Foundation | Design specs, core setup |
| **Builder** | Implementation | Code generation, features |
| **QA** | Testing & Validation | Tests, checks, examples |
| **Deployer** | Release & Operations | Checklists, deployment configs |

Each agent:
- Works on its own feature branch
- Creates pull requests with clear descriptions
- Waits for human or peer review
- Never directly merges to main or deploys

### Get Started

```bash
# 1. Read the docs (5 min)
cat docs/AGENT_WORKFLOW.md
cat docs/SAFETY_GUARDRAILS.md

# 2. See an example project
cat examples/kids-worship-app-spec.md
cat examples/example-4-agent-prompt-pack.md

# 3. Check safety before coding
cat docs/RELEASE_CHECKLIST.md
cat docs/APPFACTORY_SPEC.md

# 4. Run tests (if available)
npm run lint
npm run build
npm run test
```

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

## Examples

| Example | Description |
|---------|-------------|
| [examples/kids-worship-app-spec.md](examples/kids-worship-app-spec.md) | Sample project spec (Kids Worship Music App) |
| [examples/example-4-agent-prompt-pack.md](examples/example-4-agent-prompt-pack.md) | Four-agent prompt pack template |
| [examples/example-app-spec.md](examples/example-app-spec.md) | Generic app spec template |
| [examples/example-review-checklist.md](examples/example-review-checklist.md) | Code review checklist for agents |

## Commands

```bash
npm run lint      # Check code style
npm run build     # Build for production
npm run test      # Run tests
npm run dev       # Start development server (if applicable)
npm run check     # Run all checks (lint + build + test)
```

## First Time?

1. **Read** [CONTRIBUTING.md](CONTRIBUTING.md) to understand the workflow
2. **Review** [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md) for safety rules
3. **Check** [examples/kids-worship-app-spec.md](examples/kids-worship-app-spec.md) for a real example
4. **Run** the [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before any release

## Support

- **Questions about workflow?** → See [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md)
- **Questions about safety?** → See [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md)
- **Questions about specs?** → See [docs/APPFACTORY_SPEC.md](docs/APPFACTORY_SPEC.md)
- **Need a checklist?** → See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)

## Project Status

🚀 **Foundation Phase**: Building core documentation, workflows, and safety guardrails

See [docs/ROADMAP.md](docs/ROADMAP.md) for planned features.

---

**Last Updated**: June 2026 | **Branch**: feature/qa-docs-copilot-c2
