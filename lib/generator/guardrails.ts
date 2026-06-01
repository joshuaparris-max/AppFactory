export const GLOBAL_AGENT_GUARDRAILS = [
  "Use one branch per agent, named agent/<project-slug>-<role-slug>.",
  "Stay inside the owned paths for your role unless a handoff note explicitly grants a shared edit.",
  "Do not overwrite other agent work; inspect current files and diffs before editing shared modules.",
  "Open a pull request before merge and request human review.",
  "Do not commit secrets, tokens, credentials, private keys, or real customer data.",
  "Keep external API calls behind service interfaces and disabled by default until approved.",
  "Use mock or fixture data for demos unless the project owner approves live integrations.",
  "Require human approval before production deployment.",
  "Document assumptions, handoffs, and blocked decisions in the PR description."
];

export const FILE_OWNERSHIP_SUGGESTIONS = {
  foundation: [
    "package.json",
    "tsconfig.json",
    "lib/**",
    "src/core/**",
    "docs/architecture/**"
  ],
  uiUx: [
    "app/**",
    "pages/**",
    "src/app/**",
    "src/components/**",
    "src/styles/**",
    "public/**"
  ],
  backend: [
    "src/api/**",
    "src/server/**",
    "src/services/**",
    "src/db/**",
    "lib/services/**"
  ],
  qaDocs: [
    "tests/**",
    "e2e/**",
    "docs/**",
    "README.md",
    "playwright.config.*"
  ]
} as const;

export function branchNameForAgent(projectSlug: string, roleSlug: string): string {
  return `agent/${projectSlug}-${roleSlug}`;
}
