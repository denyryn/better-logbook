import { Prisma } from "@/generated/prisma/client";

export const logbookWithRelationsQuery = {
  include: {
    tags: {
      include: {
        tag: true,
      },
    },
    project: true,
  },
};

export type LogbookWithRelations = Prisma.LogbookGetPayload<
  typeof logbookWithRelationsQuery
>;
