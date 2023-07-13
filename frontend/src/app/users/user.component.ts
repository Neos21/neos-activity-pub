import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { UsersService } from './users.service';

import { User } from '../shared/classes/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  /** ユーザ */
  public user?: User;
  /** ログインユーザ名 */
  public authUserName?: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
  ) { }
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap): Promise<void | boolean> => {
      const name = params.get('name');
      if(name == null) return this.router.navigate(['/']);  // ユーザ名が未指定の場合はトップに戻す
      
      const user = await this.usersService.findOne(name);
      if(user == null) return this.router.navigate(['/']);  // ユーザが見つからなかった場合はトップに戻す
      this.user = user;
      
      this.authUserName = this.authService.name;
    });
  }
}
