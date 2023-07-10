import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { CustomInterceptor } from './core/custom.interceptor';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './users/user.component';
import { RedirectComponent } from './core/redirect.component';
import { PostComponent } from './home/post/post.component';
import { FollowersComponent } from './users/followers/followers.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    
    SharedModule,
    AppRoutingModule  // Root を最後に置く
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    SignupComponent,
    LoginComponent,
    HomeComponent,
    UserComponent,
    PostComponent,
    FollowersComponent,
    NotificationsComponent,
    RedirectComponent,
    AppComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
