# Merge Process

Recommended merge process to keep the repo safe and reviewable:

1. Create a feature branch following `agent/<project-slug>-<role-slug>`.
2. Open a PR with a clear description, changed files list, and the review checklist filled.
3. Run `npm run check` locally and include CI output in the PR.
4. Request reviews from relevant agents (Foundation, UI/UX, Backend, QA) and the project owner for production changes.
5. Address comments, push fixes to the same branch. Avoid force-pushing after review unless noted.
6. Merge only when: all CI checks pass, required human approvals exist, and the PR description documents risks and handoffs.

Do not merge directly to `main` and do not deploy to production without a human sign-off.
