import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./config/database/database.module";
import { RepositoryModule } from "./repositories/repository.module";
import { LoggerMiddleware } from "src/middleware/loggerMiddleware";

import { AuthService } from "./auth/auth.service";
import { DemoModule } from "./modules/demo/demo.module";
import { AttendanceReportModule } from "./modules/attendance-report/attendance-report.module";
import { AttendanceReportService } from "./modules/attendance-report/attendance-report.service";
import { BullModule } from "@nestjs/bull";
import { ReportQueueService } from "./modules/attendance-report/report-queue.service";
import { RegistrationModule } from './registration/registration.module';
console.log("AppModule loaded", process.env.REDIS_HOST, process.env.REDIS_PORT);
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.NODE_ENV}`],
			isGlobal: true,
		}),

		DatabaseModule,
		DemoModule,

		RepositoryModule,

		RegistrationModule,


	],
	controllers: [],
	providers: [AuthService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
