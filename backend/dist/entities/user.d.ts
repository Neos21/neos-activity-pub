export declare class User {
    name: string;
    password: string;
    publicKey: string;
    privateKey: string;
    createdAt: Date;
    constructor(partial: Partial<User>);
}
