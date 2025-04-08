import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UNAUTHORIZED } from '../helpers/responseHelper';
import 'dotenv/config';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateHeaderRequest(request);
  }

  async validateHeaderRequest(request) {
    try {
      const { headers = null } = request;

      if (
        !headers ||
        !headers['authorization'] ||
        headers['authorization'] !== `Bearer ${process.env.AUTH_TOKEN}`
      ) {
        throw new Error('Unauthorized');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(UNAUTHORIZED('Unauthorized', request));
    }
  }
}
