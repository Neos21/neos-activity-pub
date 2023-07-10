import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { User } from '../shared/classes/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private httpClient: HttpClient) { }
  
  /**
   * ユーザを取得する
   * 
   * @param name User Name
   * @return User・取得できなかった場合は `null`
   */
  public async findOne(name: string): Promise<User | null> {
    return await firstValueFrom(this.httpClient.get<User>(`/api/users/${name}`)).catch(_error => null);
  }
}
