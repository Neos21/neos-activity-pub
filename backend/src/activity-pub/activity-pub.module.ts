import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ActivityPubController } from './activity-pub.controller';

/** ActivityPub Module */
@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    ActivityPubController
  ]
})
export class ActivityPubModule { }
