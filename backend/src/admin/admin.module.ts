import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';

/** Admin Module */
@Module({
  controllers: [
    AdminController
  ]
})
export class AdminModule { }
