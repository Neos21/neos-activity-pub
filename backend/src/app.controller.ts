import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('')
export class AppController {
  constructor(private httpService: HttpService) { }
  
  @Get('test')
  public async test(@Res() res: Response): Promise<Response> {
    const result = await firstValueFrom(this.httpService.get('https://mstdn.jp/@Neos21mstdn/110708815749404953', {
      headers: {
        Accept        : 'application/activity+json',
        'Content-Type': 'application/activity+json'
      }
    }));  // これの `id` に対して Like すればいい・attributedTo が投稿者 URL
    console.log(result);
    return res.status(HttpStatus.OK).send('OK');
  }
}
