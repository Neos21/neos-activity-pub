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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const following_1 = require("../../entities/following");
const host_url_service_1 = require("../../shared/services/host-url.service");
let FollowingsService = exports.FollowingsService = class FollowingsService {
    constructor(followingsRepository, hostUrlService) {
        this.followingsRepository = followingsRepository;
        this.hostUrlService = hostUrlService;
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
    createRemoteUser(userName, followingName, followingRemoteHost) {
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
    removeLocalUser(userName, followingName) {
        return this.followingsRepository.delete({ userName, followingName, followingRemoteHost: '' });
    }
};
exports.FollowingsService = FollowingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(following_1.Following)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        host_url_service_1.HostUrlService])
], FollowingsService);
//# sourceMappingURL=followings.service.js.map