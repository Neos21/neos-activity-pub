import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { cyan, yellow } from './utils/colour-logger';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(AccessLogMiddleware.name);
  
  /** アクセスログを出力する */
  public use(req: Request, _res: Response, next: NextFunction): void {
    this.logger.log(yellow(`[${req.method}]`) + ' ' + cyan(`[${req.baseUrl}]`) + this.stringifyParam('Query', req.query) + this.stringifyParam('Body', req.body));
    next();
  }
  
  /** パラメータオブジェクトを安全に文字列化する */
  private stringifyParam(name: string, param: any): string {
    try {
      const parsedParam = param != null ? JSON.stringify(param) : '';  // Throws
      return ['', '{}'].includes(parsedParam) ? '' : ` ${name}:${parsedParam}`;
    }
    catch(_error) {
      return '';
    }
  }
}
