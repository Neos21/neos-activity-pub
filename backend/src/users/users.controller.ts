import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';

import { User } from 'src/entities/user';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  
  /** ユーザを登録する */
  @Post('')
  public async create(@Body() user: User, @Res() res: Response): Promise<Response> {
    try {
      await this.usersService.create(user);
      return res.status(HttpStatus.OK).end();
    }
    catch(error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.toString() });
    }
  }
  
  /** ユーザ一覧を返す */
  @Get('')
  public async findAll(@Res() res: Response): Promise<Response> {
    const users = await this.usersService.findAll();
    return res.status(HttpStatus.OK).json(users);
  }
  
  /** ユーザ情報を返す */
  @Get(':name')
  public async findOne(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
    return res.status(HttpStatus.OK).json(user);
  }
}
