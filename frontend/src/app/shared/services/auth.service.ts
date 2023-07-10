import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** ユーザ名 */
  public name: string = '';
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ・この有無でログイン済か否かを判定する */
  public accessToken: string = '';
  
  /** ユーザ名・パスワード・JWT アクセストークンを保存する LocalStorage キー名 */
  private authInfoStorageKey = 'auth_info';
  
  constructor(private httpClient: HttpClient) { }
  
  /**
   * ログインする
   * 
   * @param name Name
   * @param password Password
   * @return ログインに成功すれば `true`・失敗すれば `false`
   */
  public async login(name: string, password: string): Promise<boolean> {
    try {
      // ログイン試行する
      const { accessToken } = await firstValueFrom(this.httpClient.post<{ accessToken: string; }>('/api/auth/login', { name, password }));  // Throws
      // ログインできたら LocalStorage とキャッシュを保存する
      window.localStorage.setItem(this.authInfoStorageKey, JSON.stringify({ name, password, accessToken }));
      this.name        = name;
      this.accessToken = accessToken;
      return true;
    }
    catch(error) {
      console.warn('AuthService : Login : Failed', error);
      return false;
    }
  }
  
  /**
   * 自動再ログインする : LocalStorage から JWT を取得し控える
   * 
   * @return 自動再ログインに成功すれば `true`・失敗すれば `false`
   */
  public autoReLogin(): boolean {
    if(this.accessToken) return true;
    try {
      const authInfo = window.localStorage.getItem(this.authInfoStorageKey);
      if(authInfo == null) return false;
      const { name, accessToken } = JSON.parse(authInfo);  // Throws
      this.name        = name;
      this.accessToken = accessToken;  // ココで控えることで CustomInterceptor が JWT を使えるようになる
      return true;
    }
    catch(error) {
      console.warn('AuthService : Auto Re-Login : Failed', error);
      return false;
    }
  }
  
  /** ログアウトする */
  public logout(): void {
    window.localStorage.removeItem(this.authInfoStorageKey);
    this.name        = '';
    this.accessToken = '';
  }
}
