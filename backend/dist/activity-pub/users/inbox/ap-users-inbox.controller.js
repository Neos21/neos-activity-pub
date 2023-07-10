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
const crypto = require("node:crypto");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const users_service_1 = require("../../../users/users.service");
const host_url_service_1 = require("../../../shared/services/host-url.service");
const followers_service_1 = require("../../../users/followers/followers.service");
const notifications_service_1 = require("../../../notifications/notifications.service");
let APUsersInboxController = exports.APUsersInboxController = APUsersInboxController_1 = class APUsersInboxController {
    constructor(httpService, usersService, hostUrlService, followersService, notificationsService) {
        this.httpService = httpService;
        this.usersService = usersService;
        this.hostUrlService = hostUrlService;
        this.followersService = followersService;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(APUsersInboxController_1.name);
    }
    async inbox(name, body, res) {
        this.logger.log(`Inbox : ${name}`, body);
        const user = await this.usersService.findOneWithPrivateKey(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).send('User Not Found');
        const type = body?.type?.toLowerCase();
        if (type === 'follow') {
            const actorUrl = body?.actor;
            const actor = await this.getActor(actorUrl);
            const inboxUrl = actor?.inbox;
            if (inboxUrl == null)
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Inbox URL');
            const isCreated = await this.followersService.create(user.name, actor);
            if (!isCreated)
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Actor (Follower)');
            const isNotified = await this.notificationsService.createFollow(user.name, actor);
            if (!isNotified)
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Actor (Notification)');
            const isAccepted = await this.acceptFollow(user, body, inboxUrl);
            if (!isAccepted)
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Body (Accept)');
            return res.status(common_1.HttpStatus.OK).end();
        }
        else if (type === 'like') {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else if (type === 'announce') {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else if (type === 'undo') {
            const objectType = body.object?.type?.toLowerCase();
            if (objectType === 'follow') {
                const actorUrl = body?.actor;
                const actor = await this.getActor(actorUrl);
                const inboxUrl = actor?.inbox;
                if (inboxUrl == null)
                    return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Inbox URL');
                const isRemoved = await this.followersService.remove(user.name, actor);
                if (!isRemoved)
                    return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Undo Follow But Failed To Remove Follower');
                const isAccepted = await this.acceptFollow(user, body.object, inboxUrl);
                if (!isAccepted)
                    return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Body');
                return res.status(common_1.HttpStatus.OK).end();
            }
            else if (objectType === 'like') {
                return res.status(common_1.HttpStatus.OK).end();
            }
            else if (objectType === 'announce') {
                return res.status(common_1.HttpStatus.OK).end();
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Create But Unknown Object Type');
            }
        }
        else if (type === 'create') {
            const objectType = body?.object?.type?.toLowerCase();
            if (objectType === 'note') {
                return res.status(common_1.HttpStatus.OK).end();
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Create But Unknown Object Type');
            }
        }
        else if (['update', 'delete', 'accept', 'reject'].includes(type)) {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send('Unknown Type');
        }
    }
    async getActor(actorUrl) {
        try {
            const actorResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(actorUrl, { headers: { Accept: 'application/activity+json' } }));
            return actorResponse?.data;
        }
        catch (error) {
            this.logger.warn('Cannot Get Actor', error);
            return undefined;
        }
    }
    async acceptFollow(user, followObject, inboxUrl) {
        const date = new Date();
        const id = date.getTime();
        const utc = date.toUTCString();
        const fqdn = this.hostUrlService.fqdn;
        const json = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${fqdn}/api/activity-pub/users/${user.name}/activities/${id}`,
            type: 'Accept',
            actor: `${fqdn}/api/activity-pub/users/${user.name}`,
            object: followObject
        };
        const sha256Digest = 'SHA-256=' + crypto.createHash('sha256').update(JSON.stringify(json)).digest('base64');
        const signature = crypto.createSign('sha256').update([
            `(request-target): post ${new URL(inboxUrl).pathname}`,
            `host: ${new URL(inboxUrl).hostname}`,
            `date: ${utc}`,
            `digest: ${sha256Digest}`
        ].join('\n')).end();
        const base64Signature = signature.sign(user.privateKey, 'base64');
        const requestHeaders = {
            Host: new URL(inboxUrl).hostname,
            Date: utc,
            Digest: `${sha256Digest}`,
            Signature: [
                `keyId="${fqdn}/api/activity-pub/users/${user.name}#main-key"`,
                'algorithm="rsa-sha256"',
                'headers="(request-target) host date digest"',
                `signature="${base64Signature}"`
            ].join(','),
            Accept: 'application/activity+json',
            'Content-Type': 'application/activity+json'
        };
        await (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));
        return true;
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
        users_service_1.UsersService,
        host_url_service_1.HostUrlService,
        followers_service_1.FollowersService,
        notifications_service_1.NotificationsService])
], APUsersInboxController);
//# sourceMappingURL=ap-users-inbox.controller.js.map