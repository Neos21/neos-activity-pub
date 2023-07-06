import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminAuthService } from '../services/admin-auth.service';

/** 管理者ログイン画面 */
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  /** ログインフォーム */
  public form!: FormGroup;
  /** エラー */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly adminAuthService: AdminAuthService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void | boolean> {
    this.form = this.formBuilder.group({
      adminUserName: ['', [Validators.required]],
      adminPassword: ['', [Validators.required]]
    });
    // ログイン済ならログイン画面をスキップする (LocalStorage から復旧できれば復旧する)
    if(await this.adminAuthService.isLoggedIn()) return this.router.navigate(['/admin/home']);
  }
  
  /** ログイン試行する */
  public async login(): Promise<void> {
    this.error = undefined;
    try {
      await this.adminAuthService.login(this.form.value.adminUserName, this.form.value.adminPassword);
      this.router.navigate(['/admin/home']);
    }
    catch(error) {
      this.error = `ログイン失敗 : ${JSON.stringify(error)}`;
    }
  }
}
