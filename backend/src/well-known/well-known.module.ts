import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { WellKnownController } from './well-known.controller';

/** Well-Known Module */
@Module({
  imports: [
    UsersModule
  ],
  controllers: [
    WellKnownController
  ]
})
export class WellKnownModule { }
