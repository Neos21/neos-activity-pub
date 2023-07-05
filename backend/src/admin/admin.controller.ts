import { Controller, Delete, Param, Post } from '@nestjs/common';

/**
 * Admin Controller
 * 
 * TODO : 特定の管理者だけがユーザ登録・削除できる API にする
 *        めんどくさいのでユーザ登録画面とかメール認証とかしたくないｗ
 */
@Controller('admin')
export class AdminController {
  /** TODO : ユーザ登録 */
  @Post('users')
  public createUser() {
    return 'TODO : ユーザ登録機能を実装する';
  }
  
  /**
   * TODO : ユーザ削除
   * 
   * @param id ID
   */
  @Delete('users/:id')
  public removeUser(@Param('id') id: number) {
    return `TODO : ユーザ削除機能を実装する [${id}]`;
  }
}
