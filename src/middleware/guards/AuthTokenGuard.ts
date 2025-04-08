import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import {UNAUTHORIZED} from '../../helpers/responseHelper'
import 'dotenv/config'
@Injectable()
export class AuthTokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateHeaderRequest(request);
  }

  async validateHeaderRequest(request: any) { 
    const {headers = null} = request
    const bearerToken = headers?.authorization;

    if (!bearerToken || bearerToken !== `Bearer ${process.env.AUTH_TOKEN}`) {
      throw new UnauthorizedException(UNAUTHORIZED('Unauthorized', request))
    }
    return true;
   }
}