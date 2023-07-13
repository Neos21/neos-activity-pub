import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { User } from '../shared/classes/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private httpClient: HttpClient) { }
  
  /** ユーザ一覧を取得する */
  public async findAll(): Promise<Array<User> | null> {
    const users = await firstValueFrom(this.httpClient.get<Array<User>>(`/api/users`)).catch(_error => null);
    if(users == null) return null;
    users.forEach(user => user.createdAt = user.createdAt.slice(0 ,10));
    return users;
  }
  
  /** ユーザを取得する */
  public async findOne(name: string): Promise<User | null> {
    const user = await firstValueFrom(this.httpClient.get<User>(`/api/users/${name}`)).catch(_error => null);
    if(user == null) return null;
    user.createdAt = user.createdAt.slice(0 ,10);  // SQLite の都合上 `YYYY-MM-DDTHH:mm:SS.SSSZ` 形式の文字列で届くので年月日だけにする
    return user;
  }
}
