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
var InboxController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxController = void 0;
const crypto = require("node:crypto");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const host_url_service_1 = require("../shared/services/host-url/host-url.service");
const users_service_1 = require("../users/users.service");
let InboxController = exports.InboxController = InboxController_1 = class InboxController {
    constructor(httpService, usersService, hostUrlService) {
        this.httpService = httpService;
        this.usersService = usersService;
        this.hostUrlService = hostUrlService;
        this.logger = new common_1.Logger(InboxController_1.name);
    }
    async inbox(name, req, res) {
        const { body } = req;
        this.logger.log(`Inbox : ${name}`, body);
        const user = await this.usersService.findOneWithPrivateKey(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).send('User Not Found');
        const type = body?.type?.toLowerCase();
        if (type === 'follow') {
            const isSucceeded = await this.acceptFollow(user, body);
            if (isSucceeded) {
                return res.status(common_1.HttpStatus.OK).end();
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Follow But Invalid Body');
            }
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
                const isSucceeded = await this.acceptFollow(user, body.object);
                if (isSucceeded) {
                    return res.status(common_1.HttpStatus.OK).end();
                }
                else {
                    return res.status(common_1.HttpStatus.BAD_REQUEST).send('Type Undo Follow But Invalid Body');
                }
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
        else if (type === 'update') {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else if (type === 'delete') {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else if (type === 'accept') {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else if (type === 'reject') {
            return res.status(common_1.HttpStatus.OK).end();
        }
        else {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send('Unknown Type');
        }
    }
    async acceptFollow(user, followObject) {
        const actorUrl = followObject.actor;
        const inboxUrl = await this.getInboxUrl(actorUrl);
        ;
        if (inboxUrl == null)
            return false;
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
        await (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, JSON.stringify(json), {
            headers: requestHeaders
        }));
        return true;
    }
    async getInboxUrl(actorUrl) {
        const actorResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(actorUrl, {
            headers: { Accept: 'application/activity+json' }
        }));
        return actorResponse?.data?.inbox;
    }
};
__decorate([
    (0, common_1.Post)('users/:name/inbox'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InboxController.prototype, "inbox", null);
exports.InboxController = InboxController = InboxController_1 = __decorate([
    (0, common_1.Controller)('api/activity-pub'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        users_service_1.UsersService,
        host_url_service_1.HostUrlService])
], InboxController);
//# sourceMappingURL=inbox.controller.js.map