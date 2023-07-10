import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) { }
  
  /**
   * JWT 認証する
   * 
   * @return 認証成功なら `true`
   * @throws 認証失敗時
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(token == null) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        { secret: this.configService.get<string>('jwtSecret') }
      );
      request.user = payload;  // リクエストオブジェクトのこの名前に Payload が入るようにする
    }
    catch(_error) {
      throw new UnauthorizedException();
    }
    return true;
  }
  
  /** リクエストヘッダから Bearer トークンを取得する */
  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
