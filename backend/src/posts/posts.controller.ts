import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/posts')
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
  @Post('')
  public async create(@Req() req: Request, @Body('text') text: string, @Res() res: Response): Promise<Response> {
    const userName = (req.user as { name: string; }).name;
    console.log('TODO', { userName, text });
    return res.status(HttpStatus.CREATED).json({ createdPost: text });
  }
}
