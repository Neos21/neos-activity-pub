import { Body, Controller, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { FollowersService } from 'src/users/followers/followers.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';

import { User } from 'src/entities/user';

@Controller('api/activity-pub/users')
export class APUsersInboxController {
  private logger: Logger = new Logger(APUsersInboxController.name);
  
  constructor(
    private httpService: HttpService,
    private followersService: FollowersService,
    private hostUrlService: HostUrlService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private signHeaderService: SignHeaderService,
  ) { }
  
  @Post(':name/inbox')
  public async inbox(@Param('name') name: string, @Body() body: any, @Res() res: Response): Promise<Response> {
    this.logger.log(`Inbox : ${name}`, body);
    
    // ユーザ存在確認
    const user = await this.usersService.findOneWithPrivateKey(name);  // Accept 処理で使うので秘密鍵も取得しておく
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send('User Not Found');
    
    const type = body?.type?.toLowerCase();  // 小文字に統一する
    if(type === 'follow') {  // フォローされた
      // Actor・Inbox URL を取得する
      const actor = await this.getActor(body?.actor);
      if(actor?.inbox == null) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Inbox URL');  // Inbox URL が不明なので処理できない
      // フォロワー情報を追加する
      const isCreated = await this.followersService.create(user.name, actor);
      if(!isCreated) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Actor (Follower)');
      // フォローされた通知を追加する
      const isNotified = await this.notificationsService.createFollow(user.name, actor);
      if(!isNotified) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Actor (Notification)');
      // フォローを承認する
      const isAccepted = await this.acceptFollow(user, body, actor.inbox);
      if(!isAccepted) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Body (Accept)');
      // 成功
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'like') {  // いいねされた
      // TODO : いいね情報を追加する・いいねされた通知を追加する
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'announce') {  // ブーストされた
      // TODO : ブーストされた通知を追加する
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'undo') {  // 何らかの処理が取り消された
      const objectType = body.object?.type?.toLowerCase();
      if(objectType === 'follow') {  // アンフォローされた
        // Actor・Inbox URL を取得する
        const actor = await this.getActor(body?.actor);
        if(actor?.inbox == null) return res.status(HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Inbox URL');  // Inbox URL が不明なので処理できない
        // フォロワー情報を削除する (失敗しても続行する)
        await this.followersService.remove(user.name, actor);
        // アンフォローを承認する
        const isAccepted = await this.acceptFollow(user, body.object, actor.inbox);  // Undo 内の Follow Object を使用する
        if(!isAccepted) return res.status(HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Body');
        // 成功
        return res.status(HttpStatus.OK).end();
      }
      else if(objectType === 'like') {  // いいねが外された
        // TODO : いいね情報を削除する
        return res.status(HttpStatus.OK).end();
      }
      else if(objectType === 'announce') {  // ブーストが外された
        return res.status(HttpStatus.OK).end();
      }
      else {  // 未知の Undo イベント
        return res.status(HttpStatus.BAD_REQUEST).send('Type Create But Unknown Object Type');
      }
    }
    else if(type === 'create') {
      const objectType = body?.object?.type?.toLowerCase();
      if(objectType === 'note') {
        // TODO : リプライを受け取ったことを記録する
        return res.status(HttpStatus.OK).end();
      }
      else {  // 未知の Create イベント
        return res.status(HttpStatus.BAD_REQUEST).send('Type Create But Unknown Object Type');
      }
    }
    else if(['update', 'delete', 'accept', 'reject'].includes(type)) {  // その他のイベント
      return res.status(HttpStatus.OK).end();
    }
    else {  // 未知の Type だったら 400 にする
      return res.status(HttpStatus.BAD_REQUEST).send('Unknown Type');
    }
  }
  
  /** Actor の URL に GET リクエストを投げて情報を取得する */
  private async getActor(actorUrl: string): Promise<any | undefined> {
    try {
      const actorResponse = await firstValueFrom(this.httpService.get(actorUrl, { headers: { Accept: 'application/activity+json' } }));  // Throws
      return actorResponse?.data;
    }
    catch(error) {
      this.logger.warn('Failed To Get Actor', error);
      return undefined;
    }
  }
  
  /**
   * フォロー・アンフォローを承認する : Accept を相手の Inbox に POST する https://qiita.com/wakin/items/28cacf78095d853bfa67
   * 
   * @param user User (秘密鍵も取得しておく)
   * @param followObject 受信した Type : Follow のオブジェクト
   * @throws リクエスト失敗時
   */
  private async acceptFollow(user: User, followObject: any, inboxUrl: string): Promise<boolean> {
    // リクエスト本文を作る
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${fqdn}/api/activity-pub/users/${user.name}/activities/${Date.now()}`,  // 存在しなくても動いてる https://github.com/yuforium/api/blob/main/src/modules/activity-pub/services/inbox-processor.service.ts#L90-L97
      type      : 'Accept',
      actor     : `${fqdn}/api/activity-pub/users/${user.name}`,
      object    : followObject
    };
    // Inbox URL に向けて Accept を POST する
    const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, user.name, user.privateKey);
    await firstValueFrom(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));  // Throws
    return true;
  }
}
