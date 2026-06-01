# AppFactory Agent Workflow Guide

Step-by-step guide for how agents work together in AppFactory.

**For**: Copilot, Builder, QA, Deployer agents  
**Time to Read**: 10 minutes  
**Last Updated**: June 2026

## Quick Summary

**AppFactory is a 4-agent framework where:**
1. **Copilot** designs and specifies
2. **Builder** implements code
3. **QA** tests and validates
4. **Deployer** releases and operates
5. **Josh** (human) approves deployments and makes final decisions

Each agent works on their own Git branch, creates PRs, gets reviewed, and merges only after approval. **No agent can deploy to production.**

## The Full Workflow (Step-by-Step)

### Phase 1: Planning (Copilot)

**Goal**: Define what will be built

**Steps**:

```
1. Copilot creates feature branch
   git checkout -b feature/copilot-c2/<feature-name>

2. Copilot writes specification document
   docs/specs/<feature-name>-spec.md
   
3. Copilot commits with clear message
   git add docs/specs/
   git commit -m "spec: <feature> specification [#123]"

4. Copilot pushes and opens PR
   git push origin feature/copilot-c2/<feature-name>
   (GitHub: Open PR, add description and checklist)

5. Copilot waits for Builder + Josh review
   - Builder: "Is this implementable?"
   - Josh: "Does this fit our vision?"

6. Copilot makes revisions if needed
   (git add, git commit, git push)

7. Josh approves, Copilot merges
   git merge (GitHub UI)
```

**Copilot Checklist**:
- [ ] Spec is clear and detailed
- [ ] Spec is implementable (Builder agrees)
- [ ] No secrets in spec
- [ ] Examples provided
- [ ] Edge cases documented
- [ ] Dependencies noted

---

### Phase 2: Implementation (Builder)

**Goal**: Write code that implements the spec

**Steps**:

```
1. Builder reads merged spec carefully
   cat docs/specs/<feature-name>-spec.md

2. Builder creates feature branch
   git checkout main && git pull
   git checkout -b feature/builder/<feature-name>

3. Builder implements features
   - Create components/modules
   - Write code per spec
   - Add inline documentation
   - No hardcoded secrets

4. Builder writes unit tests
   tests/<feature-name>.test.js (or .ts, .py, etc.)

5. Builder runs all checks
   npm run lint    # Check style
   npm run build   # Build for production
   npm run test    # Run tests
   (All must pass!)

6. Builder commits with clear message
   git add src/ tests/
   git commit -m "feat(<scope>): <description>
   
   - What was implemented
   - Tests added
   - Any gotchas documented"

7. Builder pushes and opens PR
   git push origin feature/builder/<feature-name>
   (GitHub: Reference spec, add tests, checklist)

8. Builder waits for Copilot + QA review
   - Copilot: "Does this match the spec?"
   - QA: "Can this be tested?"

9. Builder makes changes if needed
   (Repeat: edit, test, commit, push)

10. Reviews approved, Builder merges
    git merge (GitHub UI)
```

**Builder Checklist**:
- [ ] Matches spec exactly
- [ ] Tests written for new code
- [ ] No lint errors
- [ ] Build passes
- [ ] All tests pass
- [ ] No secrets committed
- [ ] Comments for complex logic
- [ ] Code is readable
- [ ] No unnecessary dependencies

---

### Phase 3: Testing (QA)

**Goal**: Verify code works and is safe

**Steps**:

```
1. QA reads merged spec and code
   cat docs/specs/<feature-name>-spec.md
   cat src/<feature-name>.js

2. QA creates feature branch
   git checkout main && git pull
   git checkout -b feature/qa/<feature-name>-tests

3. QA writes integration tests
   tests/integration/<feature-name>.test.js
   tests/e2e/<feature-name>.spec.js (Playwright, etc.)

4. QA writes test plan (manual QA)
   docs/qa/<feature-name>-test-plan.md
   - What to test
   - How to test it
   - Expected results
   - Edge cases

5. QA runs tests
   npm run test          # All tests pass?
   npm run qa            # QA checks

6. QA does manual QA (if needed)
   - Test in browser
   - Test on mobile
   - Test edge cases
   - Document bugs found

7. QA creates checklist for review
   docs/qa/<feature-name>-checklist.md
   (See examples/example-review-checklist.md)

8. QA commits with clear message
   git add tests/ docs/qa/
   git commit -m "test(<feature>): add integration tests

   - Test plan documented
   - Edge cases covered
   - Manual QA checklist provided"

9. QA pushes and opens PR
   git push origin feature/qa/<feature-name>-tests
   (Reference spec, explain test approach)

10. QA waits for Builder + Copilot review
    - Builder: "Are these tests realistic?"
    - Copilot: "Do tests cover all spec requirements?"

11. QA makes changes if needed
    (Repeat: edit, test, commit, push)

12. Reviews approved, QA merges
    git merge (GitHub UI)
```

**QA Checklist**:
- [ ] Tests cover spec requirements
- [ ] Edge cases tested
- [ ] Manual QA plan documented
- [ ] Tests pass locally
- [ ] Test code is clear
- [ ] No secrets in tests
- [ ] Integration tests work with real code
- [ ] Performance is acceptable
- [ ] Error cases handled

---

### Phase 4: Release (Deployer + Josh)

**Goal**: Prepare and deploy to production

**Steps**:

```
1. Deployer checks if everything is merged
   - Spec merged? ✓
   - Code merged? ✓
   - Tests merged? ✓
   - Build passing? ✓

2. Deployer creates release branch
   git checkout -b feature/deployer/v1.2.3-release

3. Deployer updates version
   package.json: "version": "1.2.3"

4. Deployer updates CHANGELOG
   CHANGELOG.md:
   ## v1.2.3 (June 1, 2026)
   - Feature description
   - Bug fixes
   - Known issues

5. Deployer creates release checklist
   docs/releases/v1.2.3-checklist.md
   (Use docs/RELEASE_CHECKLIST.md as template)

6. Deployer commits
   git add package.json CHANGELOG.md docs/releases/
   git commit -m "release: prepare v1.2.3 release"

7. Deployer pushes and opens PR
   git push origin feature/deployer/v1.2.3-release
   (Request Josh approval)

8. Josh reviews and approves PR
   (Josh checks: safe to deploy? ready for users?)

9. Deployer merges after Josh approval
   git merge (GitHub UI)

10. Deployer tags the release
    git checkout main && git pull
    git tag -a v1.2.3 -m "Release v1.2.3"
    git push origin v1.2.3

11. Deployer builds and deploys to staging
    npm run build
    (Deploy to staging environment)

12. Deployer runs smoke tests on staging
    - Check critical paths work
    - No obvious errors
    - Performance acceptable
    - Document any issues

13. Josh gives final approval to deploy to production

14. Deployer deploys to production
    (Follow production deployment procedures)

15. Deployer monitors for issues
    - Check logs
    - Monitor uptime
    - Check user reports
    - Ready to rollback if needed

16. Deployer documents what shipped
    docs/releases/v1.2.3-release-notes.md
    - What shipped
    - Known issues
    - Migration notes (if any)
    - Next steps
```

**Deployer Checklist**:
- [ ] All PRs merged
- [ ] All checks passing
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Release checklist complete
- [ ] Josh approved
- [ ] Staging tested
- [ ] Production deployed
- [ ] Monitoring active
- [ ] Release notes published

---

## Parallel Work Example

Agents can work in parallel:

```
Day 1:
  Copilot: spec: user-auth
  ↓ (merged after 1 hour review)

Day 2:
  Builder: impl: user-auth (starts after spec merged)
  QA: starts reading spec, planning tests
  ↓
  Builder commits code by day 4
  QA has test plan ready

Day 4-5:
  Builder: review + revisions (Copilot + QA feedback)
  QA: writing tests
  ↓
  Both merge by day 5

Day 6:
  Deployer: prep release
  ↓
  Josh approves, Deployer: deploy to staging

Day 6-7:
  Deployer: monitor staging, check for issues
  ↓
  Josh approves production deploy

Day 7:
  Deployer: deploy to production
  ↓
  Done! Feature live for users.
```

**Timeline**: Spec → Code → Tests → Deploy = ~1 week  
**Parallel**: Multiple features can be in different phases simultaneously

---

## Handling Issues

### If Builder Finds Spec Issue

```
Builder (in PR comment): "Spec says X, but I think it should be Y. Here's why..."
Copilot (in PR comment): "You're right, let me update the spec."
Copilot: Update spec PR
Josh: Approve spec change
Builder: Continue implementation with new spec
```

### If QA Finds Code Bug

```
QA (in test): Test fails, code has bug
QA (in PR comment): "Test XYZ fails. Code doesn't handle case ABC."
Builder (in PR comment): "Good catch! Let me fix that."
Builder: Fix code, update tests, push
QA: Re-test, approve
```

### If Josh Doesn't Like Something

```
Josh (in PR): "I'm concerned about security approach. Can we review?"
Copilot/Builder/QA: Discuss in PR comments
Team: Decide on solution
Josh: Approves when satisfied
```

---

## When to Ask Josh

✓ **Do ask Josh**:
- Before deploying to production
- If you're unsure about security
- If architecture changes needed
- If big mistakes found
- If agents can't agree

✓ **Don't ask Josh**:
- For code review (agents review each other)
- For style/lint issues (use linter)
- For test failures (fix the code)
- For minor wording in docs

---

## PR Description Template

```markdown
## What Changed?
[Brief description: what feature, what spec section]

## Why?
[Why this change was needed]

## How?
[How the change works, architecture if needed]

## Testing
- [ ] All tests pass
- [ ] Lint passes
- [ ] Build passes
- [ ] Manual testing done (describe)

## Checklist
- [ ] Matches spec (link spec section)
- [ ] Tests written
- [ ] No secrets committed
- [ ] Breaking changes documented (if any)
- [ ] Docs updated (if needed)

## Review Notes
- Assigned to: [Agent name]
- Depends on: [PR numbers if any]
- Closes: [Issue numbers if any]
```

---

## Common Commands Cheat Sheet

```bash
# Setup
git clone https://github.com/joshuaparris-max/AppFactory
cd AppFactory

# Start a feature
git checkout -b feature/copilot-c2/my-feature

# Work on feature
git add src/
git commit -m "feat: description"
git push origin feature/copilot-c2/my-feature

# Before pushing (ALWAYS)
npm run check       # lint + build + test

# Back to main
git checkout main
git pull

# Delete old branch
git branch -d feature/copilot-c2/my-feature

# Create release tag
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

---

## Summary

| Agent | Input | Output | Review By |
|-------|-------|--------|-----------|
| Copilot | Idea | Spec | Builder, Josh |
| Builder | Spec | Code + Tests | Copilot, QA |
| QA | Spec + Code | Tests + Checklist | Builder, Copilot |
| Deployer | Merged Code | Release + Deploy | Josh |

**Golden Rules**:
1. ✓ Spec first, code second, tests third
2. ✓ Always review from peer agent
3. ✓ Always pass all checks before merge
4. ✓ Josh must approve production deploys
5. ✓ No secrets, ever

---

**Last Updated**: June 2026  
**For Questions**: See [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md) or [CONTRIBUTING.md](CONTRIBUTING.md)
