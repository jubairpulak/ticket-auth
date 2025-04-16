import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  LoginUserDto,
  RegisterUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from "../registration/dto/user.dto";
import { RegistrationService } from "../registration/registration.service";

@Controller("/user")
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post("/v1/register")
  async register(@Body() dto: RegisterUserDto, @Res() res: Response) {
    const result = await this.registrationService.registerUser(dto);
    return res
      .status(result?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }

  @Post("/v1/login")
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const result = await this.registrationService.loginUser(dto);
    return res
      .status(result?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }

  @Put("/v1/profile/:id")
  async updateProfile(
    @Param("id") id: number,
    @Body() dto: UpdateProfileDto,
    @Res() res: Response
  ) {
    const result = await this.registrationService.updateProfile(id, dto);
    return res
      .status(result?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }

  @Put("/v1/password/:id")
  async updatePassword(
    @Param("id") id: number,
    @Body() dto: UpdatePasswordDto,
    @Res() res: Response
  ) {
    const result = await this.registrationService.updatePassword(id, dto);
    return res
      .status(result?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }

  //   @UseGuards(ServiceTokenGuard)
  @Get("/v1/prifile/:id")
  async getProfile(
    @Res() res: Response,
    @Req() req: Request,
    @Param("id") id: number
  ) {
    // console.log({ user: req.user });
    const result = await this.registrationService.getProfile(id);
    return res
      .status(result?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }
}
