"use client";

import { Project } from "@/generated/prisma/client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { ProjectService } from "@/services/project";
import { useAuth } from "../auth/auth.provider";
import { ApiResponse, status } from "@/lib/api.response";
import { toast } from "sonner";

interface ProjectContextType {
  projects: Project[];
  getProjects: (positionId?: string) => Promise<void>;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (
    projectId: string,
    project: Partial<Project>,
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const serviceRef = useRef<ProjectService | null>(null);

  useEffect(() => {
    serviceRef.current = new ProjectService();
  }, []);

  const getProjects = useCallback(async (positionId?: string) => {
    if (!serviceRef.current) {
      console.error("ProjectService not initialized");
      toast.error("Service not available. Please try again later.");
      return;
    }

    try {
      const response: ApiResponse<Project[]> = positionId
        ? await serviceRef.current.getByPosition(positionId)
        : await serviceRef.current.get();

      const projects = response.data;

      setProjects(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to fetch projects");
    }
  }, []);

  const addProject = async (project: Partial<Project>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.post(project);

    if (response.status === status.ERROR) {
      console.error("Failed to add project:", response.message);
      toast.error("Failed to add project. Please try again.");
      return;
    }

    toast.success("Project added successfully!");
    await getProjects();
  };

  const updateProject = async (
    projectId: string,
    project: Partial<Project>,
  ) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.put(projectId, project);

    if (response.status === status.ERROR) {
      console.error("Failed to update project:", response.message);
      toast.error("Failed to update project. Please try again.");
      return;
    }

    toast.success("Project updated successfully!");
    await getProjects();
  };

  const deleteProject = async (projectId: string) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.delete(projectId);

    if (response.status === status.ERROR) {
      console.error("Failed to delete project:", response.message);
      toast.error("Failed to delete project. Please try again.");
      return;
    }

    toast.success("Project deleted successfully!");
    await getProjects();
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        getProjects,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
