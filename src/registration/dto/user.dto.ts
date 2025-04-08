import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";

export class RegisterUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsNotEmpty()
	@IsString()
	role: string;

	@IsOptional()
	@IsString()
	phone?: string;
}

export class LoginUserDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;
}

export class UpdateProfileDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	phone?: string;

	@IsOptional()
	@IsString()
	address?: string;
}

export class UpdatePasswordDto {
	@IsNotEmpty()
	@MinLength(6)
	oldPassword: string;

	@IsNotEmpty()
	@MinLength(6)
	newPassword: string;
}
