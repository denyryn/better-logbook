import { Logbook } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logbookWithRelationsQuery } from "@/types/prisma/logbooks";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ logbookId: string }> }) {
  try {
    const { logbookId } = await params;
    const logbook = await prisma.logbook.findFirst({ where: { id: logbookId }, ...logbookWithRelationsQuery });

    if (!logbook) {
      return serverErrorResponse(undefined, "Logbook not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(logbook, "Logbook fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching logbook:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ logbookId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const { logbookId } = await params;
    const { title, content, logDate, projectId, tags = [] } =
          await request.json() as Logbook & { tags?: string[] };

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return serverErrorResponse(undefined, "Project not found", StatusCodes.NOT_FOUND);
    }

    const logbook = await prisma.logbook.update({
      where: { id: logbookId },
      data: {
        title,
        content,
        logDate: new Date(logDate),
        project: { connect: { id: projectId } },
        tags: {
          deleteMany: {},
          create: tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const normalized = {
      ...logbook,
      tags: logbook.tags.map((t) => t.tag.name),
    };

    return serverSuccessResponse(normalized, "Logbook updated successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error updating logbook:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
