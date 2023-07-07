import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './users/user.component';
import { RedirectComponent } from './core/redirect.component';

/** Routes */
const routes: Routes = [
  { path: 'login'      , component: LoginComponent  },
  { path: 'signup'     , component: SignupComponent },
  { path: 'home'       , component: HomeComponent  , canActivate: [authGuard] },
  { path: 'users/:name', component: UserComponent   },
  
  { path: ''  , pathMatch: 'full', redirectTo: '/login' },  // ログイン済の人は `/home` に飛ばす
  { path: '**', component: RedirectComponent }
];

/** App Routing Module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
