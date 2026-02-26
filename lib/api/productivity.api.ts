import { ApiResponse } from "../api.response";
import { api } from "../axios";

export async function getProductivitiesByLogbook() {
  const { data } = await api.get<ApiResponse<{ date: string; logbook: number }[]>>("/api/productivities/logbook");
  return data;
}
