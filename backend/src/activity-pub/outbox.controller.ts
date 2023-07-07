import { Body, Controller, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

/** Outbox Controller */
@Controller('api/activity-pub')
export class OutboxController {
  private readonly logger: Logger = new Logger(OutboxController.name);
  
  // TODO : Outbox
  @Post('users/:name/outbox')
  public outbox(@Param('name') name: string, @Body() body: any, @Res() res: Response): Response {
    this.logger.log(`Outbox : ${name}`, body);
    return res.status(HttpStatus.OK).type('application/activity+json').end();
  }
}
