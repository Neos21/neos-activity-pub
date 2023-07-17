import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowingsService } from './followings.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from '../users.service';

@Controller('api/users')
export class FollowingsController {
  private logger: Logger = new Logger(FollowingsController.name);
  
  constructor(
    private followingsService: FollowingsService,
    private hostUrlService: HostUrlService,
    private usersService: UsersService,
  ) { }
  
  /** フォローする */
  @UseGuards(JwtAuthGuard)
  @Post(':name/followings')
  public async create(
    @Param('name') name: string,
    @Body('userName') userName: string,
    @Body('followingName') followingName: string,
    @Body('followingRemoteHost') followingRemoteHost: string,
    @Req() req: Request,
    @Res() res: Response
  ) : Promise<Response> {
    const jwtUserName = (req.user as { name: string; })?.name;
    if(jwtUserName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    if(name !== userName || name !== jwtUserName || userName !== jwtUserName) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    
    if(followingRemoteHost == null || followingRemoteHost === '' || followingRemoteHost === this.hostUrlService.host) {
      // ローカルユーザを登録する場合
      try {
        await this.followingsService.postFollowInboxToLocalUser(userName, followingName);  // Throws
        await this.followingsService.createLocalUser(userName, followingName);  // Throws
        return res.status(HttpStatus.CREATED).end();
      }
      catch(error) {
        this.logger.log('Failed To Follow Local User', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
      }
    }
    else {
      // リモートユーザを登録する場合
      try {
        const { objectUrl, inboxUrl } = await this.followingsService.fetchActor(followingName, followingRemoteHost);  // Throws
        await this.followingsService.postFollowInboxToRemoteUser(userName, inboxUrl, objectUrl);  // Throws
        await this.followingsService.createRemoteUser(userName, followingName, followingRemoteHost, objectUrl, inboxUrl);  // Throws
        return res.status(HttpStatus.CREATED).end();
      }
      catch(error) {
        this.logger.log('Failed To Follow Remote User', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
      }
    }
  }
  
  /** フォロー中一覧を返す */
  @Get(':name/followings')
  public async findAll(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    try {
      const user = this.usersService.findOne(name);  // ユーザ存在チェック
      if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
      const followers = await this.followingsService.findAll(name);
      return res.status(HttpStatus.OK).json(followers);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
  
  /** フォロー中のユーザを検索する (フォロー中か否かを判定するため) */
  @UseGuards(JwtAuthGuard)
  @Get(':name/followings/search')
  public async search(
    @Param('name') name: string,
    @Query('userName') userName: string,
    @Query('followingName') followingName: string,
    @Query('followingRemoteHost') followingRemoteHost: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    const jwtUserName = (req.user as { name: string; })?.name;
    if(jwtUserName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    if(name !== userName || name !== jwtUserName || userName !== jwtUserName) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    
    if(followingRemoteHost == null || followingRemoteHost === '' || followingRemoteHost === this.hostUrlService.host) {
      // ローカルユーザを検索する場合
      const result = await this.followingsService.searchLocalUser(userName, followingName);
      return res.status(HttpStatus.OK).json({ result });
    }
    else {
      // リモートユーザを検索する場合
      const result = await this.followingsService.searchRemoteUser(userName, followingName, followingRemoteHost);
      return res.status(HttpStatus.OK).json({ result });
    }
  }
  
  /** アンフォローする */
  @UseGuards(JwtAuthGuard)
  @Delete(':name/followings')
  public async remove(
    @Param('name') name: string,
    @Body('userName') userName: string,
    @Body('followingName') followingName: string,
    @Body('followingRemoteHost') followingRemoteHost: string,
    @Req() req: Request,
    @Res() res: Response
  ) : Promise<Response> {
    const jwtUserName = (req.user as { name: string; })?.name;
    if(jwtUserName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    if(name !== userName || name !== jwtUserName || userName !== jwtUserName) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    
    if(followingRemoteHost == null || followingRemoteHost === '') {
      // ローカルユーザを削除する場合
      try {
        await this.followingsService.postUnfollowInboxToLocalUser(userName, followingName);
        await this.followingsService.removeLocalUser(userName, followingName);
        return res.status(HttpStatus.OK).end();
      }
      catch(error) {
        this.logger.log('Failed To Unfollow Local User', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
      }
    }
    else {
      // リモートユーザを削除する場合
      try {
        const following = await this.followingsService.searchRemoteUser(userName, followingName, followingRemoteHost);
        if(following == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Following Not Found' });
        await this.followingsService.postUnfollowInboxToRemoteUser(userName, following.actorUrl, following.inboxUrl);
        await this.followingsService.removeRemoteUser(userName, followingName, followingRemoteHost);
        return res.status(HttpStatus.OK).end();
      }
      catch(error) {
        this.logger.log('Failed To Unfollow Remote User', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
      }
    }
  }
}
