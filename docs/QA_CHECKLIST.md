# QA Checklist

Minimal checklist to run before approving a feature PR:

- Run static checks: `npm run lint`.
- Build from clean checkout: `npm run build`.
- Run tests: `npm run test`.
- Confirm no secrets are present in changed files.
- Confirm branch naming follows `agent/<project>-<role>` when relevant.
- Confirm UI shows review notices: human approval, risk badges, and file ownership warnings.
- Confirm mock adapters are used for external integrations.
- Validate that review checklist items from `docs/APP_REVIEW_TEMPLATE.md` are covered.

Optional checks

- Manual smoke test of the primary user journey.
- Cross-agent coordination: verify handoff notes and owned paths.
