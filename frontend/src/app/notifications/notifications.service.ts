import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Notification } from '../shared/classes/notification';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private httpClient: HttpClient) { }
  
  /**
   * 通知一覧を取得する (対象ユーザ名は JWT にて判断させる)
   * 
   * @throws ユーザが見つからなかった場合 (404)・サーバエラー時
   */
  public findAll(): Promise<Array<Notification>> {
    return firstValueFrom(this.httpClient.get<Array<Notification>>(`/api/notifications`));
  }
}
