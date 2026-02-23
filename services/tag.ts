import { Tag } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

export class TagService {
  async get() {
    try {
      const { data } = await api.get<ApiResponse<{ tags: Tag[] }>>(`/api/tags`);
      return data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw new Error("Failed to fetch tags");
    }
  }

  async post(tagData: Partial<Tag>): Promise<ApiResponse<Tag>> {
    try {
      const { data } = await api.post<ApiResponse<Tag>>(`/api/tags`, tagData);
      return data;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw new Error("Failed to create tag");
    }
  }

  async put(tagId: string, tagData: Partial<Tag>): Promise<ApiResponse<Tag>> {
    try {
      const { data } = await api.put<ApiResponse<Tag>>(
        `/api/tags/${tagId}`,
        tagData,
      );
      return data;
    } catch (error) {
      console.error("Error updating tag:", error);
      throw new Error("Failed to update tag");
    }
  }
}
