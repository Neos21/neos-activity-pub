import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { UsersService } from './users.service';
import { User } from '../shared/classes/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  /** ユーザ名 */
  public user?: User;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) { }
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap): Promise<void | boolean> => {
      const name = params.get('name');
      if(name == null) return this.router.navigate(['/']);  // ユーザ名が未指定の場合はトップに戻す
      
      const user = await this.usersService.findOne(name);
      if(user == null) return this.router.navigate(['/']);  // ユーザが見つからなかった場合はトップに戻す
      
      user.createdAt = user.createdAt.slice(0 ,10);  // SQLite の都合上 `YYYY-MM-DDTHH:mm:SS.SSSZ` 形式の文字列で届くので年月日だけにする
      this.user = user;
    });
  }
}
