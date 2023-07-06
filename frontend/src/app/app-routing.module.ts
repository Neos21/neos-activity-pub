import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

/** Routes */
const routes: Routes = [
  { path: 'login' , component: LoginComponent  },
  { path: 'signup', component: SignupComponent },
  { path: 'home'  , component: HomeComponent  , canActivate: [authGuard] },
  
  { path: ''  , pathMatch: 'full', redirectTo: '/login' },  // ログイン済の人は `/home` に飛ばす
  { path: '**',                    redirectTo: ''       }   // 404 時は上の `/login` に飛ばし処理する
];

/** App Routing Module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
