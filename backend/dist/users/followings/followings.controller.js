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
exports.FollowingsController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const followings_service_1 = require("./followings.service");
const host_url_service_1 = require("../../shared/services/host-url.service");
const users_service_1 = require("../users.service");
let FollowingsController = exports.FollowingsController = class FollowingsController {
    constructor(httpService, followingsService, hostUrlService, usersService) {
        this.httpService = httpService;
        this.followingsService = followingsService;
        this.hostUrlService = hostUrlService;
        this.usersService = usersService;
    }
    async create(name, userName, followingName, followingRemoteHost, req, res) {
        const jwtUserName = req.user?.name;
        if (jwtUserName == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
        if (name !== userName || name !== jwtUserName || userName !== jwtUserName)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
        if (followingRemoteHost == null || followingRemoteHost === '') {
            try {
                await this.followingsService.createLocalUser(userName, followingName);
                const fqdn = this.hostUrlService.fqdn;
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${fqdn}/api/activity-pub/users/${followingName}/inbox`, {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    id: `${fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
                    type: 'Follow',
                    actor: `${fqdn}/api/activity-pub/users/${userName}`,
                    object: `${fqdn}/api/activity-pub/users/${followingName}`
                }));
                return res.status(common_1.HttpStatus.CREATED).end();
            }
            catch (error) {
                console.log(error);
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
            }
        }
        return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'TODO : Not Implemented' });
    }
    async findAll(name, res) {
        try {
            const user = this.usersService.findOne(name);
            if (user == null)
                return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
            const followers = await this.followingsService.findAll(name);
            return res.status(common_1.HttpStatus.OK).json(followers);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async search(name, userName, followingName, followingRemoteHost, req, res) {
        const jwtUserName = req.user?.name;
        if (jwtUserName == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
        if (name !== userName || name !== jwtUserName || userName !== jwtUserName)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
        if (followingRemoteHost == null || followingRemoteHost === '') {
            const result = await this.followingsService.searchLocalUser(userName, followingName);
            return res.status(common_1.HttpStatus.OK).json({ result });
        }
        return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'TODO : Not Implemented' });
    }
    async remove(name, userName, followingName, followingRemoteHost, req, res) {
        const jwtUserName = req.user?.name;
        if (jwtUserName == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
        if (name !== userName || name !== jwtUserName || userName !== jwtUserName)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
        if (followingRemoteHost == null || followingRemoteHost === '') {
            try {
                await this.followingsService.removeLocalUser(userName, followingName);
                const fqdn = this.hostUrlService.fqdn;
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${fqdn}/api/activity-pub/users/${followingName}/inbox`, {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    id: `${fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
                    type: 'Undo',
                    actor: `${fqdn}/api/activity-pub/users/${userName}`,
                    object: {
                        id: `${fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,
                        type: 'Follow',
                        actor: `${fqdn}/api/activity-pub/users/${userName}`,
                        object: `${fqdn}/api/activity-pub/users/${followingName}`
                    }
                }));
                return res.status(common_1.HttpStatus.OK).end();
            }
            catch (error) {
                console.log(error);
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
            }
        }
        return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'TODO : Not Implemented' });
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':name/followings'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)('userName')),
    __param(2, (0, common_1.Body)('followingName')),
    __param(3, (0, common_1.Body)('followingRemoteHost')),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FollowingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':name/followings'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':name/followings/search'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Query)('userName')),
    __param(2, (0, common_1.Query)('followingName')),
    __param(3, (0, common_1.Query)('followingRemoteHost')),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FollowingsController.prototype, "search", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':name/followings'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)('userName')),
    __param(2, (0, common_1.Body)('followingName')),
    __param(3, (0, common_1.Body)('followingRemoteHost')),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FollowingsController.prototype, "remove", null);
exports.FollowingsController = FollowingsController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        followings_service_1.FollowingsService,
        host_url_service_1.HostUrlService,
        users_service_1.UsersService])
], FollowingsController);
//# sourceMappingURL=followings.controller.js.map