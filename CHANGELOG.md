# Changelog

All notable changes to AppFactory will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- (Upcoming features go here)

### Changed
- (Upcoming changes go here)

### Fixed
- (Upcoming bug fixes go here)

### Security
- (Upcoming security fixes go here)

### Deprecated
- (Upcoming deprecations go here)

### Removed
- (Upcoming removals go here)

## [1.0.0] - 2026-06-01

### Added
- Foundation documentation (README, CONTRIBUTING, specs)
- Multi-agent workflow specification
- Safety guardrails and security checklists
- Release checklist and deployment guide
- Example projects (Kids Worship Music App)
- Example code review checklist
- Example 4-agent prompt pack
- npm scripts for lint, build, test
- .gitignore for secrets protection
- .env.example template
- ROADMAP for future features

### Features (Foundation)
- [x] Multi-agent safe development workflow
- [x] Clear documentation for 5-minute onboarding
- [x] Safety guardrails to prevent secret leaks
- [x] Release checklist for production deployments
- [x] Example project specification (Kids Worship Music App)
- [x] Code review checklist for peer agents
- [x] Prompt templates for each agent role
- [x] Git workflow with feature branches
- [x] PR-based code review process

### Known Limitations
- No automation yet (GitHub Actions not set up)
- No example working code yet (specifications only)
- Manual deployment required (no CI/CD)
- No pre-commit hooks yet (secret scanning)
- Limited to specification documentation

---

## Guidelines for Updating This File

### When to Update CHANGELOG
- When a new feature is merged to main
- When a bug fix is merged to main
- When documentation is significantly updated
- When security fixes are released
- When there are breaking changes

### When NOT to Update CHANGELOG
- For internal refactoring (no user impact)
- For code style changes
- For test additions
- For documentation typos

### Format
- Use [Keep a Changelog](https://keepachangelog.com/) format
- Categories: Added, Changed, Fixed, Security, Deprecated, Removed
- Group by version with YYYY-MM-DD dates
- Link to PRs and issues when possible: `[#123](https://github.com/joshuaparris-max/AppFactory/pull/123)`

### Example Entry
```markdown
## [1.2.3] - 2026-07-15

### Added
- New feature X ([#456](https://github.com/joshuaparris-max/AppFactory/pull/456))

### Fixed
- Bug where Y would crash ([#789](https://github.com/joshuaparris-max/AppFactory/pull/789))

### Security
- Patched vulnerability in dependency Z
```

### Version Numbers
- MAJOR.MINOR.PATCH (Semantic Versioning)
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes

Example progression:
- 1.0.0 (first release)
- 1.0.1 (bug fix)
- 1.1.0 (new feature)
- 2.0.0 (breaking changes)

---

**Last Updated**: June 1, 2026  
**Current Version**: 1.0.0  
**Status**: Foundation Phase
