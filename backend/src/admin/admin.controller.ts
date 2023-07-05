import { Controller, Delete, Param, Post } from '@nestjs/common';

/** Admin Controller */
@Controller('admin')
export class AdminController {
  @Post('users')
  public createUser() {
    return 'TODO : ユーザ登録機能を実装する';
  }
  
  @Delete('users/:id')
  public removeUser(@Param('id') id: number) {
    return `TODO : ユーザ削除機能を実装する [${id}]`;
  }
}
