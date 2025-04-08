import { HttpStatus, Injectable } from "@nestjs/common";
import { messages } from "utils/messages.enum";
import { errorResponse } from "utils/response";
import { successResponse } from "utils/response";

@Injectable()
export class DemoService {
    constructor() {}

    async healthz() {
        try {
            const uptimeInSeconds = process.uptime();
            const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
            const hours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
            const seconds = Math.floor(uptimeInSeconds % 60);

            const uptimeString = [
                days && `${days}d`,
                hours && `${hours}h`,
                minutes && `${minutes}m`,
                `${seconds}s`
            ].filter(Boolean).join(' ');

            const data = {
                uptime: uptimeString,
                message: "OK",
                date: new Date(),
                server_check: "Check Server Status",
            };
            return successResponse(data, messages.SUCCESS, HttpStatus.OK);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.resultDesc ||
                error?.message ||
                messages.FAILED;
            return errorResponse(message, {}, HttpStatus.BAD_REQUEST);
        }
    }
}
