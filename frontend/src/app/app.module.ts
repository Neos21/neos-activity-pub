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
import { FavouriteButtonComponent } from './home/favourite-button/favourite-button.component';
import { FollowersComponent } from './users/followers/followers.component';
import { FollowingsComponent } from './users/followings/followings.component';
import { FollowLocalUserButtonComponent } from './users/followers/follow-local-user-button/follow-local-user-button.component';
import { FollowRemoteUserButtonComponent } from './users/followers/follow-remote-user-button/follow-remote-user-button.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewPostComponent } from './home/new-post/new-post.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostsComponent } from './users/posts/posts.component';
import { RedirectComponent } from './core/redirect.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './users/user.component';
import { UsersComponent } from './users/users.component';
import { SearchComponent } from './home/search/search.component';

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
    FavouriteButtonComponent,
    FollowersComponent,
    FollowingsComponent,
    FollowLocalUserButtonComponent,
    FollowRemoteUserButtonComponent,
    HomeComponent,
    LoginComponent,
    NewPostComponent,
    NotificationsComponent,
    PostsComponent,
    RedirectComponent,
    SignupComponent,
    UserComponent,
    AppComponent,
    UsersComponent,
    SearchComponent,
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
