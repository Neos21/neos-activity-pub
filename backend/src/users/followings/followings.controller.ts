import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowingsService } from './followings.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from '../users.service';

@Controller('api/users')
export class FollowingsController {
  constructor(
    private httpService: HttpService,
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
    
    // ローカルユーザを登録する場合
    if(followingRemoteHost == null || followingRemoteHost === '') {
      try {
        await this.followingsService.createLocalUser(userName, followingName);  // Throws
        // フォロー通知を相手の Inbox URL に投げる
        const fqdn = this.hostUrlService.fqdn;
        await firstValueFrom(this.httpService.post(`${fqdn}/api/activity-pub/users/${followingName}/inbox`, {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id        : `${fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
          type      : 'Follow',
          actor     : `${fqdn}/api/activity-pub/users/${userName}`,
          object    : `${fqdn}/api/activity-pub/users/${followingName}`
        }));
        return res.status(HttpStatus.CREATED).end();
      }
      catch(error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
      }
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'TODO : Not Implemented' });  // TODO : 他のフォローパターンを実装する
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
    
    // ローカルユーザを検索する場合
    if(followingRemoteHost == null || followingRemoteHost === '') {
      const result = await this.followingsService.searchLocalUser(userName, followingName);
      return res.status(HttpStatus.OK).json({ result });
    }
    
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'TODO : Not Implemented' });  // TODO : 他の検索パターンを実装する
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
    
    // ローカルユーザを削除する場合
    if(followingRemoteHost == null || followingRemoteHost === '') {
      try {
        await this.followingsService.removeLocalUser(userName, followingName);
        // アンフォロー通知を Inbox URL に投げる
        const fqdn = this.hostUrlService.fqdn;
        await firstValueFrom(this.httpService.post(`${fqdn}/api/activity-pub/users/${followingName}/inbox`, {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id        : `${fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
          type      : 'Undo',
          actor     : `${fqdn}/api/activity-pub/users/${userName}`,
          object    : {
            id    : `${fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
            type  : 'Follow',
            actor : `${fqdn}/api/activity-pub/users/${userName}`,
            object: `${fqdn}/api/activity-pub/users/${followingName}`
          }
        }));
        return res.status(HttpStatus.OK).end();
      }
      catch(error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
      }
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'TODO : Not Implemented' });  // TODO : 他のアンフォローパターンを実装する
  }
}
