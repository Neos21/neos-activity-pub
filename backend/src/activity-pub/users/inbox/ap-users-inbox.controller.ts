import * as crypto from 'node:crypto';

import { Body, Controller, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { User } from 'src/entities/user';
import { UsersService } from 'src/users/users.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { FollowersService } from 'src/users/followers/followers.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('api/activity-pub/users')
export class APUsersInboxController {
  private logger: Logger = new Logger(APUsersInboxController.name);
  
  constructor(
    private httpService: HttpService,
    private usersService: UsersService,
    private hostUrlService: HostUrlService,
    private followersService: FollowersService,
    private notificationsService: NotificationsService
  ) { }
  
  /**
   * Inbox
   * 
   * @param name User Name
   * @param body Request Body
   * @param res Response
   * @return Response
   */
  @Post(':name/inbox')
  public async inbox(@Param('name') name: string, @Body() body: any, @Res() res: Response): Promise<Response> {
    this.logger.log(`Inbox : ${name}`, body);
    
    // ユーザ存在確認
    const user = await this.usersService.findOneWithPrivateKey(name);  // Accept 処理で使うので秘密鍵も取得しておく
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send('User Not Found');
    
    const type = body?.type?.toLowerCase();  // 小文字に統一する
    if(type === 'follow') {  // フォローされた
      // Inbox URL を取得する
      const actorUrl = body?.actor;
      const actor = await this.getActor(actorUrl);
      const inboxUrl = actor?.inbox;
      if(inboxUrl == null) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Inbox URL');  // Inbox URL が不明なので処理できない
      // フォロワー情報を追加する
      const isCreated = await this.followersService.create(user.name, actor);
      if(!isCreated) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Actor (Follower)');
      // フォローされた通知を追加する
      const isNotified = await this.notificationsService.createFollow(user.name, actor);
      if(!isNotified) return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Actor (Notification)');
      // フォローを承認する
      const isAccepted = await this.acceptFollow(user, body, inboxUrl);
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
        // Inbox URL を取得する
        const actorUrl = body?.actor;
        const actor = await this.getActor(actorUrl);
        const inboxUrl = actor?.inbox;
        if(inboxUrl == null) return res.status(HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Inbox URL');  // Inbox URL が不明なので処理できない
        // フォロワー情報を削除する
        const isRemoved = await this.followersService.remove(user.name, actor);
        if(!isRemoved) return res.status(HttpStatus.BAD_REQUEST).send('Type Undo Follow But Failed To Remove Follower');
        // アンフォローを承認する
        const isAccepted = await this.acceptFollow(user, body.object, inboxUrl);  // Undo 内の Follow Object を使用する
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
  
  /**
   * Actor の URL から情報を取得する
   * 
   * @param actorUrl Actor URL
   * @return Actor 情報・見つからなければ `undefined`
   */
  private async getActor(actorUrl: string): Promise<any | undefined> {
    try {
      const actorResponse = await firstValueFrom(this.httpService.get(actorUrl, { headers: { Accept: 'application/activity+json' } }));  // https://docs.nestjs.com/techniques/http-module
      return actorResponse?.data;
    }
    catch(error) {
      this.logger.warn('Cannot Get Actor', error);
      return undefined;
    }
  }
  
  /**
   * フォロー・アンフォローを承認する
   * 
   * Accept を相手の Inbox に POST する https://qiita.com/wakin/items/28cacf78095d853bfa67
   * 
   * @param user User (秘密鍵も取得しておく)
   * @param followObject 受信した Type : Follow のオブジェクト
   * @param inboxUrl 相手の Inbox URL
   */
  private async acceptFollow(user: User, followObject: any, inboxUrl: string): Promise<boolean> {
    // 現在日時を利用して ID と認証ヘッダ用の文字列にする
    const date = new Date();
    const id   = date.getTime();  // Date.now()
    const utc  = date.toUTCString();
    
    // リクエスト本文を作る
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${fqdn}/api/activity-pub/users/${user.name}/activities/${id}`,  // TODO : 存在しなくていいのかな https://github.com/yuforium/api/blob/main/src/modules/activity-pub/services/inbox-processor.service.ts#L90-L97
      type      : 'Accept',
      actor     : `${fqdn}/api/activity-pub/users/${user.name}`,
      object    : followObject
    };
    
    // SHA256 ダイジェストを作る https://gitlab.com/acefed/strawberryfields-express/-/blob/master/index.js#L35-85
    const sha256Digest = 'SHA-256=' + crypto.createHash('sha256').update(JSON.stringify(json)).digest('base64');
    // 署名を作る
    const signature = crypto.createSign('sha256').update([
      `(request-target): post ${new URL(inboxUrl).pathname}`,
      `host: ${new URL(inboxUrl).hostname}`,
      `date: ${utc}`,
      `digest: ${sha256Digest}`
    ].join('\n')).end();
    const base64Signature = signature.sign(user.privateKey, 'base64');
    // リクエストヘッダを組み立てる
    const requestHeaders = {
      Host     : new URL(inboxUrl).hostname,
      Date     : utc,
      Digest   : `${sha256Digest}`,
      Signature: [
        `keyId="${fqdn}/api/activity-pub/users/${user.name}#main-key"`,
        'algorithm="rsa-sha256"',
        'headers="(request-target) host date digest"',
        `signature="${base64Signature}"`
      ].join(','),
      Accept        : 'application/activity+json',
      'Content-Type': 'application/activity+json'
    };
    
    // Inbox URL に向けて Accept を POST する
    await firstValueFrom(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));
    return true;
  }
}
