import { Body, Controller, HttpStatus, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('api/activity-pub')
export class InboxController {
  private readonly logger: Logger = new Logger(InboxController.name);
  
  // TODO : Inbox
  @Post('users/:name/inbox')
  public inbox(@Param('name') name: string, @Req() req: Request, @Res() res: Response): Response {
    this.logger.log(`Inbox : ${name}`, req.body);
    return res.status(HttpStatus.OK).type('application/activity+json').end();
  }
}
