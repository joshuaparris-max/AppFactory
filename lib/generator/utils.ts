import type { AppType, Priority } from "./types";

export const APP_TYPE_LABELS: Record<AppType, string> = {
  dashboard: "dashboard",
  "learning-app": "learning app",
  "family-life-app": "family/life app",
  "simple-business-app": "simple business app",
  "game-prototype": "game prototype",
  "data-analyser": "data analyser",
  "staff-training-app": "staff training app",
  custom: "custom app"
};

export function compactList(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = normalizeWhitespace(value ?? "");
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function slugify(value: string): string {
  const slug = normalizeWhitespace(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "appfactory-project";
}

export function sentenceCase(value: string): string {
  const clean = normalizeWhitespace(value);
  if (!clean) {
    return clean;
  }

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function titleFromIdea(idea: string, fallbackType: AppType): string {
  const clean = normalizeWhitespace(idea);
  const explicitName = clean.match(/(?:called|named)\s+["']?([A-Z][A-Za-z0-9 ]{2,32})["']?/);
  if (explicitName?.[1]) {
    return sentenceCase(explicitName[1]);
  }

  const keywords = clean
    .replace(/^(an?|the)\s+/i, "")
    .split(/\s+/)
    .filter((word) => !["app", "for", "that", "with", "and", "to", "a", "an", "the"].includes(word.toLowerCase()))
    .slice(0, 3);

  if (keywords.length > 0) {
    return keywords.map(sentenceCase).join(" ");
  }

  return sentenceCase(APP_TYPE_LABELS[fallbackType]);
}

export function inferAppType(idea: string, requested?: string): AppType {
  const normalizedRequested = slugify(requested ?? "").replace(/-/g, " ");
  const candidates: Array<[AppType, string[]]> = [
    ["dashboard", ["dashboard", "admin", "analytics", "metrics", "reporting", "operations"]],
    ["learning-app", ["learning", "course", "lesson", "quiz", "student", "education", "study"]],
    ["family-life-app", ["family", "chore", "children", "kids", "household", "allowance", "meal"]],
    ["simple-business-app", ["business", "booking", "invoice", "quote", "client", "crm", "service"]],
    ["game-prototype", ["game", "rpg", "prototype", "level", "combat", "quest", "player"]],
    ["data-analyser", ["data", "analyser", "analyzer", "csv", "insight", "dataset", "analysis"]],
    ["staff-training-app", ["staff", "training", "employee", "onboarding", "compliance", "workplace"]]
  ];

  for (const [type] of candidates) {
    if (normalizedRequested === type.replace(/-/g, " ") || normalizedRequested === APP_TYPE_LABELS[type]) {
      return type;
    }
  }

  const haystack = normalizeWhitespace(idea).toLowerCase();
  const requestedScore = scoreCandidates(normalizedRequested, candidates);
  if (requestedScore.score > 0) {
    return requestedScore.type;
  }

  const ideaScore = scoreCandidates(haystack, candidates);
  if (ideaScore.score > 0) {
    return ideaScore.type;
  }

  return "custom";
}

function scoreCandidates(haystack: string, candidates: Array<[AppType, string[]]>): { type: AppType; score: number } {
  return candidates.reduce(
    (best, [type, words]) => {
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
      return score > best.score ? { type, score } : best;
    },
    { type: "custom" as AppType, score: 0 }
  );
}

export function featureId(name: string): string {
  return slugify(name).slice(0, 48);
}

export function priorityRank(priority: Priority): number {
  const ranks: Record<Priority, number> = {
    must: 0,
    should: 1,
    could: 2,
    later: 3
  };
  return ranks[priority];
}

export function listToSentence(items: string[], fallback: string): string {
  if (items.length === 0) {
    return fallback;
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function asSentence(value: string): string {
  const clean = sentenceCase(value);
  if (!clean) {
    return clean;
  }

  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}
