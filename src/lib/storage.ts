"use client";

import { createProjectDraft, mockProjects } from "@/lib/mock-data";
import type { Project } from "@/lib/types";

export const STORAGE_KEY = "appfactory.projects.v1";

export function loadProjects(): Project[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects));
    return mockProjects;
  }

  try {
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : mockProjects;
  } catch {
    return mockProjects;
  }
}

export function saveProjects(projects: Project[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function makeProject(name: string, idea: string) {
  return createProjectDraft(name.trim(), idea.trim());
}

export function parseProjectsBackup(raw: string): Project[] {
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Backup must be a project array.");
  }

  return parsed as Project[];
}
