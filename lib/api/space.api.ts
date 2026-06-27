import { SpaceWithPositions } from "@/types/prisma/space";

import { ApiResponse } from "../api.response";
import { api } from "../axios";
import { Space } from "@/generated/prisma/client";

function getBaseUrl() {
  return `/api/spaces`;
}

export async function getSpaces() {
  const { data } =
    await api.get<ApiResponse<SpaceWithPositions[]>>(getBaseUrl());
  return data;
}

export async function createSpace(spaceData: Partial<Space>) {
  const { data } = await api.post<ApiResponse<Space>>(
    getBaseUrl(),
    spaceData
  );
  return data;
}
