"use client";

import { createProjectDraft, demoProjects } from "@/lib/mock-data";
import type { CreateProjectInput, Project } from "@/lib/types";

const STORAGE_KEY = "appfactory.projects.v2";

export function loadProjects(): Project[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProjects));
    return demoProjects;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isProject);
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProjects));
  return demoProjects;
}

export function saveProjects(projects: Project[]): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function makeProject(input: CreateProjectInput): Project {
  return createProjectDraft(input);
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Project>;
  return Boolean(
    candidate.id &&
      candidate.name &&
      candidate.idea &&
      candidate.appSpec &&
      candidate.techPlan &&
      Array.isArray(candidate.agentTasks) &&
      Array.isArray(candidate.prompts) &&
      candidate.reviewChecklist &&
      candidate.exports
  );
}
