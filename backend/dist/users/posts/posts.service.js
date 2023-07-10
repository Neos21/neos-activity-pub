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
const post_1 = require("../../entities/post");
let PostsService = exports.PostsService = class PostsService {
    constructor(httpService, postsRepository, followersService) {
        this.httpService = httpService;
        this.postsRepository = postsRepository;
        this.followersService = followersService;
    }
    async create(userName, text) {
        if (text == null || text === '')
            throw new Error('Invalid Text');
        const post = new post_1.Post({ userName, text });
        const insertResult = await this.postsRepository.insert(post);
        const createdId = insertResult.identifiers?.[0]?.id;
        if (createdId == null)
            throw new Error('Failed To Insert Post');
        return this.findOne(createdId);
    }
    async publishNote(post) {
        const followers = await this.followersService.findAll(post.userName);
        for (const follower of followers) {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(follower.inboxUrl)).catch(_error => null);
        }
    }
    findOne(id) {
        return this.postsRepository.findOne({ where: { id } });
    }
};
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(post_1.Post)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository,
        followers_service_1.FollowersService])
], PostsService);
//# sourceMappingURL=posts.service.js.map