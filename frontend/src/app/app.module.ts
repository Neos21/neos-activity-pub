import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Imports
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
// Providers
import { CustomInterceptor } from './core/custom.interceptor';
// Bootstrap
import { AppComponent } from './app.component';
// Components
import { FollowersComponent } from './users/followers/followers.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewPostComponent } from './home/new-post/new-post.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostsComponent } from './users/posts/posts.component';
import { RedirectComponent } from './core/redirect.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './users/user.component';

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
    FollowersComponent,
    HomeComponent,
    LoginComponent,
    NewPostComponent,
    NotificationsComponent,
    PostsComponent,
    RedirectComponent,
    SignupComponent,
    UserComponent,
    AppComponent,
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
