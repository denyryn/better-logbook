import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const productivities = await prisma.logbook.groupBy({
    by: ["logDate"],
    where: {
      deletedAt: null,
      project: { position: { company: { userId: session.user.id } } }
    },
    _count: {
      id: true,
    },
    orderBy: {
      logDate: "asc"
    }
  });

  const normalized = productivities.map(p => ({
    date: p.logDate.toISOString().split("T")[0],
    logbook: p._count.id
  }));

  return serverSuccessResponse(normalized, "Productivities fetched successfully", StatusCodes.OK);
}
