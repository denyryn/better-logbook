import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Space } from "@/generated/prisma/client";

import { createSpace, getSpaces } from "../api/space.api";
import { queryKey } from "../constants/query-key.constant";

export function useSpaces() {
  return useQuery({
    queryKey: [queryKey.SPACES],
    queryFn: () => getSpaces(),
  });
}

export function useCreateSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (spaceData: Partial<Space>) => createSpace(spaceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.SPACES] });
    },
  });
}
