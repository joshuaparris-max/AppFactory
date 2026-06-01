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
import { mockProjects } from "@/lib/mock-data";
import { loadProjects, makeProject, saveProjects } from "@/lib/storage";
import type { Project } from "@/lib/types";

interface ProjectStoreValue {
  projects: Project[];
  hydrated: boolean;
  createProject: (input: { name: string; idea: string }) => Project;
  getProject: (projectId: string) => Project | undefined;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  replaceProjects: (projects: Project[]) => void;
  resetProjects: () => void;
}

const ProjectStoreContext = createContext<ProjectStoreValue | undefined>(undefined);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // LocalStorage is the MVP persistence boundary; load it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(loadProjects());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveProjects(projects);
    }
  }, [hydrated, projects]);

  const createProject = useCallback((input: { name: string; idea: string }) => {
    const project = makeProject(input.name, input.idea);
    setProjects((current) => [project, ...current]);
    return project;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project,
      ),
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((current) => current.filter((project) => project.id !== projectId));
  }, []);

  const replaceProjects = useCallback((nextProjects: Project[]) => {
    setProjects(nextProjects);
  }, []);

  const resetProjects = useCallback(() => {
    setProjects(mockProjects);
  }, []);

  const getProject = useCallback(
    (projectId: string) => projects.find((project) => project.id === projectId),
    [projects],
  );

  const value = useMemo(
    () => ({
      projects,
      hydrated,
      createProject,
      getProject,
      updateProject,
      deleteProject,
      replaceProjects,
      resetProjects,
    }),
    [
      projects,
      hydrated,
      createProject,
      getProject,
      updateProject,
      deleteProject,
      replaceProjects,
      resetProjects,
    ],
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
