import { Project } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class ProjectService {
  private getBaseUrl({ positionId }: { positionId?: string } = {}) {
    if (positionId) return `/api/positions/${positionId}/projects`;
    return `/api/projects`;
  }

  async get() {
    try {
      const { data } = await api.get<ApiResponse<Project[]>>(this.getBaseUrl());
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async getByPosition(positionId: string): Promise<ApiResponse<Project[]>> {
    if (!positionId) {
      throw new Error("Position ID is required to fetch projects by position");
    }

    try {
      const { data } = await api.get<ApiResponse<Project[]>>(
        this.getBaseUrl({ positionId }),
      );

      return data;
    } catch (error) {
      console.error("Error fetching projects by position:", error);
      throw new Error("Failed to fetch projects by position");
    }
  }

  async post(projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const { data } = await api.post<ApiResponse<Project>>(
        this.getBaseUrl(),
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
        `${this.getBaseUrl()}/${projectId}`,
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
        `${this.getBaseUrl()}/${projectId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }
}
