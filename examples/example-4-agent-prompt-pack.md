# Example: 4-Agent Prompt Pack

Complete set of prompts for all four agents working on a feature.

**For**: Reference when starting a new feature  
**Project**: Kids Worship Music App  
**Date**: June 2026

---

## Agent: Copilot (Architect) - Prompt #1

**Task**: Design the Kids Worship App architecture

**Prompt to Copilot**:

```
I need to design a kids worship music app. Here's what we need:

Users:
- Kids ages 6-12
- Simple, colorful interface
- Browse and play songs with lyrics
- Save favorites
- Works offline

Constraints:
- Should be simple (MVP)
- No user accounts yet
- Fast load time (< 2 sec)
- Works on tablets and phones
- No complex backend needed

Please provide:
1. Architecture overview (frontend/backend/database)
2. Data model (songs, users, favorites)
3. API design (what endpoints we need)
4. Technology recommendations
5. Implementation phases (MVP, Phase 2, Phase 3)
6. Edge cases and how to handle them
7. Success criteria

Follow the template in docs/PROMPT_TEMPLATES.md under "Feature Specification Template"
```

**Expected Output**:
- Complete spec in docs/specs/kids-worship-app-spec.md
- Clear enough that Builder can implement without asking questions
- Edge cases documented
- Testing strategy included

---

## Agent: Builder (Developer) - Prompt #1

**Task**: Build the frontend UI shell

**Prompt to Builder**:

```
I've designed the Kids Worship App. Read the spec:
docs/specs/kids-worship-app-spec.md

Your Phase 1 task (this week):
Build the frontend UI shell with:
1. Home page (list of songs)
2. Player page (play controls + lyrics)
3. Favorites page
4. Profile page

Start with:
- React (or Vue if you prefer) with Vite
- Tailwind CSS for styling
- Mock data for now (no real API yet)
- localStorage for user profile

Tasks:
1. Create project structure
2. Build components for each page
3. Add routing (React Router)
4. Style with Tailwind
5. Add unit tests for components
6. Ensure works on mobile

Before committing:
- npm run lint
- npm run build
- npm run test
- All must pass!

Create clear commit messages:
git commit -m "feat(ui): implement home page and player

- Home page with song list
- Player page with play controls
- Favorites and profile pages
- Mobile responsive
- Tests for main components"

Report back when ready for code review.
```

**Expected Output**:
- Working React/Vue project
- All pages functional
- Unit tests passing
- Ready for QA to write integration tests
- Code review from Copilot

---

## Agent: QA (Quality Assurance) - Prompt #1

**Task**: Plan testing approach

**Prompt to QA**:

```
Builder is implementing the Kids Worship App.

Read:
- Spec: docs/specs/kids-worship-app-spec.md
- Architecture: (from Copilot's design)
- Builder's code: (once PR is open)

Your Phase 1 task (this week):
1. Review Builder's code for spec compliance
2. Write test plan for Phase 1
3. Create manual QA checklist

Test Plan should cover:
- Unit tests for all components
- Integration tests for API calls (when ready)
- E2E tests for main flows
- Edge cases from spec
- Mobile responsiveness
- Accessibility

Create file: docs/qa/kids-worship-test-plan.md

Manual QA Checklist:
docs/qa/kids-worship-qa-checklist.md
- List of things to test manually
- Expected results
- Edge cases to verify

Code Review:
When Builder opens PR for Phase 1:
- Review against spec
- Check tests are comprehensive
- Verify no obvious bugs
- Use template from examples/example-review-checklist.md

Report back when test plan is ready.
```

**Expected Output**:
- Test plan document
- QA checklist
- Code review of Builder's PR
- Integration tests ready to write in Phase 2

---

## Agent: Deployer (Release Manager) - Prompt #1

**Task**: Prepare deployment infrastructure

**Prompt to Deployer**:

```
We're building the Kids Worship App.

Your Phase 1 task:
Prepare deployment infrastructure and processes

Tasks:
1. Design deployment architecture
   - Where will it be hosted?
   - Staging and production URLs?
   - How to deploy code?
   - How to rollback if needed?

2. Create deployment runbook
   - Step-by-step deployment instructions
   - For staging
   - For production
   - File: docs/operations/kids-worship-deployment.md

3. Plan monitoring
   - What metrics to track?
   - Error tracking (Sentry or similar)?
   - Uptime monitoring?
   - File: docs/operations/kids-worship-monitoring.md

4. Start release checklist template
   - docs/releases/kids-worship-release-template.md
   - Based on docs/RELEASE_CHECKLIST.md

5. Security checklist
   - No secrets in code
   - HTTPS enforced
   - CORS configured
   - File: docs/security/kids-worship-security.md

Recommendations:
- Frontend: Vercel or Netlify (easy for React/Vue)
- Backend: Render, Railway, or Heroku (simple Node.js)
- Database: PostgreSQL managed (Supabase, Railway) or SQLite (simpler)
- Monitoring: Sentry (free tier)
- CDN: Vercel or Netlify CDN (included)

Report back with deployment infrastructure designed.
```

**Expected Output**:
- Deployment runbook
- Monitoring plan
- Release checklist template
- Security plan
- Ready for Copilot to review

---

## After Phase 1: Full Team Sync

**All agents read**:
- Builder's code PR
- QA's test plan
- Deployer's deployment runbook
- Each agent reviews others' work

**Team meeting points**:
1. Does the code match the spec? (Copilot)
2. Are tests comprehensive? (QA)
3. Can we deploy this? (Deployer)
4. Any blockers or questions? (All)

