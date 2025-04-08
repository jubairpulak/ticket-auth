import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
	AttendanceActionLogsModel,
	AttendancesModel,
	BusinessDepartmentsModel,
	BusinessMemberBkashInfoModel,
	BusinessMembersModel,
	BusinessRolesModel,
	MembersModel,
	ProfileBankInformationsModel,
	ProfilesModel,
	ReportModel,
	ShiftAssignmentsModel,
} from "../../models";
import { DATABASE_CONNECTION, LEAVE_SERVICE_URL } from "src/config/constants";
import { Sequelize } from "sequelize-typescript";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import * as ExcelJS from "exceljs";
import * as AWS from "aws-sdk";
import moment from "moment-timezone";
import {
	ATTENDANCE_LOG_TYPE,
	ATTENDANCE_STATUS,
	EMPLOYEE_STATUS,
} from "src/constants/api.enums";
import { Op } from "sequelize";
import axios from "axios";
import { ErrorLog } from "src/config/winstonLog";
import { ReportQueueService } from "./report-queue.service";
@Injectable()
export class AttendanceReportService {
	constructor(
		@Inject(DATABASE_CONNECTION) private readonly sequelize: Sequelize,
		private readonly reportQueue: ReportQueueService,
	) {}

	async createReportRequest(
		businessId: number,
		name: string,
		startDate: string,
		endDate: string,
	) {
		console.log("Creating report request...");
		let obj: any = {};
		if (name) obj.name = name;
		if (startDate) obj.startDate = startDate;
		if (endDate) obj.endDate = endDate;

		try {
			const report = await ReportModel.create({
				business_id: businessId, // Assuming departmentId maps to business_id
				fileUrl: "test",
				downloadTime: 0,
				...obj,
			});

			return report;
		} catch (error) {
			console.log("Error creating report:", error);
		}
	}

	async addToQueue(jobName: JobType, data: any) {
		console.log("job query ", jobName, data);
		this.reportQueue.addJob({
			type: jobName,
			data: data,
		});
		console.log(`Job added to queue: ${jobName}`, data);

		// return;
	}

