import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    login(name: string, password: string, res: Response): Promise<Response>;
    jwtTest(res: Response): Response;
}
