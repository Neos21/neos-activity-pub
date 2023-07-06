import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CreateUserComponent } from './create-user/create-user.component';

/** Admin Routes */
const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'login'      , component: AdminLoginComponent },
      { path: 'home'       , component: AdminHomeComponent  },
      { path: 'create-user', component: CreateUserComponent }
    ]
  }
];

/** Admin Routing Module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
