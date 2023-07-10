import { Express } from 'express';
import * as expressListEndpoints from 'express-list-endpoints';

import { cyan, green, grey, red, yellow } from './colour-logger';

/**
 * ルーティング一覧を組み立てる https://qiita.com/18kondo/items/1b9793e67b320f640ddd
 * 
 * @param router Express Router
 * @return ルーティング一覧のテキスト
 */
export const listRoutes = (router: Express) => {
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
    .map(method => {
      const colourFunction: (text: string) => string | undefined = methodsColourFunctions[method];
      return colourFunction ? colourFunction(method) : method;
    })
    .join(', ');
  const logText = `${yellow('Routes :')}\n` + endpoints.map((endpoint) => `    - ${endpoint.path.padEnd(longestPathLength, ' ')} : ${prepareMethods(endpoint.methods)}`).sort().join('\n');
  return logText;
};
