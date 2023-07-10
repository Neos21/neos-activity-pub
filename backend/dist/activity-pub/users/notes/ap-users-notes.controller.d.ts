import { Response } from 'express';
import { HostUrlService } from 'src/shared/services/host-url.service';
export declare class APUsersNotesController {
    private hostUrlService;
    constructor(hostUrlService: HostUrlService);
    getNote(name: string, id: number, res: Response): Response;
}
