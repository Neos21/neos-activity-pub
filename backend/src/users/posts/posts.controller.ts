import { Body, Controller, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api')
export class PostsController {
  /**
   * 投稿する
   * 
   * @param req Request
   * @param text 投稿テキスト
   * @param res Response
   * @return Response
   */
  @UseGuards(JwtAuthGuard)
  @Post(':name/posts')
  public async create(@Req() req: Request, @Param('name') paramName: string, @Body('text') text: string, @Res() res: Response): Promise<Response> {
    const userName = (req.user as { name: string; }).name;
    if(userName !== paramName) return res.status(HttpStatus.BAD_REQUEST).send('JWT User Name And Param User Name Are Different');
    console.log('TODO', { userName, text });
    return res.status(HttpStatus.CREATED).json({ createdPost: text });
  }
}
