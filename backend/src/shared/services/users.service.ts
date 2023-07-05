import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user';

/** Users Service */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }
  
  /**
   * ユーザ名で一意に取得する
   * 
   * @param name Name
   * @return User・見つからなかった場合は `null`
   */
  public async findOneByName(name: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ name });
  }
}
