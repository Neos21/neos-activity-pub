import { Response } from 'express';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';
export declare class APUsersController {
    private hostUrlService;
    private usersService;
    constructor(hostUrlService: HostUrlService, usersService: UsersService);
    getUser(name: string, res: Response): Promise<Response>;
}
