import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { User } from '../shared/classes/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * ユーザを取得する
   * 
   * @param name User Name
   * @return User
   * @throws Request Response Error
   */
  public async findOne(name: string): Promise<User> {
    return await firstValueFrom(this.httpClient.get<User>(`/api/users/${name}`));
  }
}
