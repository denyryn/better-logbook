import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Company } from "@/generated/prisma/client";
import { success, error, status } from "@/lib/api.response";
import { StatusCodes } from "http-status-codes";

export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(
      success(
        companies,
        "Companies fetched successfully",
        status.SUCCESS,
        StatusCodes.OK,
      ),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        status.ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const company = await prisma.company.create({ data: body as Company });
    return NextResponse.json(
      success(
        company,
        "Company created successfully",
        status.SUCCESS,
        StatusCodes.CREATED,
      ),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        status.ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
