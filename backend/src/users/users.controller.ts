import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { User } from '../entities/user';
import { UsersService } from './users.service';

/** Users Controller */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  /**
   * ユーザを登録する
   * 
   * @param user User
   * @param res Response
   */
  @Post('')
  public async create(@Body() user: User, @Res() res: Response): Promise<Response> {
    try {
      const createdUser = await this.usersService.create(user);
      return res.status(HttpStatus.OK).json({ result: createdUser });
    }
    catch(error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.toString() });
    }
  }
}
