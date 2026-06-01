# AppFactory Safety Guardrails

This document collects practical, non-blocking safety rules for multi-agent work in AppFactory.

Core principles
- One branch per agent and clear branch naming: `agent/<project-slug>-<role-slug>`.
- Never commit secrets, credentials, or private keys. Use `.env.example` for placeholders.
- Keep live integrations behind service interfaces and disabled by default.
- Respect file ownership and avoid overwriting another agent's work without a documented handoff.
- Require human approval for production deploys and any live-credential changes.

Quick actions
- Before editing shared files: check branch owner, read diffs, and add a PR comment documenting the handoff.
- Before merging: run `npm run check` (lint + build + test) and ensure required approvals are present.
- For integrations: implement a mock adapter and document the live API shape in `docs/integrations.md`.

When in doubt
- Open an issue or flag the PR and ask the project owner for guidance.

See also: `docs/AGENT_WORKFLOW.md`, `lib/generator/guardrails.ts`
# Safety Guardrails for AppFactory

Critical safety rules and best practices for AppFactory development.

**Read this before your first commit!**

**Version**: 1.0  
**Last Updated**: June 2026  
**Scope**: All agents and developers

## TL;DR (Critical Rules)

🚫 **NEVER**:
- Commit API keys, passwords, or secrets
- Commit `.env` or `.env.local` files
- Deploy to production without Josh approval
- Merge without peer review
- Ignore failing tests

✅ **ALWAYS**:
- Use `.env.example` (with fake values)
- Review code before merging
- Pass `npm run check` before commit
- Document why you changed something
- Wait for human approval before deploy

---

## 1. Secrets & Credentials (Critical)

### Rule 1: Never Commit Secrets

**Forbidden**:
```javascript
// ❌ WRONG: Secret in code
const API_KEY = "sk_live_abc123xyz";
export const DB_PASSWORD = "super_secret_pass";
const STRIPE_SECRET = "rk_live_...";
```

**Correct**:
```javascript
// ✅ RIGHT: Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const STRIPE_SECRET = process.env.STRIPE_SECRET;
```

### Rule 2: Use .env.example (Not Real Secrets)

**Correct .env.example**:
```
# .env.example (NEVER COMMIT REAL SECRETS)
API_KEY=your_api_key_here
DB_HOST=localhost
DB_PASSWORD=your_password_here
STRIPE_SECRET=sk_test_...
GOOGLE_OAUTH_ID=your_oauth_id_here
```

**Forbidden .env.example**:
```
# ❌ WRONG: Real secret values
API_KEY=sk_live_abc123xyz
DB_PASSWORD=productionPassword123
```

### Rule 3: .gitignore Must Protect Secrets

**Correct .gitignore**:
```
.env
.env.local
.env.*.local
.env.prod
.env.staging
*.key
*.pem
```

**Verify**:
```bash
# Make sure these files are not tracked
git status  # Should NOT show .env files

# Check if they were ever tracked (DO NOT DO THIS)
# If they were, they must be removed from history
```

### Rule 4: Setup Instructions for Secrets

**Add to README.md**:
```markdown
## Setup

1. Copy `.env.example` to `.env.local`
   cp .env.example .env.local

2. Get your real values from:
   - API Key: See docs/SETUP.md
   - DB Password: Ask Josh
   - Stripe Secret: See team 1Password

3. Never commit `.env.local`
   git add .env.local  # ❌ NO! Will be caught by pre-commit hook
```

### Rule 5: Audit for Secrets

Before pushing:
```bash
# Check for common secret patterns
git diff HEAD

# Look for:
# - API keys (sk_*, pk_*, etc.)
# - Passwords
# - Tokens
# - URLs with credentials
# - Private keys
```

### If You Accidentally Commit a Secret

**IMMEDIATE ACTION**:
1. Stop everything
2. Tell Josh
3. Remove from code: `git revert <commit>`
4. Rotate the key/password immediately
5. Never push with the secret

**How to remove from history** (only Josh):
```bash
# DO NOT do this yourself - ask Josh
git filter-branch ...  # Complex, dangerous
```

---

## 2. Deployment Safety (Critical)

### Rule 1: No Silent Deployments

**Forbidden**:
```javascript
// ❌ WRONG: Agent auto-deploys
if (allTestsPass) {
  deployToProduction(); // ❌ NO! Humans must approve
}
```

**Correct**:
```javascript
// ✅ RIGHT: Document and wait for human
console.log("✓ All tests passed");
console.log("✓ Ready for production deployment");
console.log("→ Waiting for Josh approval...");
// Josh: Reviews, approves, manually deploys
```

### Rule 2: Staging First

**Required Workflow**:
```
Code → Tests Pass → Deploy to Staging → Josh Tests → Deploy to Production
```

