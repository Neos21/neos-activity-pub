import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { WellKnownController } from './well-known.controller';

/** Well-Known Module */
@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    WellKnownController
  ]
})
export class WellKnownModule { }
