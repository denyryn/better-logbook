import { Project } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class ProjectService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async get() {
    try {
      const { data } = await api.get<ApiResponse<{ projects: Project[] }>>(
        `/api/projects/${this.userId}`,
      );
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async post(projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const { data } = await api.post<ApiResponse<Project>>(
        `/api/projects/${this.userId}`,
        projectData,
      );
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  }

  async put(
    projectId: string,
    projectData: Partial<Project>,
  ): Promise<ApiResponse<Project>> {
    try {
      const { data } = await api.put<ApiResponse<Project>>(
        `/api/projects/${this.userId}/${projectId}`,
        projectData,
      );
      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  }

  async delete(projectId: string): Promise<ApiResponse<null>> {
    try {
      const { data } = await api.delete<ApiResponse<null>>(
        `/api/projects/${this.userId}/${projectId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }
}
