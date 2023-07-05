import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** BASIC 認証 Guard */
@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') { }
