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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const host_url_service_1 = require("../shared/services/host-url.service");
const users_service_1 = require("../users/users.service");
const activityJsonHeaderOption = {
    headers: {
        Accept: 'application/activity+json',
        'Content-Type': 'application/activity+json'
    }
};
let SearchService = exports.SearchService = class SearchService {
    constructor(httpService, hostUrlService, usersService) {
        this.httpService = httpService;
        this.hostUrlService = hostUrlService;
        this.usersService = usersService;
    }
    search(query) {
        if ((/^https?:\/\//).test(query))
            return this.searchUrl(query);
        if ((/^@.+@.+$/).test(query))
            return this.searchRemoteUser(query);
        if ((/^@.+$/).test(query))
            return this.searchLocalUser(query);
        return null;
    }
    async searchUrl(query) {
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get(query, activityJsonHeaderOption)).catch(_error => null);
        if (result == null)
            return null;
        if (result?.data?.type === 'Note') {
            const personUrl = result.data.attributedTo;
            if (personUrl == null)
                return null;
            const personResult = await (0, rxjs_1.firstValueFrom)(this.httpService.get(personUrl, activityJsonHeaderOption)).catch(_error => null);
            const userName = personResult?.data?.preferredUsername;
            if (userName == null)
                return null;
            return {
                type: 'Post',
                postId: result.data.id,
                postUrl: result.data.url,
                createdAt: result.data.published,
                content: result.data.content,
                userId: personResult.data.id,
                userUrl: personResult.data.url,
                userName: userName,
                userHost: this.getRemoteHost(personResult.data.id)
            };
        }
        if (result?.data?.type === 'Person')
            return {
                type: 'User',
                userId: result.data.id,
                userUrl: result.data.url,
                userName: result.data.preferredUsername,
                userHost: this.getRemoteHost(result.data.id)
            };
        return null;
    }
    async searchRemoteUser(query) {
        const matches = query.match((/^@(.+)@(.+)$/));
        const userName = matches?.[1];
        const host = matches?.[2];
        if (userName == null || host == null)
            return null;
        if (host === this.hostUrlService.host)
            return this.searchLocalUser(userName);
        const url = `https://${host}/@${userName}`;
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, activityJsonHeaderOption)).catch(_error => null);
        if (result == null || result?.data?.type !== 'Person')
            return null;
        return {
            type: 'User',
            userId: result.data.id,
            userUrl: result.data.url,
            userName: result.data.preferredUsername,
            userHost: this.getRemoteHost(result.data.id)
        };
    }
    async searchLocalUser(query) {
        query = query.replace((/^@/), '');
        const user = await this.usersService.findOne(query);
        if (user == null)
            return null;
        return {
            type: 'User',
            userId: `${this.hostUrlService.fqdn}/api/activity-pub/users/${user.name}`,
            userUrl: `${this.hostUrlService.fqdn}/users/${user.name}`,
            userName: user.name,
            userHost: null
        };
    }
    getRemoteHost(url) {
        const host = new URL(url).host;
        return host === this.hostUrlService.host ? null : host;
    }
};
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        host_url_service_1.HostUrlService,
        users_service_1.UsersService])
], SearchService);
//# sourceMappingURL=search.service.js.map