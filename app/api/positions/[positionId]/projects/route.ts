import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api.response";
import { StatusCodes } from "http-status-codes";

export async function GET(
  request: NextRequest,
  { params }: {params : Promise<{ positionId: string }>},
) {
  try {
    const { positionId } = await params;
    const projects = await prisma.project.findMany({
      where: { positionId  },
    });

    return NextResponse.json(
      successResponse(
        projects,
        "Projects fetched successfully",
        StatusCodes.OK,
      ),
    );
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
