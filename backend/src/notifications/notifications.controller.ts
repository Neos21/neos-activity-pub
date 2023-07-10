import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) { }
  
  /**
   * 通知一覧を取得する
   * 
   * @param req Request
   * @param res Response
   * @return Response
   */
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      // JWT からユーザ名を取得する (ユーザは存在するものとして考える)
      const userName = (req.user as { name: string; }).name;
      // 通知一覧を取得する
      const notifications = await this.notificationsService.findAll(userName);
      return res.status(HttpStatus.OK).json(notifications);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
