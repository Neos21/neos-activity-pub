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
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly usersService: UsersService
  ) { }
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap): Promise<void | boolean> => {
      const name = params.get('name');
      if(name == null) return this.router.navigate(['/']);  // ユーザ名画未指定の場合はトップに戻す
      
      try {
        this.user = await this.usersService.findOne(name);
      }
      catch(error) {
        console.warn('UserComponent : Invalid User Name', error);
        return this.router.navigate(['/']);  // ユーザが見つからなかった場合はトップに戻す
      }
    });
  }
}
