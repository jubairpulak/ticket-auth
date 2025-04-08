import { Body, Controller, Req, Get, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthTokenGuard } from "src/middleware/guards/AuthTokenGuard";
import { CreateDemoDto } from "./dto/create-demo.dto";
import { DemoService } from "./demo.service";
import { Request } from "express";

@Controller("demo")
export class DemoController {
    constructor(private readonly demoService: DemoService) {}

    @Get("v1/healthz")
    async healthz(@Req() req: Request, @Res() res: Response) {
        const result = await this.demoService.healthz();
        return res.status(result.statusCode).json(result);
    }
}
