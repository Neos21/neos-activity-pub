import { Body, Controller, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowingsService } from './followings.service';
import { UsersService } from '../users.service';

@Controller('api/users')
export class FollowingsController {
  constructor(
    private followingsService: FollowingsService,
    private usersService: UsersService,
  ) { }
  
  /** フォローする */
  @UseGuards(JwtAuthGuard)
  @Post(':name/followings')
  public async create(
    @Param('name') name: string,
    @Req() req: Request,
    @Body('followingName') followingName: string,
    @Body('followingRemoteHost') followingRemoteHost: string,
    @Res() res: Response) : Promise<Response> {
    const userName = (req.user as { name: string; })?.name;
    if(userName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
    if(userName !== user.name) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    // フォロー情報を登録する
    try {
      //const createdFollowing = await this.followingsService.create(user.name, fullName);  // TODO : 返さなくていいかな
      return res.status(HttpStatus.CREATED).end();
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
