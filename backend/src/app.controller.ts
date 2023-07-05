import { Controller, Get } from '@nestjs/common';

/** App Controller */
@Controller()
export class AppController {
  /**
   * Get Hello World
   * 
   * @return Text
   */
  @Get('api')
  public getHelloWorld(): string {
    return 'Hello World';
  }
}
