import {
	NotFoundException,
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { EmployeeModel } from "../models/employee.model";
import { EmployeeOfficialInfoModel } from "../models/employee-official-info.model";
import { EmployeePersonalInfoModel } from "../models/employee-personal-info.model";
import {
	RegisterUserDto,
	LoginUserDto,
	UpdateProfileDto,
	UpdatePasswordDto,
} from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import { successResponse, errorResponse } from "utils/response";

@Injectable()
export class RegistrationService {
	async registerUser(dto: RegisterUserDto): Promise<any> {
		try {
			// Hash the password
			const hashedPassword = await bcrypt.hash(dto.password, 10);

			// Create the employee record
			const employee = await EmployeeModel.create({});

			// Create the official info record
			await EmployeeOfficialInfoModel.create({
				employee_id: employee.id,
				name: dto.name,
				email: dto.email,
				role: dto.role,
			});

			// Create the personal info record
			await EmployeePersonalInfoModel.create({
				employee_id: employee.id,
				phone: dto.phone,
				password: hashedPassword,
			});

			// Reload the employee to include the associated models
			await employee.reload({
				include: [EmployeeOfficialInfoModel, EmployeePersonalInfoModel],
			});

			// Return success response
			return successResponse(
				employee,
				"Registration successful",
				HttpStatus.CREATED,
			);
		} catch (error) {
			// Return error response
			return errorResponse(
				error?.message || `Registration Error`,
				error?.response?.data || {},
				error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async loginUser(dto: LoginUserDto): Promise<any> {
		try {
			// Find the employee by email
			const employee = await EmployeeModel.findOne({
				include: [
					{
						model: EmployeePersonalInfoModel,
						where: { email: dto.email },
					},
				],
			});

			// Check if the employee exists and the password matches
			if (
				!employee ||
				!(await bcrypt.compare(
					dto.password,
					employee.personalInfo.password,
				))
			) {
				throw new HttpException(
					"Invalid email or password",
					HttpStatus.UNAUTHORIZED,
				);
			}

			// Generate a mock token (replace this with a real JWT implementation)
			const token = "mock-jwt-token";

			// Prepare user data for the response
			const userData = {
				id: employee.id,
				email: employee.personalInfo.email,
				email_verified: true, // Replace this with actual email verification logic
				name: employee.officialInfo.name,
			};

			// Return success response
			return successResponse(
				{
					...userData,
					token,
				},
				"Login successful",
				HttpStatus.OK,
			);
		} catch (error) {
			// Return error response
			return errorResponse(
				error?.message || `Login Error`,
				error?.response?.data || {},
				error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateProfile(
		employeeId: number,
		dto: UpdateProfileDto,
	): Promise<any> {
		try {
			// Find the employee by ID
			const employee = await EmployeeModel.findByPk(employeeId, {
				include: [EmployeePersonalInfoModel],
			});

			if (!employee) {
				throw new NotFoundException("Employee not found");
			}

			// Update the official and personal info
			if (dto.name) employee.officialInfo.name = dto.name;
			if (dto.phone) employee.personalInfo.phone = dto.phone;
			if (dto.address) employee.personalInfo.address = dto.address;

			// Save the changes
			await employee.officialInfo.save();
			await employee.personalInfo.save();

			// Return success response
			return successResponse(
				employee,
				"Profile updated successfully",
				HttpStatus.OK,
			);
		} catch (error) {
			// Return error response
			return errorResponse(
				error?.message || `Profile Update Error`,
				error?.response?.data || {},
				error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updatePassword(
		employeeId: number,
		dto: UpdatePasswordDto,
	): Promise<any> {
		try {
			// Find the employee by ID
			const employee = await EmployeeModel.findByPk(employeeId, {
				include: [EmployeePersonalInfoModel],
			});

			// Validate the old password
			if (
				!employee ||
				!(await bcrypt.compare(
					dto.oldPassword,
					employee.personalInfo.password,
				))
			) {
				throw new HttpException(
					"Invalid old password",
					HttpStatus.UNAUTHORIZED,
				);
			}

			// Update the password
			employee.personalInfo.password = await bcrypt.hash(
				dto.newPassword,
				10,
			);
			await employee.personalInfo.save();

			// Return success response
			return successResponse(
				null,
				"Password updated successfully",
				HttpStatus.OK,
			);
		} catch (error) {
			// Return error response
			return errorResponse(
				error?.message || `Password Update Error`,
				error?.response?.data || {},
				error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
