export declare class Notification {
    userName: string;
    type: string;
    actorName: string;
    remoteHost: string;
    postId: number;
    createdAt: Date;
    constructor(partial: Partial<Notification>);
}
