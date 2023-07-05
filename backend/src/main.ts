import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Express } from 'express';
import * as expressListEndpoints from 'express-list-endpoints';

import { cyan, green, grey, red, yellow } from './common/utils/colour-logger';
import { AppModule } from './app.module';

/**
 * List Routes : https://qiita.com/18kondo/items/1b9793e67b320f640ddd
 * 
 * @param router Express Router
 * @return Log Text
 */
function listRoutes(router: Express) {
  const endpoints: Array<expressListEndpoints.Endpoint> = expressListEndpoints(router);
  // 最長のパスに合わせて整形する
  const longestPathLength = Math.max(...endpoints.map((endpoint) => endpoint.path.length));
  // メソッド別に色別けする : https://github.com/mathieutu/vue-cli-plugin-express/blob/master/src/utils/routeTable.js
  const methodsColourFunctions: { [key: string]: (text: string) => string; } = {
    'GET'    : green,
    'POST'   : cyan,
    'PUT'    : yellow,
    'PATCH'  : yellow,
    'DELETE' : red,
    'OPTIONS': grey
  };
  const methodsOrders = Object.keys(methodsColourFunctions);
  const prepareMethods = (methods: Array<string>): string => methods
    .sort((methodA, methodB) => methodsOrders.indexOf(methodA) - methodsOrders.indexOf(methodB))  // Sort By `methodsOrders`
    .map((method) => {
      const colourFunction: (text: string) => string | undefined = methodsColourFunctions[method];
      return colourFunction ? colourFunction(method) : method;
    })
    .join(', ');
  const logText = `${yellow('Routes :')}\n` + endpoints.map((endpoint) => `    - ${endpoint.path.padEnd(longestPathLength, ' ')} : ${prepareMethods(endpoint.methods)}`).sort().join('\n');
  return logText;
}

/** Bootstrap */
async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  
  const app = await NestFactory.create(AppModule);
  // 全ての Prefix に `/api` を付ける : Angular 側で Proxy しやすくするため
  app.setGlobalPrefix('api');
  // CORS を有効にする : https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: (/localhost/),  // `localhost` を全て許可するため正規表現を使う
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Credentials',
    credentials: true  // `Access-Control-Allow-Credentials` を許可する
  });
  // Launch
  await app.listen(3000);
  logger.log(cyan(`Server started at port [`) + yellow(`${3000}`) + cyan(']'));
  // List Routes
  const router = app.getHttpServer()._events.request._router;
  logger.log(listRoutes(router));
}

void bootstrap();
