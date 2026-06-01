import { branchNameForAgent, FILE_OWNERSHIP_SUGGESTIONS, GLOBAL_AGENT_GUARDRAILS } from "./guardrails";
import type {
  AgentRole,
  AgentTask,
  AppSpec,
  ChecklistCategory,
  ComplexityEstimate,
  Milestone,
  ProjectPlan,
  PromptPack,
  ReviewChecklist,
  Risk,
  ScaffoldItem,
  StackRecommendation,
  TechPlan
} from "./types";
import { createClarifyingQuestions, generateAppSpec } from "./spec";
import type { ClarifyingAnswers } from "./types";

const FOUNDATION_ROLE: AgentRole = "Foundation / architecture";
const UI_ROLE: AgentRole = "UI / UX";
const BACKEND_ROLE: AgentRole = "Backend / integrations";
const QA_ROLE: AgentRole = "QA / tests / docs";

export function generateTechPlan(spec: AppSpec): TechPlan {
  const stack = stackForSpec(spec);
  const scaffoldPlan = scaffoldForSpec(spec);

  return {
    stack,
    architectureDecisions: [
      "Keep generator and domain logic in pure TypeScript modules separate from UI components.",
      "Use service interfaces for AI, GitHub, Vercel, notifications, storage, and future external systems.",
      "Default integrations to mock adapters so tests and previews do not need secrets.",
      "Model the first release around a complete vertical slice before expanding secondary features.",
      "Keep generated plans deterministic so outputs are unit-testable and reviewable."
    ],
    scaffoldPlan,
    milestones: milestonesForSpec(spec),
    dataFlow: [
      "User input or fixture data enters through UI/forms/API handlers.",
      "Validation normalises the request into typed domain objects.",
      "Domain services apply workflow rules and update local or mocked persistence.",
      "View models expose only the state needed by the current screen or export.",
      "External integration calls remain stubbed until a human approves live configuration."
    ],
    testingStrategy: [
      "Unit-test pure generator/domain functions with representative sample inputs.",
      "Add fixture-based tests for each service interface and integration stub.",
      "Cover the primary user journey with a smoke test before UI polish work expands.",
      "Test guardrails: no secrets required, no live network calls in default scripts, clear error states.",
      "Add regression tests for each bug fixed during multi-agent work."
    ],
    deploymentPlan: [
      "Local build and test must pass before opening PR.",
      "Preview deploys are allowed only through the VercelService interface or approved CI.",
      "Production deploy requires human approval and a reviewed PR.",
      "Environment variables are documented in `.env.example` only, never committed with real values."
    ],
    coordinationGuardrails: GLOBAL_AGENT_GUARDRAILS
  };
}

