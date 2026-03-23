import { Prisma } from "@/generated/prisma/client";

export const logbookWithRelationsQuery = {
  include: {
    tags: {
      include: { tag: true },
    },
    project: {
      include: {
        position: {
          include: {company: true}
        }
      }
    }
  },
};

export type LogbookWithRelations = Prisma.LogbookGetPayload<
  typeof logbookWithRelationsQuery
>;
