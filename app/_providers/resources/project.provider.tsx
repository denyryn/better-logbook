import { Project } from "@/generated/prisma/client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { ProjectService } from "@/services/project";
import { useAuth } from "../auth/auth.provider";
import { status } from "@/lib/api.response";
import { toast } from "sonner";

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  getProjects: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef<ProjectService | null>(null);

  // Initialize service once user is available
  useEffect(() => {
    try {
      if (user?.id && !serviceRef.current) {
        serviceRef.current = new ProjectService(user.id);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const getProjects = async () => {
    if (!serviceRef.current) return;

    try {
      const response = await serviceRef.current.get();
      if (response.data?.projects) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to fetch projects");
    }
  };

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
        isLoading,
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
