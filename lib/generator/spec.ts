import { GLOBAL_AGENT_GUARDRAILS } from "./guardrails";
import { BASE_CLARIFYING_QUESTIONS, SEED_TEMPLATES } from "./templates";
import type {
  AppSpec,
  AppType,
  ClarifyingAnswers,
  ClarifyingQuestion,
  EntitySpec,
  FeatureSpec,
  IntegrationSpec,
  PermissionSpec,
  PlatformTarget,
  Priority,
  SeedTemplate,
  TemplateFeature,
  UserJourneySpec
} from "./types";
import {
  APP_TYPE_LABELS,
  asSentence,
  compactList,
  featureId,
  inferAppType,
  listToSentence,
  normalizeWhitespace,
  priorityRank,
  slugify,
  titleFromIdea
} from "./utils";

export function createClarifyingQuestions(idea: string): ClarifyingQuestion[] {
  const appType = inferAppType(idea);
  const template = SEED_TEMPLATES[appType];
  const questions = [...BASE_CLARIFYING_QUESTIONS, ...(template?.questions ?? [])];
  const seen = new Set<string>();

  return questions.filter((question) => {
    if (seen.has(question.id)) {
      return false;
    }

    seen.add(question.id);
    return true;
  });
}

export function generateAppSpec(answers: ClarifyingAnswers): AppSpec {
  const idea = normalizeWhitespace(answers.idea);
  if (!idea) {
    throw new Error("generateAppSpec requires a non-empty idea.");
  }

  const type = inferAppType(idea, answers.appType);
  const template = getTemplate(type);
  const name = normalizeWhitespace(answers.name ?? titleFromIdea(idea, type));
  const slug = slugify(name);
  const audience = normalizeWhitespace(answers.audience ?? template.defaultAudience);
  const primaryGoal = normalizeWhitespace(answers.primaryGoal ?? template.primaryGoal);
  const mustHave = compactList(answers.mustHaveFeatures ?? []);
  const niceToHave = compactList(answers.niceToHaveFeatures ?? []);
  const roles = compactList(answers.roles?.length ? answers.roles : ["owner", "user"]);
  const integrations = compactList([...(answers.integrations ?? []), ...template.recommendedIntegrations]);
  const constraints = compactList([
    ...(answers.constraints ?? []),
    "Live OpenAI, GitHub, and Vercel calls stay disabled until explicitly approved.",
    "No secrets or production credentials are committed."
  ]);

  const coreFeatures = mergeFeatures(template.coreFeatures, mustHave, "must", roles);
  const secondaryFeatures = mergeFeatures([], niceToHave, "could", roles);
  const metrics = compactList([...(answers.successMetrics ?? []), ...template.successMetrics]);
  const platforms: PlatformTarget[] = answers.platforms?.length ? answers.platforms : ["web", "mobile-web"];

  return {
    schemaVersion: "1.0",
    id: `appspec-${slug}`,
    name,
    slug,
    type,
    summary: `${name} is a ${APP_TYPE_LABELS[type]} for ${audience} that ${primaryGoal}.`,
    idea,
    primaryAudience: audience,
    coreProblem: primaryGoal,
    valueProposition: `Give ${audience} a focused way to ${primaryGoal} with ${listToSentence(
      coreFeatures.slice(0, 3).map((feature) => feature.name.toLowerCase()),
      "a useful first workflow"
    )}.`,
    goals: compactList([
      primaryGoal,
      ...coreFeatures.slice(0, 4).map((feature) => feature.userValue),
      "Coordinate multi-agent development without overwriting work."
    ]),
    nonGoals: [
      "Production deployment without human approval.",
      "Live third-party API calls during generation.",
      "A broad marketplace of unrelated features in the first build.",
      "Storing secrets in code, generated plans, tests, or fixtures."
    ],
    personas: createPersonas(audience, roles),
    coreFeatures,
    secondaryFeatures,
    userJourneys: createUserJourneys(type, roles, coreFeatures),
    dataModel: createDataModel(template, roles, answers.authRequired ?? roles.length > 1),
    integrations: createIntegrations(integrations),
    permissions: createPermissions(roles, answers.authRequired ?? roles.length > 1),
    experience: {
      tone: normalizeWhitespace(answers.contentTone ?? "clear, trustworthy, practical, and calm"),
      visualDirection: normalizeWhitespace(answers.visualStyle ?? visualDirectionFor(type)),
      platforms
    },
    successMetrics: metrics,
    constraints,
    assumptions: createAssumptions(answers, template, roles),
    openQuestions: createOpenQuestions(answers, type),
    guardrails: GLOBAL_AGENT_GUARDRAILS,
    acceptanceCriteria: createAcceptanceCriteria(coreFeatures, metrics)
  };
}

