import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  /** 検索フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラーメッセージ */
  public error?: string;
  /** 検索結果 */
  public searchResult?: {
    type      : 'Post' | 'User';
    postId?   : string;
    postUrl?  : string;
    createdAt?: string;
    content?  : string;
    userId    : string;
    userUrl   : string;
    userHost  : string;
    userName  : string;
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
  ) { }
  
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      searchText: ['', [Validators.required]]
    });
  }
  
  public async search(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      const searchText = this.form.value.searchText.trim();
      this.searchResult = await firstValueFrom(this.httpClient.get<any>(`/api/search?query=${searchText}`));  // Throws
    }
    catch(error) {
      this.error = '検索結果が見つかりませんでした';
    }
    this.isProcessing = false;
  }
  
  public reset(): void {
    this.error        = undefined;
    this.searchResult = undefined;
  }
}
