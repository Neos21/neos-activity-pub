import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';

/** ログイン画面 (未ログイン時トップ) */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** ログインフォーム */
  public form!: FormGroup;
  /** エラーメッセージ */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }
  
  public async ngOnInit(): Promise<void | boolean> {
    // TODO : 初期表示終了まで画面全体を表示させないようにしたい
    this.form = this.formBuilder.group({
      name    : ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    // ログイン済ならこの画面を表示しない (ログアウト処理をちゃんと通させる)
    if(this.authService.accessToken) return this.router.navigate(['/home']);
  }
  
  /** ログインする */
  public async login(): Promise<void | boolean> {
    // TODO : Submit ボタンの二度押しを回避する
    this.error = undefined;
    const isSucceeded = await this.authService.login(this.form.value.name, this.form.value.password);
    if(isSucceeded) {
      return this.router.navigate(['/home']);
    }
    else {
      this.error = 'ログイン失敗';
    }
  }
}
