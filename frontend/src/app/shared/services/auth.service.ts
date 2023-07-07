import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** ユーザ名 */
  public name: string = '';
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ */
  public accessToken: string = '';
  
  /** ユーザ名・パスワード・JWT アクセストークンを保存する LocalStorage キー名 */
  private readonly authInfoStorageKey = 'auth_info';
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * ログインする
   * 
   * @param name Name
   * @param password Password
   */
  public async login(name: string, password: string): Promise<void> {
    try {
      // ログイン試行する
      const { accessToken } = await firstValueFrom(this.httpClient.post<{ accessToken: string; }>('/api/auth/login', { name, password }));
      // ログインできたら LocalStorage とキャッシュを保存する
      window.localStorage.setItem(this.authInfoStorageKey, JSON.stringify({ name, password, accessToken }));
      this.name        = name;
      this.accessToken = accessToken;
      console.log('Login Succeeded', { accessToken });
    }
    catch(error) {
      console.warn('Login Failed', { name, password }, error);
      throw error;
    }
  }
  
  /**
   * 自動再ログインする : LocalStorage から JWT を取得し控える
   * 
   * @return 自動再ログインに成功すれば `true`・失敗すれば `false`
   */
  public autoReLogin(): boolean {
    if(this.accessToken) {
      console.log('Auto Re-Login : Access Token Exists');
      return true;
    }
    try {
      const authInfo = window.localStorage.getItem(this.authInfoStorageKey);
      if(authInfo == null) {
        console.log('Auto Re-Login : Auth Info Does Not Exist');
        return false;
      }
      const { name, accessToken } = JSON.parse(authInfo);
      this.name        = name;
      this.accessToken = accessToken;  // ココで控えることで CustomInterceptor が JWT を使えるようになる
      console.log('Auto Re-Login : Succeeded', { accessToken });
      return true;
    }
    catch(error) {
      console.warn('Auto Re-Login : Failed', error);
      return false;
    }
  }
  
  /** ログアウトする */
  public logout(): void {
    window.localStorage.removeItem(this.authInfoStorageKey);
    this.name        = '';
    this.accessToken = '';
    console.log('Logout');
  }
}
