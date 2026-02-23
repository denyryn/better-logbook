import { Company } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { CompanyWithProjects } from "@/types/prisma/companies";

export class CompanyService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async get(): Promise<ApiResponse<CompanyWithProjects[]>> {
    try {
      const { data } = await api.get<ApiResponse<CompanyWithProjects[]>>(
        `/api/users/${this.userId}/companies`,
      );
      return data;
    } catch (error) {
      console.error("Error fetching company:", error);
      throw new Error("Failed to fetch company");
    }
  }

  async post(companyData: Partial<Company>): Promise<ApiResponse<Company>> {
    try {
      const { data } = await api.post<ApiResponse<Company>>(
        `/api/users/${this.userId}/companies`,
        companyData,
      );
      return data;
    } catch (error) {
      console.error("Error creating company:", error);
      throw new Error("Failed to create company");
    }
  }

  async put(
    companyId: string,
    companyData: Partial<Company>,
  ): Promise<ApiResponse<Company>> {
    try {
      const { data } = await api.put<ApiResponse<Company>>(
        `/api/users/${this.userId}/companies/${companyId}`,
        companyData,
      );
      return data;
    } catch (error) {
      console.error("Error updating company:", error);
      throw new Error("Failed to update company");
    }
  }

  async delete(companyId: string): Promise<ApiResponse<null>> {
    try {
      const { data } = await api.delete<ApiResponse<null>>(
        `/api/users/${this.userId}/companies/${companyId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw new Error("Failed to delete company");
    }
  }
}
