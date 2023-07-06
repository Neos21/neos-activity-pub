import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/** ユーザ登録画面 */
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  /** ログインフォーム */
  public form!: FormGroup;
  /** エラー */
  public error?: string;
  
  constructor(private readonly formBuilder: FormBuilder) { }
  
  /** 初期表示時 */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      adminUserName: ['', [Validators.required, Validators.min(3), Validators.max(20)]],  // TODO : 長さどうしよ
      adminPassword: ['', [Validators.required]]
    });
  }
  
  public async create(): Promise<void> {
    console.log('TODO');
  }
}
