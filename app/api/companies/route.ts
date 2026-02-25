import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { Company } from "@/generated/prisma/client";
import { error, success } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { companyWithPositionsQuery } from "@/types/prisma/companies";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const companies = await prisma.company.findMany({
      where: { userId: session?.user.id },
      ...companyWithPositionsQuery,
    });

    return NextResponse.json(
      success(companies, "Companies fetched successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error fetching companies:", err);
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

    const company = await prisma.company.create({
      data: { ...body, userId: session?.user.id } as Company,
    });

    return NextResponse.json(
      success(company, "Company created successfully", StatusCodes.CREATED),
    );
  } catch (err) {
    console.error("Error creating company:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
