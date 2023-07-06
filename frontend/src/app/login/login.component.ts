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
  /** エラー */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void | boolean> {
    this.form = this.formBuilder.group({
      name    : ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    // ログイン済ならこの画面を表示しない (ログアウト処理をちゃんと通させる)
    if(this.authService.accessToken) return this.router.navigate(['/home']);
  }
  
  /** ログインする */
  public async login(): Promise<void> {
    this.error = undefined;
    try {
      await this.authService.login(this.form.value.name, this.form.value.password);
      this.router.navigate(['/home']);
    }
    catch(error) {
      this.error = `ログイン失敗 : ${JSON.stringify(error)}`;
    }
  }
}
