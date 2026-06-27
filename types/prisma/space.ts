import { Prisma } from "@/generated/prisma/client";

export const spaceWithPositionsQuery = {
  include: {
    positions: true,
  },
};

export type SpaceWithPositions = Prisma.SpaceGetPayload<
  typeof spaceWithPositionsQuery
>;
