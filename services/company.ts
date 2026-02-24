import { Company } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { CompanyWithPositions } from "@/types/prisma/companies";

export class CompanyService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private getBaseUrl() {
    return `/api/companies`;
  }

  async get(): Promise<ApiResponse<CompanyWithPositions[]>> {
    try {
      const { data } = await api.get<ApiResponse<CompanyWithPositions[]>>(
        this.getBaseUrl(),
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
        this.getBaseUrl(),
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
        `${this.getBaseUrl()}/${companyId}`,
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
        `${this.getBaseUrl()}/${companyId}`,
      );
      return data;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw new Error("Failed to delete company");
    }
  }
}
