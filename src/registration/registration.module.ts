import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";

@Module({
  imports: [
    JwtModule.register({
      secret: "your-secret-key", // Replace with a secure key
      signOptions: { expiresIn: "1h" }, // Token expiration time
    }),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, AuthService],
})
export class RegistrationModule {}
