import { Repository } from 'typeorm';
import { User } from '../entities/user';
export declare class UsersService {
    private readonly usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>);
    create(user: User): Promise<User>;
    findOne(name: string): Promise<User | null>;
    findOneWithPassword(name: string): Promise<User | null>;
}
