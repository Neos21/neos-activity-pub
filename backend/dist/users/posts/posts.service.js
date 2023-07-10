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
exports.PostsService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const followers_service_1 = require("../followers/followers.service");
const host_url_service_1 = require("../../shared/services/host-url.service");
const sign_header_service_1 = require("../../activity-pub/sign-header.service");
const users_service_1 = require("../users.service");
const post_1 = require("../../entities/post");
let PostsService = exports.PostsService = class PostsService {
    constructor(httpService, postsRepository, followersService, hostUrlService, signHeaderService, usersService) {
        this.httpService = httpService;
        this.postsRepository = postsRepository;
        this.followersService = followersService;
        this.hostUrlService = hostUrlService;
        this.signHeaderService = signHeaderService;
        this.usersService = usersService;
    }
    async create(userName, text) {
        if (text == null || text === '')
            throw new Error('Invalid Text');
        const post = new post_1.Post({ userName, text: `<p>${text.replace((/\n/g), '<br>')}</p>` });
        const insertResult = await this.postsRepository.insert(post);
        const createdId = insertResult.identifiers?.[0]?.id;
        if (createdId == null)
            throw new Error('Failed To Insert Post');
        return this.findOne(createdId);
    }
    async publishNote(post) {
        const user = await this.usersService.findOneWithPrivateKey(post.userName);
        const followers = await this.followersService.findAll(post.userName);
        const json = this.renderCreateNote(post);
        for (const follower of followers) {
            const requestHeaders = this.signHeaderService.signHeader(json, follower.inboxUrl, user.name, user.privateKey);
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(follower.inboxUrl, JSON.stringify(json), { headers: requestHeaders })).catch(error => console.log('Create Note Error', error));
        }
        console.log('終了');
    }
    findOne(id) {
        return this.postsRepository.findOne({ where: { id } });
    }
    renderCreateNote(post) {
        const fqdn = this.hostUrlService.fqdn;
        const published = post.createdAt.toISOString().slice(0, 19) + 'Z';
        const json = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            type: 'Create',
            id: `${fqdn}/api/activity-pub/users/${post.userName}/notes/${post.id}`,
            actor: `${fqdn}/api/activity-pub/users/${post.userName}`,
            published: published,
            object: {
                type: 'Note',
                id: `${fqdn}/api/activity-pub/users/${post.userName}/notes/${post.id}`,
                attributedTo: `${fqdn}/api/activity-pub/users/${post.userName}`,
                content: post.text,
                published: published,
                to: [
                    'https://www.w3.org/ns/activitystreams#Public',
                    `${fqdn}/api/activity-pub/users/${post.userName}/followers`,
                ]
            }
        };
        return json;
    }
};
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(post_1.Post)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository,
        followers_service_1.FollowersService,
        host_url_service_1.HostUrlService,
        sign_header_service_1.SignHeaderService,
        users_service_1.UsersService])
], PostsService);
//# sourceMappingURL=posts.service.js.map