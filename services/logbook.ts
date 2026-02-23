import { Logbook } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class LogbookService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async get() {
    try {
      const { data } = await api.get<ApiResponse<{ logbooks: Logbook[] }>>(
        `/api/logbooks/${this.userId}`,
      );
      return data;
    } catch (error) {
      console.error("Error fetching logbooks:", error);
      throw new Error("Failed to fetch logbooks");
    }
  }

  async post(logbookData: Partial<Logbook>): Promise<ApiResponse<Logbook>> {
    try {
      const { data } = await api.post<ApiResponse<Logbook>>(
        `/api/logbooks/${this.userId}`,
        logbookData,
      );
      return data;
    } catch (error) {
      console.error("Error creating logbook:", error);
      throw new Error("Failed to create logbook");
    }
  }

  async put(
    logbookData: Partial<Logbook>,
    logbookId: string,
  ): Promise<ApiResponse<Logbook>> {
    try {
      const { data } = await api.put<ApiResponse<Logbook>>(
        `/api/logbooks/${this.userId}/${logbookId}`,
        logbookData,
      );
      return data;
    } catch (error) {
      console.error("Error updating logbook:", error);
      throw new Error("Failed to update logbook");
    }
  }

  async delete(logbookId: string): Promise<ApiResponse<null>> {
    try {
      const { data } = await api.delete<ApiResponse<null>>(
        `/api/logbooks/${this.userId}/${logbookId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting logbook:", error);
      throw new Error("Failed to delete logbook");
    }
  }
}
