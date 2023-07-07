import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('api')
  public getHelloWorld(): string {
    return 'Hello World'; // TODO : いつか消す
  }
}
