import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

/** ユーザ登録画面 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  /** ログインフォーム */
  public form!: FormGroup;
  /** 登録成功 */
  public isSucceeded: boolean = false;
  /** エラー */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void | boolean> {
    this.form = this.formBuilder.group({
      name    : ['', [Validators.required, Validators.min(1), Validators.max(20), Validators.pattern('[a-z0-9-]*')]],
      password: ['', [Validators.required, Validators.min(1), Validators.max(20)]]
    });
    // ログイン済ならこの画面を表示しない (ログアウト処理をちゃんと通させる)
    if(this.authService.accessToken) return this.router.navigate(['/home']);
  }
  
  /** ユーザ登録する */
  public async signup(): Promise<void> {
    this.isSucceeded = false;
    this.error = undefined;
    try {
      const name     = this.form.value.name;
      const password = this.form.value.password;
      const result = await firstValueFrom(this.httpClient.post<{ result: string; }>('/api/users', { name, password }));
      console.log('Signup Succeeded', result);
      this.isSucceeded = true;
    }
    catch(error) {
      this.error = `ユーザ登録失敗 : ${JSON.stringify(error)}`;
    }
  }
}
