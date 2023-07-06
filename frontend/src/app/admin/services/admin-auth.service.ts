import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/** 管理者認証サービス */
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  /** 管理者ユーザ名 */
  public adminUserName: string = '';
  /** 管理者パスワード */
  public adminPassword: string = '';
  /** ユーザ名・パスワードを保存する LocalStorage キー名 */
  private readonly adminAuthInfoStorageKey = 'admin_auth_info';
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * ログイン試行する
   * 
   * @param adminUserName 管理者ユーザ名
   * @param adminPassword 管理者パスワード
   * @throws レスポンスエラー時 (400)
   */
  public async login(adminUserName: string, adminPassword: string): Promise<void> {
    await firstValueFrom(this.httpClient.post<{ accessToken: string }>('/api/admin/login', { adminUserName, adminPassword }));  // Throws
    // ログインに成功すれば値を控える
    this.adminUserName = adminUserName;
    this.adminPassword = adminPassword;
    // LocalStorage に格納する
    window.localStorage.setItem(this.adminAuthInfoStorageKey, JSON.stringify({ adminUserName, adminPassword }));
  }
  
  /**
   * ログイン済かどうか
   * 
   * @return ログイン済なら `true`・そうでなければ `false`
   */
  public async isLoggedIn(): Promise<boolean> {
    if(this.adminUserName !== '' && this.adminPassword !== '') return true;
    try {
      await this.reLogin();
      return true;
    }
    catch(_error) {
      return false;
    }
  }
  
  /**
   * `AuthGuard` より呼び出す : LocalStorage の情報を基に自動再ログインする
   * 
   * @throws LocalStorage にログイン情報がない場合・ログイン API がエラーレスポンスを返した場合
   */
  public async reLogin(): Promise<void> {
    const adminAuthInfo = window.localStorage.getItem(this.adminAuthInfoStorageKey);
    if(adminAuthInfo == null) throw new Error('Admin auth info does not exist.');
    const { adminUserName, adminPassword } = JSON.parse(adminAuthInfo);
    await this.login(adminUserName, adminPassword);
  }
}
