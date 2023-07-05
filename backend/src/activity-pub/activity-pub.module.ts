import { Module } from '@nestjs/common';

import { ActivityPubController } from './activity-pub.controller';

/** ActivityPub Module */
@Module({
  controllers: [
    ActivityPubController
  ]
})
export class ActivityPubModule { }
