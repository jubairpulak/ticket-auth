import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { AttendanceReportService } from "./attendance-report.service";

@Processor("report-queue")
export class ReportProcessor {
	constructor(private readonly reportService: AttendanceReportService) {}

	@Process("attendance-data-generate")
	async handleGenerateAttendanceReportDaily(job: Job) {
		try {
			console.log("call here 101");
			console.log(
				">>> Handling generate-custom-attendance-by-employee job",
			);

			await this.reportService.generateAttendanceReportDaily(job);
		} catch (error) {
			console.log("error P: ", error);
		}
	}
	@Process("generate-custom-attendance")
	async handleGenerateAttendanceReport(job: Job) {
		await this.reportService.generateAttendanceReport(job);
	}

	@Process("generate-custom-attendance-by-employee")
	async handleGenerateAttendanceReportByEmployee(job: Job) {
		console.log("call 2");
		await this.reportService.generateAttendanceReportDailyByEmployee(job);
	}

	@Process("generate-employee-list")
	async handleGenerateEmployeeList(job: Job) {
		console.log("call 2");
		await this.reportService.generateEmployeeList(job);
	}
}
