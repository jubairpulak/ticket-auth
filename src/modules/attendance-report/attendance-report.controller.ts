import {
	Controller,
	Post,
	Body,
	HttpCode,
	Res,
	HttpStatus,
	Req,
	Query,
	UseGuards,
	Get,
} from "@nestjs/common";
import { Request } from "express";
import { Response } from "express";

import { AttendanceReportService } from "./attendance-report.service";
import { ServiceTokenGuard } from "src/guards";
import { ATTENDANCE_STATUS } from "src/constants/api.enums";
@Controller("attendance-report")
export class AttendanceReportController {
	constructor(private readonly reportService: AttendanceReportService) {}
	@Get("/v1/reports")
	async getReports(
		@Query("business_id") businessId: number,
		@Query("business_member_id") businessMemberId: number,
		@Res() res: Response,
	) {
		try {
			const reports = await this.reportService.getReports(
				businessId,
				businessMemberId,
			);
			return res.status(HttpStatus.OK).json(reports);
		} catch (error) {
			console.error("Error fetching reports:", error);
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				message: "Failed to fetch reports",
			});
		}
	}

	@UseGuards(ServiceTokenGuard)
	@Post("/v1/custom-attendance-report")
	async requestReport(
		@Res() res: Response,
		@Req() req,
		@Query("start_date") startDate: string,
		@Query("end_date") endDate: string,
		@Body("name") name: string,
	) {
		try {
			const { business_id } = req?.user;
			const report = await this.reportService.createReportRequest(
				business_id,
				name,
				startDate,
				endDate,
			);
			console.log("Report created:", report.toJSON());

			console.log("Adding report to queue...", req?.user);
			await this.reportService.addToQueue("generate-custom-attendance", {
				reportId: report.id,
				filters: {
					startDate,
					endDate,
					user: req?.user,
					headers: req?.headers,
				},
			});
			console.log("Report added to queue.");

			return res.status(HttpStatus.OK).json({
				status: "success",
				message: "Report generation started.",
			});
		} catch (error) {
			console.error("Error creating report:", error);
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: "Failed to start report generation." });
		}
	}


	
	@UseGuards(ServiceTokenGuard)
	@Post("/v1/download-employee-list")
	async generateEmployeeList(
		@Res() res: Response,
		@Req() req,
		@Query("start_date") startDate: string,
		@Query("end_date") endDate: string,
		@Body("name") name: string,
	) {
		try {
			const { business_id } = req?.user;
			const report = await this.reportService.createReportRequest(
				business_id,
				name,
				startDate,
				endDate,
			);
			console.log("Report created:", report.toJSON());

			console.log("Adding report to queue...", req?.user);
			await this.reportService.addToQueue("generate-employee-list", {
				reportId: report.id,
				filters: {
					user: req?.user,
					headers: req?.headers,
				},
			});
			console.log("Report added to queue.");

			return res.status(HttpStatus.OK).json({
				status: "success",
				message: "Report generation started.",
			});
		} catch (error) {
			console.error("Error creating report:", error);
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: "Failed to start report generation." });
		}
	}
	
	

	@UseGuards(ServiceTokenGuard)
	@Post("/v1/custom-attendace-report-by-employee")
	async getCustomAttendanceReportByEmployee(
		@Query("from_date") fromDate: string,
		@Query("to_date") toDate: string,
		@Query("business_member_id") businessMemberId: number,
		@Req() req,
		@Res() res: Response,
		@Query("start_date") startDate: string,
		@Query("end_date") endDate: string,
		@Body("name") name: string,
	) {
		try {
			console.log("Starting report creation...");
			const { business_id } = req?.user;
			const report = await this.reportService.createReportRequest(
				business_id,
				name,
				fromDate,
				toDate,
			);
			console.log("Report created:", report.toJSON());

			console.log("Adding report to queue...", req?.user);
			await this.reportService.addToQueue(
				"generate-custom-attendance-by-employee",
				{
					reportId: report.id,
					filters: {
						fromDate,
						toDate,
						businessMemberId,
						user: req?.user,
						headers: req?.headers,
					},
				},
			);
			console.log("Report added to queue.");

			return res
				.status(HttpStatus.OK)
				.json({ message: "Report generation started." });
		} catch (error) {
			console.error("Error creating report:", error);
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: "Failed to start report generation." });
		}
	}

	@UseGuards(ServiceTokenGuard)
	@Post("/v1/daily-attendance-report")
	async requestReportDaily(
		@Query("date") date: string,
		@Query("department_id") departmentId: number,
		@Query("checkin_location_id") checkinLocationId: number,
		@Query("checkout_location_id") checkoutLocationId: number,
		@Query("checkin_office_or_remote") checkinMode: string,
		@Query("checkout_office_or_remote") checkoutMode: string,
		@Query("skip") skip: string,
		@Query("limit") limit: string,
		@Query("search_keyword") search: string,
		@Query("search_type") search_type: "name" | "email" | "employee_id",
		@Query("status") status: string,
		@Query("checkin_status") checkinStatus: string,
		@Query("checkout_status") checkoutStatus: string,
		@Query("attendance_status")
		attendanceStatus: "present" | "absent" | "on_leave",
		@Req() req,
		@Res() res: Response,
		@Query("start_date") startDate: string,
		@Query("end_date") endDate: string,
		@Body("name") name: string,
	) {
		try {
			console.log("Starting report creation...");
			const { business_id, business_member_id } = req?.user;
			const report = await this.reportService.createReportRequest(
				business_id,
				name,
				date,
				date,
			);
			console.log("Report created:");

			let is_all = false;
			if (
				(skip == "0" && limit == "0") ||
				skip == undefined ||
				limit == undefined
			) {
				is_all = true;
			}
			const skipNumber = parseInt(skip, 10) || 0;
			const limitNumber = parseInt(limit, 10) || 10;
			console.log("hello data :", req?.user);
			await this.reportService.addToQueue("attendance-data-generate", {
				reportId: report.id,
				filters: {
					date,
					department_id: departmentId,
					checkin_location_id: checkinLocationId,
					checkout_location_id: checkoutLocationId,
					checkin_office_or_remote: checkinMode,
					checkout_office_or_remote: checkoutMode,
					skip: skipNumber,
					limit: limitNumber,
					is_all,
					search,
					search_type,
					status,
					checkin_status: checkinStatus,
					checkout_status: checkoutStatus,
					attendance_status: attendanceStatus,
					business_member_id,
					business_id,
					user: req?.user,
					headers: req?.headers,
				},
			});
			console.log("Report added to queue.");

			return res
				.status(HttpStatus.OK)
				.json({ message: "Report generation started." });
		} catch (error) {
			console.error("Error creating report:", error);
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: "Failed to start report generation." });
		}
	}
}
