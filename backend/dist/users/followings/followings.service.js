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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowingsService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const following_1 = require("../../entities/following");
const host_url_service_1 = require("../../shared/services/host-url.service");
const headers = {
    headers: {
        Accept: 'application/activity+json',
        'Content-Type': 'application/activity+json'
    }
};
let FollowingsService = exports.FollowingsService = class FollowingsService {
    constructor(httpService, followingsRepository, hostUrlService) {
        this.httpService = httpService;
        this.followingsRepository = followingsRepository;
        this.hostUrlService = hostUrlService;
    }
    postFollowInboxToLocalUser(userName, followingName) {
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}/inbox`, {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
            type: 'Follow',
            actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
            object: `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}`
        }, headers));
    }
    async fetchActor(followingName, followingRemoteHost) {
        const webFingerResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://${followingRemoteHost}/.well-known/webfinger?resource=acct:${followingName}@${followingRemoteHost}`, headers));
        const webFinger = webFingerResponse.data;
        const objectUrl = webFinger?.links?.find(item => item.rel === 'self')?.href;
        const actorResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(objectUrl, headers));
        const actor = actorResponse.data;
        const inboxUrl = actor.inbox;
        return { objectUrl, inboxUrl };
    }
    postFollowInboxToRemoteUser(userName, inboxUrl, objectUrl) {
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
            type: 'Follow',
            actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
            object: objectUrl
        }, headers));
    }
    createLocalUser(userName, followingName) {
        const following = new following_1.Following({
            userName,
            followingName,
            followingRemoteHost: '',
            url: `${this.hostUrlService.fqdn}/users/${followingName}`,
            actorUrl: `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}`,
            inboxUrl: `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}/inbox`
        });
        return this.followingsRepository.insert(following);
    }
    createRemoteUser(userName, followingName, followingRemoteHost, objectUrl, inboxUrl) {
        const following = new following_1.Following({
            userName,
            followingName,
            followingRemoteHost,
            url: objectUrl,
            actorUrl: objectUrl,
            inboxUrl
        });
        return this.followingsRepository.insert(following);
    }
    findAll(userName) {
        return this.followingsRepository.find({
            where: { userName },
            order: { createdAt: 'DESC' }
        });
    }
    searchLocalUser(userName, followingName) {
        return this.followingsRepository.findOne({
            where: { userName, followingName, followingRemoteHost: '' }
        });
    }
    searchRemoteUser(userName, followingName, followingRemoteHost) {
        return this.followingsRepository.findOne({
            where: { userName, followingName, followingRemoteHost }
        });
    }
    postUnfollowInboxToLocalUser(userName, followingName) {
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}/inbox`, {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
            type: 'Undo',
            actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
            object: {
                id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
                type: 'Follow',
                actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
                object: `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}`
            }
        }, headers));
    }
    postUnfollowInboxToRemoteUser(userName, followingName, objectUrl, inboxUrl) {
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
            type: 'Undo',
            actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
            object: {
                id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
                type: 'Follow',
                actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
                object: objectUrl
            }
        }, headers));
    }
    removeLocalUser(userName, followingName) {
        return this.followingsRepository.delete({ userName, followingName, followingRemoteHost: '' });
    }
    removeRemoteUser(userName, followingName, followingRemoteHost) {
        return this.followingsRepository.delete({ userName, followingName, followingRemoteHost });
    }
};
exports.FollowingsService = FollowingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(following_1.Following)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository,
        host_url_service_1.HostUrlService])
], FollowingsService);
//# sourceMappingURL=followings.service.js.map