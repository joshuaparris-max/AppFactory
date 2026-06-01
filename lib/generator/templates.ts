import type { ClarifyingQuestion, SeedTemplate } from "./types";

const templateQuestion = (
  id: string,
  question: string,
  why: string,
  kind: ClarifyingQuestion["kind"],
  required = false,
  options?: string[]
): ClarifyingQuestion => ({
  id,
  question,
  why,
  kind,
  required,
  options
});

export const BASE_CLARIFYING_QUESTIONS: ClarifyingQuestion[] = [
  templateQuestion(
    "audience",
    "Who is the primary user, and what situation are they in when they open the app?",
    "The generator needs a real user context so the product does not become a generic feature pile.",
    "short-text",
    true
  ),
  templateQuestion(
    "primary-goal",
    "What is the main outcome this app must help the user achieve?",
    "A single outcome keeps the spec, scope, and first build plan coherent.",
    "long-text",
    true
  ),
  templateQuestion(
    "must-have-features",
    "Which features are absolutely required for the first useful version?",
    "This separates the vertical slice from nice-to-have expansion work.",
    "multi-choice",
    true
  ),
  templateQuestion(
    "roles-permissions",
    "Which user roles need different permissions or views?",
    "Role clarity prevents agents from mixing admin, staff, customer, and public workflows.",
    "short-text"
  ),
  templateQuestion(
    "data-sensitivity",
    "What sensitive data could this app store or process?",
    "Data risk affects auth, logging, fixtures, test plans, and integration safety.",
    "single-choice",
    true,
    ["low", "moderate", "high"]
  ),
  templateQuestion(
    "integrations",
    "Which external systems might the app eventually need to connect to?",
    "Integrations should be planned behind safe interfaces before anyone wires live credentials.",
    "multi-choice"
  ),
  templateQuestion(
    "success-metrics",
    "How will Josh know the first build is genuinely working?",
    "Clear acceptance signals keep multiple agents aligned.",
    "long-text",
    true
  )
];

