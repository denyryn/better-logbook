import { Position } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class PositionService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async get() {
    try {
      const { data } = await api.get<ApiResponse<{ position: string }>>(
        `/api/position/${this.userId}`,
      );
      return data;
    } catch (error) {
      console.error("Error fetching position:", error);
      throw new Error("Failed to fetch position");
    }
  }

  async post(
    positionData: Partial<Position>,
  ): Promise<ApiResponse<{ position: string }>> {
    try {
      const { data } = await api.post<ApiResponse<{ position: string }>>(
        `/api/position/${this.userId}`,
        positionData,
      );
      return data;
    } catch (error) {
      console.error("Error updating position:", error);
      throw new Error("Failed to update position");
    }
  }

  async put(
    positionData: Partial<Position>,
  ): Promise<ApiResponse<{ position: string }>> {
    try {
      const { data } = await api.put<ApiResponse<{ position: string }>>(
        `/api/position/${this.userId}`,
        positionData,
      );
      return data;
    } catch (error) {
      console.error("Error updating position:", error);
      throw new Error("Failed to update position");
    }
  }

  async delete(): Promise<ApiResponse<null>> {
    try {
      const { data } = await api.delete<ApiResponse<null>>(
        `/api/position/${this.userId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting position:", error);
      throw new Error("Failed to delete position");
    }
  }
}
