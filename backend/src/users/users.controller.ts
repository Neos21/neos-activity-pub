import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { User } from '../entities/user';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  /**
   * ユーザを登録する
   * 
   * @param user User (Name・Password)
   * @param res Response
   * @return Response
   */
  @Post('')
  public async create(@Body() user: User, @Res() res: Response): Promise<Response> {
    try {
      const createdUser = await this.usersService.create(user);
      return res.status(HttpStatus.OK).json(createdUser);
    }
    catch(error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.toString() });
    }
  }
  
  /**
   * ユーザ情報を返す　
   * 
   * @param name User Name
   * @param res Response
   * @return Response
   */
  @Get(':name')
  public async findOne(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
    return res.status(HttpStatus.OK).json(user);
  }
}
