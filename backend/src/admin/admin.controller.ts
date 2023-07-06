import { Body, Controller, Delete, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { User } from '../entities/user';
import { AdminService } from './admin.service';
import { BasicAuthGuard } from './guards/basic-auth.guard';

/**
 * Admin Controller
 * 
 * - 特定の管理者だけがユーザ登録・削除できる API にする (ユーザ登録画面とかメール認証とか面倒臭いので実装省きたい)
 */
@Controller('admin')
export class AdminController {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService
  ) { }
  
  /**
   * 管理者ログイン (簡易チェック)
   * 
   * @param adminUserName 管理者ユーザ名
   * @param adminPassword 管理者パスワード
   * @param res Response
   */
  @Post('login')
  public async adminLogin(@Body('adminUserName') adminUserName: string, @Body('adminPassword') adminPassword: string, @Res() res: Response) {
    const envAdminUserName = this.configService.get<string>('adminUserName');
    const envAdminPassword = this.configService.get<string>('adminPassword');
    if(adminUserName === envAdminUserName && adminPassword === envAdminPassword) {
      return res.status(HttpStatus.OK).json({ result: 'OK' });
    }
    else {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invali User Name Or Password.' });
    }
  }
  
  /**
   * ユーザ登録
   * 
   * @param user User
   * @param res Response
   */
  @Post('users')
  @UseGuards(BasicAuthGuard)
  public async createUser(@Body() user: User, @Res() res: Response) {
    try {
      const createdUser = await this.adminService.createUser(user);
      return res.status(HttpStatus.OK).json({ result: createdUser });
    }
    catch(error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.toString() });
    }
  }
  
  /**
   * TODO : ユーザ削除
   * 
   * @param id ID
   */
  @Delete('users/:id')
  @UseGuards(BasicAuthGuard)
  public removeUser(@Param('id') id: number) {
    return `TODO : ユーザ削除機能を実装する [${id}]`;
  }
}
