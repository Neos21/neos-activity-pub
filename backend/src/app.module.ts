import * as path from 'node:path';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpModule } from '@nestjs/axios';

// Core
import { configuration } from './core/configuration';
import { AccessLogMiddleware } from './core/access-log.middleware';
// TypeORM Entities
import { Follower } from './entities/follower';
import { Notification } from './entities/notification';
import { Post } from './entities/post';
import { User } from './entities/user';
// Controllers
import { APUsersController } from './activity-pub/users/ap-users.controller';
import { APUsersInboxController } from './activity-pub/users/inbox/ap-users-inbox.controller';
import { APUsersNotesController } from './activity-pub/users/notes/ap-users-notes.controller';
import { APUsersOutboxController } from './activity-pub/users/outbox/ap-users-outbox.controller';
import { AuthController } from './auth/auth.controller';
import { FollowersController } from './users/followers/followers.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { PostsController } from './users/posts/posts.controller';
import { SearchController } from './search/search.controller';
import { UsersController } from './users/users.controller';
import { WellKnownController } from './well-known/well-known.controller';
import { AppController } from './app.controller';
// Providers
import { ActorObjectService } from './shared/services/actor-object.service';
import { FollowersService } from './users/followers/followers.service';
import { HostUrlService } from './shared/services/host-url.service';
import { NotificationsService } from './notifications/notifications.service';
import { PostsService } from './users/posts/posts.service';
import { SearchService } from './search/search.service';
import { SignHeaderService } from './activity-pub/sign-header.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    // 環境変数を注入する
    ConfigModule.forRoot({
      isGlobal: true,  // 各 Module での `imports` を不要にする
      load: [configuration]  // 環境変数を読み取り適宜デフォルト値を割り当てるオブジェクトをロードする
    }),
    // HTTP 通信する用
    HttpModule,
    // JWT Token
    JwtModule.registerAsync({
      inject: [ConfigService],  // `useFactory()` で使うサービスを注入する
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),  // 環境変数から注入する
        signOptions: { expiresIn: '1y' }  // JWT アクセストークンの有効期限 : https://github.com/vercel/ms
      })
    }),
    // ビルドした Angular 資材を配信する・Angular のルーティングも認識される
    ServeStaticModule.forRootAsync({
      useFactory: () => [{
        rootPath: path.resolve(__dirname, '../../frontend/dist')
      }]
    }),
    // TypeORM : https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: path.resolve(__dirname, '../db/neos-activity-pub-backend.sqlite3.db'),
        entities: [
          Follower,
          Notification,
          Post,
          User,
        ],
        synchronize: true
      })
    }),
    // Repository を使えるようにする
    TypeOrmModule.forFeature([
      Follower,
      Notification,
      Post,
      User,
    ]),
  ],
  controllers: [
    APUsersController,
    APUsersInboxController,
    APUsersNotesController,
    APUsersOutboxController,
    AuthController,
    FollowersController,
    UsersController,
    NotificationsController,
    PostsController,
    SearchController,
    WellKnownController,
    AppController,
  ],
  providers: [
    ActorObjectService,
    FollowersService,
    HostUrlService,
    NotificationsService,
    PostsService,
    SearchService,
    SignHeaderService,
    UsersService,
  ]
})
export class AppModule {
  /** 独自のミドルウェアを適用する : https://docs.nestjs.com/middleware */
  public configure(middlewareConsumer: MiddlewareConsumer): void {
    middlewareConsumer.apply(AccessLogMiddleware).forRoutes('*');  // アクセスログ出力
  }
}
