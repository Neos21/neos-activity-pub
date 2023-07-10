import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private jwtService;
    private usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    login(name: string, password: string, res: Response): Promise<Response>;
}
