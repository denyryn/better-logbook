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
  status: status.SUCCESS,
  code = 200,
): ApiResponse<T> {
  return {
    data,
    message,
    status,
    code,
  };
}

export function error<T>(
  data: T,
  message = "Something went wrong",
  status: status.ERROR,
  code = 500,
): ApiResponse<T> {
  return {
    data,
    message,
    status,
    code,
  };
}
