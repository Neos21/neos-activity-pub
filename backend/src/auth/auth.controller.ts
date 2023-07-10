import { Body, Controller, Get, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from 'src/users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) { }
  
  /**
   * ログインする : https://docs.nestjs.com/security/authentication
   * 
   * @param name Name
   * @param password Password
   * @return JWT
   * @throw ログイン失敗時
   */
  @Post('login')
  public async login(@Body('name') name: string, @Body('password') password: string, @Res() res: Response): Promise<Response> {
    // パスワードを含むユーザ情報を取得する
    const user = await this.usersService.findOneWithPassword(name);
    if(user == null) throw new UnauthorizedException();  // ユーザ名誤り
    // パスワードのハッシュを比較する
		const isSame = await bcryptjs.compare(password, user.password);
    if(!isSame) throw new UnauthorizedException();  // パスワード誤り
    // JWT を生成しレスポンスする
    const payload = { sub: name, name };  // コレが `req.user` に入る
    const json = { accessToken: await this.jwtService.signAsync(payload) };
    return res.json(json);
  }
}
