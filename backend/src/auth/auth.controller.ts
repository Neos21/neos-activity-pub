import { Body, Controller, Get, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }
  
  /**
   * ログインする : https://docs.nestjs.com/security/authentication
   * 
   * @param name Name
   * @param password Password
   * @return JWT
   */
  @Post('login')
  public async login(@Body('name') name: string, @Body('password') password: string, @Res() res: Response): Promise<Response> {
    // パスワードを含むユーザ情報を取得する
    const user = await this.usersService.findOneWithPassword(name);
    if(!user) throw new UnauthorizedException();  // ユーザ名誤り
    // パスワードのハッシュを比較する
		const isSame = await bcryptjs.compare(password, user.password);
    if(!isSame) throw new UnauthorizedException();  // パスワード誤り
    // JWT を生成しレスポンスする
    const payload = { sub: name };
    const json = { accessToken: await this.jwtService.signAsync(payload) };
    return res.json(json);
  }
  
  // TODO : テスト用 API
  @UseGuards(JwtAuthGuard)
  @Get('test')
  public jwtTest(@Res() res: Response): Response {
    return res.json({ result: 'TODO : JWT OK' });
  }
}
