import { Component } from '@angular/core';

import { User } from '../shared/classes/user';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  /** ユーザ一覧 */
  public users?: Array<User>;
  
  constructor(
    private router: Router,
    private usersService: UsersService
  ) { }
  
  public async ngOnInit(): Promise<void | boolean> {
    const users = await this.usersService.findAll();
    if(users == null) return this.router.navigate(['/']);  // ユーザが見つからなかった場合はトップに戻す
    this.users = users;
  }
}
