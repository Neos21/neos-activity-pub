import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { FollowersService } from './followers.service';
import { UsersService } from '../users.service';

@Controller('api/users')
export class FollowersController {
  constructor(
    private followersService: FollowersService,
    private usersService: UsersService,
  ) { }
  
  /** フォロワー一覧を返す */
  @Get(':name/followers')
  public async findAll(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    try {
      const user = this.usersService.findOne(name);  // ユーザ存在チェック
      if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
      const followers = await this.followersService.findAll(name);
      return res.status(HttpStatus.OK).json(followers);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
