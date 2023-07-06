import * as path from 'node:path';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

// Common
import { configuration } from './common/configs/configuration';
import { AccessLogMiddleware } from './common/middlewares/access-log.middleware';
// TypeORM
import { User } from './entities/user';
// Modules
import { WellKnownModule } from './well-known/well-known.module';
import { ActivityPubModule } from './activity-pub/activity-pub.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// Controllers
import { AppController } from './app.controller';

/** App Module */
@Module({
  imports: [
    // 環境変数を注入する
    ConfigModule.forRoot({
      isGlobal: true,  // 各 Module での `imports` を不要にする
      load: [configuration]  // 環境変数を読み取り適宜デフォルト値を割り当てるオブジェクトをロードする
    }),
    // TypeORM : https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: path.resolve(__dirname, '../db/neos-activity-pub-backend.sqlite3.db'),
        entities: [
          User
        ],
        synchronize: true
      })
    }),
    // ビルドした Angular 資材を配信する・Angular のルーティングも認識される
    ServeStaticModule.forRootAsync({
      useFactory: () => [{
        rootPath: path.resolve(__dirname, '../../frontend/dist')
      }]
    }),
    
    // Out-Side End-Points
    WellKnownModule,
    // API Modules
    ActivityPubModule,
    AuthModule,
    UsersModule,
    // Angular 側で Proxy しやすくするため `/api` の Prefix を付ける : https://docs.nestjs.com/recipes/router-module
    RouterModule.register([{
      path: 'api',
      children: [
        ActivityPubModule,
        AuthModule,
        UsersModule
      ]
    }])
  ],
  controllers: [
    AppController
  ]
})
export class AppModule {
  /**
   * 独自のミドルウェア適用する : https://docs.nestjs.com/middleware
   * 
   * @param middlewareConsumer Middleware Consumer
   */
  public configure(middlewareConsumer: MiddlewareConsumer): void {
    middlewareConsumer.apply(AccessLogMiddleware).forRoutes('*');  // アクセスログ出力
  }
}
