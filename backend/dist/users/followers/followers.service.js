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
exports.FollowersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const actor_object_service_1 = require("../../shared/services/actor-object.service");
const follower_1 = require("../../entities/follower");
let FollowersService = exports.FollowersService = class FollowersService {
    constructor(followersRepository, actorObjectSerice) {
        this.followersRepository = followersRepository;
        this.actorObjectSerice = actorObjectSerice;
    }
    create(userName, actorObject) {
        const follower = new follower_1.Follower({
            userName: userName,
            followerName: actorObject.preferredUsername,
            followerRemoteHost: this.actorObjectSerice.getRemoteHost(actorObject.id),
            url: actorObject.url,
            actorUrl: actorObject.id,
            inboxUrl: actorObject.inbox
        });
        console.log('TODO : ', follower);
        return this.followersRepository.insert(follower).then(_insertResult => true).catch(_error => {
            console.log('TODO: : 何が悪い', _error);
            return false;
        });
    }
    findAll(userName) {
        return this.followersRepository.find({
            where: { userName },
            order: { createdAt: 'DESC' }
        });
    }
    remove(userName, actorObject) {
        return this.followersRepository.delete({
            userName: userName,
            followerName: actorObject.preferredUsername,
            followerRemoteHost: this.actorObjectSerice.getRemoteHost(actorObject.id)
        }).then(_deleteResult => true).catch(_error => false);
    }
};
exports.FollowersService = FollowersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(follower_1.Follower)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        actor_object_service_1.ActorObjectService])
], FollowersService);
//# sourceMappingURL=followers.service.js.map