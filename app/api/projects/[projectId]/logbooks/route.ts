import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { errorResponse, successResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logbookWithRelationsQuery } from "@/types/prisma/logbooks";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json(
        errorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED),
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json(
        errorResponse(undefined, "Project not found", StatusCodes.NOT_FOUND),
      );
    }

    const logbooks = await prisma.logbook.findMany({
      where: { projectId, deletedAt: null },
      ...logbookWithRelationsQuery
    });

    return NextResponse.json(
      successResponse(
        logbooks,
        "Logbooks fetched successfully",
        StatusCodes.OK,
      ),
    );
  } catch (err) {
    console.error("Error fetching logbooks:", err);
    return NextResponse.json(
      errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json(
        errorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED),
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json(
        errorResponse(undefined, "Project not found", StatusCodes.NOT_FOUND),
      );
    }

    const body = await request.json();
    const { tags, ...logbookData } = body;

    const logbook = await prisma.logbook.create({
      data: {
        ...logbookData,
        projectId,
        logDate: new Date(logbookData.logDate),
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

    return NextResponse.json(
      successResponse(
        normalized,
        "Logbook created successfully",
        StatusCodes.CREATED,
      ),
    );
  } catch (err) {
    console.error("Error creating logbook:", err);
    return NextResponse.json(
      errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
