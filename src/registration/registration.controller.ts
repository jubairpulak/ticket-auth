import {
	Controller,
	Post,
	Put,
	Body,
	Param,
	Res,
	HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { RegistrationService } from "../registration/registration.service";
import {
	RegisterUserDto,
	LoginUserDto,
	UpdateProfileDto,
	UpdatePasswordDto,
} from "../registration/dto/user.dto";

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
		@Res() res: Response,
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
		@Res() res: Response,
	) {
		const result = await this.registrationService.updatePassword(id, dto);
		return res
			.status(result?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
			.json(result);
	}
}