**Never**:
- Skip staging
- Deploy directly to production
- Test on production first

### Rule 3: Josh Approves All Productions Deploys

**Process**:
1. Deployer prepares release checklist (see [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md))
2. Deployer opens PR with checklist
3. Josh reviews and approves
4. Only after approval, Deployer deploys

**Code**:
```markdown
## Release Checklist
- [ ] All tests pass
- [ ] All PRs merged
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Josh reviewed and approved
→ Only after Josh checks all boxes can deployment happen
```

### Rule 4: Rollback Plan Required

Before every release, have a rollback plan:

```markdown
## Rollback Plan for v1.2.3

If something breaks in production:
1. Identify the problem
2. Run: git revert v1.2.3
3. Deploy previous version: git deploy v1.2.2
4. Notify users
5. Post-mortem analysis

Time to rollback: < 5 minutes
```

### Rule 5: Monitor After Deployment

After deploying to production:
- [ ] Check error logs
- [ ] Monitor uptime (if applicable)
- [ ] Test critical user flows
- [ ] Check performance metrics
- [ ] Be ready to rollback

---

## 3. Code Safety

### Rule 1: All Reviews Must Happen

**Before merge, require**:
- [ ] Peer agent code review (5-30 min)
- [ ] Automatic checks pass (lint, build, test)
- [ ] Josh approval (for main branch)

**Never**:
- Approve your own PR
- Skip review to save time
- Merge without passing checks

### Rule 2: Tests Must Pass

```bash
# Before committing
npm run check    # Runs lint + build + test

# ALL must be green
✓ Lint passes
✓ Build passes
✓ Tests pass
```

**Never commit if**:
- Tests fail
- Build has errors
- Lint has errors

### Rule 3: No Breaking Changes Without Discussion

If you must make a breaking change:

1. **Document it clearly**:
```markdown
## Breaking Changes
- Changed API endpoint from `/api/user` to `/api/v2/user`
- Migration: Update imports from `UserAPI` to `UserAPIv2`
```

2. **Provide migration guide**:
```markdown
## Migration Guide
For existing users:
1. Update imports: `import { UserAPIv2 as UserAPI } from '...'`
2. Update calls: `userAPI.v2.getUser()` instead of `userAPI.getUser()`
```

3. **Get Josh approval**:
```markdown
@josh This is a breaking change. Please confirm we should do this.
```

### Rule 4: Comment Complex Logic

```javascript
// ✅ Good: Explains WHY
// We retry auth tokens 3 times because AWS SigV4 sometimes
// has timing issues. 2 retries wasn't enough in production.
async function signRequest(request) {
  for (let i = 0; i < 3; i++) {
    try {
      return await signer.sign(request);
    } catch (e) {
      if (i === 2) throw e;
    }
  }
}

// ❌ Bad: No explanation
async function signRequest(request) {
  for (let i = 0; i < 3; i++) {
    try {
      return await signer.sign(request);
    } catch (e) {
      if (i === 2) throw e;
    }
  }
}
```

### Rule 5: No Unnecessary Dependencies

Before adding a package:
```bash
npm install new-package
```

Ask:
- Is it necessary?
- Is it maintained?
- Does it have security issues? `npm audit`
- Is it too large?

Never:
- Add unmaintained packages
- Add packages with known vulnerabilities
- Add huge packages for tiny functionality

---

## 4. Collaboration Safety

### Rule 1: Respect File Ownership

**Each agent owns their output**:
- **Copilot**: `docs/specs/`
- **Builder**: `src/`, production code
- **QA**: `tests/`, test code
- **Deployer**: `docs/releases/`, deployment docs

**If you need to change someone else's work**:
1. Ask in PR comment: "Would you mind if I changed X?"
2. If they don't respond in 24h, proceed with comment
3. Document why you changed it
4. Notify in commit message

**Never**:
- Rewrite someone's code without asking
- Delete someone's work to "clean up"
- "Fix" code style in someone else's PR

### Rule 2: Clear Commit Messages

**Bad**:
```
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

**Good**:
```
git commit -m "feat(auth): add JWT token refresh

- Implement refresh token endpoint
- Store tokens in HTTP-only cookies
- Auto-refresh before expiry (15 min)
- Add logout that invalidates tokens

Related to #42, closes #40"
```

### Rule 3: Use PR Comments for Discussion

**In PR**:
```markdown
@builder This looks good, but one question:
Why use HTTP-only cookies instead of localStorage?
(Just want to understand the security decision)
```

**Never**:
- Use Slack/email for code discussions
- Merge without addressing comments
- Ignore feedback

### Rule 4: Ask Josh for Conflicts

If two agents disagree:

```markdown
@copilot @builder You two disagree on API design.
Let's discuss in this PR. I'll weigh in.

