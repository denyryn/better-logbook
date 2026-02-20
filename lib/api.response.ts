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
