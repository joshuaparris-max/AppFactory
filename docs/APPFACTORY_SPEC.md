# AppFactory Specification

Complete architectural and operational specification for AppFactory.

**Version**: 1.0  
**Status**: Foundation Phase  
**Last Updated**: June 2026

## 1. Vision & Goals

### Vision
Enable multiple AI agents to collaboratively build, test, and deploy web applications safely, reliably, and transparently.

### Core Goals
1. **Safety First**: Humans retain full control; agents never silently deploy
2. **Reliability**: All changes pass tests and checks before merge
3. **Transparency**: All decisions, changes, and reasons are documented
4. **Scalability**: Framework supports 4+ agents working in parallel
5. **Simplicity**: Minimal complexity; pragmatic over perfect

## 2. Architecture

### 2.1 The Four-Agent Model

AppFactory uses four specialized agent roles:

#### **1. Copilot (Architect)**
- **Role**: Architecture, specs, foundation
- **Responsibilities**:
  - Design application architecture
  - Write technical specifications
  - Review code for design compliance
  - Make architectural decisions
- **Branch Pattern**: `feature/copilot-<suffix>`
- **Review**: Josh + consensus

#### **2. Builder (Developer)**
- **Role**: Implementation, features, code
- **Responsibilities**:
  - Implement features per spec
  - Write production code
  - Create components and modules
  - Handle technical debt
- **Branch Pattern**: `feature/builder-<suffix>`
- **Review**: Copilot + QA

#### **3. QA (Quality Assurance)**
- **Role**: Testing, validation, verification
- **Responsibilities**:
  - Write tests and test plans
  - Verify spec compliance
  - Run manual QA
  - Create safety checklists
  - Document edge cases
- **Branch Pattern**: `feature/qa-<suffix>`
- **Review**: Builder + Copilot

#### **4. Deployer (Release Manager)**
- **Role**: Deployment, operations, release
- **Responsibilities**:
  - Create release checklists
  - Manage deployment configs
  - Document operational procedures
  - Create runbooks
  - Monitor post-deployment
- **Branch Pattern**: `feature/deployer-<suffix>`
- **Review**: Josh + QA

### 2.2 Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ Copilot Writes Spec → Builder Implements → QA Tests        │
│ ↓                                                            │
│ All agents: Create PR → Review → Approve → Merge to main  │
│ ↓                                                            │
│ Deployer: Release checklist → Josh approves → Deploy       │
└─────────────────────────────────────────────────────────────┘
```

**Key Rules**:
- Each agent works on its own branch
- PRs require review from peer agent + Josh (for main)
- No direct commits to `main`
- No silent deployments
- All agents can see all code

### 2.3 Git Workflow

**Branch Naming**:
```
feature/<agent-name>/<short-description>
feature/copilot-c2/user-auth-spec
feature/builder/dashboard-ui
feature/qa/integration-tests
feature/deployer/production-release
```

**Merge Strategy**:
1. Agent creates feature branch
2. Agent commits focused changes
3. Agent pushes and opens PR
4. Peer agent reviews (5-30 min)
5. Josh approves if needed
6. Agent merges (never auto-merge)

**Protected Rules** (on main):
- Require PR review
- Require all checks to pass
- Require up-to-date with main
- Dismisses stale reviews
- Requires Josh approval for sensitive changes

## 3. Safety Guardrails

### 3.1 Secrets & Environment

**Never**:
- Commit API keys, tokens, or secrets
- Commit `.env` or `.env.local` files
- Hardcode database credentials
- Store auth tokens in code

**Always**:
- Use environment variables
- Provide `.env.example` with fake values
- Document required env vars
- Use `.gitignore` for secrets

**Tools**:
- Pre-commit hooks to detect secrets (if available)
- Regular audits of git history
- Rotate keys if accidentally committed

### 3.2 Deployment Safety

**Staging First Rule**:
- All deployments must test on staging first
- Never skip staging
- Production changes require full checklist
- Josh must approve live deployments

**No Silent Deployment Rule**:
- Agents can suggest deployment configs
- Agents can prepare release checklists
- Only Josh (human) can deploy to production
- Log all deployments with timestamp, who, and what

**Rollback Plan**:
- Every release must have a rollback plan
- Document how to revert quickly
- Keep previous versions available (N-1)
- Test rollback procedures

### 3.3 Code Safety

**Review Requirements**:
- All PRs must be reviewed by peer agent
- Builder code reviewed by Copilot + QA
- Copilot specs reviewed by Builder
- QA tests reviewed by Builder
- All main merges approved by Josh

**Test Requirements**:
- All new code must have tests
- Tests must pass before merge
- 80%+ code coverage target (if practical)
- Manual QA checklist for complex features

**Breaking Changes**:
- Must document all breaking changes
- Must provide migration guide
- Must version APIs (semantic versioning)
- Must notify users before breaking

### 3.4 Agent Boundaries

**Respect File Ownership**:
- Each agent owns their output
- Don't rewrite another agent's code without discussion
- If you must change someone else's code, comment why
- Conflicts: Josh decides

**Communication**:
- Use PR descriptions and comments
- Ask before changing another's work
- Document decisions in commit messages
- Keep specs and code in sync

## 4. Development Process

### 4.1 Development Flow

1. **Spec Phase** (Copilot)
   - Design feature
   - Write spec document
   - Create PR with spec
   - Wait for Builder + QA feedback
   - Merge after review

2. **Build Phase** (Builder)
   - Read spec carefully
   - Implement feature
   - Write unit tests
   - Create PR with code
   - Wait for Copilot + QA review
   - Merge after approval

3. **Test Phase** (QA)
   - Read spec and code
   - Write integration tests
   - Create test plan
   - Manual QA checks
   - Create PR with tests
   - Merge after approval

4. **Release Phase** (Deployer + Josh)
   - Create release checklist
   - Run all checks
   - Prepare deployment
   - Josh approves
   - Deploy to staging
   - Test
   - Deploy to production

### 4.2 Commit Message Guidelines

```
<type>(<scope>): <subject> [<ticket>]

