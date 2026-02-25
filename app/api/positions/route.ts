import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { Position } from "@/generated/prisma/client";
import { positionWithRelationsQuery } from "@/types/prisma/positions";
import { error, success } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const positions = await prisma.position.findMany({
      where: { company: { userId: session?.user.id } },
      ...positionWithRelationsQuery,
    });
    return NextResponse.json(
      success(positions, "Positions fetched successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error fetching positions:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await auth.api.getSession({ headers: request.headers });

    const position = await prisma.position.create({
      data: { ...body } as Position,
    });

    return NextResponse.json(
      success(position, "Position created successfully", StatusCodes.CREATED),
    );
  } catch (err) {
    console.error("Error creating position:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