	async generateAttendanceReport(job: any) {
		const { reportId, filters } = job;
		try {
			console.log("Generating attendance report for reportId:");
			const { startDate, endDate, user: loginUser, headers } = filters;
			//test
			const fromMoment = moment(startDate).tz("Asia/Dhaka");
			const toMoment = moment(endDate).tz("Asia/Dhaka");

			if (!fromMoment.isValid() || !toMoment.isValid()) {
				throw new HttpException(
					"Invalid date format. Please use YYYY-MM-DD format.",
					HttpStatus.BAD_REQUEST,
				);
			}
			console.log("login user :", loginUser);
			// Get all active business members
			const businessMembers = await BusinessMembersModel.findAll({
				where: {
					business_id: loginUser.business_id,
					status: EMPLOYEE_STATUS.ACTIVE,
				},
				include: [
					{
						model: MembersModel,
						as: "member",
						include: [
							{
								model: ProfilesModel,
								as: "profile",
								attributes: ["name", "email", "address"],
							},
						],
					},
					{
						model: BusinessRolesModel,
						as: "role",
						include: [
							{
								model: BusinessDepartmentsModel,
								as: "department",
								attributes: ["name"],
							},
						],
					},
				],
			});
			console.log("Business members:", businessMembers.length);
			// Extract unique manager IDs
			const managerIds = [
				...new Set(
					businessMembers
						.map((member) => member.manager_id)
						.filter((id) => id != null),
				),
			];

			// Fetch all manager details in a single query
			const managersMap = new Map();
			if (managerIds.length > 0) {
				const managerDetails = await BusinessMembersModel.findAll({
					where: {
						id: {
							[Op.in]: managerIds,
						},
					},
					include: [
						{
							model: MembersModel,
							as: "member",
							include: [
								{
									model: ProfilesModel,
									as: "profile",
									attributes: ["name", "email"],
								},
							],
						},
					],
				});
				console.log("Manager details:", managerDetails.length);
				// Create a map of manager details for quick lookup
				managerDetails.forEach((manager) => {
					managersMap.set(manager.id, {
						name: manager.member?.profile?.name || "-",
						email: manager.member?.profile?.email || "-",
					});
				});
			}

			const employeeReports: EmployeeAttendanceReport[] = [];

			for (const member of businessMembers) {
				let managerName = "-";
				let managerEmail = "-";
				if (member.manager_id) {
					// Get manager details from the pre-fetched map
					const managerDetails = member.manager_id
						? managersMap.get(member.manager_id)
						: { name: "-", email: "-" };

					managerName = managerDetails.name;
					managerEmail = managerDetails.email;
				}

				const fromDateMoment = moment(startDate)
					.tz("Asia/Dhaka")
					.format("YYYY-MM-DD");
				const toDateMoment = moment(endDate)
					.tz("Asia/Dhaka")
					.format("YYYY-MM-DD");
				// Get attendance records for date range
				const attendances = await AttendancesModel.findAll({
					where: {
						[Op.and]: [
							Sequelize.where(
								Sequelize.fn("DATE", Sequelize.col("date")),
								{
									[Op.between]: [
										fromDateMoment,
										toDateMoment,
									],
								},
							),
							{ business_member_id: member.id },
						],
					},
					include: [
						{
							model: AttendanceActionLogsModel,
							as: "attendance_action_logs",
						},
					],
					order: [["date", "ASC"]],
				});
				console.log("Attendance records:", attendances.length);
				const shiftAssignments = await ShiftAssignmentsModel.findAll({
					where: {
						[Op.and]: [
							Sequelize.where(
								Sequelize.fn("DATE", Sequelize.col("date")),
								{
									[Op.between]: [
										fromDateMoment,
										toDateMoment,
									],
								},
							),
							{ business_member_id: member.id },
						],
					},
				});
				console.log("Shift assignments:", shiftAssignments.length);
				const shiftAssignments_2 = shiftAssignments.filter(
					(assignment) =>
						assignment.is_weekend === 0 &&
						assignment.is_holiday === 0,
				);

				const shiftAssignmentsWithWeekendHoliday =
					shiftAssignments.filter(
						(assignment) =>
							assignment.is_weekend === 1 ||
							assignment.is_holiday === 1,
					);

				const weekendHolidayAttendances = attendances.filter(
					(attendance) => {
						// Find matching shift assignment for this attendance date
						const matchingShift =
							shiftAssignmentsWithWeekendHoliday.find(
								(shift) =>
									moment(shift.date)
										.tz("Asia/Dhaka")
										.format("YYYY-MM-DD") ===
									moment(attendance.date)
										.tz("Asia/Dhaka")
										.format("YYYY-MM-DD"),
							);

						// Return true if this attendance was on a weekend or holiday
						return (
							matchingShift &&
							(matchingShift.is_weekend === 1 ||
								matchingShift.is_holiday === 1)
						);
					},
				);

				// Calculate statistics
				let stats = {
					working_days:
						shiftAssignments_2.length +
						weekendHolidayAttendances.length,
					total_check_out_miss: 0,
					on_time: 0,
					late: 0,
					left_early: 0,
					absent: 0,
					left_timely: 0,
					on_leave: 0,
					present: attendances.length, // assuming absent record is not saved in AttendancesModel table
					total_minutes: 0,
					overtime_in_minutes: 0,
					remote_checkin: 0,
					wifi_checkin: 0,
					geo_checkin: 0,
					remote_checkout: 0,
					wifi_checkout: 0,
					geo_checkout: 0,
					late_days: [],
					late_days_string: "",
					absent_days_string: "",
					leave_days: "",
					absent_days: [],
				};

				// Process each attendance record
				attendances.forEach((attendance) => {
					// Calculate check-in stats
					const checkInLog = attendance.attendance_action_logs.find(
						(log) => log.action === ATTENDANCE_LOG_TYPE.CHECKIN,
					);
					const checkOutLog = attendance.attendance_action_logs.find(
						(log) => log.action === ATTENDANCE_LOG_TYPE.CHECKOUT,
					);

					if (checkInLog) {
						if (checkInLog.status === ATTENDANCE_STATUS.ON_TIME) {
							stats.on_time++;
						} else if (
							checkInLog.status === ATTENDANCE_STATUS.LATE
						) {
							stats.late++;
							stats.late_days.push(
								moment(attendance.date)
									.tz("Asia/Dhaka")
									.format("YYYY-MM-DD"),
							);
						}

						if (checkInLog.is_remote) {
							stats.remote_checkin++;
						} else if (checkInLog.is_geo_location) {
							stats.geo_checkin++;
						} else if (checkInLog.is_in_wifi) {
							stats.wifi_checkin++;
						}
					}

					if (checkInLog && !checkOutLog) {
						stats.total_check_out_miss++;
					}

					if (checkOutLog) {
						if (
							checkOutLog.status === ATTENDANCE_STATUS.LEFT_EARLY
						) {
							stats.left_early++;
						} else if (
							checkOutLog.status === ATTENDANCE_STATUS.LEFT_TIMELY
						) {
							stats.left_timely++;
						}

						if (checkOutLog.is_remote) {
							stats.remote_checkout++;
						} else if (checkOutLog.is_geo_location) {
							stats.geo_checkout++;
						} else if (checkOutLog.is_in_wifi) {
							stats.wifi_checkout++;
						}
					}

					// Number() is used to response as number, otherwise it will response as string
					stats.total_minutes +=
						Number(attendance.staying_time_in_minutes) || 0.0;
					stats.overtime_in_minutes +=
						Number(attendance.overtime_in_minutes) || 0.0;
				});

				const params: any = {
					from_date: fromDateMoment,
					to_date: toDateMoment,
					status: "accepted",
					business_member_id: member.id,
				};

				// Only add business_member_id to params if it's provided
				if (member.id) {
					params.business_member_id = member.id;
				}

				// Make API call to leave service
				const leaveResponse = await axios.get(
					`${LEAVE_SERVICE_URL}/leave-api/leave-application/v1/data`,
					{
						params,
						headers: {
							"Content-Type": "application/json",
							Authorization: headers?.authorization,
						},
					},
				);
				console.log("Leave response:", leaveResponse.data);
				let leaveDays = [];
				if (leaveResponse?.data?.data?.leave_applications) {
					leaveResponse.data.data.leave_applications.forEach(
						(leave) => {
							// Convert dates to moment objects in Asia/Dhaka timezone
							const startDate = moment(leave.start_date).tz(
								"Asia/Dhaka",
							);
							const endDate = moment(leave.end_date).tz(
								"Asia/Dhaka",
							);

							// Generate array of dates between start and end date
							for (
								let date = moment(startDate);
								date.isSameOrBefore(endDate);
								date.add(1, "days")
							) {
								leaveDays.push(date.format("YYYY-MM-DD"));
							}
						},
					);
				}
				stats.on_leave = leaveDays.length;

				const today = moment().tz("Asia/Dhaka").startOf("day");

				// format attendance logs
				const allDates = [];

				const joinDate = member.join_date
					? moment(member.join_date).tz("Asia/Dhaka").startOf("day")
					: null;

				// Generate array of all dates in range, but only up to today
				for (
					let date = moment(fromDateMoment).tz("Asia/Dhaka");
					date.format("YYYY-MM-DD") <= today.format("YYYY-MM-DD");
					date.add(1, "days")
				) {
					// Only add dates within the specified range
					if (
						date.format("YYYY-MM-DD") >= fromDateMoment &&
						date.format("YYYY-MM-DD") <= toDateMoment &&
						(!joinDate || date.isSameOrAfter(joinDate))
					) {
						allDates.push(date.format("YYYY-MM-DD"));
					}
				}

				// Create a map of existing attendance records
				const attendanceMap = new Map(
					attendances.map((attendance) => [
						moment(attendance.date)
							.tz("Asia/Dhaka")
							.format("YYYY-MM-DD"),
						attendance,
					]),
				);

				// Create a map of shift assignments
				const shiftMap = new Map(
					shiftAssignments.map((shift) => [
						moment(shift.date)
							.tz("Asia/Dhaka")
							.format("YYYY-MM-DD"),
						shift,
					]),
				);

				// Generate complete attendance logs including missing dates
				allDates.map((date) => {
					const attendance = attendanceMap.get(date);
					const shift = shiftMap.get(date);

					if (!attendance) {
						if (
							!attendance &&
							shift &&
							!shift.is_weekend &&
							!shift.is_holiday
						) {
							// Add the date to absentDays list when status is Absent
							stats.absent_days.push(
								moment(date)
									.tz("Asia/Dhaka")
									.format("YYYY-MM-DD"),
							);
						}
					}
				});

				// Update the absent count to match the actual absent days
				stats.absent = stats.absent_days.length;

				// Prepare response
				stats = {
					...stats,
					late_days_string: stats.late_days.join(", "),
					absent_days_string: stats.absent_days.join(", "),
					leave_days: leaveDays.join(", ") || "-",
				};

				let isProrated = "No";

				try {
					const prorateResponse = await axios.get(
						`${LEAVE_SERVICE_URL}/leave-api/leave-prorate/v1/employee-prorate-list`,
						{
							params: {
								business_member_id: member.id,
							},
							headers: {
								"Content-Type": "application/json",
								Authorization: headers?.authorization,
							},
						},
					);

					if (prorateResponse?.data?.data?.prorate_list) {
						// Check if all leave types are auto prorated
						const allProrated =
							prorateResponse.data.data.prorate_list.every(
								(item) => item.is_auto_prorated === 1,
							);
						isProrated = allProrated ? "Yes" : "No";
					}
				} catch (error) {
					ErrorLog("Error fetching prorate information", error);
					isProrated = "No"; // Default to No if API fails
				}

				// Format the report
				employeeReports.push({
					employee_id: member.employee_id,
					employee_name: member.member.profile.name,
					employee_email: member.member.profile.email,
					employee_department: member.role?.department?.name || "-",
					employee_designation: member.role?.name || "-",
					line_manager_name: managerName,
					line_manager_email: managerEmail,
					employee_address: member.member.profile.address || "-",
					working_days: stats.working_days,
					present: stats.present,
					on_time: stats.on_time,
					late: stats.late,
					left_timely: stats.left_timely,
					left_early: stats.left_early,
					on_leave: stats.on_leave,
					absent: stats.absent,
					total_hours: `${Math.floor(stats.total_minutes / 60)} hours ${stats.total_minutes % 60} min`,
					overtime: `${Math.floor(stats.overtime_in_minutes / 60)} hours ${stats.overtime_in_minutes % 60} min`,
					total_remote_checkin: stats.remote_checkin,
					total_office_checkin:
						stats.wifi_checkin + stats.geo_checkin,
					total_remote_checkout: stats.remote_checkout,
					total_office_checkout:
						stats.wifi_checkout + stats.geo_checkout,
					total_checkout_missing: stats.total_check_out_miss,
					joining_prorated: isProrated,
					leave_days: stats.leave_days || "-",
					late_days: stats.late_days_string || "-",
					absent_days: stats.absent_days_string || "-",
				});
			}

			console.log("Employee reports : ", employeeReports);
			//
			// Fetch data (mocked services for attendance, shifts, etc.)
			const [checkIns, checkOuts, shifts, leaves] = await Promise.all([
				this.getCheckIns(filters),
				this.getCheckOuts(filters),
				this.getShifts(filters),
				this.getLeaves(filters),
			]);

			const data = this.aggregateReport(
				checkIns,
				checkOuts,
				shifts,
				leaves,
			);

			// Generate Excel file
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Attendance Report");
			sheet.columns = [
				{ header: "Employee ID", key: "employee_id" },
				{ header: "Check-ins", key: "employee_name" },
				{ header: "Check-outs", key: "employee_email" },
				{ header: "Department name", key: "employee_department" },
				{ header: "Designation", key: "employee_designation" },
				{ header: "Line Manager Name", key: "line_manager_name" },
				{ header: "Line Manager Email", key: "line_manager_email" },
				{ header: "Email Address", key: "employee_address" },
				{ header: "Working Days", key: "working_days" },
				{ header: "Present", key: "present" },
				{ header: "On Time", key: "on_time" },
				{ header: "Late", key: "late" },
				{ header: "Left Timely", key: "left_timely" },
				{ header: "Left Early", key: "left_early" },
				{ header: "On Leave", key: "on_leave" },
				{ header: "Late", key: "late" },
				{ header: "Absent", key: "absent" },
				{ header: "Total Hours", key: "total_hours" },
				{ header: "Overtime", key: "overtime" },
				{ header: "Total Remote Checkin", key: "total_remote_checkin" },
				{ header: "Total Office Checkin", key: "total_office_checkin" },
				{
					header: "Total Remote Checkout",
					key: "total_remote_checkout",
				},
				{
					header: "Total Office Checkout",
					key: "total_office_checkout",
				},
				{ header: "Total Remote Checkin", key: "total_remote_checkin" },
				{
					header: "Total Checkout missing",
					key: "total_checkout_missing",
				},
				{ header: "Joining Prorated", key: "joining_prorated" },
				{ header: "Leave Days", key: "leave_days" },
				{ header: "Late Days", key: "late_days" },
				{ header: "Absent Days", key: "absent_days" },
			];

			sheet.addRows(employeeReports);

			const buffer = await workbook.xlsx.writeBuffer();

			// Upload file to S3 (mocked S3 service)
			const currentTime = moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
			const key = `attendance/custom-report-${reportId}-${currentTime}.xlsx`;
			const s3Buffer = Buffer.from(buffer);

			const s3Url = await this.uploadToS3(key, s3Buffer);

			// Update report status
			await ReportModel.update(
				{ fileUrl: s3Url, downloadTime: Date.now(), status: "success" },
				{ where: { id: reportId } },
			);
		} catch (error) {
			await ReportModel.update(
				{ status: "failed", remarks: error.message },
				{ where: { id: reportId } },
			);
		}
	}

