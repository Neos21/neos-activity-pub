import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

/** User Component */
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  /** ユーザ名 */
  public name!: string;
  
  constructor(private readonly activatedRoute: ActivatedRoute) { }
  
  /** 初期表示時 */
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const name = params.get('name');
      if(name == null) throw new Error('User Name Is Empty');  // TODO
      this.name = name;  // TODO : 本来は DB から取得する・存在しない名前の場合はエラー画面に飛ばすなど
    });
  }
}
