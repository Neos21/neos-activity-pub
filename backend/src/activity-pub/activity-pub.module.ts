import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { ActivityPubController } from './activity-pub.controller';

/** ActivityPub Module */
@Module({
  imports: [
    UsersModule
  ],
  controllers: [
    ActivityPubController
  ]
})
export class ActivityPubModule { }
