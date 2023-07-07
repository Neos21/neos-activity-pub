import { Body, Controller, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

/** Inbox Controller */
@Controller('api/activity-pub')
export class InboxController {
  private readonly logger: Logger = new Logger(InboxController.name);
  
  // TODO : Inbox
  @Post('users/:name/inbox')
  public inbox(@Param('name') name: string, @Body() body: any, @Res() res: Response): Response {
    this.logger.log(`Inbox : ${name}`, body);
    return res.status(HttpStatus.OK).type('application/activity+json').end();
  }
}
