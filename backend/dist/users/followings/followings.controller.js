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
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const followings_service_1 = require("./followings.service");
const users_service_1 = require("../users.service");
let FollowingsController = exports.FollowingsController = class FollowingsController {
    constructor(followingsService, usersService) {
        this.followingsService = followingsService;
        this.usersService = usersService;
    }
    async create(name, req, followingName, followingRemoteHost, res) {
        const userName = req.user?.name;
        if (userName == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
        const user = await this.usersService.findOne(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
        if (userName !== user.name)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
        try {
            return res.status(common_1.HttpStatus.CREATED).end();
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':name/followings'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('followingName')),
    __param(3, (0, common_1.Body)('followingRemoteHost')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], FollowingsController.prototype, "create", null);
exports.FollowingsController = FollowingsController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [followings_service_1.FollowingsService,
        users_service_1.UsersService])
], FollowingsController);
//# sourceMappingURL=followings.controller.js.map