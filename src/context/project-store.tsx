"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadProjects, makeProject, saveProjects } from "@/lib/storage";
import type { CreateProjectInput, Project } from "@/lib/types";

interface ProjectStoreValue {
  projects: Project[];
  hydrated: boolean;
  createProject: (input: CreateProjectInput) => Project;
  getProject: (projectId: string) => Project | undefined;
  deleteProject: (projectId: string) => void;
}

const ProjectStoreContext = createContext<ProjectStoreValue | undefined>(undefined);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveProjects(projects);
    }
  }, [hydrated, projects]);

  const createProject = useCallback((input: CreateProjectInput) => {
    const project = makeProject(input);
    setProjects((current) => [project, ...current]);
    return project;
  }, []);

  const getProject = useCallback(
    (projectId: string) => projects.find((project) => project.id === projectId),
    [projects],
  );

  const deleteProject = useCallback((projectId: string) => {
    setProjects((current) => current.filter((project) => project.id !== projectId));
  }, []);

  const value = useMemo(
    () => ({ projects, hydrated, createProject, getProject, deleteProject }),
    [projects, hydrated, createProject, getProject, deleteProject],
  );

  return (
    <ProjectStoreContext.Provider value={value}>
      {children}
    </ProjectStoreContext.Provider>
  );
}

export function useProjectStore() {
  const context = useContext(ProjectStoreContext);

  if (!context) {
    throw new Error("useProjectStore must be used inside ProjectStoreProvider");
  }

  return context;
}
