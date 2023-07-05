import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user';
import { BasicStrategy } from './strategies/basic.strategy';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

/** Admin Module */
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User])  // Repository を使えるようにする
  ],
  controllers: [
    AdminController
  ],
  providers: [
    BasicStrategy,
    AdminService
  ]
})
export class AdminModule { }
