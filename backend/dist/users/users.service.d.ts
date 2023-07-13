import { Repository } from 'typeorm';
import { User } from 'src/entities/user';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(user: User): Promise<boolean>;
    findAll(): Promise<Array<User> | null>;
    findOne(name: string): Promise<User | null>;
    findOneWithPassword(name: string): Promise<User | null>;
    findOneWithPublicKey(name: string): Promise<User | null>;
    findOneWithPrivateKey(name: string): Promise<User | null>;
    private findOneBase;
}
