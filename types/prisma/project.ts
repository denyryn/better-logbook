import { Prisma } from "@/generated/prisma/browser";

export const projectWithRelationsQuery = {
  include: {
    position: {
      include: {
        company: true,
      }
    }
  }
}

export type ProjectWithRelations = Prisma.ProjectGetPayload<
  typeof projectWithRelationsQuery
>;