export function generateAgentTasks(spec: AppSpec): AgentTask[] {
  return [
    {
      role: FOUNDATION_ROLE,
      mission: "Create the project skeleton, shared types, state boundaries, domain modules, and architecture notes that other agents can safely build on.",
      branchName: branchNameForAgent(spec.slug, "foundation"),
      ownedPaths: [...FILE_OWNERSHIP_SUGGESTIONS.foundation],
      sharedPaths: ["README.md", "docs/architecture/**"],
      coordinateWith: [UI_ROLE, BACKEND_ROLE, QA_ROLE],
      deliverables: [
        "Typed app/domain models and shared constants.",
        "Project scripts, lint/build/test baseline, and folder conventions.",
        "Architecture notes explaining module boundaries and ownership.",
        "Stub data or fixtures required by UI and QA agents."
      ],
      forbiddenActions: commonForbiddenActions(),
      acceptanceCriteria: [
        "The app builds from a fresh install.",
        "Shared types cover core features, roles, permissions, and data entities.",
        "No agent needs to edit foundation-owned files without a handoff note.",
        "All integration boundaries remain mocked or disabled by default."
      ],
      suggestedFiles: ["lib/domain/types.ts", "lib/domain/workflows.ts", "docs/architecture/overview.md", "package.json"]
    },
    {
      role: UI_ROLE,
      mission: "Build the main user experience around the primary journey with copyable outputs, clear states, and no dependency on live services.",
      branchName: branchNameForAgent(spec.slug, "ui-ux"),
      ownedPaths: [...FILE_OWNERSHIP_SUGGESTIONS.uiUx],
      sharedPaths: ["README.md", "docs/ui-notes.md"],
      coordinateWith: [FOUNDATION_ROLE, BACKEND_ROLE, QA_ROLE],
      deliverables: [
        "Primary screens for the first useful session.",
        "Copyable prompt/spec/checklist views where generated text is shown.",
        "Responsive layout with loading, empty, success, and error states.",
        "Accessible labels and keyboard-friendly controls."
      ],
      forbiddenActions: commonForbiddenActions(),
      acceptanceCriteria: [
        "A user can complete the primary journey without reading documentation.",
        "Generated prompts and checklist text are easy to copy if the app has a UI.",
        "The UI consumes typed data from fixtures, props, or service boundaries.",
        "Text does not overlap or overflow at common mobile and desktop widths."
      ],
      suggestedFiles: ["src/app/page.tsx", "src/components/AppSpecView.tsx", "src/components/PromptPackView.tsx", "src/styles/global.css"]
    },
    {
      role: BACKEND_ROLE,
      mission: "Implement safe service adapters, validation, persistence boundaries, and planned integrations without making live external calls by default.",
      branchName: branchNameForAgent(spec.slug, "backend-integrations"),
      ownedPaths: [...FILE_OWNERSHIP_SUGGESTIONS.backend],
      sharedPaths: ["lib/domain/**", "docs/integrations.md"],
      coordinateWith: [FOUNDATION_ROLE, UI_ROLE, QA_ROLE],
      deliverables: [
        "Service interfaces and mock implementations.",
        "Validation and persistence boundaries for core entities.",
        "Integration notes for future GitHub, Vercel, AI, notifications, or data imports.",
        "Safe error handling and audit-friendly logging shape."
      ],
      forbiddenActions: commonForbiddenActions(),
      acceptanceCriteria: [
        "No live OpenAI, GitHub, Vercel, payment, email, or production database call occurs in default mode.",
        "Every planned integration has a mock adapter and a typed request/response shape.",
        "Sensitive data handling is documented when relevant.",
        "Backend functions can be tested with fixtures."
      ],
      suggestedFiles: ["src/services/index.ts", "src/services/mockServices.ts", "src/api/routes.ts", "docs/integrations.md"]
    },
    {
      role: QA_ROLE,
      mission: "Protect the build from coordination chaos with tests, review checklists, documentation, and release verification.",
      branchName: branchNameForAgent(spec.slug, "qa-tests-docs"),
      ownedPaths: [...FILE_OWNERSHIP_SUGGESTIONS.qaDocs],
      sharedPaths: ["package.json", "docs/architecture/**"],
      coordinateWith: [FOUNDATION_ROLE, UI_ROLE, BACKEND_ROLE],
      deliverables: [
        "Unit tests for pure functions and workflow rules.",
        "Smoke tests for the primary user journey.",
        "Review checklist mapped to acceptance criteria and risk areas.",
        "README updates explaining setup, scripts, mock mode, and handoff rules."
      ],
      forbiddenActions: commonForbiddenActions(),
      acceptanceCriteria: [
        "Build and test scripts pass locally.",
        "The review checklist catches secrets, live calls, branch ownership, and deploy approval risks.",
        "Docs explain how a new agent should start without overwriting others.",
        "Known gaps are documented as issues or follow-up tasks."
      ],
      suggestedFiles: ["tests/core.test.ts", "tests/smoke.test.ts", "docs/review-checklist.md", "README.md"]
    }
  ];
}

export function generatePromptPack(spec: AppSpec, tasks: AgentTask[]): PromptPack {
  return {
    globalGuardrails: GLOBAL_AGENT_GUARDRAILS,
    prompts: tasks.map((task) => ({
      role: task.role,
      title: `${spec.name}: ${task.role}`,
      branchName: task.branchName,
      prompt: buildAgentPrompt(spec, task)
    }))
  };
}

