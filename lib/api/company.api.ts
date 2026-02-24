import { CompanyWithPositions } from "@/types/prisma/companies"
import { ApiResponse } from "../api.response"
import { api } from "../axios"

function getBaseUrl() {
  return `/api/companies`
}

export async function getCompanies() {
  const { data } = await api.get<ApiResponse<CompanyWithPositions[]>>(getBaseUrl())
  return data
}
