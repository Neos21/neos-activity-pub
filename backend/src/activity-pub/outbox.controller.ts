import { Controller, HttpStatus, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';

@Controller('api/activity-pub')
export class OutboxController {
  private readonly logger: Logger = new Logger(OutboxController.name);
  
  constructor(
    private readonly usersService: UsersService,
    private readonly hostUrlService: HostUrlService
  ) { }
  
  /**
   * Outbox
   * 
   * @param name User Name
   * @param req Request
   * @param res Response
   * @return Response
   */
  @Post('users/:name/outbox')
  public async outbox(@Param('name') name: string, @Req() req: Request, @Res() res: Response): Promise<Response> {
    this.logger.log(`Outbox : ${name}`, req.body);
    
    // ユーザ存在確認
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send('User Not Found');
    
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      id  : `${fqdn}/api/activity-pub/${name}/outbox`,
      type: 'OrderedCollection',
      totalItems: 1,
      first: `${fqdn}/api/activity-pub/${name}/posts`,  // TODO : 投稿を取得できるエンドポイント https://zenn.dev/link/comments/b7dcc3a8163b5b
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
