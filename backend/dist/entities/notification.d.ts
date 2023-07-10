export declare class Notification {
    id: number;
    userName: string;
    type: string;
    actorName: string;
    remoteHost: string;
    postId: number;
    createdAt: Date;
    constructor(partial: Partial<Notification>);
}