export function generateReviewChecklist(spec: AppSpec): ReviewChecklist {
  const riskItems = identifyRisks(spec).map((risk) => `${risk.title}: ${risk.mitigation}`);
  const categories: ChecklistCategory[] = [
    {
      name: "Product and Scope",
      items: [
        `Spec matches the core idea: ${spec.idea}`,
        `Primary audience is clear: ${spec.primaryAudience}`,
        "First release is a complete vertical slice, not a loose collection of screens.",
        "Open questions are either answered or tracked before implementation expands."
      ]
    },
    {
      name: "Agent Coordination",
      items: [
        "Each agent has a branch named with the `agent/<project-slug>-<role-slug>` convention.",
        "Owned paths are respected; shared files include handoff notes in PR descriptions.",
        "No work is overwritten without reading the current diff and coordinating with the owner.",
        "Every merge happens through a PR after human review."
      ]
    },
    {
      name: "Security and Safety",
      items: [
        "No secrets, tokens, credentials, private keys, or real user data are committed.",
        "Live AI, GitHub, Vercel, email, payment, and database calls are disabled by default.",
        "Sensitive data assumptions and retention rules are documented.",
        "Production deploy cannot happen without human approval."
      ]
    },
    {
      name: "Architecture",
      items: [
        "Generator and domain logic are separated from UI.",
        "External systems are accessed through typed service interfaces.",
        "Mock adapters work in tests and local development.",
        "Data model, permissions, and core features remain consistent."
      ]
    },
    {
      name: "Testing",
      items: [
        "Unit tests cover generator outputs and primary workflow rules.",
        "Smoke tests cover the first useful user journey.",
        "Error, empty, loading, and success states are reviewed.",
        "Build passes from a clean checkout."
      ]
    },
    {
      name: "Risks",
      items: riskItems.length ? riskItems : ["No high-priority risks identified for this spec."]
    }
  ];

  return {
    title: `${spec.name} Review Checklist`,
    categories,
    requiredApprovals: [
      "Project owner approves scope and first release definition.",
      "Human reviewer approves PR before merge.",
      "Human owner approves any live integration credentials.",
      "Human owner approves production deploy."
    ]
  };
}

export function estimateComplexity(spec: AppSpec): ComplexityEstimate {
  const rationale: string[] = [];
  let score = 15;

  const featureScore = spec.coreFeatures.length * 4 + spec.secondaryFeatures.length * 2;
  score += featureScore;
  rationale.push(`${spec.coreFeatures.length} core feature(s) and ${spec.secondaryFeatures.length} secondary feature(s) add ${featureScore} points.`);

  if (spec.integrations.length > 0) {
    const points = spec.integrations.length * 6;
    score += points;
    rationale.push(`${spec.integrations.length} planned integration(s) add ${points} points.`);
  }

  if (spec.permissions.length > 1) {
    score += 8;
    rationale.push("Multiple roles and permissions add 8 points.");
  }

  if (spec.type === "game-prototype" || spec.type === "data-analyser") {
    score += 12;
    rationale.push(`${spec.type} requires specialised interaction or analysis logic, adding 12 points.`);
  }

  if (spec.type === "staff-training-app" || spec.experience.platforms.length > 1) {
    score += 6;
    rationale.push("Training evidence or multiple target platforms add 6 points.");
  }

  if (spec.openQuestions.length > 3) {
    score += 8;
    rationale.push("Several open product questions add discovery risk.");
  }

  const cappedScore = Math.min(100, score);
  const size = sizeFromScore(cappedScore);

  return {
    score: cappedScore,
    size,
    estimatedAgents: size === "small" ? 2 : size === "medium" ? 3 : 4,
    estimatedSprints: size === "small" ? 1 : size === "medium" ? 2 : size === "large" ? 3 : 5,
    rationale
  };
}