	async generateAttendanceReportDailyByEmployee(job: any) {
		console.log("job data: ", job);
		const { reportId, filters } = job;
		try {
			console.log(
				"Generating daily attendance report for reportId:",
				reportId,
			);
			const {
				fromDate,
				toDate,
				businessMemberId,
				user: loginUser,
				headers,
			} = filters;
			//test

			// businessMemberId is required
			if (!businessMemberId) {
				throw new HttpException(
					"Business member ID is required",
					HttpStatus.BAD_REQUEST,
				);
			}
			// Get business member details with related data
			const businessMember = await BusinessMembersModel.findOne({
				where: {
					id: businessMemberId,
					business_id: loginUser.business_id,
				},
				include: [
					{
						model: MembersModel,
						as: "member",
						include: [
							{
								model: ProfilesModel,
								as: "profile",
								attributes: ["name", "email"],
							},
						],
					},
					{
						model: BusinessRolesModel,
						as: "role",
						attributes: ["name"],
						include: [
							{
								model: BusinessDepartmentsModel,
								as: "department",
								attributes: ["name"],
							},
						],
					},
				],
			});

			if (!businessMember) {
				throw new HttpException(
					"Business member not found",
					HttpStatus.NOT_FOUND,
				);
			}

			// from date to date area required
			if (!fromDate || !toDate) {
				throw new HttpException(
					"From date and to date are required. Please use YYYY-MM-DD format.",
					HttpStatus.BAD_REQUEST,
				);
			}

			// Validate date format and range
			const fromMoment = moment(fromDate).tz("Asia/Dhaka");
			const toMoment = moment(toDate).tz("Asia/Dhaka");

			// Check if dates are valid
			if (!fromMoment.isValid() || !toMoment.isValid()) {
				throw new HttpException(
					"Invalid date format. Please use YYYY-MM-DD format.",
					HttpStatus.BAD_REQUEST,
				);
			}

			// Check if from date is after to date
			if (fromMoment.isAfter(toMoment)) {
				throw new HttpException(
					"From date cannot be after to date",
					HttpStatus.BAD_REQUEST,
				);
			}

			const fromDateMoment = moment(fromDate)
				.tz("Asia/Dhaka")
				.format("YYYY-MM-DD");
			const toDateMoment = moment(toDate)
				.tz("Asia/Dhaka")
				.format("YYYY-MM-DD");
			// Get attendance records for date range
			const attendances = await AttendancesModel.findAll({
				where: {
					[Op.and]: [
						Sequelize.where(
							Sequelize.fn("DATE", Sequelize.col("date")),
							{ [Op.between]: [fromDateMoment, toDateMoment] },
						),
						{ business_member_id: businessMemberId },
					],
				},
				include: [
					{
						model: AttendanceActionLogsModel,
						as: "attendance_action_logs",
					},
				],
				order: [["date", "ASC"]],
			});

			const shiftAssignments = await ShiftAssignmentsModel.findAll({
				where: {
					[Op.and]: [
						Sequelize.where(
							Sequelize.fn("DATE", Sequelize.col("date")),
							{ [Op.between]: [fromDateMoment, toDateMoment] },
						),
						{ business_member_id: businessMemberId },
					],
				},
			});

			const params: any = {
				from_date: fromDateMoment,
				to_date: toDateMoment,
				status: "accepted",
				business_member_id: businessMemberId,
			};

			// Only add business_member_id to params if it's provided
			if (businessMemberId) {
				params.business_member_id = businessMemberId;
			}

			// Make API call to leave service
			const leaveResponse = await axios.get(
				`${LEAVE_SERVICE_URL}/leave-api/leave-application/v1/data`,
				{
					params,
					headers: {
						"Content-Type": "application/json",
						Authorization: headers?.authorization,
					},
				},
			);
			let leaveDays = [];
			if (leaveResponse?.data?.data?.leave_applications) {
				leaveResponse.data.data.leave_applications.forEach((leave) => {
					// Convert dates to moment objects in Asia/Dhaka timezone
					const startDate = moment(leave.start_date).tz("Asia/Dhaka");
					const endDate = moment(leave.end_date).tz("Asia/Dhaka");

					// Generate array of dates between start and end date
					for (
						let date = moment(startDate);
						date.isSameOrBefore(endDate);
						date.add(1, "days")
					) {
						leaveDays.push(date.format("YYYY-MM-DD"));
					}
				});
			}

			const today = moment().tz("Asia/Dhaka").startOf("day");

			// format attendance logs
			const allDates = [];

			const joinDate = businessMember.join_date
				? moment(businessMember.join_date)
						.tz("Asia/Dhaka")
						.startOf("day")
				: null;

			// Generate array of all dates in range, but only up to today
			for (
				let date = moment(fromDateMoment).tz("Asia/Dhaka");
				date.format("YYYY-MM-DD") <= today.format("YYYY-MM-DD");
				date.add(1, "days")
			) {
				// Only add dates within the specified range
				if (
					date.format("YYYY-MM-DD") >= fromDateMoment &&
					date.format("YYYY-MM-DD") <= toDateMoment &&
					(!joinDate || date.isSameOrAfter(joinDate))
				) {
					allDates.push(date.format("YYYY-MM-DD"));
				}
			}

			// Create a map of existing attendance records
			const attendanceMap = new Map(
				attendances.map((attendance) => [
					moment(attendance.date)
						.tz("Asia/Dhaka")
						.format("YYYY-MM-DD"),
					attendance,
				]),
			);

			// Create a map of shift assignments
			const shiftMap = new Map(
				shiftAssignments.map((shift) => [
					moment(shift.date).tz("Asia/Dhaka").format("YYYY-MM-DD"),
					shift,
				]),
			);

			// Generate complete attendance logs including missing dates
			const complete_attendance_logs = allDates.map((date) => {
				const attendance = attendanceMap.get(date);
				const shift = shiftMap.get(date);

				if (attendance) {
					// Return existing attendance record
					return {
						date,
						shift_name:
							shift?.shift_name ||
							(shift?.is_general ? "General" : null),
						attendance_id: attendance.id || null,
						checkin_time: attendance.checkin_time,
						checkout_time: attendance.checkout_time,
						checkin_log:
							attendance.attendance_action_logs.find(
								(log) =>
									log.action === ATTENDANCE_LOG_TYPE.CHECKIN,
							) || null,
						checkout_log:
							attendance.attendance_action_logs.find(
								(log) =>
									log.action === ATTENDANCE_LOG_TYPE.CHECKOUT,
							) || null,
						staying_time_in_minutes: Number(
							attendance.staying_time_in_minutes,
						),
						overtime_in_minutes: Number(
							attendance.overtime_in_minutes,
						),
						status: attendance.status,
						remarks: attendance.remarks,
						is_attendance_reconciled:
							attendance.is_attendance_reconciled || 0,
						is_weekend: shift?.is_weekend || 0,
						is_holiday: shift?.is_holiday || 0,
						is_general: shift?.is_general || 0,
						holiday_title: null,
					};
				} else {
					// Create record for missing attendance
					let status = "Not Marked";
					if (leaveDays.includes(date)) {
						status = "On Leave";
					} else if (shift?.is_weekend) {
						status = "Weekend";
					} else if (shift?.is_holiday) {
						status = "Holiday";
					} else if (
						!attendance &&
						shift &&
						!shift.is_weekend &&
						!shift.is_holiday
					) {
						status = "Absent";
					}

					return {
						date,
						shift_name:
							shift?.shift_name ||
							(shift?.is_general ? "General" : null),
						attendance_id: null,
						checkin_time: null,
						checkout_time: null,
						checkin_log: null,
						checkout_log: null,
						staying_time_in_minutes: 0,
						overtime_in_minutes: 0,
						status,
						remarks: null,
						is_attendance_reconciled: 0,
						is_weekend: shift?.is_weekend || 0,
						is_holiday: shift?.is_holiday || 0,
						is_general: shift?.is_general || 0,
						holiday_title:
							(
								shift?.shift_settings as {
									holiday_title?: string;
								}
							)?.holiday_title || null,
					};
				}
			});

			const transformedRecords = complete_attendance_logs.map(
				(record) => ({
					...record,
					checkin_log_status: !record.checkin_log
						? "-"
						: record.checkin_log.status,
					checkout_log_status: !record.checkout_log
						? "-"
						: record.checkout_log.status,
					check_in_location: !record.checkin_log
						? "-"
						: record.checkin_log.is_remote
							? "Remote"
							: record.checkin_log.is_in_wifi
								? "Wifi"
								: record.checkin_log.is_geo_location
									? "Office"
									: "-",
					check_in_address:
						record.checkin_log?.location?.address || "-",
					check_out_location: !record.checkout_log
						? "-"
						: record.checkout_log.is_remote
							? "Remote"
							: record.checkout_log.is_in_wifi
								? "Wifi"
								: record.checkout_log.is_geo_location
									? "Office"
									: "-",
					check_out_address:
						record.checkout_log?.location?.address || "-",
					total_hours: `${Math.floor((record.staying_time_in_minutes || 0) / 60)} hour${Math.floor((record.staying_time_in_minutes || 0) / 60) !== 1 ? "s" : ""} ${(record.staying_time_in_minutes || 0) % 60} min`,
					overtime: `${Math.floor((record.overtime_in_minutes || 0) / 60)} hour${Math.floor((record.overtime_in_minutes || 0) / 60) !== 1 ? "s" : ""} ${(record.overtime_in_minutes || 0) % 60} min`,
					late_check_in_note: record.checkin_log?.note || "-",
					left_early_note: record.checkout_log?.note || "-",
					attendance_reconciliation:
						record.is_attendance_reconciled === 1 ? "Yes" : "No",
				}),
			);

			console.log(transformedRecords);

			// Generate Excel file
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Attendance Report");
			sheet.columns = [
				{ header: "Date", key: "date" },
				{ header: "Shift Name", key: "shift_name" },
				{ header: "Status", key: "status" },
				{ header: "Check in time", key: "checkin_time" },
				{ header: "Check in status", key: "checkin_log_status" },
				{ header: "Check in location", key: "check_in_location" },
				{ header: "Check in address", key: "check_in_address" },
				{ header: "Check out time", key: "checkout_time" },
				{ header: "Check out status", key: "checkout_log_status" },
				{ header: "Check out location", key: "check_out_location" },
				{ header: "Check out address", key: "check_out_address" },
				{ header: "Total Hours", key: "total_hours" },
				{ header: "Overtime", key: "overtime" },
				{ header: "Late check in note", key: "late_check_in_note" },
				{ header: "Left early note", key: "left_early_note" },
				{
					header: "Attendance Reconciliation",
					key: "attendance_reconciliation",
				},
			];

			sheet.addRows(transformedRecords);

			const buffer = await workbook.xlsx.writeBuffer();

			// Upload file to S3 (mocked S3 service)
			const currentTime = moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
			const key = `attendance/custom-report-${businessMember?.member?.profile?.name}-${reportId}-${currentTime}.xlsx`;
			const s3Buffer = Buffer.from(buffer);

			const s3Url = await this.uploadToS3(key, s3Buffer);

			// Update report status
			await ReportModel.update(
				{ fileUrl: s3Url, downloadTime: Date.now(), status: "success" },
				{ where: { id: reportId } },
			);
		} catch (error) {
			await ReportModel.update(
				{ status: "failed", remarks: error.message },
				{ where: { id: reportId } },
			);
		}
	}

	async generateAttendanceReportDaily(job: any) {
		console.log("call here 505");
		const { reportId, filters } = job;
		console.log("call here 506", filters);
		try {
			console.log(
				"Generating daily attendance report for reportId:",
				reportId,
			);
			const {
				date,
				department_id,
				checkin_location_id,
				checkout_location_id,
				checkin_office_or_remote,
				checkout_office_or_remote,
				skip,
				limit,
				is_all,
				search,
				search_type,
				status,
				checkin_status,
				checkout_status,
				attendance_status,
				business_member_id,
				business_id,
				user: loginUser,
				headers,
			} = filters;
			//test

			let query = {
				date: date,
				department_id: department_id,
				checkin_location_id: checkin_location_id,
				checkout_location_id: checkout_location_id,
				checkin_office_or_remote: checkin_office_or_remote,
				checkout_office_or_remote: checkout_office_or_remote,
				skip: skip,
				limit: limit,
				is_all: is_all,
				search: search,
				search_type: search_type,
				status: status,
				checkin_status: checkin_status,
				checkout_status: checkout_status,
				attendance_status: attendance_status,
			};

			const dailyFlag = true;
			const formattedRecords = await this.getAttendanceRecords(
				query,
				business_id,
				headers,
				dailyFlag,
				business_member_id,
			);
			let paginatedRecords = [];
			if (query.is_all) {
				paginatedRecords = formattedRecords;
			} else {
				paginatedRecords = formattedRecords.slice(
					query.skip || 0,
					(query.skip || 0) + (query.limit || 10),
				);
			}

			console.log("Employee reports : ", paginatedRecords);

			const transformedRecords = paginatedRecords.map((record) => ({
				...record,
				check_in_log_status: record.check_in_log.status,
				check_out_log_status: record.check_out_log.status,
				check_in_location: !record.check_in_log
					? "-"
					: record.check_in_log.is_remote
						? "Remote"
						: record.check_in_log.is_in_wifi
							? "Wifi"
							: record.check_in_log.is_geo_location
								? "Office"
								: "-",
				check_in_address: record.check_in_log?.location?.address || "-",
				check_out_location: !record.check_out_log
					? "-"
					: record.check_out_log.is_remote
						? "Remote"
						: record.check_out_log.is_in_wifi
							? "Wifi"
							: record.check_out_log.is_geo_location
								? "Office"
								: "-",
				check_out_address:
					record.check_out_log?.location?.address || "-",
				total_hours: `${Math.floor((record.staying_time_in_minutes || 0) / 60)} hour${Math.floor((record.staying_time_in_minutes || 0) / 60) !== 1 ? "s" : ""} ${(record.staying_time_in_minutes || 0) % 60} min`,
				overtime: `${Math.floor((record.overtime_in_minutes || 0) / 60)} hour${Math.floor((record.overtime_in_minutes || 0) / 60) !== 1 ? "s" : ""} ${(record.overtime_in_minutes || 0) % 60} min`,
				late_check_in_note: record.check_in_log?.note || "-",
				left_early_note: record.check_out_log?.note || "-",
				attendance_reconciliation:
					record.is_attendance_reconciled === 1 ? "Yes" : "No",
			}));

			// Generate Excel file
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Attendance Report");
			sheet.columns = [
				{ header: "Date", key: "date" },
				{ header: "Employee ID", key: "employee_id" },
				{ header: "Employee Name", key: "employee_name" },
				{ header: "Shift Name", key: "shift_name" },
				{ header: "Department", key: "department" },
				{ header: "Address", key: "address" },
				{ header: "Status", key: "status" },
				{ header: "Check in time", key: "check_in" },
				{ header: "Check in status", key: "check_in_log_status" },
				{ header: "Check in location", key: "check_in_location" },
				{ header: "Check in address", key: "check_in_address" },
				{ header: "Check out time", key: "check_out" },
				{ header: "Check out status", key: "check_out_log_status" },
				{ header: "Check out location", key: "check_out_location" },
				{ header: "Check out address", key: "check_out_address" },
				{ header: "Total Hours", key: "total_hours" },
				{ header: "Overtime", key: "overtime" },
				{ header: "Late check in note", key: "late_check_in_note" },
				{ header: "Left early note", key: "left_early_note" },
				{
					header: "Attendance Reconciliation",
					key: "attendance_reconciliation",
				},
			];

			sheet.addRows(transformedRecords);

			const buffer = await workbook.xlsx.writeBuffer();

			// Upload file to S3 (mocked S3 service)
			const currentTime = moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
			const key = `attendance/daily-report-${reportId}-${currentTime}.xlsx`;
			const s3Buffer = Buffer.from(buffer);

			const s3Url = await this.uploadToS3(key, s3Buffer);

			// Update report status
			await ReportModel.update(
				{ fileUrl: s3Url, downloadTime: Date.now(), status: "success" },
				{ where: { id: reportId } },
			);
		} catch (error) {
			await ReportModel.update(
				{ status: "failed", remarks: error.message },
				{ where: { id: reportId } },
			);
		}
	}

	async generateEmployeeList(job: any) {
		const { reportId, filters } = job;
		try {
			console.log(
				"Generating daily attendance report for reportId:",
				reportId,
			);
			const { user: loginUser, headers } = filters;
			//test

			const employees = await BusinessMembersModel.findAll({
				where: {
					business_id: loginUser.business_id,
				},
				include: [
					{
						model: MembersModel,
						attributes: [
							"emergency_contract_person_number",
							"emergency_contract_person_relationship",
							"emergency_contract_person_name",
						],
						include: [
							{
								model: ProfilesModel,
								attributes: [
									"name",
									"email",
									"dob",
									"address",
									"nationality",
									"nid_no",
									"tin_no",
								],
								include: [
									{
										model: ProfileBankInformationsModel,
										attributes: ["bank_name", "account_no"], // Bank details
									},
								],
							},
						],
					},
					{
						model: BusinessRolesModel,
						attributes: ["name"], // Designation
						include: [
							{
								model: BusinessDepartmentsModel,
								attributes: ["name"], // Department
							},
						],
					},
					{
						model: BusinessMemberBkashInfoModel,
						attributes: ["account_no"], // bKash account
					},
				],
			});

			const transformedEmployeesPromises = employees.map(
				async (employee) => {
					const managerInfo = await BusinessMembersModel.findOne({
						where: {
							id: employee.manager_id,
						},
						include: [
							{
								model: MembersModel,
								attributes: ["id"],
								include: [
									{
										model: ProfilesModel,
										attributes: ["name", "email"],
									},
								],
							},
						],
					});

					return {
						employee_id: employee.employee_id || null,
						name: employee.member?.profile?.name || null,
						phone: employee?.mobile || null,
						email: employee.member?.profile?.email || null,
						status: employee.status || null,
						department: employee.role?.department?.name || null,
						designation: employee.role?.name || null,
						manager: employee.manager_id
							? managerInfo?.member?.profile?.name
							: null,
						joining_date: employee.join_date || null,
						grade: employee.grade || null,
						employee_type: employee.type || null,
						dob: employee.member?.profile?.dob || null,
						address: employee.member?.profile?.address || null,
						nationality:
							employee.member?.profile?.nationality || null,
						nid_passport: employee.member?.profile?.nid_no || null,
						tin: employee.member?.profile?.tin_no || null,
						bank_name:
							employee.member?.profile?.bank_info?.bank_name ||
							null,
						bank_account_no:
							employee.member?.profile?.bank_info?.account_no ||
							null,
						bkash_account_no:
							employee.bkash_info?.account_no || null,
						emergency_contact: {
							number:
								employee.member
									?.emergency_contract_person_number || null,
							relationship:
								employee.member
									?.emergency_contract_person_relationship ||
								null,
							name:
								employee.member
									?.emergency_contract_person_name || null,
						},
					};
				},
			);

			const transformedEmployees = await Promise.all(
				transformedEmployeesPromises,
			);

			// Generate Excel file
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Report");
			sheet.columns = [
				{ header: "Employee ID", key: "employee_id" },
				{ header: "Employee Name", key: "name" },
				{ header: "Phone", key: "phone" },
				{ header: "Email", key: "email" },
				{ header: "Status", key: "status" },
				{ header: "Department", key: "department" },
				{ header: "Designation", key: "designation" },
				{ header: "Manager", key: "manager" },
				{ header: "Joining Date", key: "joining_date" },
				{ header: "Employee Grade", key: "grade" },
				{ header: "Employee Type", key: "employee_type" },
				{ header: "DOB", key: "dob" },
				{ header: "Address", key: "address" },
				{ header: "Nationality", key: "nationality" },
				{ header: "NID/Passport", key: "nid_passport" },
				{ header: "TIN", key: "tin" },
				{ header: "Bank Name", key: "bank_name" },
				{ header: "Bank Account No.", key: "bank_account_no" },
				{ header: "bKash Account No", key: "bkash_account_no" },
				{
					header: "Emergency Contact",
					key: "emergency_contact.number",
				},
				{
					header: "Name Emergency Contact",
					key: "emergency_contact.name",
				},
				{
					header: "Relationship Emergency Contact",
					key: "emergency_contact.relationship",
				},
			];

			sheet.addRows(transformedEmployees);

			const buffer = await workbook.xlsx.writeBuffer();

			// Upload file to S3 (mocked S3 service)
			const currentTime = moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
			const key = `attendance/Coworker-report-${reportId}-${currentTime}.xlsx`;
			const s3Buffer = Buffer.from(buffer);

			const s3Url = await this.uploadToS3(key, s3Buffer);

			// Update report status
			await ReportModel.update(
				{ fileUrl: s3Url, downloadTime: Date.now(), status: "success" },
				{ where: { id: reportId } },
			);
		} catch (error) {
			await ReportModel.update(
				{ status: "failed", remarks: error.message },
				{ where: { id: reportId } },
			);
		}
	}

	aggregateReport(checkIns, checkOuts, shifts, leaves) {
		const employeeIds = [
			...new Set([
				...checkIns.map((i) => i.empId),
				...checkOuts.map((i) => i.empId),
			]),
		];
		return employeeIds.map((empId) => ({
			employeeId: empId,
			checkIns: checkIns.filter((i) => i.empId === empId).length,
			checkOuts: checkOuts.filter((i) => i.empId === empId).length,
			shifts: shifts.filter((i) => i.empId === empId).length,
			leaves: leaves.filter((i) => i.empId === empId).length,
		}));
	}

	// Mocked methods for fetching data
	async getCheckIns(filters: any) {
		return []; // Replace with actual implementation
	}

	async getCheckOuts(filters: any) {
		return []; // Replace with actual implementation
	}

	async getShifts(filters: any) {
		return []; // Replace with actual implementation
	}

	async getLeaves(filters: any) {
		return []; // Replace with actual implementation
	}

	// Mocked S3 upload method
	async uploadToS3(key: string, buffer: Buffer): Promise<string> {
		// Replace with actual S3 upload logic
		// console.log("call here");
		// const s3 = new AWS.S3({
		// 	region: "ap-southeast-1",
		// 	accessKeyId: "asd",
		// 	secretAccessKey: "werw",
		// });

		// const params = {
		// 	Bucket: "sheba-dev-digigo-bucket", // Your S3 bucket name
		// 	Key: key, // The key (file path) in the bucket
		// 	Body: buffer, // The file content
		// 	ContentType:
		// 		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME type for Excel files
		// };
		// // try {
		// // 	const result = await s3.upload(params).promise();
		// // 	console.log("S3 upload result:", result.Location);
		// // 	return result.Location; // Return the URL of the uploaded file
		// // } catch (error) {
		// // 	console.error("Error uploading to S3:", error);
		// // 	throw new Error("Failed to upload file to S3");
		// }
	}

	async getReports(businessId: number, businessMemberId: number) {
		try {
			const whereClause: any = {};
			if (businessId) {
				whereClause.business_id = businessId;
			}
			if (businessMemberId) {
				whereClause.business_member_id = businessMemberId;
			}

			const reports = await ReportModel.findAll({
				where: whereClause,
				order: [["createdAt", "DESC"]],
			});

			return reports;
		} catch (error) {
			console.error("Error fetching reports:", error);
			throw error;
		}
	}

	private async getAttendanceRecords(
		query: AttendanceQueryParams,
		businessId: number,
		headers: any,
		dailyFlag: boolean,
		businessMemberId: number,
	) {
		const date =
			moment(query.date).tz("Asia/Dhaka").format("YYYY-MM-DD") ||
			moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
		let filterOptions: FilterOptions;
		if (dailyFlag) {
			filterOptions = {
				checkin_status: query.checkin_status,
				checkout_status: query.checkout_status,
				attendance_status: query.status as
					| "present"
					| "absent"
					| "on_leave",
				checkin_location_id: query.checkin_location_id,
				checkout_location_id: query.checkout_location_id,
				checkin_office_or_remote: query.checkin_office_or_remote,
				checkout_office_or_remote: query.checkout_office_or_remote,
			};
		} else {
			const statusFilters = this.parseStatusFilter(query.status);
			filterOptions = {
				...statusFilters,
				checkin_location_id: query.checkin_location_id,
				checkout_location_id: query.checkout_location_id,
				attendance_status: query.attendance_status,
				checkin_office_or_remote: query.checkin_office_or_remote,
				checkout_office_or_remote: query.checkout_office_or_remote,
			};
		}

		const businessMembers = await this.getBusinessMembers(
			query,
			businessId,
			businessMemberId,
			dailyFlag,
		);
		// Get all leave records for the date in one API call
		const leaveResponse = await this.getLeaveRecord(null, date, headers);
		// Create a map of business member IDs to their leave records
		const leaveMap = new Map();
		if (leaveResponse?.data?.data?.leave_applications) {
			leaveResponse.data.data.leave_applications.forEach((leave) => {
				leaveMap.set(leave.business_member_id, leave);
			});
		}
		const formattedRecords = (
			await Promise.all(
				businessMembers.map(
					async (businessMember) =>
						await this.formatAttendanceRecord(
							businessMember,
							date,
							filterOptions,
							leaveMap,
						),
				),
			)
		).filter((record) => record !== null);

		// Only sort by check-in time if dailyFlag is true
		if (dailyFlag) {
			formattedRecords.sort((a, b) => {
				// Handle null check_in times (put them at the bottom)
				if (!a.check_in) return 1;
				if (!b.check_in) return -1;
				// Sort in descending order (latest first)
				return moment(b.check_in, "HH:mm:ss").diff(
					moment(a.check_in, "HH:mm:ss"),
				);
			});
		}

		return formattedRecords;
	}

	private async formatAttendanceRecord(
		businessMember: any,
		date: string,
		filterOptions: FilterOptions,
		leaveMap: Map<any, any>,
	) {
		const attendance = await AttendancesModel.findOne({
			where: {
				[Op.and]: [
					Sequelize.where(
						Sequelize.fn("DATE", Sequelize.col("date")),
						date,
					),
					{ business_member_id: businessMember.id },
				],
			},
			include: [
				{
					model: AttendanceActionLogsModel,
					separate: true,
					order: [["created_at", "ASC"]],
				},
			],
			order: [["checkin_time", "DESC"]],
		});

		const shiftAssignment = await ShiftAssignmentsModel.findOne({
			where: {
				[Op.and]: [
					Sequelize.where(
						Sequelize.fn("DATE", Sequelize.col("date")),
						date,
					),
					{ business_member_id: businessMember.id },
				],
			},
		});

		// Check if member has leave record
		const leaveRecord = leaveMap.has(businessMember.id);
		// const leaveRecord = "TODO NEED TO IMPLEMENT";
		// Get leave record if exists hoy model aina call dimu.. naile leave service axios diya api call dimu
		// const leaveRecord = await this.getLeaveRecord(businessMember.id, date);
		// // OR
		// const formattedDate = this.addTimeToDate(date);
		// const leaveRecord = await LeavesModel.findOne({
		//     where: {
		//         business_member_id: businessMember.id,
		//         start_date: {
		//             [Op.lte]: formattedDate
		//         },
		//         end_date: {
		//             [Op.gte]: formattedDate
		//         },
		//         status: 'accepted'
		//     }
		// });

		const checkInLog = attendance?.attendance_action_logs?.find(
			(log) => log.action === ATTENDANCE_LOG_TYPE.CHECKIN,
		);
		const checkOutLog = attendance?.attendance_action_logs?.find(
			(log) => log.action === ATTENDANCE_LOG_TYPE.CHECKOUT,
		);

		if (
			this.shouldFilterOutRecord(
				checkInLog,
				checkOutLog,
				filterOptions,
				leaveRecord,
				shiftAssignment,
			)
		) {
			return null;
		}

		// Determine attendance status
		let is_present = 0;
		let is_absent = 0;
		let is_leave = 0;

		if (leaveRecord) {
			is_leave = 1;
		} else if (checkInLog) {
			is_present = 1;
		} else if (
			shiftAssignment &&
			!shiftAssignment.is_weekend &&
			!shiftAssignment.is_holiday
		) {
			// Only mark as absent if it's a working day (not weekend/holiday) and no leave
			is_absent = 1;
		}

		return {
			date: date,
			address: businessMember.member?.profile?.address || null,
			status: attendance?.status || "Not Marked",
			shift_color: shiftAssignment?.color_code || null,
			shift_name:
				shiftAssignment?.shift_name ||
				(shiftAssignment?.is_general ? "General" : null),
			business_member_id: businessMember.id,
			pro_pic: businessMember?.member?.profile?.pro_pic || null,
			employee_id: businessMember.employee_id,
			employee_name: businessMember.member.profile.name,
			department: businessMember.role?.department?.name || null,
			designation: businessMember.role?.name || null,
			check_in: attendance?.checkin_time || null,
			check_out: attendance?.checkout_time || null,
			check_in_log: checkInLog || null,
			check_out_log: checkOutLog || null,
			remarks: attendance?.remarks || null,
			is_attendance_reconciled: attendance?.is_attendance_reconciled || 0,
			is_present: is_present,
			is_absent: is_absent,
			is_leave: is_leave,
			attendance_status: this.determineAttendanceStatus(
				is_present,
				is_absent,
				is_leave,
				shiftAssignment,
			),
			is_shift: shiftAssignment?.is_shift || null,
			is_holiday: shiftAssignment?.is_holiday || null,
			is_weekend: shiftAssignment?.is_weekend || null,
			is_general: shiftAssignment?.is_general || null,
			overtime_in_minutes: attendance?.overtime_in_minutes
				? Number(attendance.overtime_in_minutes)
				: 0,
			staying_time_in_minutes: attendance?.staying_time_in_minutes
				? Number(attendance.staying_time_in_minutes)
				: 0,
			hours: attendance?.staying_time_in_minutes
				? Math.floor(attendance.staying_time_in_minutes / 60)
				: 0,
			overtime_hours: attendance?.overtime_in_minutes
				? Math.floor(attendance.overtime_in_minutes / 60)
				: 0,
		};
	}

	private determineAttendanceStatus(
		is_present: number,
		is_absent: number,
		is_leave: number,
		shiftAssignment: any,
	): string {
		if (is_leave) return "On Leave";
		if (is_present) return "Present";
		if (is_absent) return "Absent";
		if (shiftAssignment?.is_weekend) return "Weekend";
		if (shiftAssignment?.is_holiday) return "Holiday";
		return "Not Marked";
	}

	private shouldFilterOutRecord(
		checkInLog: AttendanceActionLogsModel,
		checkOutLog: AttendanceActionLogsModel,
		filterOptions: FilterOptions,
		leaveRecord: any,
		shiftAssignment: any,
	): boolean {
		// Check check-in mode and location filters
		if (filterOptions.checkin_office_or_remote) {
			switch (filterOptions.checkin_office_or_remote) {
				case "remote":
					if (!checkInLog?.is_remote) return true;
					break;
				case "wifi":
					if (!checkInLog?.is_in_wifi) return true;
					// Only check location ID for wifi mode
					if (
						filterOptions.checkin_location_id &&
						checkInLog?.business_office_id !==
							filterOptions.checkin_location_id
					) {
						return true;
					}
					break;
				case "office":
					if (!checkInLog?.is_geo_location) return true;
					// Only check location ID for office mode
					if (
						filterOptions.checkin_location_id &&
						checkInLog?.business_office_id !==
							filterOptions.checkin_location_id
					) {
						return true;
					}
					break;
			}
		} else if (filterOptions.checkin_location_id && checkInLog) {
			// If no mode specified but location ID exists
			if (
				checkInLog.business_office_id !==
				filterOptions.checkin_location_id
			) {
				return true;
			}
		}

		// Check check-out mode and location filters
		if (filterOptions.checkout_office_or_remote) {
			switch (filterOptions.checkout_office_or_remote) {
				case "remote":
					if (!checkOutLog?.is_remote) return true;
					break;
				case "wifi":
					if (!checkOutLog?.is_in_wifi) return true;
					// Only check location ID for wifi mode
					if (
						filterOptions.checkout_location_id &&
						checkOutLog?.business_office_id !==
							filterOptions.checkout_location_id
					) {
						return true;
					}
					break;
				case "office":
					if (!checkOutLog?.is_geo_location) return true;
					// Only check location ID for office mode
					if (
						filterOptions.checkout_location_id &&
						checkOutLog?.business_office_id !==
							filterOptions.checkout_location_id
					) {
						return true;
					}
					break;
			}
		} else if (filterOptions.checkout_location_id && checkOutLog) {
			// If no mode specified but location ID exists
			if (
				checkOutLog.business_office_id !==
				filterOptions.checkout_location_id
			) {
				return true;
			}
		}

		// Check status filters
		if (
			filterOptions.checkin_status &&
			checkInLog?.status !== filterOptions.checkin_status
		) {
			return true;
		}

		if (
			filterOptions.checkout_status &&
			checkOutLog?.status !== filterOptions.checkout_status
		) {
			return true;
		}

		// Check attendance status filter
		if (filterOptions.attendance_status) {
			switch (filterOptions.attendance_status) {
				case "present":
					return !checkInLog;
				case "absent":
					return !(
						!checkInLog &&
						!leaveRecord &&
						shiftAssignment &&
						!shiftAssignment.is_weekend &&
						!shiftAssignment.is_holiday
					);
				case "on_leave":
					return !leaveRecord;
				default:
					return false;
			}
		}

		return false;
	}

	private async getBusinessMembers(
		query: AttendanceQueryParams,
		businessId: number,
		businessMemberId: number,
		dailyFlag: boolean,
	) {
		const whereClause = {
			status: EMPLOYEE_STATUS.ACTIVE,
			business_id: businessId,
			...(dailyFlag ? {} : { manager_id: businessMemberId }),
			...(query.department_id && {
				"$role.business_department_id$": query.department_id,
			}),
			// ...(query.manager_id && { manager_id: query.manager_id }),
			...(query.search && {
				[Op.or]: [
					...(query.search_type === "name"
						? [
								{
									"$member.profile.name$": {
										[Op.like]: `%${query.search}%`,
									},
								},
							]
						: []),
					...(query.search_type === "email"
						? [
								{
									"$member.profile.email$": {
										[Op.like]: `%${query.search}%`,
									},
								},
							]
						: []),
					...(query.search_type === "employee_id"
						? [
								{
									employee_id: {
										[Op.like]: `%${query.search}%`,
									},
								},
							]
						: []),
				],
			}),
		};

		const businessMembers = await BusinessMembersModel.findAll({
			where: whereClause,
			include: [
				{
					model: MembersModel,
					as: "member",
					required: true,
					include: [
						{
							model: ProfilesModel,
							as: "profile",
							required: true,
							attributes: ["name", "address", "pro_pic"],
						},
					],
				},
				{
					model: BusinessRolesModel,
					as: "role",
					attributes: ["id", "name"],
					include: [
						{
							model: BusinessDepartmentsModel,
							as: "department",
							attributes: ["name"],
						},
					],
				},
			],
			order: [["created_at", "DESC"]],
		});

		if (!dailyFlag && query?.manager_level > 1) {
			const allMembers = new Set(
				businessMembers.map((member) => member.id),
			);
			await this.getSubordinateMembers(
				allMembers,
				businessMembers,
				businessId,
				query.manager_level - 1,
				query,
			);
			const uniqueBusinessMembers = Array.from(allMembers).map((id) =>
				businessMembers.find((member) => member.id === id),
			);
			return uniqueBusinessMembers;
		}

		return businessMembers;
	}

	private async getSubordinateMembers(
		allMembers: Set<number>,
		businessMembers: BusinessMembersModel[],
		businessId: number,
		levelsRemaining: number,
		query: AttendanceQueryParams,
	) {
		if (levelsRemaining <= 0) return;

		const managerIds = Array.from(allMembers);
		const whereClause = {
			status: EMPLOYEE_STATUS.ACTIVE,
			business_id: businessId,
			manager_id: {
				[Op.in]: managerIds,
			},
			...(query.department_id && {
				"$role.business_department_id$": query.department_id,
			}),
			...(query.search && {
				[Op.or]: [
					...(query.search_type === "name"
						? [
								{
									"$member.profile.name$": {
										[Op.like]: `%${query.search}%`,
									},
								},
							]
						: []),
					...(query.search_type === "email"
						? [
								{
									"$member.profile.email$": {
										[Op.like]: `%${query.search}%`,
									},
								},
							]
						: []),
					...(query.search_type === "employee_id"
						? [
								{
									employee_id: {
										[Op.like]: `%${query.search}%`,
									},
								},
							]
						: []),
				],
			}),
		};

		const subordinateMembers = await BusinessMembersModel.findAll({
			where: whereClause,
			include: [
				{
					model: MembersModel,
					as: "member",
					required: true,
					include: [
						{
							model: ProfilesModel,
							as: "profile",
							required: true,
							attributes: ["name", "address", "pro_pic"],
						},
					],
				},
				{
					model: BusinessRolesModel,
					as: "role",
					attributes: ["id", "name"],
					include: [
						{
							model: BusinessDepartmentsModel,
							as: "department",
							attributes: ["name"],
						},
					],
				},
			],
			order: [["created_at", "DESC"]],
		});

		subordinateMembers.forEach((member) => allMembers.add(member.id));
		businessMembers.push(...subordinateMembers);
		await this.getSubordinateMembers(
			allMembers,
			businessMembers,
			businessId,
			levelsRemaining - 1,
			query,
		);
	}

	private parseStatusFilter(status?: string): {
		checkin_status?: ATTENDANCE_STATUS;
		checkout_status?: ATTENDANCE_STATUS;
	} {
		if (!status) return {};

		let checkin_status: ATTENDANCE_STATUS;
		let checkout_status: ATTENDANCE_STATUS;

		switch (status.toLowerCase()) {
			case "late":
				checkin_status = ATTENDANCE_STATUS.LATE;
				break;
			case "on_time":
				checkin_status = ATTENDANCE_STATUS.ON_TIME;
				break;
			case "left_early":
				checkout_status = ATTENDANCE_STATUS.LEFT_EARLY;
				break;
			case "left_timely":
				checkout_status = ATTENDANCE_STATUS.LEFT_TIMELY;
				break;
		}

		return { checkin_status, checkout_status };
	}

	private async getLeaveRecord(
		businessMemberId: number | null,
		date?: string,
		headers?: any,
	) {
		try {
			// Format date as YYYY-MM-DD
			const formattedDate = moment(date)
				.tz("Asia/Dhaka")
				.format("YYYY-MM-DD");

			const params: any = {
				from_date: formattedDate,
				to_date: formattedDate,
				status: "accepted",
			};

			// Only add business_member_id to params if it's provided
			if (businessMemberId) {
				params.business_member_id = businessMemberId;
			}

			// Make API call to leave service
			const response = await axios.get(
				`${LEAVE_SERVICE_URL}/leave-api/leave-application/v1/data`,
				{
					params,
					headers: {
						"Content-Type": "application/json",
						Authorization: headers?.authorization,
					},
				},
			);

			return response;
		} catch (error) {
			ErrorLog("Error fetching leave record", error);
			return null;
		}
	}
}

export interface EmployeeAttendanceReport {
	employee_id: string;
	employee_name: string;
	employee_email: string;
	employee_department: string;
	employee_designation: string;
	line_manager_name: string;
	line_manager_email: string;
	employee_address: string;
	working_days: number;
	present: number;
	on_time: number;
	late: number;
	left_timely: number;
	left_early: number;
	on_leave: number;
	absent: number;
	total_hours: string;
	overtime: string;
	total_remote_checkin: number;
	total_office_checkin: number;
	total_remote_checkout: number;
	total_office_checkout: number;
	total_checkout_missing: number;
	joining_prorated: string;
	leave_days: string;
	late_days: string;
	absent_days: string;
}

export interface AttendanceQueryParams {
	date?: string;
	department_id?: number;
	checkin_location_id?: number;
	checkout_location_id?: number;
	checkin_office_or_remote?: string;
	checkout_office_or_remote?: string;
	skip?: number;
	limit?: number;
	manager_level?: number;
	search?: string;
	search_type?: "name" | "email" | "employee_id";
	checkin_status?: ATTENDANCE_STATUS;
	checkout_status?: ATTENDANCE_STATUS;
	manager_id?: number;
	status?: string;
	attendance_status?: "present" | "absent" | "on_leave";
}

export interface FilterOptions {
	checkin_status?: ATTENDANCE_STATUS;
	checkout_status?: ATTENDANCE_STATUS;
	checkin_location_id?: number;
	checkout_location_id?: number;
	checkin_office_or_remote?: string;
	checkout_office_or_remote?: string;
	attendance_status?: "present" | "absent" | "on_leave";
}

export type JobType =
	| "attendance-data-generate"
	| "generate-custom-attendance"
	| "generate-custom-attendance-by-employee"
	| "generate-employee-list";

export interface JobPayload {
	type: JobType;
	data: any;
}
