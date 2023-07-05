import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** BASIC Auth Guard */
@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') { }
