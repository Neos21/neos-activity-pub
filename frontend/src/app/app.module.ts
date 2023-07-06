import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';

/** App Module */
@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    
    CoreModule,
    SharedModule,
    AppRoutingModule  // Root を最後に置く
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    
    LoginComponent,
    HomeComponent,
    SignupComponent
  ]
})
export class AppModule { }
