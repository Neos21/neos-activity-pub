"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var APUsersInboxController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APUsersInboxController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const followers_service_1 = require("../../../users/followers/followers.service");
const host_url_service_1 = require("../../../shared/services/host-url.service");
const notifications_service_1 = require("../../../notifications/notifications.service");
const users_service_1 = require("../../../users/users.service");
const sign_header_service_1 = require("../../sign-header.service");
let APUsersInboxController = exports.APUsersInboxController = APUsersInboxController_1 = class APUsersInboxController {
    constructor(httpService, followersService, hostUrlService, notificationsService, usersService, signHeaderService) {
        this.httpService = httpService;
        this.followersService = followersService;
        this.hostUrlService = hostUrlService;
        this.notificationsService = notificationsService;
        this.usersService = usersService;
        this.signHeaderService = signHeaderService;
        this.logger = new common_1.Logger(APUsersInboxController_1.name);
    }
    async inbox(name, body, res) {
        this.logger.log(`Inbox : ${name}`, body);
        const user = await this.usersService.findOneWithPrivateKey(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
        const type = body?.type?.toLowerCase();
        if (type === 'follow')
            return this.onFollow(user, body, res);
        if (type === 'like')
            return this.onLike(user.name, body, res);
        if (type === 'announce')
            return res.status(common_1.HttpStatus.OK).end();
        if (type === 'undo') {
            const objectType = body.object?.type?.toLowerCase();
            if (objectType === 'follow')
                return this.onUnfollow(user, body, res);
            if (['like', 'announce'].includes(objectType))
                return res.status(common_1.HttpStatus.OK).end();
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Undo But Unknown Object Type' });
        }
        if (type === 'create') {
            const objectType = body.object?.type?.toLowerCase();
            if (objectType === 'note')
                return res.status(common_1.HttpStatus.OK).end();
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Create But Unknown Object Type' });
        }
        if (['update', 'delete', 'accept', 'reject'].includes(type))
            return res.status(common_1.HttpStatus.OK).end();
        return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Unknown Type' });
    }
    async fetchActor(actorUrl) {
        try {
            const actorResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(actorUrl, { headers: { Accept: 'application/activity+json' } }));
            return actorResponse?.data;
        }
        catch (error) {
            this.logger.warn('Failed To Get Actor', error);
            return null;
        }
    }
    async onFollow(user, body, res) {
        const actor = await this.fetchActor(body?.actor);
        if (actor?.inbox == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Follow But Invalid Actor' });
        const isCreated = await this.followersService.create(user.name, actor);
        if (!isCreated)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Follow But Invalid Follower' });
        const isNotified = await this.notificationsService.createFollow(user.name, actor);
        if (!isNotified)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Follow But Invalid Notification' });
        const isAccepted = await this.acceptFollow(user, body, actor.inbox);
        if (!isAccepted)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Follow But Invalid Accept' });
        return res.status(common_1.HttpStatus.OK).end();
    }
    async onUnfollow(user, body, res) {
        const actor = await this.fetchActor(body?.actor);
        if (actor?.inbox == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Undo Follow But Invalid Inbox URL' });
        await this.followersService.remove(user.name, actor);
        const isAccepted = await this.acceptFollow(user, body.object, actor.inbox);
        if (!isAccepted)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Undo Follow But Invalid Body' });
        return res.status(common_1.HttpStatus.OK).end();
    }
    acceptFollow(user, followObject, inboxUrl) {
        const fqdn = this.hostUrlService.fqdn;
        const json = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${fqdn}/api/activity-pub/users/${user.name}/activities/${Date.now()}`,
            type: 'Accept',
            actor: `${fqdn}/api/activity-pub/users/${user.name}`,
            object: followObject
        };
        const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, user.name, user.privateKey);
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders })).then(_response => true).catch(_error => false);
    }
    async onLike(userName, body, res) {
        const actor = await this.fetchActor(body?.actor);
        if (actor == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Like But Invalid Actor' });
        const postId = body?.object;
        if (postId == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Like But Invalid Object' });
        const isNotified = await this.notificationsService.createLike(userName, actor, postId);
        if (!isNotified)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Type Like But Invalid Notification' });
        return res.status(common_1.HttpStatus.OK).end();
    }
};
__decorate([
    (0, common_1.Post)(':name/inbox'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], APUsersInboxController.prototype, "inbox", null);
exports.APUsersInboxController = APUsersInboxController = APUsersInboxController_1 = __decorate([
    (0, common_1.Controller)('api/activity-pub/users'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        followers_service_1.FollowersService,
        host_url_service_1.HostUrlService,
        notifications_service_1.NotificationsService,
        users_service_1.UsersService,
        sign_header_service_1.SignHeaderService])
], APUsersInboxController);
//# sourceMappingURL=ap-users-inbox.controller.js.map