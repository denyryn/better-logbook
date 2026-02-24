import { Position } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class PositionService {
  private userId: string;
  private companyId?: string;

  constructor(userId: string, companyId?: string) {
    this.userId = userId;
    this.companyId = companyId;
  }

  private getBaseUrl() {
    return `/api/positions`;
  }

  async get() {
    try {
      const { data } = await api.get<ApiResponse<Position[]>>(
        this.getBaseUrl(),
      );
      return data;
    } catch (error) {
      console.error("Error fetching position:", error);
      throw new Error("Failed to fetch position");
    }
  }

  async post(positionData: Partial<Position>): Promise<ApiResponse<Position>> {
    try {
      const { data } = await api.post<ApiResponse<Position>>(
        this.getBaseUrl(),
        positionData,
      );
      return data;
    } catch (error) {
      console.error("Error creating position:", error);
      throw new Error("Failed to create position");
    }
  }

  async put(positionData: Partial<Position>): Promise<ApiResponse<Position>> {
    try {
      const { data } = await api.put<ApiResponse<Position>>(
        this.getBaseUrl(),
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
      const { data } = await api.delete<ApiResponse<null>>(this.getBaseUrl());
      return data;
    } catch (error) {
      console.error("Error deleting position:", error);
      throw new Error("Failed to delete position");
    }
  }
}
