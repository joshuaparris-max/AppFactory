import type { AgentTask, AppSpec, BuildPhase, Project, RiskLevel } from "@/lib/types";

const now = "2026-06-01T06:00:00.000Z";

function defaultSpec(idea: string): AppSpec {
  return {
    audience: "Josh and trusted build agents",
    problem: idea,
    coreFeatures: [
      "Capture the app idea and target outcome",
      "Generate planning artifacts for review",
      "Split work across specialized agents",
      "Export prompts without calling paid APIs",
    ],
    nonGoals: [
      "Fully autonomous code execution",
      "Production deployment without approval",
      "Live GitHub, Vercel, or OpenAI API automation",
    ],
    constraints: [
      "Local-first storage for MVP",
      "No secrets committed to the repo",
      "Every scaffold step requires human approval",
    ],
    successCriteria: [
      "Josh can create and revisit a project locally",
      "The next build action is clear for every project",
      "Risk and review gates are visible before handoff",
    ],
  };
}

function task(
  id: string,
  projectId: string,
  title: string,
  owner: AgentTask["owner"],
  phase: BuildPhase,
  risk: RiskLevel,
): AgentTask {
  return {
    id,
    projectId,
    title,
    owner,
    phase,
    status: id.endsWith("1") ? "ready" : "backlog",
    risk,
    description: `Prepare the ${title.toLowerCase()} deliverable for approval.`,
    acceptanceCriteria: [
      "Scope is explicit",
      "Risks are called out",
      "No production side effects are required",
    ],
  };
}

export const mockProjects: Project[] = [
  {
    id: "project-appfactory",
    name: "AppFactory",
    idea: "A guided AI app-building command centre that helps Josh plan, scaffold, review, and prepare new apps safely.",
    status: "planning",
    phase: "technical-plan",
    risk: "medium",
    createdAt: now,
    updatedAt: now,
    appSpec: defaultSpec(
      "Josh needs a safe command centre for turning app ideas into reviewed build plans.",
    ),
    clarifyingQuestions: [
      "Who is the first user besides Josh, if anyone?",
      "Which actions must always require approval?",
      "What project artifacts should be exportable first?",
    ],
    technicalPlan: [
      "Use Next.js App Router with client-side localStorage persistence.",
      "Keep integrations behind placeholder interfaces until credentials and approval rules exist.",
      "Model projects, specs, tasks, risk, and build phases as shared TypeScript types.",
    ],
    scaffoldPlan: [
      "Create the app shell and routes.",
      "Add local project creation and persistence.",
      "Add task board and project review surfaces.",
    ],
    reviewChecklist: [
      "No secrets or paid API calls.",
      "Local project survives refresh.",
      "Navigation covers dashboard, wizard, projects, tasks, and settings.",
    ],
    exportPrompts: [
      "Codex: scaffold the selected project only after Josh approves the plan.",
      "UI Agent: improve the selected route using existing components and types.",
      "QA Agent: verify persistence, routing, and review checklist coverage.",
    ],
    agentTasks: [
      task("appfactory-task-1", "project-appfactory", "Foundation scaffold", "Codex C1", "scaffold-plan", "medium"),
      task("appfactory-task-2", "project-appfactory", "Dashboard polish", "UI Agent", "review", "low"),
      task("appfactory-task-3", "project-appfactory", "Integration placeholders", "Integration Agent", "technical-plan", "medium"),
      task("appfactory-task-4", "project-appfactory", "MVP verification pass", "QA Agent", "review", "low"),
    ],
  },
];

export function createProjectDraft(name: string, idea: string): Project {
  const timestamp = new Date().toISOString();
  const id = `project-${crypto.randomUUID()}`;

  return {
    id,
    name,
    idea,
    status: "draft",
    phase: "questions",
    risk: "low",
    createdAt: timestamp,
    updatedAt: timestamp,
    appSpec: defaultSpec(idea),
    clarifyingQuestions: [
      "Who is the target user?",
      "What must the MVP do on day one?",
      "What should the app explicitly avoid doing?",
      "What approval gates are required before code or deployment?",
    ],
    technicalPlan: [
      "Confirm the preferred stack and local development workflow.",
      "Identify required routes, shared types, and persistence needs.",
      "List external integrations as placeholders until approved.",
    ],
    scaffoldPlan: [
      "Create the route structure.",
      "Add typed project data and local persistence.",
      "Prepare exportable prompts for implementation agents.",
    ],
    reviewChecklist: [
      "Idea, target user, and non-goals are written down.",
      "Risk level is reviewed before scaffolding.",
      "No credentials or paid API calls are needed for the next step.",
    ],
    exportPrompts: [
      `Codex: build the approved MVP foundation for "${name}" using the project spec and review checklist.`,
      `UI Agent: design the first usable screen for "${name}" without adding backend dependencies.`,
      `QA Agent: create a verification checklist for "${name}" covering local persistence and navigation.`,
    ],
    agentTasks: [
      task(`${id}-task-1`, id, "Clarify MVP scope", "Codex C1", "questions", "low"),
      task(`${id}-task-2`, id, "Draft core screens", "UI Agent", "spec", "low"),
      task(`${id}-task-3`, id, "Map integration boundaries", "Integration Agent", "technical-plan", "medium"),
      task(`${id}-task-4`, id, "Define review checklist", "QA Agent", "review", "low"),
    ],
  };
}