---

## Agent: Copilot - Prompt #2 (After Phase 1)

**Task**: Review Builder's implementation

**Prompt to Copilot**:

```
Builder completed Phase 1 and opened PR #1 with the UI.

Please review:
1. Does the code match the spec in docs/specs/kids-worship-app-spec.md?
2. Is the architecture sound?
3. Any concerns or improvements?
4. Are edge cases handled?
5. Is testing adequate?
6. Questions for Builder?

Use the code review template from docs/PROMPT_TEMPLATES.md
```

**Expected Output**:
- Code review comments in GitHub PR
- Approval or requests for changes
- Clear feedback for Builder

---

## Agent: QA - Prompt #2 (After Phase 1)

**Task**: Code review and initial testing

**Prompt to QA**:

```
Builder completed Phase 1. PR #1 is open.

Please:
1. Review code for testability
2. Run the app locally and test:
   - Home page loads
   - Song list displays
   - Can click on songs
   - Player shows
   - Profile page works
   - Favorites page works
3. Check for obvious bugs
4. Verify mobile responsiveness
5. Report findings in PR

Use the review checklist from examples/example-review-checklist.md
```

**Expected Output**:
- Code review feedback
- Testing results
- Approval or change requests
- Bug reports (if any)

---

## Agent: Builder - Prompt #2 (After Reviews)

**Task**: Address feedback and merge

**Prompt to Builder**:

```
Copilot and QA have reviewed Phase 1.

Please:
1. Read all feedback in PR #1
2. Fix any issues identified
3. Update tests if needed
4. Push changes
5. Report when ready to merge

Focus areas if feedback:
- Spec compliance
- Code structure
- Test coverage
- Edge cases
```

**Expected Output**:
- Updated code
- All feedback addressed
- Tests passing
- Ready to merge

---

## Phase 2: Expand Features

**Once Phase 1 is merged:**

### Copilot - Prompt #3
```
Phase 1 is merged. Now let's plan Phase 2.

We need to add:
- API integration (get real songs)
- Lyrics syncing with audio
- Favorites persistence
- Download/offline mode

Please update the spec: docs/specs/kids-worship-app-spec.md with:
1. More detailed API design for Phase 2
2. Offline strategy (IndexedDB, Service Workers)
3. Implementation notes for Builder
4. New edge cases

Create: docs/specs/kids-worship-app-phase2.md
```

### Builder - Prompt #3
```
Phase 2 design is done. Time to implement.

New tasks:
1. Connect to real API
2. Implement lyrics display with sync
3. Add favorites to localStorage
4. Implement download functionality
5. Add offline mode

Before each commit: npm run check

When done: Open PR #2 for Phase 2 code review
```

### QA - Prompt #3
```
Builder is working on Phase 2.

Phase 2 tasks:
1. Write integration tests for API calls
2. Test lyrics sync accuracy
3. Test offline mode (disconnect network)
4. Test download functionality
5. Full QA checklist

Create: docs/qa/kids-worship-qa-phase2.md
```

### Deployer - Prompt #3
```
Phase 2 is in progress.

Tasks:
1. Set up staging environment
2. Set up production environment
3. Create CI/CD pipeline (GitHub Actions)
4. Set up error tracking (Sentry)
5. Create production monitoring alerts

Doc: docs/operations/kids-worship-ci-cd.md
```

---

## Phase 3: Polish & Release

**Once Phase 2 is merged:**

### All Agents - Prep for Release
```
Phase 2 merged. Time to prepare v1.0 release.

All agents:
1. Run full test suite
2. Check security
3. Check accessibility
4. Check performance
5. Update docs

Deployer:
1. Create release checklist: docs/releases/v1.0-checklist.md
2. Write release notes: CHANGELOG.md
3. Stage release
4. Final QA on staging

Copilot:
Ask Josh for approval to release.
```

---

## Key Prompting Principles

### 1. Always Reference Specs
```
"Read docs/specs/kids-worship-app-spec.md"
(Don't ask agent to figure out requirements)
```

### 2. Be Specific About What's Needed
```
Good: "Write integration tests for API calls with mock data"
Bad: "Write tests"
```

### 3. Provide Examples
```
"Use the template in examples/example-review-checklist.md"
```

### 4. Ask for Specific Formats
```
"Use markdown format with # for headers, - for bullets"
```

### 5. Ask for Validation
```
"How will you verify this meets the performance requirement?"
```

---

## Common Issues & How to Prompt

### If Builder is Stuck
```
"You're building [feature]. The spec says [relevant section].

You're stuck on [problem]. What approach would work?"
```

### If Tests Fail
```
"Tests are failing. Run: npm run test -- --verbose

What's breaking? How should you fix it?"
```

### If Security Issue Found
```
"QA found potential security issue: [issue].

How should we fix this? What tests would catch this?"
```

### If Performance Problem
```
"App load time is 4 seconds, target is 2 seconds.

Where is the bottleneck? How would you optimize?"
```

---

## Summary

This example shows how four agents work together:

1. **Copilot** designs → **Builder** implements → **QA** tests → **Deployer** releases
2. Each agent has clear tasks and outputs
3. Each agent reviews others' work
4. Clear prompts prevent confusion
5. Specification is the source of truth
6. All work follows the same workflow

**For a real feature**: Create your own prompt pack using this as a template.

---

**Last Updated**: June 2026  
**Used for**: Kids Worship Music App example  
**Reference**: docs/PROMPT_TEMPLATES.md
