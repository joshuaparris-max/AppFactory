# Contributing

AppFactory uses a 4-agent workflow so changes stay scoped and reviewable.

## Agent Roles

1. **Codex C1 - Foundation and architecture**
   - Owns app structure, shared types, route boundaries, persistence, and build health.
   - Keeps integrations behind safe interfaces until explicitly approved.

2. **UI Agent - Product interface**
   - Owns layout polish, interaction states, responsive behavior, and component refinement.
   - Uses existing types and components instead of reshaping the foundation without review.

3. **Integration Agent - External systems**
   - Owns future OpenAI, GitHub, and Vercel connector work.
   - Must keep secrets out of the repo and add approval gates before side effects.

4. **QA Agent - Verification and risk**
   - Owns test plans, acceptance checks, regression notes, and risk review.
   - Confirms local persistence, routing, build output, and approval-gate behavior.

## Workflow

1. Start from a project idea and clarify scope.
2. Generate or update the app spec.
3. Draft the technical plan and scaffold plan.
4. Split work across the four agent roles.
5. Review risks and acceptance criteria.
6. Export prompts or tasks for the next agent.
7. Require Josh approval before scaffold, deployment, or external API actions.

## Development Rules

- Do not commit secrets or `.env.local`.
- Do not add paid API requirements for the MVP.
- Keep changes small and route them through the relevant agent role.
- Run `npm run build` before handing off foundation changes.
- Document any new integration boundary in `src/lib` or the settings surface.
