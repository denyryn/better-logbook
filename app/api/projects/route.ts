import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { Project } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectWithRelationsQuery } from "@/types/prisma/project";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const projects = await prisma.project.findMany({
      where: { position: { company: { userId: session?.user.id } } },
      ...projectWithRelationsQuery
    });

    return serverSuccessResponse(projects, "Projects fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth.api.getSession({ headers: request.headers });

    const project = await prisma.project.create({
      data: { ...body, userId: session?.user.id } as Project,
    });

    return serverSuccessResponse(project, "Project created successfully", StatusCodes.CREATED);
  } catch (err) {
    console.error("Error creating project:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
