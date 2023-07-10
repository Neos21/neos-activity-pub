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
  /** 初期表示が完了したかどうか */
  public isLoaded: boolean = false;
  /** ログインフォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラーメッセージ */
  public error?: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }
  
  public ngOnInit(): void | Promise<boolean> {
    this.form = this.formBuilder.group({
      name    : ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    // ログイン済ならこの画面を表示しない
    if(this.authService.accessToken) return this.router.navigate(['/home']);
    this.isLoaded = true;
  }
  
  public async login(): Promise<void | boolean> {
    this.error = undefined;
    this.isProcessing = true;
    const isSucceeded = await this.authService.login(this.form.value.name, this.form.value.password);
    if(isSucceeded) return this.router.navigate(['/home']);
    this.error = 'ログイン失敗';
    this.isProcessing = false;
  }
}
