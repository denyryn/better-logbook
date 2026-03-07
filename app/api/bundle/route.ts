import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const bundle = await prisma.company.create({
      data: {
        name: body.space.name,
        userId: body.userId,
        positions: {
          create: [
            {
              role: body.position.role,
              projects: {
                create: [
                  {
                    name: body.project.name,
                    userId: session.user.id,
                    logbooks: {
                      create: [
                        {
                          title: body.logbook.title,
                          content: body.logbook.content,
                          tags: body.logbook.tags,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return serverSuccessResponse(bundle, "Bundle created successfully", StatusCodes.CREATED);
  } catch (err) {
    console.error("Error creating bundle:", err);
    return serverErrorResponse(undefined, "Failed to create bundle", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
