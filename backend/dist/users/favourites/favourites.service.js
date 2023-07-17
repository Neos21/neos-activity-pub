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
exports.FavouritesService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const typeorm_2 = require("typeorm");
const host_url_service_1 = require("../../shared/services/host-url.service");
const sign_header_service_1 = require("../../activity-pub/sign-header.service");
const users_service_1 = require("../users.service");
const favourite_1 = require("../../entities/favourite");
const headers = {
    headers: {
        Accept: 'application/activity+json',
        'Content-Type': 'application/activity+json'
    }
};
let FavouritesService = exports.FavouritesService = class FavouritesService {
    constructor(httpService, favouritesRepository, hostUrlService, signHeaderService, usersService) {
        this.httpService = httpService;
        this.favouritesRepository = favouritesRepository;
        this.hostUrlService = hostUrlService;
        this.signHeaderService = signHeaderService;
        this.usersService = usersService;
    }
    async fetchInboxUrl(actorUrl) {
        const actorResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(actorUrl, headers));
        return actorResponse?.data?.inbox;
    }
    async postLikeInbox(userName, inboxUrl, postId) {
        const user = await this.usersService.findOneWithPrivateKey(userName);
        const json = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
            type: 'Like',
            actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
            object: postId
        };
        const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, userName, user.privateKey);
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));
    }
    create(userName, postUrl, inboxUrl) {
        const favourite = new favourite_1.Favourite({ userName, postUrl, inboxUrl });
        return this.favouritesRepository.insert(favourite);
    }
    findOne(userName, postUrl) {
        return this.favouritesRepository.findOne({
            where: { userName, postUrl }
        });
    }
    async postUnlikeInbox(userName, inboxUrl, postId) {
        const user = await this.usersService.findOneWithPrivateKey(userName);
        const json = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
            type: 'Undo',
            actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
            object: {
                id: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
                type: 'Like',
                actor: `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
                object: postId
            }
        };
        const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, userName, user.privateKey);
        return (0, rxjs_1.firstValueFrom)(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));
    }
    remove(userName, postUrl) {
        return this.favouritesRepository.delete({ userName, postUrl });
    }
};
exports.FavouritesService = FavouritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(favourite_1.Favourite)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository,
        host_url_service_1.HostUrlService,
        sign_header_service_1.SignHeaderService,
        users_service_1.UsersService])
], FavouritesService);
//# sourceMappingURL=favourites.service.js.map