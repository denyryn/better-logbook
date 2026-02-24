import { Prisma } from "@/generated/prisma/client";

export const companyWithProjectsQuery = {
  include: {
    projects: true,
  },
};

export type CompanyWithProjects = Prisma.CompanyGetPayload<
  typeof companyWithProjectsQuery
>;

export const companyWithPositionsQuery = {
  include: {
    positions: true,
  },
};

export type CompanyWithPositions = Prisma.CompanyGetPayload<
  typeof companyWithPositionsQuery
>;
