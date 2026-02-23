import { Prisma } from "@/generated/prisma/client";

export const companyWithProjectsQuery = {
  include: {
    projects: true,
  },
};

export type CompanyWithProjects = Prisma.CompanyGetPayload<
  typeof companyWithProjectsQuery
>;
