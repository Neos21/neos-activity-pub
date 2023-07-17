import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-favourite-button',
  templateUrl: './favourite-button.component.html',
  styleUrls: ['./favourite-button.component.css']
})
export class FavouriteButtonComponent {
  /** ふぁぼる側のユーザ名 */
  @Input()
  public userName?: string;
  /** ふぁぼる対象の Post ID (URL) */
  @Input()
  public postId?: string;
  /** ふぁぼる対象のユーザ ID (URL) */
  @Input()
  public userId?: string;
  
  /** ボタンのラベル */
  public label: string = '☆';
  /** ボタンを比活性にするかどうか */
  public isDisabled: boolean = true;
  /** 既にふぁぼ済なら `true`・コレからふぁぼるなら `false` */
  public isFavourited: boolean = false;
  
  constructor(private httpClient: HttpClient) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      const result = await firstValueFrom(this.httpClient.get<{ result: any; }>(`/api/users/${this.userName}/favourites?postId=${this.postId}`));  // Throws
      if(result?.result == null) {  // 未ふぁぼ
        this.isFavourited = false;
        this.label = '☆';
      }
      else {
        this.isFavourited = true;
        this.label = '★';
      }
      this.isDisabled = false;
    }
    catch(error) {
      console.error('FavouriteButtonComponent#ngOnInit() : Error', error);
      this.isDisabled  = true;
      this.isFavourited = false;
      this.label = '☆';
    }
  }
  
  public async favourite(): Promise<void> {
    this.isDisabled = true;
    if(this.isFavourited) {  // ふぁぼを外す
      try {
        await firstValueFrom(this.httpClient.delete(`/api/users/${this.userName}/favourites`, { body: { postId: this.postId } }));
        this.isFavourited = false;
        this.label = '☆';
      }
      catch(error) {
        console.error('FavouriteButtonComponent#favourite() : Failed To Unlike', error);
      }
    }
    else {  // ふぁぼる
      try {
        await firstValueFrom(this.httpClient.post(`/api/users/${this.userName}/favourites`, {
          userName: this.userName,
          postId  : this.postId,
          userId  : this.userId
        }));
        this.isFavourited = true;
        this.label = '★';
      }
      catch(error) {
        console.error('FavouriteButtonComponent#onFollow() : Failed To Like', error);
      }
    }
    this.isDisabled = false;
  }
}
