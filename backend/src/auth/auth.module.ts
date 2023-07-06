import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

/** Auth Module */
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],  // `useFactory()` で使うサービスを注入する
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),  // 環境変数から注入する
        signOptions: { expiresIn: '1y' }  // JWT アクセストークンの有効期限 : https://github.com/vercel/ms
      })
    }),
    UsersModule
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule { }
