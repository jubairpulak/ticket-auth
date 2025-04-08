import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { AttendanceReportService } from "./attendance-report.service";

type JobType =
	| "attendance-data-generate"
	| "generate-custom-attendance"
	| "generate-custom-attendance-by-employee"
	| "generate-employee-list";

interface JobPayload {
	type: JobType;
	data: any;
}

@Injectable()
export class ReportQueueService {
	private queue: JobPayload[] = [];
	private isProcessing = false;

	constructor(
		@Inject(forwardRef(() => AttendanceReportService))
		private readonly reportService: AttendanceReportService,
	) {}
	addJob(job: JobPayload) {
		console.log("Job added to in-memory queue:", job); // Log the job payload

		this.queue.push(job);
		console.log("Job added to in-memory queue:", job.type);
		this.processQueue();
	}

	private async processQueue() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.queue.length > 0) {
			const job = this.queue.shift();
			try {
				console.log("Processing job:", job.type);

				switch (job.type) {
					case "attendance-data-generate":
						console.log(">>> Handling attendance-data-generate");
						await this.reportService.generateAttendanceReportDaily(
							job.data,
						);
						break;

					case "generate-custom-attendance":
						await this.reportService.generateAttendanceReport(
							job.data,
						);
						break;

					case "generate-custom-attendance-by-employee":
						console.log(
							"call 2 - generate-custom-attendance-by-employee",
						);
						await this.reportService.generateAttendanceReportDailyByEmployee(
							job.data,
						);
						break;

					case "generate-employee-list":
						console.log("call 2 - generate-employee-list");
						await this.reportService.generateEmployeeList(job.data);
						break;

					default:
						console.warn("Unknown job type:", job.type);
				}
			} catch (error) {
				console.error(`Error processing job (${job.type}):`, error);
			}
		}

		this.isProcessing = false;
	}
}
