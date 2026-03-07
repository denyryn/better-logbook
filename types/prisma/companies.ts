import { Prisma } from "@/generated/prisma/client";

export const companyWithPositionsQuery = {
  include: {
    positions: true,
  },
};

export type CompanyWithPositions = Prisma.CompanyGetPayload<
  typeof companyWithPositionsQuery
>;
