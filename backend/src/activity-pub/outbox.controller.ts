import { Body, Controller, HttpStatus, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('api/activity-pub')
export class OutboxController {
  private readonly logger: Logger = new Logger(OutboxController.name);
  
  // TODO : Outbox
  @Post('users/:name/outbox')
  public outbox(@Param('name') name: string, @Req() req: Request, @Res() res: Response): Response {
    this.logger.log(`Outbox : ${name}`, req.body);
    return res.status(HttpStatus.OK).type('application/activity+json').end();
  }
}
