import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private postsService: PostsService) { }
  
  /** 投稿する */
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Req() req: Request, @Body('text') text: string, @Res() res: Response): Promise<Response> {
    const userName = (req.user as { name: string; })?.name;
    if(userName == null) return res.status(HttpStatus.BAD_REQUEST).send('JWT User Name Is Empty');
    // 投稿を保存する
    let createdPost;
    try {
      createdPost = await this.postsService.create(userName, text);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
    // Create イベントを発行する … TODO : BullMQ で処理させたい
    await this.postsService.publishNote(createdPost);
    return res.status(HttpStatus.CREATED).end();
  }
}
