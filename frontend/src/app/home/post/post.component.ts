import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  /** 登録フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラーメッセージ */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient
  ) { }
  
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      text: ['', [Validators.required, Validators.max(500)]]
    });
  }
  
  public async post(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      const text = this.form.value.text;
      await firstValueFrom(this.httpClient.post('/api/posts', { text }));
      this.form.setValue({ text: '' });
    }
    catch(error) {
      console.warn('PostComponent : Post : Failed', error);
      this.error = '投稿に失敗しました';
    }
    this.isProcessing = false;
  }
}
