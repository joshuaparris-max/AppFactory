import type {
  AgentPrompt,
  AgentTask,
  AppSpec,
  ClarifyingQuestion,
  ComplexityEstimate,
  ProjectPlan,
  ReviewChecklist,
  Risk,
  TechPlan
} from "../../lib/generator";

export type {
  AgentPrompt,
  AgentTask,
  AppSpec,
  ClarifyingQuestion,
  ComplexityEstimate,
  ProjectPlan,
  ReviewChecklist,
  Risk,
  TechPlan
};

export type BuildPhase =
  | "idea"
  | "questions"
  | "spec"
  | "technical-plan"
  | "agent-split"
  | "review";

export type ProjectStatus =
  | "draft"
  | "planning"
  | "ready-for-agents"
  | "review"
  | "approved";

export type RiskLevel = Risk["severity"];

export interface ProjectExports {
  markdownSpec: string;
  jsonProjectPlan: string;
  promptPackMarkdown: string;
  checklistMarkdown: string;
}

export interface Project {
  id: string;
  name: string;
  idea: string;
  status: ProjectStatus;
  phase: BuildPhase;
  risk: RiskLevel;
  createdAt: string;
  updatedAt: string;
  plan: ProjectPlan;
  appSpec: AppSpec;
  techPlan: TechPlan;
  clarifyingQuestions: ClarifyingQuestion[];
  agentTasks: AgentTask[];
  prompts: AgentPrompt[];
  reviewChecklist: ReviewChecklist;
  complexity: ComplexityEstimate;
  risks: Risk[];
  exports: ProjectExports;
}

export interface CreateProjectInput {
  name: string;
  idea: string;
  audience?: string;
  mustHaveFeatures?: string[];
  integrations?: string[];
}
