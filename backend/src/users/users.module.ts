import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/** Users Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([User])  // Repository を使えるようにする
  ],
  controllers: [
    UsersController
  ],
  providers: [
    UsersService
  ],
  exports: [
    // 他 Module で使うため Re-Export する
    UsersService
  ]
})
export class UsersModule { }
