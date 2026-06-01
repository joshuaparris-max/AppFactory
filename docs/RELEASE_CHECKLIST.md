# AppFactory Release Checklist

Step-by-step checklist for releasing AppFactory to production.

**For**: Deployer agent + Josh  
**Time Required**: 30-60 minutes  
**Last Updated**: June 2026

## Pre-Release (24 hours before)

### Code Quality Check

- [ ] All feature PRs are merged to `main`
- [ ] `main` branch is clean (no uncommitted changes)
- [ ] No failing tests: `npm run test`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] All code reviews approved
- [ ] No merge conflicts

### Security Check

- [ ] No secrets in code: `git log --all -p | grep -i "password\|secret\|key\|token"`
- [ ] No API keys in environment
- [ ] No hardcoded database credentials
- [ ] Dependencies scanned for vulnerabilities: `npm audit`
- [ ] All security fixes applied
- [ ] `.env` file not committed
- [ ] `.env.example` has only fake values
- [ ] `.gitignore` protects secrets

### Documentation Check

- [ ] README.md updated
- [ ] CHANGELOG.md updated
- [ ] API documentation current
- [ ] Examples work and are tested
- [ ] Any breaking changes documented
- [ ] Migration guides provided (if needed)
- [ ] Known issues documented

### Testing Check

- [ ] Unit tests all pass
- [ ] Integration tests all pass
- [ ] Manual QA checklist complete
- [ ] Cross-browser testing done (if web app)
- [ ] Mobile testing done (if applicable)
- [ ] Accessibility testing done (if applicable)
- [ ] Performance testing done
- [ ] Edge cases tested

---

## Version Update

### Update Version Number

```bash
# Current version (check first)
cat package.json | grep version

# Update version (semantic versioning)
# Format: MAJOR.MINOR.PATCH
# - MAJOR: Breaking changes
# - MINOR: New features
# - PATCH: Bug fixes

npm version patch    # For bug fixes (1.2.3 → 1.2.4)
npm version minor    # For new features (1.2.3 → 1.3.0)
npm version major    # For breaking changes (1.2.3 → 2.0.0)

# Verify
cat package.json | grep version
```

**Version Checklist**:
- [ ] Version bumped correctly
- [ ] git tag created automatically
- [ ] CHANGELOG.md has version section

### Update CHANGELOG

**Format**:
```markdown
## [1.2.4] - 2026-06-01

### Added
- Feature one
- Feature two

### Changed
- Behavior change
- API improvement

### Fixed
- Bug fix one
- Bug fix two

### Security
- Security patch

### Breaking Changes
- List if any

### Migration Guide
- If breaking changes

### Known Issues
- Issue one: workaround
- Issue two: workaround
```

**Checklist**:
- [ ] CHANGELOG.md has new version section
- [ ] All features listed
- [ ] All bug fixes listed
- [ ] All breaking changes listed
- [ ] Migration guide included (if needed)
- [ ] Known issues documented

---

## Staging Deployment

### Deploy to Staging

1. **Build for staging**:
   ```bash
   npm run build
   # Should complete without errors
   ```

2. **Deploy binary/code**:
   ```bash
   # Example (adjust for your setup)
   # cp -r dist/ /staging/app/
   # or
   # docker push app:staging && kubectl rollout restart deployment/app-staging
   # or
   # npm run deploy:staging
   ```

3. **Verify deployment**:
   ```bash
   # Check app is running
   curl https://staging.example.com/health
   # Expected: 200 OK
   ```

**Staging Checklist**:
- [ ] Build completed without errors
- [ ] Deployment succeeded
- [ ] App is running
- [ ] Logs look healthy
- [ ] No errors in monitoring

### Smoke Test on Staging

Test critical user flows:

- [ ] Homepage loads
- [ ] Login works
- [ ] Core feature 1 works
- [ ] Core feature 2 works
- [ ] Logout works
- [ ] Profile page loads
- [ ] No JavaScript errors in console
- [ ] Page load time is acceptable
- [ ] Database queries working
- [ ] API calls working
- [ ] Images load correctly
- [ ] Links work
- [ ] Forms submit correctly
- [ ] Email sends (if applicable)

