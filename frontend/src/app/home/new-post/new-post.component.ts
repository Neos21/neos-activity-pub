import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';

/** 空白のみの投稿を除外する */
const noWhitespacesValidator = (formControl: FormControl) =>  (formControl.value ?? '').trim().length ? null : { whitespaces: true };

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  /** 登録フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラーメッセージ */
  public error?: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private authService: AuthService,
  ) { }
  
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      text: ['', [Validators.required, Validators.max(500), noWhitespacesValidator]]
    });
  }
  
  public async post(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      const text = this.form.value.text.trim();  // ココでトリムしておく
      await firstValueFrom(this.httpClient.post(`/api/users/${this.authService.name}/posts`, { text }));  // Throws
      this.form.setValue({ text: '' });
    }
    catch(error) {
      this.error = `投稿に失敗しました : ${JSON.stringify(error)}`;
    }
    this.isProcessing = false;
  }
}
