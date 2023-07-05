import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TopComponent } from './top/top.component';

/** Routes */
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'top' , component: TopComponent  },
  
  { path: ''  , pathMatch: 'full', redirectTo: '/home' },
  { path: '**',                    redirectTo: ''      }  // 404
];

/** App Routing Module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
