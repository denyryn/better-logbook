import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { Project } from "@/generated/prisma/client";
import { error, success } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const projects = await prisma.project.findMany({
      where: { position: { company: { userId: session?.user.id } } },
    });

    return NextResponse.json(
      success(projects, "Projects fetched successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
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

    return NextResponse.json(
      success(project, "Project created successfully", StatusCodes.CREATED),
    );
  } catch (err) {
    console.error("Error creating project:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
