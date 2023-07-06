import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

/** Routes */
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home' , component: HomeComponent  },
  
  { path: ''  , pathMatch: 'full', redirectTo: '/login' },  // TODO : Guard でログイン済の人は `/home` に飛ばす
  { path: '**',                    redirectTo: ''       }   // 404 時は上の `/login` に飛ばし処理する
];

/** App Routing Module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
