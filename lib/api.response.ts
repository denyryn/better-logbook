import { NextResponse } from "next/server";

export enum status {
  SUCCESS = "success",
  ERROR = "error",
}

export type ApiResponse<T> = {
  data: T;
  message: string;
  code: number;
  status: status;
};

export function success<T>(
  data: T,
  message = "Success",
  code = 200,
): ApiResponse<T> {
  return {
    data,
    message,
    status: status.SUCCESS,
    code,
  };
}

export function error<T>(
  data: T,
  message = "Something went wrong",
  code = 500,
): ApiResponse<T> {
  return {
    data,
    message,
    status: status.ERROR,
    code,
  };
}

export function serverSuccess<T>(
  data: T,
  message = "Success",
  code = 200
) {
  const body: ApiResponse<T> = {
    data,
    message,
    code,
    status: status.SUCCESS,
  };

  return NextResponse.json(body, { status: code });
}

export function serverError<T>(
  data: T,
  message = "Something went wrong",
  code = 500
) {
  const body: ApiResponse<T> = {
    data,
    message,
    code,
    status: status.ERROR,
  };

  return NextResponse.json(body, { status: code });
}

export { success as successResponse, error as errorResponse };
export { serverSuccess as serverSuccessResponse, serverError as serverErrorResponse };
