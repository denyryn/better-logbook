import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";
import { projectWithRelationsQuery } from "@/types/prisma/project";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  try {
    const { spaceId } = await params;
    const projects = await prisma.project.findMany({
      where: { position: { spaceId } },
      ...projectWithRelationsQuery
    });

    return serverSuccessResponse(
      projects,
      "Projects fetched successfully",
      StatusCodes.OK,
    );
  } catch (err) {
    console.error("Error fetching projects:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
