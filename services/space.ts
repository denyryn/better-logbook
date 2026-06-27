import { Space } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { SpaceWithPositions } from "@/types/prisma/space";

export class SpaceService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private getBaseUrl() {
    return `/api/spaces`;
  }

  async get(): Promise<ApiResponse<SpaceWithPositions[]>> {
    try {
      const { data } = await api.get<ApiResponse<SpaceWithPositions[]>>(
        this.getBaseUrl(),
      );
      return data;
    } catch (error) {
      console.error("Error fetching spaces:", error);
      throw new Error("Failed to fetch spaces");
    }
  }

  async post(spaceData: Partial<Space>): Promise<ApiResponse<Space>> {
    try {
      const { data } = await api.post<ApiResponse<Space>>(
        this.getBaseUrl(),
        spaceData,
      );
      return data;
    } catch (error) {
      console.error("Error creating space:", error);
      throw new Error("Failed to create space");
    }
  }

  async put(
    spaceId: string,
    spaceData: Partial<Space>,
  ): Promise<ApiResponse<Space>> {
    try {
      const { data } = await api.put<ApiResponse<Space>>(
        `${this.getBaseUrl()}/${spaceId}`,
        spaceData,
      );
      return data;
    } catch (error) {
      console.error("Error updating space:", error);
      throw new Error("Failed to update space");
    }
  }

  async delete(spaceId: string): Promise<ApiResponse<null>> {
    try {
      const { data } = await api.delete<ApiResponse<null>>(
        `${this.getBaseUrl()}/${spaceId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting space:", error);
      throw new Error("Failed to delete space");
    }
  }
}