function getTemplate(type: AppType): SeedTemplate {
  return SEED_TEMPLATES[type] ?? {
    type: "custom",
    label: "Custom App",
    description: "A custom application with a focused first workflow.",
    defaultAudience: "users with a repeated problem worth turning into software",
    primaryGoal: "complete the most important workflow reliably",
    coreFeatures: [
      {
        name: "Core workflow",
        description: "The smallest end-to-end path that proves the app is useful.",
        priority: "must",
        userValue: "Users can complete the app's main job without manual workarounds."
      },
      {
        name: "Persistent records",
        description: "A simple way to create, review, update, and preserve important records.",
        priority: "must",
        userValue: "The app retains useful state across sessions."
      },
      {
        name: "Review dashboard",
        description: "A compact view of recent activity, status, and next actions.",
        priority: "should",
        userValue: "Users can see what changed and what needs attention."
      }
    ],
    dataEntities: ["User", "Record", "Activity"],
    recommendedIntegrations: [],
    successMetrics: ["main workflow completion", "return usage", "manual work reduced"],
    scaffoldHints: ["domain model", "workflow service", "record views"],
    risks: ["unclear scope", "generic UX", "missing data ownership rules"],
    questions: []
  };
}

function mergeFeatures(
  templateFeatures: TemplateFeature[],
  requestedFeatures: string[],
  requestedPriority: Priority,
  roles: string[]
): FeatureSpec[] {
  const features: FeatureSpec[] = templateFeatures.map((feature) => toFeatureSpec(feature, roles));
  const seen = new Set(features.map((feature) => feature.id));

  for (const requested of requestedFeatures) {
    const id = featureId(requested);
    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    features.push(
      toFeatureSpec(
        {
          name: requested,
          description: `${requested} tailored to the first useful release.`,
          priority: requestedPriority,
          userValue: `Users can rely on ${requested.toLowerCase()} as part of the core workflow.`
        },
        roles
      )
    );
  }

  return features.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function toFeatureSpec(feature: TemplateFeature, roles: string[]): FeatureSpec {
  return {
    id: featureId(feature.name),
    name: feature.name,
    description: asSentence(feature.description),
    priority: feature.priority,
    userValue: asSentence(feature.userValue),
    acceptanceCriteria: [
      `${feature.name} has a clear empty state, happy path, and error state.`,
      `${feature.name} can be tested without live third-party services.`,
      `${feature.name} records or displays enough state for a reviewer to verify it works.`
    ],
    dependencies: [],
    affectedRoles: roles
  };
}

function createPersonas(audience: string, roles: string[]) {
  return roles.map((role) => ({
    name: roleLabel(role),
    role,
    needs: [
      `Use the app in the context of ${audience}.`,
      "Understand what to do next without reading setup notes.",
      "Trust that their changes will not break another user's workflow."
    ],
    frustrations: [
      "Manual coordination across scattered tools.",
      "Unclear status, ownership, or next action.",
      "Apps that look polished but do not preserve useful state."
    ]
  }));
}

function createUserJourneys(type: AppType, roles: string[], features: FeatureSpec[]): UserJourneySpec[] {
  const primaryRole = roles[0] ?? "user";
  const reviewerRole = roles[1] ?? "owner";

  const journeys: UserJourneySpec[] = [
    {
      name: "First useful session",
      actor: primaryRole,
      steps: [
        "Open the app and see a purposeful starting state.",
        `Create or review the first ${APP_TYPE_LABELS[type]} record.`,
        `Use ${features[0]?.name ?? "the core workflow"} to make progress.`,
        "See confirmation, saved state, and a clear next action."
      ],
      successState: "The user completes the core workflow with no live integration required."
    },
    {
      name: "Review and follow-up",
      actor: reviewerRole,
      steps: [
        "Open a review, dashboard, or admin view.",
        "Inspect recent changes and any blocked items.",
        "Approve, correct, export, or assign follow-up work.",
        "Leave the system in a state another user can understand."
      ],
      successState: "A second user can validate progress and make a meaningful decision."
    }
  ];

  if (type === "game-prototype") {
    journeys[0] = {
      name: "Playable prototype run",
      actor: primaryRole,
      steps: [
        "Start a run with immediate readable controls.",
        "Face a clear challenge with feedback and consequence.",
        "Earn or lose progress based on player choices.",
        "Reach a win, loss, or replay state that teaches the loop."
      ],
      successState: "A player can complete and replay the prototype loop without developer help."
    };
  }

  return journeys;
}

function createDataModel(template: SeedTemplate, roles: string[], authRequired: boolean): EntitySpec[] {
  const entities = template.dataEntities.map<EntitySpec>((entity) => ({
    name: entity,
    description: `Stores ${entity.toLowerCase()} state needed by the ${template.label.toLowerCase()} workflow.`,
    fields: [
      { name: "id", type: "string", required: true, description: "Stable unique identifier." },
      { name: "createdAt", type: "date", required: true, description: "Creation timestamp." },
      { name: "updatedAt", type: "date", required: true, description: "Last update timestamp." },
      { name: "status", type: "string", required: false, description: "Workflow state for filtering and review." },
      { name: "metadata", type: "json", required: false, description: "Extensible safe metadata for early prototypes." }
    ]
  }));

  if (authRequired) {
    entities.unshift({
      name: "User",
      description: "Represents an authenticated or invited app user.",
      fields: [
        { name: "id", type: "string", required: true, description: "Stable unique identifier." },
        { name: "displayName", type: "string", required: true, description: "Name shown in the interface." },
        { name: "role", type: "string", required: true, description: `One of ${roles.join(", ")}.` },
        { name: "isActive", type: "boolean", required: true, description: "Whether the user can access the app." }
      ]
    });
  }

  return dedupeEntities(entities);
}

function dedupeEntities(entities: EntitySpec[]): EntitySpec[] {
  const seen = new Set<string>();
  return entities.filter((entity) => {
    const key = entity.name.toLowerCase();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function createIntegrations(integrations: string[]): IntegrationSpec[] {
  return integrations.map((name) => ({
    name,
    purpose: `${name} support is planned behind a safe service boundary.`,
    mode: "planned",
    safetyNotes: [
      "Use a mock adapter in local development and tests.",
      "Do not require credentials for build, test, or generated examples.",
      "Gate live calls behind explicit environment configuration and human approval."
    ]
  }));
}

function createPermissions(roles: string[], authRequired: boolean): PermissionSpec[] {
  if (!authRequired) {
    return [
      {
        role: "public user",
        can: ["Use the core workflow with local or fixture data."],
        cannot: ["Access private production records.", "Trigger live deployments or external writes."]
      }
    ];
  }

  return roles.map((role, index) => ({
    role,
    can:
      index === 0
        ? ["Create, edit, review, and export records.", "Invite or manage lower-privilege users when implemented."]
        : ["Use assigned workflows.", "View records relevant to their role."],
    cannot:
      index === 0
        ? ["Bypass audit notes for sensitive changes.", "Deploy to production without human approval."]
        : ["Edit admin settings.", "Access unrelated users' private records.", "Trigger live integrations without approval."]
  }));
}

function createAssumptions(answers: ClarifyingAnswers, template: SeedTemplate, roles: string[]): string[] {
  return compactList([
    `The first version should be a ${template.label.toLowerCase()} rather than a broad platform.`,
    `Primary roles are ${roles.join(", ")}.`,
    answers.deadline ? `Target timing: ${answers.deadline}.` : "Timeline is flexible enough to prioritise a clean vertical slice.",
    answers.monetization ? `Monetization direction: ${answers.monetization}.` : "Monetization is not required for the first build.",
    answers.existingAssets?.length ? `Existing assets: ${answers.existingAssets.join(", ")}.` : "No existing assets are assumed."
  ]);
}

function createOpenQuestions(answers: ClarifyingAnswers, type: AppType): string[] {
  const questions: string[] = [];

  if (!answers.audience) {
    questions.push("Which exact user segment should the first version optimise for?");
  }

  if (!answers.primaryGoal) {
    questions.push("What single outcome matters most in the first useful release?");
  }

  if (!answers.mustHaveFeatures?.length) {
    questions.push("Which features are truly required for a vertical slice?");
  }

  if (answers.dataSensitivity === "high") {
    questions.push("What retention, audit, and access rules apply to sensitive data?");
  }

  if (type === "data-analyser") {
    questions.push("What sample dataset should be used as the canonical test fixture?");
  }

  if (type === "game-prototype") {
    questions.push("What single mechanic should prove the prototype is fun before more content is added?");
  }

  return questions;
}

function createAcceptanceCriteria(features: FeatureSpec[], metrics: string[]): string[] {
  return compactList([
    "A rough idea can be turned into a complete structured app spec.",
    "The generated plan includes scaffold suggestions, roles, guardrails, and safe integration boundaries.",
    "The four generated agent prompts are copyable and distinct.",
    "The generator can run in tests without network access, secrets, or live API calls.",
    ...features.filter((feature) => feature.priority === "must").map((feature) => `${feature.name} is represented in the first build plan.`),
    ...metrics.slice(0, 3).map((metric) => `The build can be reviewed against ${metric}.`)
  ]);
}

function visualDirectionFor(type: AppType): string {
  const directions: Record<AppType, string> = {
    dashboard: "dense, calm, scan-friendly, with clear hierarchy and restrained charts",
    "learning-app": "welcoming, focused, progress-oriented, and accessible",
    "family-life-app": "warm, practical, trustworthy, and low-friction for repeated use",
    "simple-business-app": "professional, efficient, and organised around daily work",
    "game-prototype": "immersive, readable, responsive, and tuned around play feedback",
    "data-analyser": "analytical, precise, and transparent about confidence and data quality",
    "staff-training-app": "clear, workplace-appropriate, evidence-oriented, and easy to resume",
    custom: "clean, purposeful, and shaped around the primary workflow"
  };

  return directions[type];
}

function roleLabel(role: string): string {
  return role
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
