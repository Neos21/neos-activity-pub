import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { cyan, yellow } from './common/utils/colour-logger';
import { listRoutes } from './common/utils/list-routes';
import { AppModule } from './app.module';

/** Bootstrap */
async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  
  const app = await NestFactory.create(AppModule);
  // CORS を有効にする : https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: (/localhost/),  // `localhost` を全て許可するため正規表現を使う
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Credentials',
    credentials: true  // `Access-Control-Allow-Credentials` を許可する
  });
  // Launch
  const port = app.get<ConfigService>(ConfigService).get<number>('port')!;
  await app.listen(port);
  logger.log(cyan(`Server started at port [`) + yellow(`${port}`) + cyan(']'));
  // List Routes
  const router = app.getHttpServer()._events.request._router;
  logger.log(listRoutes(router));
}

void bootstrap();
