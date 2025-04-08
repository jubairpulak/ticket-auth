import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { UNAUTHORIZED } from "../helpers/responseHelper";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ServiceTokenGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.validateHeaderRequest(request);
	}
	constructor(private readonly authService: AuthService) {}

	async validateHeaderRequest(request: any) {
		try {
			const { headers = null } = request;
			const bearerToken = headers?.authorization;
			// const serviceName = headers?.servicename;
			console.log("token data:", bearerToken);

			if (!bearerToken) {
				throw new Error("Unauthorized");
			}

			const authData =
				await this.authService.verifyPartnerToken(bearerToken);

			if (!authData) {
				throw new HttpException("Unauthorized", HttpStatus.FORBIDDEN);
			}

			request.user = authData;
			return true;
		} catch (error) {
			throw new UnauthorizedException(
				UNAUTHORIZED("Unauthorized", request),
			);
		}
	}
}