**Smoke Test Results**:
```markdown
## Staging Smoke Test Results - 2026-06-01

### ✓ Passed
- Homepage loads in 1.2 sec
- Login succeeds
- Dashboard loads data
- Profile updates work

### ✗ Failed
(None)

### ⚠️ Warnings
(None)

### Tested By
- Deployer Agent
- QA Agent

### Date
2026-06-01 14:30 UTC
```

---

## Josh Approval (Critical)

**Before production deployment, Josh must approve**:

```markdown
## Release Approval Request

### Version: 1.2.4
### Branch: feature/deployer/v1.2.4-release
### Date: 2026-06-01

### Checklist
- [x] All code reviews approved
- [x] All tests passing
- [x] No secrets in code
- [x] Security audit passed
- [x] Staging tests passed
- [x] Documentation updated
- [x] CHANGELOG updated
- [x] Rollback plan in place

### Known Issues
(None)

### Rollback Plan
If production breaks, revert to v1.2.3:
1. git checkout v1.2.3
2. npm run build
3. npm run deploy:production
4. Verify https://example.com/health returns 200
5. Monitor logs for 30 min

### Questions?
(Answer any Josh asks)

### Ready for Production?
@josh Please review and approve. Ready to deploy once you sign off.
```

**Josh Approval Checklist**:
- [ ] Reviewed all changes since last release
- [ ] Read CHANGELOG
- [ ] Verified staging tests
- [ ] Confirmed security audit
- [ ] Approved deployment
- [ ] Signed off in PR

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Josh approved
- [ ] All staging tests passed
- [ ] Monitoring systems ready
- [ ] Alerting configured
- [ ] On-call team notified
- [ ] Maintenance window (if needed) scheduled
- [ ] Rollback plan documented
- [ ] Communication plan ready

### Deploy to Production

1. **Final checks**:
   ```bash
   git status              # Should be clean
   npm run check          # Should pass
   ```

2. **Deploy**:
   ```bash
   # Example (adjust for your setup)
   npm run deploy:prod
   # or
   # docker push app:v1.2.4 && kubectl set image deployment/app app=app:v1.2.4
   # or
   # manually on server: pull, build, restart
   ```

3. **Verify deployment**:
   ```bash
   curl https://example.com/health
   # Expected: 200 OK
   ```

**Deployment Log Template**:
```markdown
## Production Deployment Log - 2026-06-01

### Version: 1.2.4
### Start Time: 14:30 UTC
### Duration: 5 minutes

### Deployment Steps
1. Built binary ✓
2. Uploaded to server ✓
3. Restarted application ✓
4. Verified health check ✓

### End Time: 14:35 UTC
### Status: SUCCESS ✓

### Verified
- App is running
- Health check passes
- Critical endpoints respond
- No errors in logs
```

**Deployment Checklist**:
- [ ] Deployment started at [time]
- [ ] Deployment completed successfully
- [ ] Health checks passing
- [ ] App responding normally
- [ ] Logs show no errors
- [ ] Monitoring active
- [ ] Rollback available if needed

---

## Post-Deployment Monitoring

### First 30 Minutes (Critical)

Monitor closely for issues:

```markdown
## Post-Deployment Monitoring - 2026-06-01 14:35 UTC

### Key Metrics
- [ ] Uptime: 100%
- [ ] Error rate: < 0.1%
- [ ] Response time: normal
- [ ] CPU usage: normal
- [ ] Memory usage: normal
- [ ] Database connections: healthy

### Issues Found
(None)

### Actions Taken
(None needed)

### Monitoring Until
2026-06-01 15:05 UTC (30 min window)
```

**Monitoring Checklist**:
- [ ] Check uptime monitoring
- [ ] Check error logs
- [ ] Check performance metrics
- [ ] Check database health
- [ ] Check external integrations
- [ ] Monitor user reports
- [ ] Be ready to rollback if needed

### First 24 Hours (Ongoing)

Continue monitoring:

- [ ] No spike in error rate
- [ ] No performance degradation
- [ ] No unexpected behavior
- [ ] Database performing well
- [ ] No user complaints
- [ ] All features working
- [ ] All integrations working

---

## If Something Goes Wrong

### Immediate Response

**If you see errors**:
1. Check logs: what's the error?
2. Tell Josh immediately
3. Assess severity:
   - **Critical** (app down): Rollback immediately
   - **High** (features broken): Rollback
   - **Medium** (some users affected): Investigate, maybe rollback
   - **Low** (edge case): Monitor and fix in next release

### Rollback Procedure

