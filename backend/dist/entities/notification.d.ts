export declare class Notification {
    id: number;
    userName: string;
    type: string;
    actorName: string;
    remoteHost: string;
    postId: string;
    replyId: string;
    replyUrl: string;
    replyContent: string;
    createdAt: Date;
    constructor(partial: Partial<Notification>);
}
