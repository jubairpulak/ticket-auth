import { Injectable } from "@nestjs/common";

export interface IResponse {
    issuccess: boolean;
    statusCode: number;
    data: any;
    message: string;
}

@Injectable()
export class Response {
    successResponse(isSuccess: boolean, code: number, msg: string, data: any): IResponse {
        return {
            issuccess: isSuccess,
            statusCode: code,
            data: data,
            message: msg  
        }
    }

    failedResponse(isSuccess: boolean, code: number, msg: string, data: string | { [key: string]: number | string }): IResponse {
        return {
            issuccess: isSuccess,
            statusCode: code,
            data: data,
            message: msg  
        }
    }
}