export const SEED_TEMPLATES: Record<string, SeedTemplate> = {
  dashboard: {
    type: "dashboard",
    label: "Dashboard",
    description: "A focused operational view for tracking metrics, tasks, and status.",
    defaultAudience: "operators and decision-makers who need quick situational awareness",
    primaryGoal: "turn scattered activity into a clear, trustworthy operating picture",
    coreFeatures: [
      {
        name: "Metric overview",
        description: "A scan-friendly summary of the most important numbers and status changes.",
        priority: "must",
        userValue: "Users can understand current performance without digging through raw records."
      },
      {
        name: "Filtered records table",
        description: "A searchable, sortable table for the underlying operational records.",
        priority: "must",
        userValue: "Users can move from summary to detail quickly."
      },
      {
        name: "Status alerts",
        description: "Configurable warnings for missing data, overdue work, and threshold breaches.",
        priority: "should",
        userValue: "Teams can act before small problems become invisible failures."
      }
    ],
    dataEntities: ["Metric", "Record", "Alert", "SavedView"],
    recommendedIntegrations: ["CSV import", "analytics warehouse", "email notifications"],
    successMetrics: ["time to understand status", "data freshness", "alert accuracy"],
    scaffoldHints: ["metrics service", "dashboard view model", "filter state", "chart components"],
    risks: ["stale or misleading data", "unclear metric definitions", "dashboard clutter"],
    questions: [
      templateQuestion("critical-metrics", "Which 3-5 metrics must be visible first?", "Metric priority shapes the dashboard layout.", "long-text", true),
      templateQuestion("refresh-rate", "How fresh does the data need to be?", "Freshness determines caching and integration complexity.", "single-choice", false, ["manual", "daily", "hourly", "near real-time"])
    ]
  },
  "learning-app": {
    type: "learning-app",
    label: "Learning App",
    description: "A guided learning product with lessons, practice, feedback, and progress.",
    defaultAudience: "learners who need structured practice and visible progress",
    primaryGoal: "help learners build skill through short lessons, checks, and review loops",
    coreFeatures: [
      {
        name: "Lesson path",
        description: "A sequenced learning path broken into achievable modules.",
        priority: "must",
        userValue: "Learners know what to do next and why it matters."
      },
      {
        name: "Practice checks",
        description: "Short quizzes or exercises that reinforce each lesson.",
        priority: "must",
        userValue: "Learners get feedback before moving on."
      },
      {
        name: "Progress journal",
        description: "A durable record of progress, weak areas, and completed milestones.",
        priority: "should",
        userValue: "Learners can see momentum and return to unfinished work."
      }
    ],
    dataEntities: ["Learner", "Course", "Lesson", "Exercise", "Progress"],
    recommendedIntegrations: ["content import", "email reminders", "AI feedback stub"],
    successMetrics: ["lesson completion rate", "practice accuracy", "return sessions"],
    scaffoldHints: ["curriculum model", "lesson renderer", "quiz engine", "progress tracker"],
    risks: ["thin content", "poor feedback quality", "progress mechanics that reward clicking instead of learning"],
    questions: [
      templateQuestion("curriculum-scope", "What skill or topic should the first course teach?", "The first course scope controls content and assessment design.", "short-text", true),
      templateQuestion("feedback-style", "Should feedback be strict, coaching-oriented, or exploratory?", "Feedback tone changes the learning experience.", "single-choice", false, ["strict", "coaching", "exploratory"])
    ]
  },
  "family-life-app": {
    type: "family-life-app",
    label: "Family/Life App",
    description: "A practical household app for coordination, routines, reminders, and shared responsibilities.",
    defaultAudience: "families or households coordinating repeated everyday responsibilities",
    primaryGoal: "reduce household friction by making responsibilities visible and fair",
    coreFeatures: [
      {
        name: "Shared household board",
        description: "A single view of chores, routines, events, and ownership.",
        priority: "must",
        userValue: "Everyone can see what needs doing and who owns it."
      },
      {
        name: "Approval flow",
        description: "A lightweight review step for completed tasks, allowance, or important changes.",
        priority: "must",
        userValue: "Parents or organisers can keep trust without constant manual tracking."
      },
      {
        name: "Routine reminders",
        description: "Gentle recurring prompts for tasks, events, and missed responsibilities.",
        priority: "should",
        userValue: "The app supports consistency without becoming noisy."
      }
    ],
    dataEntities: ["Household", "Member", "Task", "Approval", "Reward"],
    recommendedIntegrations: ["calendar sync", "email reminders", "push notifications"],
    successMetrics: ["task completion rate", "approval turnaround", "missed routine reduction"],
    scaffoldHints: ["household roles", "task recurrence", "approval queue", "reward ledger"],
    risks: ["over-notification", "privacy for children", "family rules that differ widely"],
    questions: [
      templateQuestion("household-rules", "What household rules or approvals should the app enforce?", "Rules define workflows and permissions.", "long-text", true),
      templateQuestion("reward-model", "Does the app need rewards, allowance, points, or simple completion?", "Rewards add state and family-specific expectations.", "single-choice", false, ["none", "allowance", "points", "custom rewards"])
    ]
  },
  "simple-business-app": {
    type: "simple-business-app",
    label: "Simple Business App",
    description: "A focused workflow app for a small business process such as bookings, clients, quotes, or jobs.",
    defaultAudience: "small business owners and staff who need less manual admin",
    primaryGoal: "turn a repeated business workflow into a reliable, trackable system",
    coreFeatures: [
      {
        name: "Client and job records",
        description: "A clear record of customers, work items, notes, status, and history.",
        priority: "must",
        userValue: "Staff can find the current state of work without searching messages."
      },
      {
        name: "Workflow pipeline",
        description: "A status-based workflow for enquiries, quotes, bookings, delivery, and follow-up.",
        priority: "must",
        userValue: "The business can see what needs action next."
      },
      {
        name: "Document or message templates",
        description: "Reusable templates for quotes, confirmations, reminders, or summaries.",
        priority: "should",
        userValue: "Common communication becomes faster and more consistent."
      }
    ],
    dataEntities: ["Client", "Job", "Quote", "MessageTemplate", "Invoice"],
    recommendedIntegrations: ["email", "payments", "calendar"],
    successMetrics: ["admin time saved", "jobs tracked", "missed follow-ups reduced"],
    scaffoldHints: ["CRM records", "pipeline states", "template renderer", "activity log"],
    risks: ["scope creep", "payment compliance", "messy real-world workflow exceptions"],
    questions: [
      templateQuestion("business-process", "Which business workflow should the first version own end-to-end?", "A narrow workflow creates a useful first release.", "long-text", true),
      templateQuestion("customer-facing", "Will customers use this app directly, or only staff?", "Customer-facing flows require different UX and security choices.", "boolean")
    ]
  },
  "game-prototype": {
    type: "game-prototype",
    label: "Game Prototype",
    description: "A playable prototype with a focused loop, progression, readable feedback, and content hooks.",
    defaultAudience: "players testing the core fantasy and moment-to-moment loop",
    primaryGoal: "prove the core game loop is fun, legible, and expandable",
    coreFeatures: [
      {
        name: "Playable core loop",
        description: "A short but complete loop with clear input, feedback, win/loss state, and replay.",
        priority: "must",
        userValue: "Players can actually feel the intended game fantasy."
      },
      {
        name: "Progression hook",
        description: "A small unlock, upgrade, score, or narrative consequence that gives play meaning.",
        priority: "must",
        userValue: "Players have a reason to keep experimenting."
      },
      {
        name: "Encounter variety",
        description: "At least a few distinct obstacles, enemies, puzzles, or scenarios.",
        priority: "should",
        userValue: "The prototype tests depth instead of a single repeated interaction."
      }
    ],
    dataEntities: ["PlayerState", "Encounter", "Ability", "InventoryItem", "SaveGame"],
    recommendedIntegrations: ["local save", "asset pipeline", "analytics stub"],
    successMetrics: ["session length", "restart rate", "loop comprehension"],
    scaffoldHints: ["game state machine", "input controller", "encounter definitions", "save state"],
    risks: ["unclear controls", "content too shallow", "logic tangled with rendering"],
    questions: [
      templateQuestion("core-fantasy", "What should the player feel powerful, clever, or tense doing?", "The player fantasy should drive mechanics before content volume.", "long-text", true),
      templateQuestion("session-shape", "How long should one complete prototype run last?", "Session length affects map, save, and progression design.", "single-choice", false, ["1-3 minutes", "5-10 minutes", "15-30 minutes"])
    ]
  },
  "data-analyser": {
    type: "data-analyser",
    label: "Data Analyser",
    description: "A tool for importing, cleaning, exploring, and summarising datasets.",
    defaultAudience: "users who need quick insight from messy or unfamiliar data",
    primaryGoal: "turn raw data into trustworthy summaries and next-step decisions",
    coreFeatures: [
      {
        name: "Data import",
        description: "A safe import flow for CSV, JSON, or pasted data with validation feedback.",
        priority: "must",
        userValue: "Users can bring real data in without breaking the app."
      },
      {
        name: "Insight summary",
        description: "Readable summaries of trends, outliers, missing values, and key segments.",
        priority: "must",
        userValue: "Users can understand what matters without manual spreadsheet work."
      },
      {
        name: "Exploration workspace",
        description: "Filters, groupings, charts, and saved views for deeper investigation.",
        priority: "should",
        userValue: "Users can verify insights and answer follow-up questions."
      }
    ],
    dataEntities: ["Dataset", "ColumnProfile", "Insight", "SavedAnalysis", "Export"],
    recommendedIntegrations: ["file upload", "AI summary stub", "export service"],
    successMetrics: ["import success rate", "insight usefulness", "time to first answer"],
    scaffoldHints: ["parser boundary", "column profiler", "insight engine", "chart adapters"],
    risks: ["incorrect analysis", "large file performance", "privacy of uploaded data"],
    questions: [
      templateQuestion("data-format", "What data formats should the first version support?", "Format scope determines parser and validation choices.", "multi-choice", true, ["CSV", "JSON", "Excel", "manual paste"]),
      templateQuestion("analysis-output", "What decisions should the analysis help users make?", "Decision context prevents generic charts with no action.", "long-text", true)
    ]
  },
  "staff-training-app": {
    type: "staff-training-app",
    label: "Staff Training App",
    description: "A workplace training app with modules, checks, completion evidence, and manager visibility.",
    defaultAudience: "staff and managers who need consistent onboarding or compliance training",
    primaryGoal: "make training consistent, trackable, and useful in the flow of work",
    coreFeatures: [
      {
        name: "Training modules",
        description: "Structured modules with learning objectives, content, and completion rules.",
        priority: "must",
        userValue: "Staff can complete training without manager hand-holding."
      },
      {
        name: "Knowledge checks",
        description: "Short checks that prove understanding and flag weak areas.",
        priority: "must",
        userValue: "Managers can trust completion more than a checkbox."
      },
      {
        name: "Manager progress view",
        description: "A manager dashboard for completion, overdue modules, and follow-up needs.",
        priority: "should",
        userValue: "Managers can intervene early and document readiness."
      }
    ],
    dataEntities: ["Employee", "TrainingModule", "Assessment", "CompletionRecord", "ManagerNote"],
    recommendedIntegrations: ["SSO", "HR import", "email reminders"],
    successMetrics: ["completion rate", "assessment pass rate", "time to readiness"],
    scaffoldHints: ["role-based access", "module engine", "assessment records", "manager dashboard"],
    risks: ["compliance evidence gaps", "stale content", "privacy of employee records"],
    questions: [
      templateQuestion("training-domain", "What job role or compliance topic should the first modules cover?", "Training topic affects content structure and evidence requirements.", "short-text", true),
      templateQuestion("evidence-needed", "What proof of completion needs to be retained?", "Evidence requirements affect data retention and audit logs.", "long-text")
    ]
  }
};
