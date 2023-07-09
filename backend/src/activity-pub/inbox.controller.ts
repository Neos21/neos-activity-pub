import * as crypto from 'node:crypto';
import { Controller, HttpStatus, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user';

@Controller('api/activity-pub')
export class InboxController {
  private readonly logger: Logger = new Logger(InboxController.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly hostUrlService: HostUrlService
  ) { }
  
  /**
   * Inbox
   * 
   * @param name User Name
   * @param req Request
   * @param res Response
   * @return Response
   */
  @Post('users/:name/inbox')
  public async inbox(@Param('name') name: string, @Req() req: Request, @Res() res: Response): Promise<Response> {
    const { body } = req;
    this.logger.log(`Inbox : ${name}`, body);
    
    // ユーザ存在確認
    const user = await this.usersService.findOneWithPrivateKey(name);  // Accept 処理で使うので秘密鍵も取得しておく
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send('User Not Found');
    
    const type = body?.type?.toLowerCase();  // 小文字に統一する
    if(type === 'follow') {  // フォローされた
      // フォローを承認する
      const isSucceeded = await this.acceptFollow(user, body);
      if(isSucceeded) {
        return res.status(HttpStatus.OK).end();
      }
      else {
        return res.status(HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Body');
      }
    }
    else if(type === 'like') {  // いいねされた
      // TODO : いいねを受信したことを記録する
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'announce') {  // ブーストされた
      // TODO : ブーストされたことを記録する
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'undo') {  // 何らかの処理が取り消された
      const objectType = body.object?.type?.toLowerCase();
      if(objectType === 'follow') {  // アンフォローされた
        // アンフォローを承認する
        const isSucceeded = await this.acceptFollow(user, body.object);  // Undo 内の Follow Object を使用する
        if(isSucceeded) {
          return res.status(HttpStatus.OK).end();
        }
        else {
          return res.status(HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Body');
        }
      }
      else if(objectType === 'like') {  // いいねが外された
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
    else if(type === 'update') {
      // TODO : どういうイベントなのかよく分からない
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'delete') {
      // TODO : どういうイベントなのかよく分からない
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'accept') {
      // TODO : どういうイベントなのかよく分からない
      return res.status(HttpStatus.OK).end();
    }
    else if(type === 'reject') {
      // TODO : どういうイベントなのかよく分からない
      return res.status(HttpStatus.OK).end();
    }
    else {
      // 未知の Type だったら 400 にする
      return res.status(HttpStatus.BAD_REQUEST).send('Unknown Type');
    }
  }
  
  /**
   * フォロー・アンフォローを承認する
   * 
   * Accept を相手の Inbox に POST する https://qiita.com/wakin/items/28cacf78095d853bfa67
   * 
   * @param user User (秘密鍵も取得しておく)
   * @param followObject 受信した Type : Follow のオブジェクト
   */
  private async acceptFollow(user: User, followObject: any): Promise<boolean> {
    // Inbox URL を取得する
    const actorUrl = followObject.actor;
    const inboxUrl = await this.getInboxUrl(actorUrl);;
    if(inboxUrl == null) return false;  // Inbox URL が不明なので処理できない
    
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
    // リクエストヘッダをッ組み立てる
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
    await firstValueFrom(this.httpService.post(inboxUrl, JSON.stringify(json), {
      headers: requestHeaders
    }));
    return true;
  }
  
  /**
   * Actor の URL から Inbox URL を取得する
   * 
   * @param actorUrl Actor URL
   * @return Inbox URL・見つからなければ `undefined`
   */
  private async getInboxUrl(actorUrl: string): Promise<string | undefined> {
    const actorResponse = await firstValueFrom(this.httpService.get(actorUrl, {
      headers: { Accept: 'application/activity+json' }
    }));  // https://docs.nestjs.com/techniques/http-module
    return actorResponse?.data?.inbox;
  }
}
