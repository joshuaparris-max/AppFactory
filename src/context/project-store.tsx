'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadProjects, makeProject, saveProjects, importProjectsFromJson } from '@/lib/storage';
import { regenerateProject } from '@/lib/mock-data';
import type { CreateProjectInput, Project } from '@/lib/types';

interface ProjectStoreValue {
  projects: Project[];
  hydrated: boolean;
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (projectId: string, input: CreateProjectInput) => Project | undefined;
  getProject: (projectId: string) => Project | undefined;
  deleteProject: (projectId: string) => void;
  importProjects: (raw: unknown) => Project[];
}

const ProjectStoreContext = createContext<ProjectStoreValue | undefined>(undefined);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProjects(loadProjects());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveProjects(projects);
    }
  }, [hydrated, projects]);

  const createProject = useCallback((input: CreateProjectInput) => {
    const project = makeProject(input);
    setProjects(current => [project, ...current]);
    return project;
  }, []);

  const updateProject = useCallback(
    (projectId: string, input: CreateProjectInput) => {
      const existing = projects.find(project => project.id === projectId);
      if (!existing) {
        return undefined;
      }

      const updatedProject = regenerateProject(existing, input);

      setProjects(current =>
        current.map(project => (project.id === projectId ? updatedProject : project))
      );

      return updatedProject;
    },
    [projects]
  );

  const getProject = useCallback(
    (projectId: string) => projects.find(project => project.id === projectId),
    [projects]
  );

  const deleteProject = useCallback((projectId: string) => {
    setProjects(current => current.filter(project => project.id !== projectId));
  }, []);

  const importProjects = useCallback(
    (raw: unknown) => {
      const imported = importProjectsFromJson(raw);
      setProjects(imported);
      if (!hydrated) {
        setHydrated(true);
      }
      return imported;
    },
    [hydrated]
  );

  const value = useMemo(
    () => ({
      projects,
      hydrated,
      createProject,
      updateProject,
      getProject,
      deleteProject,
      importProjects,
    }),
    [projects, hydrated, createProject, updateProject, getProject, deleteProject, importProjects]
  );

  return <ProjectStoreContext.Provider value={value}>{children}</ProjectStoreContext.Provider>;
}

export function useProjectStore() {
  const context = useContext(ProjectStoreContext);

  if (!context) {
    throw new Error('useProjectStore must be used inside ProjectStoreProvider');
  }

  return context;
}
