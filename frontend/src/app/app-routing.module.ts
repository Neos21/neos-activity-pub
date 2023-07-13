import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';

import { FollowersComponent } from './users/followers/followers.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostsComponent } from './users/posts/posts.component';
import { RedirectComponent } from './core/redirect.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './users/user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'login'                , component: LoginComponent     },  // 未ログイン時トップ
  { path: 'signup'               , component: SignupComponent    },  // ユーザ登録画面
  { path: 'home'                 , component: HomeComponent         , canActivate: [authGuard] },  // ログイン後トップ
  { path: 'notifications'        , component: NotificationsComponent, canActivate: [authGuard] },  // 通知
  { path: 'users'                , component: UsersComponent     },
  { path: 'users/:name'          , component: UserComponent      },
  { path: 'users/:name/followers', component: FollowersComponent },
  { path: 'users/:name/posts'    , component: PostsComponent     },
  
  { path: ''  , pathMatch: 'full', redirectTo: '/login' },  // LoginComponent 内の処理でログイン済の人は `/home` に飛ばす
  { path: '**', component: RedirectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
