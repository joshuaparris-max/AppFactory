# Deployment Approval

Production deployments require explicit human approval. The minimal steps are:

1. Ensure `npm run check` completes successfully in CI and locally.
2. Confirm the PR documents any live credentials, why they are needed, and who will rotate them.
3. Confirm mock adapters exist and tests cover integration edges.
4. Project owner (or designated approver) writes an approval comment on the PR and adds the `approved-for-production` label.
5. Only after approval, a release PR or CI job may run the deploy steps.

Notes
- Never store real secrets in the repository. Use secure secret stores and reference them in CI only after approval.
- Keep a short audit note in the PR describing the deployment time, approver, and any post-deploy checks.