export function identifyRisks(spec: AppSpec): Risk[] {
  const risks: Risk[] = [
    {
      id: "risk-agent-collision",
      title: "Agents may overwrite each other's work",
      severity: "high",
      likelihood: "possible",
      trigger: "Multiple agents edit shared files without checking branch ownership or diffs.",
      mitigation: "Use owned path suggestions, handoff notes, PR review, and explicit coordination before shared edits.",
      ownerRole: FOUNDATION_ROLE
    },
    {
      id: "risk-live-services",
      title: "Live services could be called before approval",
      severity: "high",
      likelihood: "possible",
      trigger: "An integration is wired directly into UI or backend code without a mock boundary.",
      mitigation: "Keep GitHub, Vercel, AI, payment, email, and database calls behind disabled service interfaces.",
      ownerRole: BACKEND_ROLE
    }
  ];

  if (spec.integrations.length > 0) {
    risks.push({
      id: "risk-integration-scope",
      title: "Integration scope may expand the first release",
      severity: "medium",
      likelihood: "likely",
      trigger: "The team tries to complete live integrations before validating the core workflow.",
      mitigation: "Ship with mock adapters and document the request/response shape for later live work.",
      ownerRole: BACKEND_ROLE
    });
  }

  if (spec.permissions.length > 1) {
    risks.push({
      id: "risk-permissions",
      title: "Role permissions may be inconsistent",
      severity: "medium",
      likelihood: "possible",
      trigger: "UI, backend, and tests define role behaviour independently.",
      mitigation: "Centralise permission rules in typed domain logic and test role-specific workflows.",
      ownerRole: FOUNDATION_ROLE
    });
  }

  if (spec.type === "data-analyser") {
    risks.push({
      id: "risk-analysis-trust",
      title: "Analysis output may be misleading",
      severity: "high",
      likelihood: "possible",
      trigger: "Charts or summaries present unvalidated assumptions as facts.",
      mitigation: "Show data quality warnings, sample counts, missing values, and confidence limits.",
      ownerRole: QA_ROLE
    });
  }

  if (spec.type === "game-prototype") {
    risks.push({
      id: "risk-game-depth",
      title: "Prototype may feel shallow despite having content",
      severity: "medium",
      likelihood: "possible",
      trigger: "More encounters are added before the core loop is readable and satisfying.",
      mitigation: "Test one complete loop with clear controls, feedback, win/loss state, and replay before expanding.",
      ownerRole: UI_ROLE
    });
  }

  if (spec.primaryAudience.toLowerCase().includes("child") || spec.idea.toLowerCase().includes("child")) {
    risks.push({
      id: "risk-child-privacy",
      title: "Child or household privacy needs extra care",
      severity: "high",
      likelihood: "possible",
      trigger: "The app stores children's names, behaviour, rewards, or household routines.",
      mitigation: "Minimise personal data, use mock records in demos, and document approval and retention rules.",
      ownerRole: BACKEND_ROLE
    });
  }

  return risks;
}

export function createProjectPlan(answers: ClarifyingAnswers): ProjectPlan {
  const spec = generateAppSpec(answers);
  const techPlan = generateTechPlan(spec);
  const tasks = generateAgentTasks(spec);
  const promptPack = generatePromptPack(spec, tasks);

  return {
    spec,
    techPlan,
    tasks,
    promptPack,
    reviewChecklist: generateReviewChecklist(spec),
    complexity: estimateComplexity(spec),
    risks: identifyRisks(spec)
  };
}

export const createGeneratorOutput = createProjectPlan;

function stackForSpec(spec: AppSpec): StackRecommendation {
  const dataLayer = spec.type === "data-analyser" ? "Local file parser plus planned Postgres/object storage boundary" : "Postgres-compatible repository interface with in-memory mock";
  const aiLayer = spec.type === "data-analyser" || spec.type === "learning-app" ? "AIService interface with mock summaries; live calls disabled" : "AIService interface available but disabled";

  return {
    frontend: "TypeScript React/Next.js or equivalent component app",
    backend: "Typed server/service layer with pure domain functions",
    data: dataLayer,
    auth: spec.permissions.length > 1 ? "Role-aware auth boundary, mocked until provider is selected" : "Optional auth boundary, disabled for local prototype",
    hosting: "Vercel-compatible preview plan with production promotion gated by human approval",
    testing: "TypeScript unit tests plus smoke/e2e checks for the primary journey",
    ai: aiLayer
  };
}

