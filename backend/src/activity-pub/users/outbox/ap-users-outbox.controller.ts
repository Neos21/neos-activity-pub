import { Controller, HttpStatus, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';

@Controller('api/activity-pub/users')
export class APUsersOutboxController {
  private logger: Logger = new Logger(APUsersOutboxController.name);
  
  constructor(
    private hostUrlService: HostUrlService,
    private usersService: UsersService,
  ) { }
  
  @Post(':name/outbox')
  public async outbox(@Param('name') name: string, @Req() req: Request, @Res() res: Response): Promise<Response> {
    this.logger.log(`Outbox : ${name}`, req.body);
    
    // ユーザ存在確認
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
    
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      id  : `${fqdn}/api/activity-pub/users/${name}/outbox`,
      type: 'OrderedCollection',
      totalItems: 1,
      first: `${fqdn}/api/activity-pub/users/${name}/notes`,  // NOTE : 投稿を取得できるエンドポイントあるべき https://zenn.dev/link/comments/b7dcc3a8163b5b
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
