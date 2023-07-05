import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

/** BASIC Strategy */
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  
  /**
   * BASIC 認証する
   * 
   * @param userName ユーザ名
   * @param password パスワード
   * @return 認証成功時は `true`
   * @throws 認証失敗時
   */
  public validate(userName: string, password: string): boolean {
    const adminUserName = this.configService.get<string>('adminUserName');
    const adminPassword = this.configService.get<string>('adminPassword');
    if(userName === adminUserName && password === adminPassword) return true;
    throw new UnauthorizedException();
  }
}
