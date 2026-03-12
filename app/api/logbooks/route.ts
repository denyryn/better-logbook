import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logbook } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const logbooks = await prisma.logbook.findMany({
      where: { project: { userId: session.user.id }, deletedAt: null },
      include: {
        tags: {
          include: { tag: true },
        },
      },
      orderBy: { logDate: "desc" },
    });

    return serverSuccessResponse(logbooks, "Logbooks fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching logbooks:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const { title, content, logDate, projectId, tags = [] } =
          await request.json() as Logbook & { tags?: string[] };

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return serverErrorResponse(undefined, "Project not found", StatusCodes.NOT_FOUND);
    }

    const logbook = await prisma.logbook.create({
      data: {
        title,
        content,
        logDate: new Date(logDate),
        project: { connect: { id: projectId } },
        tags: tags?.length
          ? {
              create: tags.map((tagName: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const normalized = {
      ...logbook,
      tags: logbook.tags.map((t) => t.tag.name),
    };

    return serverSuccessResponse(normalized, "Logbook created successfully", StatusCodes.CREATED);
  } catch (err) {
    console.error("Error creating logbook:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
