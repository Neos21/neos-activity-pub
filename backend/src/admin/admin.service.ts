import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user';

/** Admin Service */
@Injectable()
export class AdminService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }
  
  /**
   * ユーザ登録する
   * 
   * @param user User
   * @return 登録した User 情報
   */
  public async createUser(user: User): Promise<User> {
    // 英小文字・数字・ハイフンのみ許容する : TODO : ハイフンだけのユーザなども作れちゃうのでもう少し制限入れようね
    if(!(/^[a-z0-9-]+$/gu).test(user.name)) throw new Error('Invalid User Name');
    // パスワードのハッシュ値
    if(user.password === '') throw new Error('Invalid Password');
    
    // Insert
    const _insertResult = await this.usersRepository.insert(user);
    // Result
    return this.usersRepository.findOneByOrFail({ name: user.name });
  }
}