<body - what changed and why>

<footer - breaking changes, closes issues>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests or QA
- `style`: Code style
- `refactor`: Code refactor
- `chore`: Build, deps, etc.

**Examples**:
```
feat(auth): implement JWT refresh token rotation

- Add refresh token endpoint
- Store tokens in HTTP-only cookies
- Auto-refresh before expiry
- Add logout endpoint

Closes #42
```

## 5. Deployment & Release

### 5.1 Release Process

**Before Release**:
1. All PRs merged to main
2. All checks passing
3. Version bumped (package.json)
4. CHANGELOG updated
5. Release checklist run (see docs/RELEASE_CHECKLIST.md)

**Release**:
1. Tag version: `git tag v1.2.3`
2. Build: `npm run build`
3. Deploy to staging
4. Run smoke tests
5. Deploy to production
6. Monitor for issues

**After Release**:
1. Document what deployed
2. Note any issues
3. Create post-mortem if needed
4. Plan next release

### 5.2 Version Management

**Semantic Versioning**: MAJOR.MINOR.PATCH
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

**Version File**: `package.json` (version field)

## 6. Quality Standards

### 6.1 Code Quality

- **Linting**: ESLint or similar (configurable)
- **Build**: Must build without errors/warnings
- **Tests**: All tests must pass
- **Coverage**: 80%+ target (if practical)

### 6.2 Documentation Quality

- **Specs**: Clear, detailed, reviewable by non-experts
- **Code Comments**: Complex logic documented
- **Examples**: Real examples for features
- **Docs**: Kept in sync with code

### 6.3 Design Quality

- **Consistency**: Matches existing patterns
- **Performance**: No obvious bottlenecks
- **Security**: No obvious vulnerabilities
- **Accessibility**: Follows WCAG standards (if applicable)

## 7. Tools & Infrastructure

### 7.1 Required Tools

- **Git**: Version control (minimum)
- **npm**: Package management (if Node.js project)
- **GitHub**: Hosting + PR workflow

### 7.2 Optional Tools

- **Linter**: ESLint, Prettier, etc.
- **Tests**: Jest, Playwright, Vitest, etc.
- **CI/CD**: GitHub Actions or similar
- **Monitoring**: Sentry, LogRocket, etc.

### 7.3 Scripts (npm)

```json
{
  "scripts": {
    "lint": "Check code style",
    "build": "Build for production",
    "test": "Run tests",
    "qa": "Run QA checks",
    "check": "Run all checks (lint+build+test)",
    "dev": "Development server (if applicable)"
  }
}
```

## 8. FAQ

### Q: Can two agents work on the same feature?
**A**: Yes, but coordinate first. Create a shared feature branch (`feature/shared-feature-name`) or have one agent wait for the other to merge.

### Q: What if an agent makes a mistake?
**A**: No problem. That's why we have code review. The peer agent will catch it in PR review. If it merges, Josh can revert with `git revert <commit>`.

### Q: Can an agent deploy?
**A**: No. Agents can prepare deployments and checklists, but only Josh (human) can deploy to production. This ensures human control.

### Q: What if the spec changes?
**A**: Copilot updates the spec in a new PR. Other agents use the new spec for future work. For in-progress work, decide case-by-case (usually finish current work, then update).

### Q: How fast should reviews happen?
**A**: Aim for 24 hours. Urgent changes can be faster (30 min), routine changes can be slower (48 hours).

### Q: What about merge conflicts?
**A**: Merge locally: `git checkout main && git pull && git checkout your-branch && git merge main`. Resolve conflicts, test, commit, and push.

## 9. Success Metrics

- **Code Quality**: All tests pass, no lint errors
- **Documentation**: New features documented
- **Safety**: Zero secrets leaked, all reviews completed
- **Velocity**: Features delivered on schedule
- **Reliability**: Zero unplanned downtime
- **Collaboration**: All agents can work in parallel

## 10. Glossary

| Term | Definition |
|------|-----------|
| **Agent** | AI assistant with a specific role (Copilot, Builder, QA, Deployer) |
| **Spec** | Written specification for a feature or system |
| **PR** | Pull Request (code review mechanism) |
| **Branch** | Independent development line in Git |
| **Main** | Primary branch (production-ready code) |
| **Feature Branch** | Temporary branch for one feature |
| **Merge** | Combine one branch into another |
| **Review** | Peer examination of code changes |
| **Lint** | Automated code style checking |
| **Test** | Automated verification of code behavior |
| **Checklist** | Manual verification steps |
| **Deploy** | Release code to production |

---

**Last Updated**: June 2026  
**Status**: Foundation Phase (v1.0)  
**Next Review**: September 2026
