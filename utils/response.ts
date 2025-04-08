import { HttpStatus } from '@nestjs/common';
export const successResponse = (
  data: any,
  message: string = "Success",
  statusCode: number = HttpStatus.OK,
) => {
  return {
    issuccess: true,
    statusCode,
    message,
    data,
  };
};

export const errorResponse = (
  message: string,
  data: any = {},
  statusCode: number = HttpStatus.BAD_REQUEST,
) => {
  return {
    issuccess: false,
    statusCode,
    message,
    data,
  };
};
