import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPosition, getPositions, getPositionsBySpace } from "../api/position.api";
import { Position } from "@/generated/prisma/browser";
import { queryKey } from "../constants/query-key.constant";

export function usePositions() {
  return useQuery({
    queryKey: [queryKey.POSITIONS],
    queryFn: () => getPositions(),
  });
}

export function usePositionsBySpace(spaceId: string) {
  return useQuery({
    queryKey: [queryKey.POSITIONS, spaceId],
    queryFn: () => getPositionsBySpace(spaceId),
    enabled: !!spaceId,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ spaceId, positionData }: { spaceId: string; positionData: Partial<Position> }) =>
      createPosition(spaceId, positionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.POSITIONS] });
    },
  });
}
