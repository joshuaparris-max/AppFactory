# Contributing to AppFactory

Welcome! AppFactory is built for collaborative, multi-agent development. This guide explains how to work with AppFactory safely and effectively.

## Before You Start

1. **Read** [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md)
2. **Understand** [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md)
3. **Review** [docs/APPFACTORY_SPEC.md](docs/APPFACTORY_SPEC.md)

## The Basic Workflow

### Step 1: Create Your Branch

```bash
git checkout -b feature/<your-agent-name>/<short-description>
```

Examples:

- `feature/copilot-c2/auth-spec`
- `feature/builder-agent/user-dashboard`
- `feature/qa-agent/test-suite`
- `feature/deployer/release-checklist`

**Rule**: Each agent has its own branch. Never commit directly to `main`.

### Step 2: Make Your Changes

**Do**:

- Make small, focused changes
- Write clear commit messages
- Add tests for new functionality
- Update docs if you change behavior
- Reference the spec in PRs

**Don't**:

- Commit API keys or secrets
- Modify other agents' files without discussion
- Skip testing or checks
- Merge your own PRs (wait for review)

### Step 3: Commit With a Clear Message

```bash
git add .
git commit -m "Brief description: what changed and why

- Detailed explanation
- References to spec sections
- Any breaking changes noted
- Any dependencies added

Closes #123 (if applicable)"
```

### Step 4: Push and Open a PR

```bash
git push origin feature/<your-branch>
```

Then open a **Pull Request** on GitHub with:

- Clear title (what changed)
- Description of changes
- Reference to spec sections affected
- Any breaking changes noted
- Test results (passed/failed)
- Review checklist (see [examples/example-review-checklist.md](examples/example-review-checklist.md))

### Step 5: Wait for Review

**PRs must be reviewed and approved before merging:**

- For core changes: Josh reviews and approves
- For feature changes: Any agent can review
- For docs/examples: Any agent can review

**Rule**: Never merge your own PR. Always wait for review.

## Safety Rules (Critical)

### Secrets & Environment

- **Never** commit `.env`, `.env.local`, or any secrets
- Use `.env.example` for template (with fake values)
- Document required env vars in code comments

### Deployment

- **No agent silently deploys**
- Check [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before any release
- Josh must approve live deployments
- Use staging first, never skip to production

### Code Changes

- Run `npm run check` before committing (lint + build + test)
- All tests must pass
- No breaking changes without discussion
- Keep changes focused and reviewable

### File Ownership

- Don't rewrite another agent's code without discussing first
- Comment why you changed something
- In conflicts, ask human (Josh) to decide

## Running Checks

```bash
# Run everything
npm run check

# Or individually:
npm run lint       # Check code style
npm run build      # Build for production
npm run test       # Run tests
npm run qa         # Run QA checks
```

**Rule**: Never commit if `npm run check` fails.

## Examples & Templates

Use these as starting points:

- **New App Spec**: See [examples/example-app-spec.md](examples/example-app-spec.md)
- **Prompt Pack**: See [examples/example-4-agent-prompt-pack.md](examples/example-4-agent-prompt-pack.md)
- **Review Checklist**: See [examples/example-review-checklist.md](examples/example-review-checklist.md)
- **Kids Worship App**: See [examples/kids-worship-app-spec.md](examples/kids-worship-app-spec.md) (real example)

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:

- `feat(auth): add JWT token refresh`
- `docs(workflow): clarify agent roles`
- `fix(build): resolve webpack config issue`
- `test(api): add auth endpoint tests`

## Questions?

- **How do I start?** → Read [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md)
- **What's safe?** → Check [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md)
- **What's the spec?** → See [docs/APPFACTORY_SPEC.md](docs/APPFACTORY_SPEC.md)
- **How do I release?** → Follow [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)

---

**Last Updated**: June 2026