```bash
# Step 1: Identify previous version
git tag | tail -5
# v1.2.3 (previous stable version)

# Step 2: Rollback code
git checkout v1.2.3
npm run build

# Step 3: Redeploy previous version
npm run deploy:prod

# Step 4: Verify
curl https://example.com/health

# Step 5: Notify
# Tell users: "We rolled back v1.2.4 to v1.2.3 due to issues"

# Step 6: Investigate
# What went wrong in v1.2.4?
# Fix it in a new release
```

**Rollback Checklist**:
- [ ] Previous version identified
- [ ] Code checked out
- [ ] Built successfully
- [ ] Deployed successfully
- [ ] Health checks passing
- [ ] Users notified
- [ ] Root cause identified

### Incident Report

```markdown
## Incident Report: v1.2.4

### What Happened
Brief description of the issue

### When
Start: 2026-06-01 14:35 UTC
End: 2026-06-01 14:45 UTC
Duration: 10 minutes

### Impact
- Affected users: X%
- Affected endpoints: /api/feature
- Business impact: $X loss (if applicable)

### Root Cause
What went wrong? Why wasn't it caught in staging?

### What We Did
1. Detected issue at 14:40 UTC
2. Rolled back to v1.2.3 at 14:45 UTC
3. Verified system stable

### Prevention
How do we prevent this next time?
- Add test case for this scenario
- Improve staging tests
- Add monitoring alert
- Code review checklist update

### Follow-up
- [ ] Test case added
- [ ] Monitoring alert added
- [ ] Docs updated
- [ ] Team meeting scheduled

### Assignee
Josh: Review incident
Builder: Fix code
QA: Add test
Deployer: Update checklist
```

---

## Release Success Checklist

After successful production deployment:

- [ ] All code merged and tested
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Staging deployment successful
- [ ] Staging tests passed
- [ ] Production deployment successful
- [ ] Health checks passing
- [ ] No errors in logs
- [ ] Monitoring stable (30+ min)
- [ ] Users notified (if needed)
- [ ] Release notes published
- [ ] Git tag created
- [ ] Documentation updated

---

## Communication Template

### Release Announcement

```markdown
## 🎉 AppFactory v1.2.4 Released

**Features**:
- New user dashboard
- Better performance
- Security improvements

**Bug Fixes**:
- Fixed login issue
- Fixed profile save

**Breaking Changes**:
- Removed deprecated `/api/v1/` endpoints
  Migration guide: See CHANGELOG.md

**Migration**:
Update imports from `OldAPI` to `NewAPI`

**Timeline**:
- Released: 2026-06-01 14:35 UTC
- Stable: 2026-06-01 15:35 UTC (after 1 hour monitoring)

**Questions?**
See [CHANGELOG.md](CHANGELOG.md) for full details
Contact Josh for urgent issues
```

---

## Quick Reference

| Step | Owner | Time | Status |
|------|-------|------|--------|
| Code quality check | Builder | 5 min | Pre-release |
| Security check | QA | 5 min | Pre-release |
| Version update | Deployer | 2 min | Pre-release |
| Staging deploy | Deployer | 5 min | Staging |
| Staging test | QA | 10 min | Staging |
| Josh approval | Josh | 5 min | Approval |
| Production deploy | Deployer | 5 min | Production |
| Monitor (30 min) | Deployer | 30 min | Post-deploy |
| Monitor (24 hours) | Deployer | ongoing | Post-deploy |

---

## Troubleshooting

### Build Fails

```bash
npm run build
# If fails:
npm ci                # Clean install
npm run clean         # Clear cache
npm run build         # Try again
```

### Tests Fail

```bash
npm run test
# If fails:
npm run test -- --verbose  # See details
npm run test -- --watch    # Debug interactively
```

### Deployment Fails

```bash
# Check logs
tail -100 /var/log/app.log   # Server logs
docker logs app-prod          # Docker logs
kubectl logs deployment/app   # Kubernetes logs

# Rollback if needed
git checkout v1.2.3
npm run deploy:prod
```

---

## Questions & Support

- **Questions about checklist?** → See [docs/SAFETY_GUARDRAILS.md](docs/SAFETY_GUARDRAILS.md)
- **Questions about workflow?** → See [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md)
- **Emergency?** → Tell Josh immediately

---

**Last Updated**: June 2026  
**Review Frequency**: Before each release  
**Owner**: Deployer Agent
