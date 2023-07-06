import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/** JWT Guard */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService
  ) { }
  
  /**
   * JWT を認証する
   * 
   * @param context Context
   * @return 認証成功なら `true`
   * @throws 認証失敗時
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        { secret: this.configService.get<string>('jwtSecret') }
      );
      // We're assigning the payload to the request object here so that we can access it in our route handlers
      request['user'] = payload;
    }
    catch(_error) {
      throw new UnauthorizedException();
    }
    return true;
  }
  
  /**
   * ヘッダからトークンを取得する
   * 
   * @param request Request
   * @return Bearer Token・なければ `null`
   */
  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
