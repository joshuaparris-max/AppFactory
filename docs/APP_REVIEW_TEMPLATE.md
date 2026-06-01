# App Review Template

Use this template when reviewing a feature before export or deploy.

**What changed?**

- Short summary of the change and linked spec or issue.

**Why?**

- Why this change is needed and the acceptance criteria it meets.

**How to validate**

- Commands to run locally: `npm run build && npm run test`.
- Manual steps for a reviewer (smoke test steps).

**Risks & Mitigations**

- List any risks (live calls, data sensitivity, agent collisions) and how they were mitigated.

**Handoffs**

- Files owned by other agents touched? List and link PR comments showing coordination.

**Approvals required**

- Project owner approval for production deploy.
- At least one peer agent review (Foundation/UI/Backend/QA as appropriate).
