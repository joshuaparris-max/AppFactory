export type BuildPhase =
  | "idea"
  | "questions"
  | "spec"
  | "technical-plan"
  | "scaffold-plan"
  | "agent-split"
  | "review"
  | "export";

export type RiskLevel = "low" | "medium" | "high";

export interface AppSpec {
  audience: string;
  problem: string;
  coreFeatures: string[];
  nonGoals: string[];
  constraints: string[];
  successCriteria: string[];
}

export interface AgentTask {
  id: string;
  projectId: string;
  title: string;
  owner: "Codex C1" | "UI Agent" | "Integration Agent" | "QA Agent";
  phase: BuildPhase;
  status: "backlog" | "ready" | "in-progress" | "review" | "done";
  risk: RiskLevel;
  description: string;
  acceptanceCriteria: string[];
}

export interface Project {
  id: string;
  name: string;
  idea: string;
  status: "draft" | "planning" | "ready-for-scaffold" | "review" | "approved";
  phase: BuildPhase;
  risk: RiskLevel;
  createdAt: string;
  updatedAt: string;
  appSpec: AppSpec;
  clarifyingQuestions: string[];
  technicalPlan: string[];
  scaffoldPlan: string[];
  reviewChecklist: string[];
  exportPrompts: string[];
  agentTasks: AgentTask[];
}
