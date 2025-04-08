import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database/database.module";
import { demoProviders } from "./repository.providers";
import { DemoRepository } from "./demo.repository";
@Module({
  providers: [
    DemoRepository,
    ...demoProviders
  ],
  imports: [DatabaseModule],
  exports: [DemoRepository]
})
export class RepositoryModule {}