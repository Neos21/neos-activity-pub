import { Controller, Get } from '@nestjs/common';

/** App Controller */
@Controller()
export class AppController {
  /** Get Hello World */
  @Get()
  public getHelloWorld(): string {
    return 'Hello World';
  }
}
