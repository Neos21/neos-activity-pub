import * as crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { HostUrlService } from 'src/shared/services/host-url.service';

@Injectable()
export class SignHeaderService {
  constructor(private hostUrlService: HostUrlService) { }
  
  /**
   * リクエストヘッダを組み立てる
   * 
   * @param json ダイジェストを作成するための JSON 本文
   * @param inboxUrl Inbox URL (ホスト名とパス名の解決に使用する)
   */
  public signHeader(json: any, inboxUrl: string, userName: string, privateKey: string): any {
    const utc = new Date().toUTCString();
    // SHA256 ダイジェストを作る https://gitlab.com/acefed/strawberryfields-express/-/blob/master/index.js#L35-85
    const sha256Digest = 'SHA-256=' + crypto.createHash('sha256').update(JSON.stringify(json)).digest('base64');
    // 署名を作る
    const hostName = new URL(inboxUrl).hostname;
    const signature = crypto.createSign('sha256').update([
      `(request-target): post ${new URL(inboxUrl).pathname}`,
      `host: ${hostName}`,
      `date: ${utc}`,
      `digest: ${sha256Digest}`
    ].join('\n')).end();
    const base64Signature = signature.sign(privateKey, 'base64');
    // リクエストヘッダを組み立てる
    const requestHeaders = {
      Host     : hostName,
      Date     : utc,
      Digest   : sha256Digest,
      Signature: [
        `keyId="${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}#main-key"`,
        'algorithm="rsa-sha256"',
        'headers="(request-target) host date digest"',
        `signature="${base64Signature}"`
      ].join(','),
      Accept        : 'application/activity+json',
      'Content-Type': 'application/activity+json'
    };
    return requestHeaders;
  }
}
