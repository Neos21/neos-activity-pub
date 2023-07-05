import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user';
import { UsersService } from './services/users.service';

/** Shared Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([User])  // Repository を使えるようにする
  ],
  providers: [
    UsersService
  ],
  exports: [
    // Re-Exports
    TypeOrmModule,
    UsersService
  ]
})
export class SharedModule { }
