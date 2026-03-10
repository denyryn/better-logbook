import { User } from "@/generated/prisma/client";
import { api } from "../axios";
import { ApiResponse } from "../api.response";

export async function updateProfile(user: Partial<User>) {
  const { data } = await api.put<ApiResponse<User>>(
    "/api/profile",
    user
  )
  return data;
}
