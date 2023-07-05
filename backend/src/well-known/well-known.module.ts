import { Module } from '@nestjs/common';
import { WellKnownController } from './well-known.controller';

/** Well-Known Module */
@Module({
  controllers: [WellKnownController]
})
export class WellKnownModule { }
