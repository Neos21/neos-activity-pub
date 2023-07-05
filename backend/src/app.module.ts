import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ActivityPubModule } from './activity-pub/activity-pub.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AccessLogMiddleware } from './common/middlewares/access-log.middleware';

/** App Module */
@Module({
  imports: [
    ActivityPubModule,
    AdminModule
  ],
  controllers: [AppController]
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
