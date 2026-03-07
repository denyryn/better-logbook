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

  const mapped = productivities.map(p => ({
    date: p.logDate.toISOString().split("T")[0],
    logbook: p._count.id
  }));

  const normalized: { date: string; logbook: number }[] = [];

  if (mapped.length > 0) {
    const start = new Date(mapped[0].date);
    const end = new Date(mapped[mapped.length - 1].date);
    const countByDate = new Map(mapped.map(p => [p.date, p.logbook]));

    for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      normalized.push({ date: dateStr, logbook: countByDate.get(dateStr) ?? 0 });
    }
  }

  return serverSuccessResponse(normalized, "Productivities fetched successfully", StatusCodes.OK);
}
