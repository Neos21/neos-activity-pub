import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { FollowersService } from './followers.service';
import { UsersService } from '../users.service';

@Controller('api/users')
export class FollowersController {
  constructor(
    private usersService: UsersService,
    private followersService: FollowersService
  ) { }
  
  /**
   * フォロワー一覧を返す
   * 
   * @param name User Name
   * @param res Response
   * @return Response
   */
  @Get(':name/followers')
  public async findAll(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    try {
      // ユーザ存在チェック
      const user = this.usersService.findOne(name);
      if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
      // 通知一覧を取得する
      const followers = await this.followersService.findAll(name);
      return res.status(HttpStatus.OK).json(followers);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
