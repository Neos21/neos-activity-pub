import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PostsService } from './posts.service';
import { UsersService } from '../users.service';

@Controller('api/users')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
  ) { }
  
  /** 投稿する */
  @UseGuards(JwtAuthGuard)
  @Post(':name/posts')
  public async create(@Param('name') name: string, @Req() req: Request, @Body('text') text: string, @Res() res: Response): Promise<Response> {
    const userName = (req.user as { name: string; })?.name;
    if(userName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
    if(userName !== user.name) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    // 投稿を保存する
    let createdPost;
    try {
      createdPost = await this.postsService.create(userName, text);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
    await this.postsService.publishNote(createdPost);  // Create イベントを発行する (本当は BullMQ でやりたい)
    return res.status(HttpStatus.CREATED).end();
  }
  
  /** 投稿一覧を返す */
  @Get(':name/posts')
  public async findAll(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    try {
      const user = this.usersService.findOne(name);  // ユーザ存在チェック
      if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
      const posts = await this.postsService.findAll(name);  // SQL で最大件数を絞ってある
      return res.status(HttpStatus.OK).json(posts);
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
