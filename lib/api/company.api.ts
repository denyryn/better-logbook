import { CompanyWithPositions } from "@/types/prisma/companies";

import { ApiResponse } from "../api.response";
import { api } from "../axios";
import { Company } from "@/generated/prisma/client";

function getBaseUrl() {
  return `/api/companies`;
}

export async function getCompanies() {
  const { data } =
    await api.get<ApiResponse<CompanyWithPositions[]>>(getBaseUrl());
  return data;
}

export async function createCompany(companyData: Partial<Company>) {
  const { data } = await api.post<ApiResponse<Company>>(
    getBaseUrl(),
    companyData
  );
  return data;
}
