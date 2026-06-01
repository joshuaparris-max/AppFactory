export type AppType =
  | "dashboard"
  | "learning-app"
  | "family-life-app"
  | "simple-business-app"
  | "game-prototype"
  | "data-analyser"
  | "staff-training-app"
  | "custom";

export type QuestionKind =
  | "short-text"
  | "long-text"
  | "single-choice"
  | "multi-choice"
  | "boolean";

export type Priority = "must" | "should" | "could" | "later";

export type RiskSeverity = "low" | "medium" | "high";

export type RiskLikelihood = "unlikely" | "possible" | "likely";

export type ComplexitySize = "small" | "medium" | "large" | "epic";

export type DataSensitivity = "low" | "moderate" | "high";

export type PlatformTarget = "web" | "mobile-web" | "desktop" | "api";

export type AgentRole =
  | "Foundation / architecture"
  | "UI / UX"
  | "Backend / integrations"
  | "QA / tests / docs";

export interface ClarifyingQuestion {
  id: string;
  question: string;
  why: string;
  kind: QuestionKind;
  required: boolean;
  options?: string[];
}

export interface ClarifyingAnswers {
  idea: string;
  appType?: AppType | string;
  name?: string;
  audience?: string;
  primaryGoal?: string;
  successMetrics?: string[];
  mustHaveFeatures?: string[];
  niceToHaveFeatures?: string[];
  constraints?: string[];
  integrations?: string[];
  dataSensitivity?: DataSensitivity;
  authRequired?: boolean;
  roles?: string[];
  deadline?: string;
  visualStyle?: string;
  platforms?: PlatformTarget[];
  monetization?: string;
  inspiration?: string[];
  contentTone?: string;
  existingAssets?: string[];
  riskTolerance?: "low" | "medium" | "high";
  customAnswers?: Record<string, string | string[] | boolean | number | undefined>;
}

export interface TemplateFeature {
  name: string;
  description: string;
  priority: Priority;
  userValue: string;
}

export interface SeedTemplate {
  type: AppType;
  label: string;
  description: string;
  defaultAudience: string;
  primaryGoal: string;
  coreFeatures: TemplateFeature[];
  dataEntities: string[];
  recommendedIntegrations: string[];
  successMetrics: string[];
  scaffoldHints: string[];
  risks: string[];
  questions: ClarifyingQuestion[];
}

export interface PersonaSpec {
  name: string;
  role: string;
  needs: string[];
  frustrations: string[];
}

export interface FeatureSpec {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  userValue: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  affectedRoles: string[];
}

export interface EntityFieldSpec {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "json" | "relation";
  required: boolean;
  description: string;
}

export interface EntitySpec {
  name: string;
  description: string;
  fields: EntityFieldSpec[];
}

export interface IntegrationSpec {
  name: string;
  purpose: string;
  mode: "stubbed" | "planned" | "optional";
  safetyNotes: string[];
}

export interface PermissionSpec {
  role: string;
  can: string[];
  cannot: string[];
}

export interface UserJourneySpec {
  name: string;
  actor: string;
  steps: string[];
  successState: string;
}

export interface AppSpec {
  schemaVersion: "1.0";
  id: string;
  name: string;
  slug: string;
  type: AppType;
  summary: string;
  idea: string;
  primaryAudience: string;
  coreProblem: string;
  valueProposition: string;
  goals: string[];
  nonGoals: string[];
  personas: PersonaSpec[];
  coreFeatures: FeatureSpec[];
  secondaryFeatures: FeatureSpec[];
  userJourneys: UserJourneySpec[];
  dataModel: EntitySpec[];
  integrations: IntegrationSpec[];
  permissions: PermissionSpec[];
  experience: {
    tone: string;
    visualDirection: string;
    platforms: PlatformTarget[];
  };
  successMetrics: string[];
  constraints: string[];
  assumptions: string[];
  openQuestions: string[];
  guardrails: string[];
  acceptanceCriteria: string[];
}

export interface StackRecommendation {
  frontend: string;
  backend: string;
  data: string;
  auth: string;
  hosting: string;
  testing: string;
  ai: string;
}

export interface ScaffoldItem {
  path: string;
  purpose: string;
  ownerRole: AgentRole;
}

export interface Milestone {
  name: string;
  outcome: string;
  exitCriteria: string[];
}

export interface TechPlan {
  stack: StackRecommendation;
  architectureDecisions: string[];
  scaffoldPlan: ScaffoldItem[];
  milestones: Milestone[];
  dataFlow: string[];
  testingStrategy: string[];
  deploymentPlan: string[];
  coordinationGuardrails: string[];
}

export interface AgentTask {
  role: AgentRole;
  mission: string;
  branchName: string;
  ownedPaths: string[];
  sharedPaths: string[];
  coordinateWith: AgentRole[];
  deliverables: string[];
  forbiddenActions: string[];
  acceptanceCriteria: string[];
  suggestedFiles: string[];
}

export interface AgentPrompt {
  role: AgentRole;
  title: string;
  branchName: string;
  prompt: string;
}

export interface PromptPack {
  prompts: AgentPrompt[];
  globalGuardrails: string[];
}

export interface ChecklistCategory {
  name: string;
  items: string[];
}

export interface ReviewChecklist {
  title: string;
  categories: ChecklistCategory[];
  requiredApprovals: string[];
}

export interface ComplexityEstimate {
  score: number;
  size: ComplexitySize;
  estimatedAgents: number;
  estimatedSprints: number;
  rationale: string[];
}

export interface Risk {
  id: string;
  title: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  trigger: string;
  mitigation: string;
  ownerRole: AgentRole;
}

export interface ProjectPlan {
  spec: AppSpec;
  techPlan: TechPlan;
  tasks: AgentTask[];
  promptPack: PromptPack;
  reviewChecklist: ReviewChecklist;
  complexity: ComplexityEstimate;
  risks: Risk[];
}

export interface ServiceResult<T> {
  ok: boolean;
  mode: "mock";
  message: string;
  data?: T;
}
