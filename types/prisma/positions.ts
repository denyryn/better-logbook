import { Prisma } from "@/generated/prisma/client";

export const positionWithRelationsQuery = {
  include : {
    projects: true,
    company: true
  }
};

export type PositionWithRelations = Prisma.PositionGetPayload<
  typeof positionWithRelationsQuery
>;
