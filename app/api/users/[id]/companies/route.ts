import { NextRequest, NextResponse } from "next/server";
import { success, error } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { Company } from "@/generated/prisma/client";
import { companyWithProjectsQuery } from "@/types/prisma/companies";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findMany({
      where: { userId: id },
      ...companyWithProjectsQuery,
    });

    if (!company || company.length === 0) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company fetched successfully", StatusCodes.OK),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const company = await prisma.company.create({
      data: { ...body, userId: id } as Company,
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
