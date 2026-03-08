import { AiTokenUsage } from "@/generated/prisma/client";
import { ApiResponse } from "../api.response";
import { api } from "../axios";

function getBaseUrl() {
  return `/api/ai/log`;
}

export async function getAiUsage() {
  const { data } = await api.get<ApiResponse<AiTokenUsage[]>>(getBaseUrl());
  return data;
}