function scaffoldForSpec(spec: AppSpec): ScaffoldItem[] {
  return [
    { path: "lib/domain/types.ts", purpose: "Shared app, entity, role, and workflow types.", ownerRole: FOUNDATION_ROLE },
    { path: "lib/domain/workflows.ts", purpose: "Pure workflow rules for core features and permissions.", ownerRole: FOUNDATION_ROLE },
    { path: "lib/services/index.ts", purpose: "Service interfaces for persistence, AI, GitHub, Vercel, and future integrations.", ownerRole: BACKEND_ROLE },
    { path: "lib/services/mockServices.ts", purpose: "Safe mock adapters used by tests and local demos.", ownerRole: BACKEND_ROLE },
    { path: "src/components", purpose: "Reusable UI components for primary screens and generated outputs.", ownerRole: UI_ROLE },
    { path: "src/app", purpose: "App routes, layout, and first journey screens.", ownerRole: UI_ROLE },
    { path: "tests", purpose: "Unit, smoke, and regression tests.", ownerRole: QA_ROLE },
    { path: "docs", purpose: "Architecture, handoff notes, integration plan, and review checklist.", ownerRole: QA_ROLE },
    ...spec.coreFeatures.slice(0, 3).map<ScaffoldItem>((feature) => ({
      path: `lib/domain/${feature.id}.ts`,
      purpose: `Rules and view model helpers for ${feature.name}.`,
      ownerRole: FOUNDATION_ROLE
    }))
  ];
}

function milestonesForSpec(spec: AppSpec): Milestone[] {
  return [
    {
      name: "Spec lock",
      outcome: "Scope, roles, data model, and first journey are agreed before agents split work.",
      exitCriteria: [
        "Open questions are triaged.",
        "Must-have features are confirmed.",
        "Agent ownership paths are accepted."
      ]
    },
    {
      name: "Vertical slice",
      outcome: "The first user journey works with fixture data and mock services.",
      exitCriteria: [
        spec.userJourneys[0]?.successState ?? "Primary journey succeeds.",
        "Build and unit tests pass.",
        "No live integrations or secrets are required."
      ]
    },
    {
      name: "Reviewable preview",
      outcome: "The app is polished enough for Josh to review scope, UX, risks, and next steps.",
      exitCriteria: [
        "Review checklist is complete.",
        "Prompt/spec/checklist exports are copyable if UI exists.",
        "Human approval gate is documented for deploy."
      ]
    }
  ];
}

function buildAgentPrompt(spec: AppSpec, task: AgentTask): string {
  return [
    `You are the ${task.role} agent for ${spec.name}.`,
    "",
    `Project summary: ${spec.summary}`,
    `Core audience: ${spec.primaryAudience}`,
    `Core problem: ${spec.coreProblem}`,
    "",
    "Your mission:",
    task.mission,
    "",
    `Branch: ${task.branchName}`,
    "",
    "Owned paths:",
    ...task.ownedPaths.map((path) => `- ${path}`),
    "",
    "Shared paths requiring coordination:",
    ...task.sharedPaths.map((path) => `- ${path}`),
    "",
    "Deliverables:",
    ...task.deliverables.map((item) => `- ${item}`),
    "",
    "Acceptance criteria:",
    ...task.acceptanceCriteria.map((item) => `- ${item}`),
    "",
    "Global guardrails:",
    ...GLOBAL_AGENT_GUARDRAILS.map((guardrail) => `- ${guardrail}`),
    "",
    "Do not do these things:",
    ...task.forbiddenActions.map((item) => `- ${item}`),
    "",
    "Before you finish, run the relevant build/test checks and write a concise PR summary with changed files, validation, risks, and handoffs."
  ].join("\n");
}

function commonForbiddenActions(): string[] {
  return [
    "Do not commit secrets or real credentials.",
    "Do not make live OpenAI, GitHub, Vercel, payment, email, or production database calls unless explicitly approved.",
    "Do not overwrite another agent's owned files without inspecting diffs and documenting the handoff.",
    "Do not merge directly to main.",
    "Do not deploy to production without human approval."
  ];
}

function sizeFromScore(score: number) {
  if (score < 35) {
    return "small";
  }

  if (score < 60) {
    return "medium";
  }

  if (score < 82) {
    return "large";
  }

  return "epic";
}

export { createClarifyingQuestions };
