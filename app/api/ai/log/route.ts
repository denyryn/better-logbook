import { AiTokenUsage } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfISOWeek } from "date-fns";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const startOfWeekDate = startOfISOWeek(new Date());

    const usage = await prisma.aiTokenUsage.findMany({
      where: { userId: session.user.id, createdAt: { gte: startOfWeekDate} }
    });

    return serverSuccessResponse(usage, "Usage fetched successfully", StatusCodes.OK)
  } catch (err) {
    console.error(err);
    return serverErrorResponse(undefined, "Failed to fetch usage", StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const body = request.json() as Partial<AiTokenUsage>;

    const usage = await prisma.aiTokenUsage.create({
      data: { ...body, userId: session.user.id } as AiTokenUsage
    });

    return serverSuccessResponse(usage, "Usage stored successfully", StatusCodes.CREATED)
  } catch (err) {
    console.error(err);
    return serverErrorResponse(undefined, "Failed to store usage.", StatusCodes.INTERNAL_SERVER_ERROR)
  }
}
