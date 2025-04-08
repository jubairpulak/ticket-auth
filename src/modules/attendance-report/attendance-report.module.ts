import { Module } from "@nestjs/common";
import { AttendanceReportController } from "./attendance-report.controller";
import { BullModule } from "@nestjs/bull";
import { AttendanceReportService } from "./attendance-report.service";
import { DatabaseModule } from "src/config/database/database.module";
import { ReportProcessor } from "./report.process";
import { AuthService } from "src/auth/auth.service";
import { ReportQueueService } from "./report-queue.service";
@Module({
	imports: [
		// BullModule.registerQueue({
		// 	name: "report-queue", // Register the queue with the name "report-queue"
		// }),
		DatabaseModule,
		// Assuming you have a RequestQueueModule for handling requests
	],
	controllers: [AttendanceReportController],
	providers: [AttendanceReportService, AuthService, ReportQueueService],
})
export class AttendanceReportModule {}
