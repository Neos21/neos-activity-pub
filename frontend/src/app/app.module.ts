import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

/** App Module */
@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    AdminModule,
    AppRoutingModule  // Root を最後に置く
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    
    LoginComponent,
    HomeComponent
  ]
})
export class AppModule { }