Copilot: "Should be /api/users/:id/permissions"
Builder: "Should be /api/permissions?userId=:id"
Josh: "Let's go with Copilot's structure because..."
```

### Rule 5: Regular Sync (If Needed)

If working closely:
- Daily standup comment in PR
- Weekly check-in on progress
- Monthly retrospective on process

---

## 5. Security Checklist

Before releasing, verify:

- [ ] No hardcoded secrets
- [ ] No SQL injection risks (use parameterized queries)
- [ ] No XSS risks (sanitize user input)
- [ ] No CSRF risks (use tokens)
- [ ] Authentication/authorization correct
- [ ] Error messages don't leak info
- [ ] Sensitive data encrypted (passwords, tokens)
- [ ] HTTPS enforced (if web app)
- [ ] Security headers set (if web app)
- [ ] Dependencies scanned for vulnerabilities

```bash
# Check dependencies
npm audit
npm audit fix   # If needed
```

---

## 6. Accessibility Checklist (If Web App)

Before releasing, verify:

- [ ] Images have alt text
- [ ] Form labels present
- [ ] Keyboard navigation works
- [ ] Color not only way to convey info
- [ ] Text contrast sufficient
- [ ] Focus visible
- [ ] Error messages clear
- [ ] Mobile responsive

---

## 7. Data Privacy Checklist

Before releasing, verify:

- [ ] User data encrypted at rest
- [ ] User data encrypted in transit (HTTPS)
- [ ] Passwords hashed (bcrypt or similar)
- [ ] Tokens short-lived
- [ ] No user data in logs
- [ ] Privacy policy exists
- [ ] GDPR compliance (if EU users)
- [ ] Data deletion works
- [ ] Backups encrypted

---

## 8. Quality Checklist

Before releasing, verify:

- [ ] All tests pass
- [ ] Lint passes
- [ ] Build succeeds
- [ ] No console errors
- [ ] Performance acceptable (load < 3 sec)
- [ ] No obvious bugs
- [ ] Docs updated
- [ ] Examples work

---

## 9. The Review Checklist

See [examples/example-review-checklist.md](examples/example-review-checklist.md) for a detailed code review checklist that agents should use.

---

## 10. Emergency Procedures

### If Production Goes Down

1. **Immediate**: Tell Josh immediately
2. **Within 5 min**: Assess damage (what broke?)
3. **Within 15 min**: Rollback if possible
   ```bash
   git revert <commit>
   # Deploy previous working version
   ```
4. **Within 1 hour**: Root cause analysis
5. **Document**: Write incident report

### If Secret is Exposed

1. **Immediately**: Tell Josh
2. **Immediately**: Rotate the secret (change password, revoke token, etc.)
3. **Within 1 hour**: Remove from git history (Josh does this)
4. **Within 24 hours**: Audit who had access
5. **Within 48 hours**: Post-mortem

### If Code Quality Drops

1. **Identify**: Which PR introduced it?
2. **Revert**: `git revert <commit>`
3. **Discuss**: Why did review miss it?
4. **Improve**: Update checklist or review process

---

## 11. Approval Matrix

| Change | Copilot | Builder | QA | Josh | Deployer |
|--------|---------|---------|----|----|----------|
| Docs/Specs | Josh + Any | - | - | - | - |
| Code/Features | - | Copilot + QA | - | - | - |
| Tests | - | Builder | Copilot | - | - |
| Version/Release | - | - | - | Josh | Must have |
| Production Deploy | - | - | - | **Josh** | Executes |
| Security changes | Josh | - | - | Josh | - |

**Rule**: Every change needs at least 1 other person's approval before merge.

---

## 12. Summary

✅ **Do**:
- Use environment variables for secrets
- Provide `.env.example` (with fake values)
- Review before merging
- Pass all checks before commit
- Wait for Josh to approve deployments
- Document why you made changes
- Ask before changing someone else's code
- Rotate secrets immediately if exposed

❌ **Don't**:
- Commit secrets to git
- Auto-deploy to production
- Merge without review
- Ignore failing tests
- Approve your own PR
- Skip staging environment
- Make breaking changes without discussion
- Rewrite someone's code without asking

---

## Questions?

- **What's a secret?** → API keys, passwords, tokens, private URLs
- **Where do secrets go?** → `.env.local` file (never committed)
- **Can I deploy?** → No, only Josh can deploy to production
- **Can I merge my own PR?** → No, always need peer review
- **What if tests fail?** → Fix the code, don't commit it
- **What if I make a mistake?** → Tell Josh immediately
- **What about CI/CD?** → Use GitHub Actions (see docs/RELEASE_CHECKLIST.md)

---

**Last Updated**: June 2026  
**Review Frequency**: Quarterly  
**Owner**: Josh (updated by any agent)
